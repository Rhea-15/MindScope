const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface StudentStressInput {
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

interface PredictionResponse {
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
}

export async function predictStress(
  input: StudentStressInput
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error('Prediction failed');
  return res.json();
}

export async function batchPredict(
  students: StudentStressInput[]
): Promise<any> {
  const res = await fetch(`${API_BASE}/batch-predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(students),
  });

  if (!res.ok) throw new Error('Batch prediction failed');
  return res.json();
}

export async function getModelInfo(): Promise<any> {
  const res = await fetch(`${API_BASE}/model-info`);
  if (!res.ok) throw new Error('Failed to fetch model info');
  return res.json();
}