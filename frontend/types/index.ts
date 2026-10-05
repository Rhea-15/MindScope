export interface StudentStressInput {
  academic_performance: number;
  study_load: number;
  teacher_student_relationship: number;
  future_career_concerns: number;
  basic_needs: number;
  living_conditions: number;
  safety: number;
  noise_level: number;
  anxiety_level: number;
  self_esteem: number;
  depression: number;
  peer_pressure: number;
  social_support: number;
  bullying: number;
  sleep_quality: number;
  headache: number;
  breathing_problem: number;
  blood_pressure: number;
  mental_health_history: number;
  extracurricular_activities: number;
}

export interface PredictionResult {
  stress_level: string;
  stress_level_code: number;
  confidence: number;
  color: string;
  top_stressors: Array<{
    feature: string;
    impact: number;
    contribution: number;
  }>;
  interventions: string[];
  raw_probabilities: {
    Low: number;
    Moderate: number;
    High: number;
  };
  timestamp?: string;
}