from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import joblib
import numpy as np
import pandas as pd
import shap
import json
import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# --- DATABASE SETUP ---
os.makedirs("data", exist_ok=True)
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/mindscope.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBAssessmentRecord(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    stress_level = Column(String)
    stress_level_code = Column(Integer)
    confidence = Column(Float)
    top_stressor = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- INITIALIZE FASTAPI ---
app = FastAPI(
    title="Student Stress ML API",
    description="ML-based stress level prediction with SHAP interpretability and DB persistence",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD ARTIFACTS ---
MODEL_DIR = 'models/'
try:
    model = joblib.load(f'{MODEL_DIR}xgboost_model.joblib')
    scaler_standard = joblib.load(f'{MODEL_DIR}scaler_standard.joblib')
    scaler_minmax = joblib.load(f'{MODEL_DIR}scaler_minmax.joblib')
    print("✓ Models loaded successfully")
except Exception as e:
    print(f"ERROR loading models: {e}")

CONTINUOUS_FEATURES = ['anxiety_level', 'self_esteem', 'depression']
LIKERT_FEATURES = [
    'academic_performance', 'study_load', 'teacher_student_relationship',
    'future_career_concerns', 'basic_needs', 'living_conditions',
    'safety', 'noise_level', 'peer_pressure', 'social_support', 'bullying',
    'sleep_quality', 'headache', 'breathing_problem', 'extracurricular_activities'
]
CATEGORICAL_FEATURES = ['blood_pressure', 'mental_health_history']
ALL_FEATURES = CONTINUOUS_FEATURES + LIKERT_FEATURES + CATEGORICAL_FEATURES

STRESS_LABELS = {0: 'Low', 1: 'Moderate', 2: 'High'}
STRESS_COLORS = {0: '#10b981', 1: '#f59e0b', 2: '#ef4444'}

# --- PYDANTIC MODELS ---
class StudentStressInput(BaseModel):
    user_email: str = "alex@northbridge.edu" # Used to track users across devices
    academic_performance: int = Field(..., ge=0, le=5)
    study_load: int = Field(..., ge=0, le=5)
    teacher_student_relationship: int = Field(..., ge=0, le=5)
    future_career_concerns: int = Field(..., ge=0, le=5)
    basic_needs: int = Field(..., ge=0, le=5)
    living_conditions: int = Field(..., ge=0, le=5)
    safety: int = Field(..., ge=0, le=5)
    noise_level: int = Field(..., ge=0, le=5)
    anxiety_level: int = Field(..., ge=0, le=21)
    self_esteem: int = Field(..., ge=0, le=30)
    depression: int = Field(..., ge=0, le=27)
    peer_pressure: int = Field(..., ge=0, le=5)
    social_support: int = Field(..., ge=0, le=5)
    bullying: int = Field(..., ge=0, le=5)
    sleep_quality: int = Field(..., ge=0, le=5)
    headache: int = Field(..., ge=0, le=5)
    breathing_problem: int = Field(..., ge=0, le=5)
    blood_pressure: int = Field(..., ge=1, le=3)
    mental_health_history: int = Field(..., ge=0, le=1)
    extracurricular_activities: int = Field(..., ge=0, le=5)

class TopStressorOut(BaseModel):
    feature: str
    impact: float
    contribution: float

class PredictionResponse(BaseModel):
    stress_level: str
    stress_level_code: int
    confidence: float
    color: str
    top_stressors: List[TopStressorOut]
    interventions: List[str]
    raw_probabilities: Dict[str, float]

class HistoryRecordResponse(BaseModel):
    id: int
    date: datetime
    stress_level: str
    stress_level_code: int
    confidence: float
    top_stressor: str
    class Config:
        from_attributes = True

# --- SHAP EXPLAINER ---
SHAP_EXPLAINER = None

def initialize_shap_explainer():
    global SHAP_EXPLAINER
    if SHAP_EXPLAINER is None:
        booster = model.get_booster() if hasattr(model, 'get_booster') else model
        SHAP_EXPLAINER = shap.TreeExplainer(booster)

def scale_input(data_dict: dict) -> np.ndarray:
    df = pd.DataFrame([data_dict])
    feature_names = getattr(model, 'feature_names_in_', ALL_FEATURES)
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0
            
    cont_feats = [c for c in CONTINUOUS_FEATURES if c in df.columns]
    if cont_feats:
        df[cont_feats] = scaler_standard.transform(df[cont_feats])
    
    lik_feats = [l for l in LIKERT_FEATURES if l in df.columns]
    if lik_feats:
        df[lik_feats] = scaler_minmax.transform(df[lik_feats])
    
    return df[feature_names].values

def get_shap_values(scaled_input: np.ndarray, prediction: int) -> List[Dict[str, Any]]:
    try:
        initialize_shap_explainer()
        feature_names = getattr(model, 'feature_names_in_', ALL_FEATURES)
        shap_values = SHAP_EXPLAINER.shap_values(scaled_input)
        
        if isinstance(shap_values, list):
            instance_shap = shap_values[prediction][0]
        elif isinstance(shap_values, np.ndarray):
            if shap_values.ndim == 3:
                if shap_values.shape[2] == len(feature_names):
                    instance_shap = shap_values[0, prediction, :]
                else:
                    instance_shap = shap_values[0, :, prediction]
            else:
                instance_shap = shap_values[0]
        else:
            instance_shap = shap_values[0]
            
        instance_shap = np.array(instance_shap).flatten()
        
        feature_impact = [
            {'feature': feature_names[i], 'impact': float(np.abs(instance_shap[i])), 'contribution': float(instance_shap[i])}
            for i in range(len(feature_names))
        ]
        top_5 = sorted(feature_impact, key=lambda x: x['impact'], reverse=True)[:5]
        return top_5
    except Exception:
        return []

def generate_interventions(input_data: StudentStressInput, stress_level: int) -> List[str]:
    suggestions = []
    if input_data.sleep_quality <= 2: suggestions.append("💤 SLEEP: Establish a consistent bedtime routine (10-11 PM). Avoid screens 30min before sleep.")
    if input_data.study_load >= 4: suggestions.append("📚 STUDY: Break study sessions into 45-min blocks with 10-min breaks (Pomodoro).")
    if input_data.anxiety_level >= 14: suggestions.append("🧠 ANXIETY: Practice breathing exercises (4-7-8 technique) for 5min daily.")
    if input_data.basic_needs >= 4: suggestions.append("💰 SUPPORT: Meet with university financial aid office or explore student loans.")
    if input_data.social_support <= 2: suggestions.append("🤝 SUPPORT: Reach out to a friend, counselor, or join a campus club.")
    if input_data.headache >= 3 or input_data.breathing_problem >= 3: suggestions.append("⚕️ HEALTH: Consult campus health center. Consider stress-management workshops.")
    if input_data.self_esteem <= 12: suggestions.append("🎯 SELF-ESTEEM: Seek peer support or university counseling services.")
    if stress_level == 2: suggestions.insert(0, "🚨 HIGH STRESS: Consider consulting campus counseling or mental health services.")
    return suggestions[:3]

# --- API ROUTES ---
@app.post("/predict", response_model=PredictionResponse, tags=["Predictions"])
def predict_stress(student_data: StudentStressInput, db: Session = Depends(get_db)):
    try:
        data_dict = student_data.dict()
        email = data_dict.pop('user_email', 'alex@northbridge.edu')
        scaled_input = scale_input(data_dict)
        
        prediction = int(model.predict(scaled_input)[0])
        probabilities = model.predict_proba(scaled_input)[0]
        confidence = float(np.max(probabilities))
        
        top_stressors = get_shap_values(scaled_input, prediction)
        interventions = generate_interventions(student_data, prediction)
        
        prob_dict = {'Low': float(probabilities[0]), 'Moderate': float(probabilities[1]), 'High': float(probabilities[2])}
        
        # Save to DB
        top_feature = top_stressors[0]['feature'] if top_stressors else "study_load"
        db_record = DBAssessmentRecord(
            user_email=email,
            stress_level=STRESS_LABELS[prediction],
            stress_level_code=prediction,
            confidence=confidence,
            top_stressor=top_feature
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        return PredictionResponse(
            stress_level=STRESS_LABELS[prediction],
            stress_level_code=prediction,
            confidence=confidence,
            color=STRESS_COLORS[prediction],
            top_stressors=top_stressors,
            interventions=interventions,
            raw_probabilities=prob_dict
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/history/{email}", response_model=List[HistoryRecordResponse], tags=["History"])
def get_user_history(email: str, db: Session = Depends(get_db)):
    records = db.query(DBAssessmentRecord).filter(DBAssessmentRecord.user_email == email).order_by(DBAssessmentRecord.date.asc()).all()
    return records

@app.delete("/history/{email}", tags=["History"])
def clear_user_history(email: str, db: Session = Depends(get_db)):
    db.query(DBAssessmentRecord).filter(DBAssessmentRecord.user_email == email).delete()
    db.commit()
    return {"status": "cleared"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)