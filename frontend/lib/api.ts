import { StudentStressInput, PredictionResult } from '@/types';

// Points to your FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function predictStress(data: StudentStressInput): Promise<PredictionResult> {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}