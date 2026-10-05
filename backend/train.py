import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import warnings
warnings.filterwarnings('ignore')

# CONSTANTS
DATASET_PATH = 'data/StressLevelDataset.csv'
MODEL_DIR = 'models/'
RANDOM_STATE = 42

# ACTUAL FEATURE GROUPS (FROM DATASET)
CONTINUOUS_FEATURES = ['anxiety_level', 'self_esteem', 'depression']
LIKERT_FEATURES = [
    'academic_performance', 'study_load', 'teacher_student_relationship',
    'future_career_concerns', 'basic_needs', 'living_conditions',
    'safety', 'noise_level', 'peer_pressure', 'social_support', 'bullying',
    'sleep_quality', 'headache', 'breathing_problem', 'extracurricular_activities'
]
CATEGORICAL_FEATURES = ['blood_pressure', 'mental_health_history']

ALL_FEATURES = CONTINUOUS_FEATURES + LIKERT_FEATURES + CATEGORICAL_FEATURES

def load_and_explore_data():
    """Load dataset and perform EDA"""
    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset shape: {df.shape}")
    print(f"\nColumns: {df.columns.tolist()}")
    print(f"\nMissing values:\n{df.isnull().sum()}")
    print(f"\nStress level distribution:\n{df['stress_level'].value_counts()}")
    print(f"\nFirst few rows:\n{df.head()}")
    return df

def preprocess_data(df):
    """
    SCALING STRATEGY:
    - StandardScaler on anxiety_level, self_esteem, depression (score-based, different ranges)
    - MinMaxScaler on Likert (0-5) features (bounded range)
    - Leave categorical as-is
    """
    X = df.drop('stress_level', axis=1)
    y = df['stress_level']
    
    # Verify all features exist
    missing_cols = [col for col in ALL_FEATURES if col not in X.columns]
    if missing_cols:
        print(f"⚠️ WARNING: Missing columns: {missing_cols}")
        print(f"Available columns: {X.columns.tolist()}")
    
    # Split first (IMPORTANT: avoid data leakage)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    
    # StandardScaler for continuous features
    scaler_standard = StandardScaler()
    X_train[CONTINUOUS_FEATURES] = scaler_standard.fit_transform(X_train[CONTINUOUS_FEATURES])
    X_test[CONTINUOUS_FEATURES] = scaler_standard.transform(X_test[CONTINUOUS_FEATURES])
    
    # MinMaxScaler for Likert features
    scaler_minmax = MinMaxScaler()
    X_train[LIKERT_FEATURES] = scaler_minmax.fit_transform(X_train[LIKERT_FEATURES])
    X_test[LIKERT_FEATURES] = scaler_minmax.transform(X_test[LIKERT_FEATURES])
    
    # Save scalers for inference
    joblib.dump(scaler_standard, f'{MODEL_DIR}scaler_standard.joblib')
    joblib.dump(scaler_minmax, f'{MODEL_DIR}scaler_minmax.joblib')
    
    print(f"Training set: {X_train.shape}, Test set: {X_test.shape}")
    return X_train, X_test, y_train, y_test

def train_models(X_train, X_test, y_train, y_test):
    """Train baseline + ensemble models"""
    
    print("\n=== RANDOM FOREST ===")
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        random_state=RANDOM_STATE,
        n_jobs=-1
    )
    rf.fit(X_train, y_train)
    rf_pred = rf.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_pred)
    print(f"Accuracy: {rf_acc:.4f}")
    print(f"Classification Report:\n{classification_report(y_test, rf_pred)}")
    
    print("\n=== XGBOOST (PRIMARY MODEL) ===")
    xgb = XGBClassifier(
        n_estimators=150,
        max_depth=7,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=RANDOM_STATE,
        eval_metric='mlogloss',
        use_label_encoder=False,
        tree_method='hist'
    )
    xgb.fit(X_train, y_train)
    xgb_pred = xgb.predict(X_test)
    xgb_acc = accuracy_score(y_test, xgb_pred)
    print(f"Accuracy: {xgb_acc:.4f}")
    print(f"Classification Report:\n{classification_report(y_test, xgb_pred)}")
    
    # Cross-validation
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    cv_scores = cross_val_score(xgb, X_train, y_train, cv=skf, scoring='accuracy')
    print(f"Cross-validation scores: {cv_scores}")
    print(f"Mean CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    # Save primary model
    joblib.dump(xgb, f'{MODEL_DIR}xgboost_model.joblib')
    print(f"\n✓ Model saved to {MODEL_DIR}xgboost_model.joblib")
    
    return xgb

def feature_importance(model, X_train):
    """Extract feature importance"""
    importance_df = pd.DataFrame({
        'feature': X_train.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Important Features:")
    print(importance_df.head(10))
    return importance_df

if __name__ == '__main__':
    print("PHASE 1: ML MODEL TRAINING\n")
    
    df = load_and_explore_data()
    X_train, X_test, y_train, y_test = preprocess_data(df)
    model = train_models(X_train, X_test, y_train, y_test)
    feature_importance(model, X_train)
    
    print("\n✓ Training complete! Models saved in 'models/' directory")