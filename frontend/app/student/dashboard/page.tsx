'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PredictionResult } from '@/types';
import MetricCard from '@/components/cards/MetricCard';

export default function StudentDashboard() {
  const router = useRouter();
  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);
  const [assessmentCount, setAssessmentCount] = useState(0);

  useEffect(() => {
    // Load latest prediction from localStorage
    const saved = localStorage.getItem('latestPrediction');
    if (saved) {
      setLatestPrediction(JSON.parse(saved));
    }

    // Count assessments in history
    const history = localStorage.getItem('assessmentHistory');
    if (history) {
      const parsed = JSON.parse(history);
      setAssessmentCount(parsed.length);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-blue-600 font-semibold mb-2">WELCOME BACK</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Good morning, Alex</h1>
          <p className="text-lg text-gray-600">
            Understand your current wellbeing and discover what may be affecting your stress.
          </p>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Check-in ready</p>
              <p className="text-sm text-gray-600">You can complete your next wellbeing assessment now</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Latest Assessment Card */}
          <div className="md:col-span-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Last Assessment</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {latestPrediction ? new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }) : '—'}
            </p>
            <p className="text-xs text-gray-500 mb-6">12 days ago</p>
            <button
              onClick={() => router.push('/student/assessment')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Take Assessment
            </button>
          </div>

          {/* Current Stress Level */}
          {latestPrediction && (
            <div className="md:col-span-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Current Stress Level</p>
              <div className="flex items-baseline gap-2 mb-4">
                <p
                  className="text-3xl font-bold"
                  style={{ color: latestPrediction.color }}
                >
                  {latestPrediction.stress_level}
                </p>
                <p className="text-sm text-gray-600">Stable since September</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${(latestPrediction.stress_level_code + 1) * 33.33}%`,
                    backgroundColor: latestPrediction.color,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Total Assessments */}
          <div className="md:col-span-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Assessments</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">{assessmentCount}</p>
            <p className="text-xs text-gray-500 mb-6">Since August 2026</p>
            <button
              onClick={() => router.push('/student/history')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              View History
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white shadow-lg">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 1 1 0 000 2H6a6 6 0 100 12H5a1 1 0 100 2h4a2 2 0 002-2 6 6 0 100-12h1a1 1 0 100-2 2 2 0 00-2-2H4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">How are you feeling lately?</h3>
              <p className="text-blue-100 mb-6">
                Complete a short, private assessment to understand your current stress level and what you can focus on next.
              </p>
              <button
                onClick={() => router.push('/student/assessment')}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Start Assessment →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}