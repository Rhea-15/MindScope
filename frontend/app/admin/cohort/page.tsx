'use client';

import { useState } from 'react';

const STRESS_FACTORS_HEATMAP = [
  {
    cohort: 'Computer Eng. - Y2',
    academic_performance: 54,
    study_load: 88,
    financial_stress: 68,
    anxiety: 72,
    sleep_quality: 76,
    social_support: 42,
    career_concerns: 70,
    peer_pressure: 55,
  },
  {
    cohort: 'Information Tech. - Y2',
    academic_performance: 48,
    study_load: 70,
    financial_stress: 58,
    anxiety: 61,
    sleep_quality: 64,
    social_support: 38,
    career_concerns: 55,
    peer_pressure: 48,
  },
  {
    cohort: 'AI & Data Science - Y2',
    academic_performance: 61,
    study_load: 76,
    financial_stress: 51,
    anxiety: 69,
    sleep_quality: 58,
    social_support: 47,
    career_concerns: 67,
    peer_pressure: 52,
  },
  {
    cohort: 'Computer Eng. - Y3',
    academic_performance: 66,
    study_load: 63,
    financial_stress: 49,
    anxiety: 54,
    sleep_quality: 52,
    social_support: 36,
    career_concerns: 82,
    peer_pressure: 45,
  },
];

const getHeatmapColor = (value: number): string => {
  if (value >= 75) return '#4f46e5';
  if (value >= 60) return '#8b5cf6';
  if (value >= 45) return '#a78bfa';
  return '#e9d5ff';
};

export default function CohortAnalyticsPage() {
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Cohort Analytics</h1>
          <p className="text-gray-600">
            Deep dive into specific student groups to understand stress factors and inform targeted interventions.
          </p>
        </div>

        {/* Cohort Selector */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <p className="font-medium text-gray-900 mb-4">Select a Cohort</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STRESS_FACTORS_HEATMAP.map((cohort) => (
              <button
                key={cohort.cohort}
                onClick={() => setSelectedCohort(cohort.cohort)}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  selectedCohort === cohort.cohort
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cohort.cohort}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stress Factors by Cohort</h2>
          <p className="text-gray-600 mb-6">Average relative impact across anonymized groups</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 sticky left-0 bg-gray-50">
                    Cohort
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Academic</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Study Load</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Financial</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Anxiety</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Sleep</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Support</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Career</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Peer Press</th>
                </tr>
              </thead>
              <tbody>
                {STRESS_FACTORS_HEATMAP.map((row) => (
                  <tr
                    key={row.cohort}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                      selectedCohort === row.cohort ? 'bg-purple-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-white hover:bg-gray-50">
                      {row.cohort}
                    </td>
                    {[
                      row.academic_performance,
                      row.study_load,
                      row.financial_stress,
                      row.anxiety,
                      row.sleep_quality,
                      row.social_support,
                      row.career_concerns,
                      row.peer_pressure,
                    ].map((score, idx) => (
                      <td key={idx} className="px-6 py-4 text-center">
                        <div
                          className="inline-block px-3 py-2 rounded font-semibold text-white text-xs"
                          style={{
                            backgroundColor: getHeatmapColor(score),
                          }}
                        >
                          {score}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Impact Scale:</span>
            {[
              { range: '75+', color: '#4f46e5', label: 'Very High' },
              { range: '60-74', color: '#8b5cf6', label: 'High' },
              { range: '45-59', color: '#a78bfa', label: 'Moderate' },
              { range: '< 45', color: '#e9d5ff', label: 'Low' },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights for Selected Cohort */}
        {selectedCohort && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Insights for {selectedCohort}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Primary Stressors</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">1.</span>
                    <div>
                      <p className="font-medium text-gray-900">Study Load (88%)</p>
                      <p className="text-sm text-gray-600">High assignment volume is the primary stressor for this cohort.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">2.</span>
                    <div>
                      <p className="font-medium text-gray-900">Sleep Quality (76%)</p>
                      <p className="text-sm text-gray-600">Poor sleep patterns correlate with high stress.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">3.</span>
                    <div>
                      <p className="font-medium text-gray-900">Anxiety Levels (72%)</p>
                      <p className="text-sm text-gray-600">Above-average anxiety among this group.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Recommended Actions</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <span>📚</span>
                    <div>
                      <p className="font-medium text-gray-900">Adjust Assignment Deadlines</p>
                      <p className="text-sm text-gray-600">Spread project deadlines to reduce concurrent workload.</p>
                    </div>
                  </li>
                  <li className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <span>😴</span>
                    <div>
                      <p className="font-medium text-gray-900">Wellness Breaks</p>
                      <p className="text-sm text-gray-600">Schedule dedicated rest days during heavy exam periods.</p>
                    </div>
                  </li>
                  <li className="flex gap-3 p-3 bg-purple-50 rounded-lg">
                    <span>🧠</span>
                    <div>
                      <p className="font-medium text-gray-900">Mental Health Support</p>
                      <p className="text-sm text-gray-600">Promote counseling services and stress-management workshops.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}