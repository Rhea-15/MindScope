import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from main import SessionLocal, DBAssessmentRecord

def seed_database():
    db: Session = SessionLocal()
    
    # Clear existing data so you can run this script multiple times safely
    db.query(DBAssessmentRecord).delete()
    db.commit()

    print("Seeding database...")

    # --- 1. SEED ALEX'S PERSONAL HISTORY (For Student Dashboard) ---
    alex_email = "alex@northbridge.edu"
    alex_records = []
    
    # Generate 10 records over the last 30 days to show a clear trend
    for i in range(10, -1, -1): 
        record_date = datetime.utcnow() - timedelta(days=i * 3)
        
        if i > 7:
            # Past: Edge Case (High Achiever, Physical Burnout)
            level, code, stressor = "High", 2, "sleep_quality"
        elif i > 3:
            # Middle: Moderate Stress (Standard Academic Pressure)
            level, code, stressor = "Moderate", 1, "study_load"
        else:
            # Recent: Low Stress (Healthy, Protective Factors Dominating)
            level, code, stressor = "Low", 0, "academic_performance"
        
        alex_records.append(DBAssessmentRecord(
            user_email=alex_email, 
            date=record_date, 
            stress_level=level, 
            stress_level_code=code, 
            confidence=round(random.uniform(0.75, 0.98), 2),
            top_stressor=stressor
        ))
    
    db.add_all(alex_records)

    # --- 2. SEED COHORT DATA (For Admin Dashboard) ---
    branches = ['ce', 'it', 'aids']
    years = ['y2', 'y3']
    
    # Define the archetypes you requested
    cases = [
        # The "Clear Cut" Low Stress Case
        {"level": "Low", "code": 0, "stressors": ["academic_performance", "self_esteem", "social_support"]},
        # The "Average" Moderate Stress Case
        {"level": "Moderate", "code": 1, "stressors": ["study_load", "future_career_concerns", "peer_pressure"]},
        # The "Clear Cut" High Stress Case
        {"level": "High", "code": 2, "stressors": ["depression", "anxiety_level", "financial_stress"]},
        # The Edge Case: High Achiever / Physically Burned Out
        {"level": "High", "code": 2, "stressors": ["sleep_quality", "headache", "breathing_problem"]} 
    ]

    cohort_records = []
    for i in range(1, 151):
        record_date = datetime.utcnow() - timedelta(days=random.randint(0, 90))
        
        # Weighted distribution: 30% Low, 45% Mod, 15% High, 10% Edge Case
        case = random.choices(cases, weights=[30, 45, 15, 10])[0]
        stressor = random.choice(case["stressors"])
        
        # Generate realistic Indian engineering student emails
        email = f"student{i}_{random.choice(branches)}_{random.choice(years)}@sfit.ac.in"
        
        cohort_records.append(DBAssessmentRecord(
            user_email=email, 
            date=record_date, 
            stress_level=case["level"],
            stress_level_code=case["code"], 
            confidence=round(random.uniform(0.65, 0.95), 2),
            top_stressor=stressor
        ))
    
    db.add_all(cohort_records)
    db.commit()
    db.close()
    
    print("✓ Successfully seeded 10 personal history records for Alex.")
    print("✓ Successfully seeded 150 anonymous cohort records for the Admin Dashboard.")

if __name__ == "__main__":
    seed_database()