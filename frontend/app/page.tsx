'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleNavigate = (role: 'student' | 'admin') => {
    setSelectedRole(role);
    if (role === 'student') {
      router.push('/student/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">MindScope</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Understand your wellbeing through AI-powered insights. Get personalized recommendations to support your mental health journey.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Student Card */}
          <button
            type="button"
            onClick={() => handleNavigate('student')}
            className={`group w-full cursor-pointer bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-left ${
              selectedRole === 'student' ? 'ring-4 ring-blue-300' : ''
            }`}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Student</h3>
            <p className="text-gray-600 mb-6 text-left">
              Complete your personal wellbeing assessment and receive AI-powered insights about your stress levels with actionable recommendations.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 text-left">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Personal stress assessment
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Detailed factor analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Personalized interventions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                History tracking
              </li>
            </ul>
            <span className="block w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center">
              Enter as Student →
            </span>
          </button>

          {/* Admin Card */}
          <button
            type="button"
            onClick={() => handleNavigate('admin')}
            className={`group w-full cursor-pointer bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-left ${
              selectedRole === 'admin' ? 'ring-4 ring-purple-300' : ''
            }`}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Institution Admin</h3>
            <p className="text-gray-600 mb-6 text-left">
              Access aggregated, anonymized cohort analytics to identify trends, support struggling student groups, and inform institutional interventions.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 text-left">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Cohort-level analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Department comparisons
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Trend monitoring
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Aggregated insights
              </li>
            </ul>
            <span className="block w-full mt-8 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-center">
              Enter as Admin →
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-blue-100">
          <p className="text-sm">
            🔒 Privacy Protected — All cohort data is aggregated and anonymized | Not a medical diagnosis
          </p>
        </div>
      </div>
    </div>
  );
}