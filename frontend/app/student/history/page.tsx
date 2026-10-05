'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TrendChart from '@/components/charts/TrendChart';

interface AssessmentRecord {
  date: string;
  stress_level: string;
  confidence: number;
  top_stressor: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    // For now, mock data. In real app, fetch from backend
    const mockHistory: AssessmentRecord[] = [
      {
        date: '2026-10-14',
        stress_level: 'Moderate',
        confidence: 0.67,
        top_stressor: 'Study Load',
      },
      {
        date: '2026-09-16',
        stress_level: 'Moderate',
        confidence: 0.71,
        top_stressor: 'Financial Stress',
      },
      {
        date: '2026-08-18',
        stress_level: 'Low',
        confidence: 0.76,
        top_stressor: 'Sleep Quality',
      },
      {
        date: '2026-07-12',
        stress_level: 'Moderate',
        confidence: 0.69,
        top_stressor: 'Career Concerns',
      },
    ];

    setHistory(mockHistory);
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Wellbeing History</h1>
          <p className="text-gray-600">
            See how your stress patterns and contributing factors have changed over time.
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-700">View:</p>
            <div className="flex gap-2">
              {[
                { value: '7', label: '7 days' },
                { value: '30', label: '30 days' },
                { value: '90', label: '3 months' },
                { value: 'all', label: 'All time' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    timeRange === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Stress Level Over Time</h2>
          <p className="text-sm text-gray-600 mb-4">Six private assessments · May–October 2026</p>
          <TrendChart data={history} />
        </div>

        {/* Assessment History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
            <p className="text-sm text-gray-600 mt-1">Your recent predictions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stress Level
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Top Stressor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          record.stress_level === 'Low'
                            ? 'bg-green-100 text-green-800'
                            : record.stress_level === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.stress_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {Math.round(record.confidence * 100)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {record.top_stressor}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {history.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 mb-4">No assessments found in this time range.</p>
              <button
                onClick={() => router.push('/student/assessment')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Start Your First Assessment
              </button>
            </div>
          )}
        </div>

        {/* Insights Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Pattern Insights</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>Your stress has remained stable around the Moderate range over the past 3 months.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>Study Load consistently appears as a top stressor across assessments.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>Sleep Quality has fluctuated, showing correlation with stress levels.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}