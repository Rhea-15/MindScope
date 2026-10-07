import { StudentStressInput, PredictionResult } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function predictStress(data: StudentStressInput): Promise<PredictionResult> {
  // Ensure email is sent to link data across profiles
  const payload = { ...data, user_email: 'alex@northbridge.edu' };

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getAssessmentHistory(email: string = 'alex@northbridge.edu') {
  try {
    const response = await fetch(`${API_URL}/history/${email}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

export async function clearAssessmentHistory(email: string = 'alex@northbridge.edu') {
  try {
    const response = await fetch(`${API_URL}/history/${email}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    console.error("Error clearing history:", error);
    return false;
  }
}

export async function deleteAssessmentRecord(id: number) {
  try {
    const response = await fetch(`${API_URL}/history/record/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    console.error("Error deleting record:", error);
    return false;
  }
}