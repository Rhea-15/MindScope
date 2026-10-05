'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GaugeChart from '@/components/charts/GaugeChart';
import FactorChart from '@/components/charts/FactorChart';
import { PredictionResult } from '@/types';
import { format } from 'date-fns';

export default function InsightsPage() {
  const router = useRouter();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('latestPrediction');
    if (saved) {
      setPrediction(JSON.parse(saved));
    } else {
      router.push('/student/assessment');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-gray-600 mb-4">No assessment data found. Please complete an assessment first.</p>
          <button
            onClick={() => router.push('/student/assessment')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-blue-600 font-semibold">
            ASSESSMENT COMPLETE · {format(new Date(), 'dd MMM yyyy')}
          </p>
          <h1 className="text-4xl font-bold mt-2 text-gray-900">Your Stress Insights</h1>
          <p className="text-gray-600 mt-3">
            Based on the information you provided. Here is what the model found.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Gauge Chart (spans 2 cols on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <GaugeChart
              stressLevel={prediction.stress_level_code}
              confidence={prediction.confidence}
              stressLabel={prediction.stress_level}
              color={prediction.color}
            />
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Predicted Level</p>
              <p
                className="text-3xl font-bold"
                style={{ color: prediction.color }}
              >
                {prediction.stress_level}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Model Confidence</p>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(prediction.confidence * 100)}%
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Assessment Areas</p>
              <p className="text-3xl font-bold text-blue-600">4</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Top Stressor</p>
              <p className="text-lg font-semibold text-gray-800">
                {prediction.top_stressors[0]?.feature
                  .split('_')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
              </p>
            </div>
          </div>
        </div>

        {/* SHAP Factor Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Factor Chart */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <FactorChart stressors={prediction.top_stressors} />
          </div>

          {/* Top Factors Explained */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-6">What is contributing most?</h3>
            <p className="text-sm text-gray-600 mb-6">Your top three factors, explained</p>

            <div className="space-y-6">
              {prediction.top_stressors.slice(0, 3).map((factor, idx) => (
                <div key={idx} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-900">
                      {idx + 1}. {factor.feature
                        .split('_')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </p>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round(factor.impact * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    This factor is strongly shaping your current result. Consider this area when planning next steps.
                  </p>
                </div>
              ))}
            </div>

            <button className="mt-6 text-blue-600 font-medium text-sm hover:underline">
              View all factors →
            </button>
          </div>
        </div>

        {/* Interventions */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-10">
          <h3 className="font-semibold text-lg mb-6">Personalized Next Steps</h3>
          <p className="text-sm text-gray-600 mb-6">Small, practical actions based on your assessment.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prediction.interventions.map((intervention, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:shadow-md transition"
              >
                <p className="text-sm font-medium text-blue-900 leading-relaxed">
                  {intervention}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Probability Breakdown */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-10">
          <h3 className="font-semibold text-lg mb-6">Stress Level Probabilities</h3>
          <p className="text-sm text-gray-600 mb-6">Model's confidence across all stress categories</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200 text-center">
              <p className="text-sm text-gray-600 mb-2">Low Stress</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(prediction.raw_probabilities.Low * 100)}%
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200 text-center">
              <p className="text-sm text-gray-600 mb-2">Moderate Stress</p>
              <p className="text-3xl font-bold text-amber-600">
                {Math.round(prediction.raw_probabilities.Moderate * 100)}%
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-6 border border-red-200 text-center">
              <p className="text-sm text-gray-600 mb-2">High Stress</p>
              <p className="text-3xl font-bold text-red-600">
                {Math.round(prediction.raw_probabilities.High * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-10">
          <p className="text-sm text-blue-900">
            <strong>ⓘ Important:</strong> This result is not a diagnosis. It is a supportive estimate to help you reflect on your wellbeing. If you're experiencing significant distress, please consult campus counseling or mental health services for professional support.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/student/assessment')}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => router.push('/student/history')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            View History
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(
                new Blob([JSON.stringify(prediction, null, 2)], { type: 'application/json' })
              );
              link.download = `stress_assessment_${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Save Summary
          </button>
        </div>
      </div>
    </div>
  );
}