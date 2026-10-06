from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import joblib
import numpy as np
import pandas as pd
import shap
import json
import os

# Initialize FastAPI
app = FastAPI(
    title="Student Stress ML API",
    description="ML-based stress level prediction with SHAP interpretability",
    version="1.0.0"
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LOAD ARTIFACTS
MODEL_DIR = 'models/'
try:
    model = joblib.load(f'{MODEL_DIR}xgboost_model.joblib')
    scaler_standard = joblib.load(f'{MODEL_DIR}scaler_standard.joblib')
    scaler_minmax = joblib.load(f'{MODEL_DIR}scaler_minmax.joblib')
    print("✓ Models loaded successfully")
except Exception as e:
    print(f"ERROR loading models: {e}")

# FEATURE CONFIGURATION (UPDATED TO MATCH DATASET)
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

# PYDANTIC MODELS
class StudentStressInput(BaseModel):
    """Input schema for stress prediction"""
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
    
    class Config:
        schema_extra = {
            "example": {
                "academic_performance": 3,
                "study_load": 4,
                "teacher_student_relationship": 3,
                "future_career_concerns": 2,
                "basic_needs": 5,
                "living_conditions": 2,
                "safety": 3,
                "noise_level": 4,
                "anxiety_level": 15,
                "self_esteem": 18,
                "depression": 12,
                "peer_pressure": 3,
                "social_support": 2,
                "bullying": 1,
                "sleep_quality": 2,
                "headache": 3,
                "breathing_problem": 2,
                "blood_pressure": 2,
                "mental_health_history": 0,
                "extracurricular_activities": 3
            }
        }

class PredictionResponse(BaseModel):
    """Output schema for predictions"""
    stress_level: str
    stress_level_code: int
    confidence: float
    color: str
    top_stressors: List[Dict[str, Any]]
    interventions: List[str]
    raw_probabilities: Dict[str, float]

# SHAP EXPLAINER (initialized globally for efficiency)
SHAP_EXPLAINER = None

def initialize_shap_explainer():
    """Initialize SHAP explainer (TreeExplainer for XGBoost)"""
    global SHAP_EXPLAINER
    if SHAP_EXPLAINER is None:
        SHAP_EXPLAINER = shap.TreeExplainer(model)
        print("✓ SHAP explainer initialized")

def scale_input(data_dict: dict) -> np.ndarray:
    """Apply appropriate scaling to input features"""
    df = pd.DataFrame([data_dict])
    
    # StandardScaler for continuous
    df[CONTINUOUS_FEATURES] = scaler_standard.transform(df[CONTINUOUS_FEATURES])
    
    # MinMaxScaler for Likert
    df[LIKERT_FEATURES] = scaler_minmax.transform(df[LIKERT_FEATURES])
    
    # Reorder to match training features
    return df[ALL_FEATURES].values

def get_shap_values(scaled_input: np.ndarray, prediction: int) -> List[Dict[str, Any]]:
    """
    Calculate SHAP values for interpretability
    Returns top contributing features for the predicted class
    """
    try:
        initialize_shap_explainer()
        
        # Get SHAP values for the instance
        shap_values = SHAP_EXPLAINER.shap_values(scaled_input)
        
        # Handle different SHAP output formats for multi-class models
        if isinstance(shap_values, list):
            # List of arrays, one per class, each shape (n_samples, n_features)
            instance_shap = shap_values[prediction][0]
        elif isinstance(shap_values, np.ndarray):
            if shap_values.ndim == 3:
                # Shape (n_samples, n_features, n_classes) for XGBoost multi-class
                if shap_values.shape[2] == 3:
                    instance_shap = shap_values[0, :, prediction]
                elif shap_values.shape[1] == 3:
                    instance_shap = shap_values[0, prediction, :]
                else:
                    instance_shap = shap_values[0, :, prediction]
            else:
                instance_shap = shap_values[0]
        else:
            instance_shap = shap_values[0]
            
        # Ensure instance_shap is a 1D array of length len(ALL_FEATURES)
        instance_shap = np.array(instance_shap).flatten()
        
        # Map to feature names with absolute impact
        feature_impact = [
            {
                'feature': ALL_FEATURES[i],
                'impact': float(np.abs(instance_shap[i])),
                'contribution': float(instance_shap[i])  # signed value
            }
            for i in range(len(ALL_FEATURES))
        ]
        
        # Sort by absolute impact and return top 5
        top_5 = sorted(feature_impact, key=lambda x: x['impact'], reverse=True)[:5]
        return top_5
    except Exception as e:
        print(f"SHAP calculation error: {e}")
        import traceback
        traceback.print_exc()
        return []

def generate_interventions(input_data: StudentStressInput, stress_level: int) -> List[str]:
    """
    Generate contextual intervention suggestions based on input metrics
    """
    suggestions = []
    
    # Sleep-related
    if input_data.sleep_quality <= 2:
        suggestions.append("💤 SLEEP: Establish a consistent bedtime routine (10-11 PM). Avoid screens 30min before sleep.")
    
    # Academic load
    if input_data.study_load >= 4:
        suggestions.append("📚 STUDY: Break study sessions into 45-min blocks with 10-min breaks (Pomodoro).")
    
    # Anxiety
    if input_data.anxiety_level >= 14:
        suggestions.append("🧠 ANXIETY: Practice breathing exercises (4-7-8 technique) for 5min daily.")
    
    # Basic needs / Financial
    if input_data.basic_needs >= 4:
        suggestions.append("💰 SUPPORT: Meet with university financial aid office or explore student loans.")
    
    # Social support
    if input_data.social_support <= 2:
        suggestions.append("🤝 SUPPORT: Reach out to a friend, counselor, or join a campus club.")
    
    # Physiological symptoms
    if input_data.headache >= 3 or input_data.breathing_problem >= 3:
        suggestions.append("⚕️ HEALTH: Consult campus health center. Consider stress-management workshops.")
    
    # Self-esteem
    if input_data.self_esteem <= 12:
        suggestions.append("🎯 SELF-ESTEEM: Seek peer support or university counseling services (often free).")
    
    # If high stress, recommend professional help
    if stress_level == 2:
        suggestions.insert(0, "🚨 HIGH STRESS: Consider consulting campus counseling or mental health services.")
    
    return suggestions[:3]  # Return top 3 suggestions

# ROUTES
@app.get("/", tags=["Health"])
def root():
    """API health check"""
    return {
        "status": "online",
        "service": "Student Stress ML Predictor",
        "version": "1.0.0"
    }

@app.post("/predict", response_model=PredictionResponse, tags=["Predictions"])
def predict_stress(student_data: StudentStressInput):
    """
    PRIMARY ENDPOINT: Predict stress level with interpretability
    
    Input: 20 student survey responses
    Output: Stress category + top stressors + interventions
    """
    try:
        # Convert to dict for processing
        data_dict = student_data.dict()
        
        # Scale input
        scaled_input = scale_input(data_dict)
        
        # Predict
        prediction = model.predict(scaled_input)[0]
        probabilities = model.predict_proba(scaled_input)[0]
        confidence = float(np.max(probabilities))
        
        # Get SHAP explanations
        top_stressors = get_shap_values(scaled_input, prediction)
        
        # Generate interventions
        interventions = generate_interventions(student_data, prediction)
        
        # Probability mapping
        prob_dict = {
            'Low': float(probabilities[0]),
            'Moderate': float(probabilities[1]),
            'High': float(probabilities[2])
        }
        
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
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/batch-predict", tags=["Predictions"])
def batch_predict(student_list: List[StudentStressInput]):
    """
    BATCH ENDPOINT: Predict for multiple students (admin cohort analysis)
    Returns aggregated metrics
    """
    predictions = []
    stress_counts = {0: 0, 1: 0, 2: 0}
    
    for student in student_list:
        data_dict = student.dict()
        scaled_input = scale_input(data_dict)
        
        pred = model.predict(scaled_input)[0]
        proba = model.predict_proba(scaled_input)[0]
        
        predictions.append({
            'stress_level': STRESS_LABELS[pred],
            'confidence': float(np.max(proba)),
            'probabilities': {
                'Low': float(proba[0]),
                'Moderate': float(proba[1]),
                'High': float(proba[2])
            }
        })
        stress_counts[pred] += 1
    
    return {
        'total_students': len(student_list),
        'predictions': predictions,
        'aggregated_stats': {
            'low_stress_count': stress_counts[0],
            'moderate_stress_count': stress_counts[1],
            'high_stress_count': stress_counts[2],
            'high_stress_percentage': (stress_counts[2] / len(student_list) * 100) if student_list else 0
        }
    }

@app.get("/model-info", tags=["Info"])
def model_info():
    """Get model metadata"""
    return {
        'model_type': 'XGBoost',
        'n_estimators': 150,
        'n_classes': 3,
        'class_labels': STRESS_LABELS,
        'n_features': len(ALL_FEATURES),
        'features': ALL_FEATURES,
        'feature_groups': {
            'continuous': CONTINUOUS_FEATURES,
            'likert': LIKERT_FEATURES,
            'categorical': CATEGORICAL_FEATURES
        }
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)