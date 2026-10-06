'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TrendChart from '@/components/charts/TrendChart';

interface AssessmentRecord {
  date: string;
  stress_level: string;
  top_stressor: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    const stored = localStorage.getItem('assessmentHistory');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const formatted: AssessmentRecord[] = parsed.map((item: any) => {
          const topStressorFeature = item.top_stressors?.[0]?.feature || 'study_load';
          const formattedStressor = topStressorFeature
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase());

          return {
            date: item.date || new Date().toISOString(),
            stress_level: item.stress_level || 'Moderate',
            top_stressor: formattedStressor,
          };
        });
        setHistory(formatted);
      } catch (e) {
        console.error('Failed to parse assessment history', e);
      }
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your assessment history?')) {
      localStorage.removeItem('assessmentHistory');
      setHistory([]);
    }
  };

  // Filter history based on selected time range
  const filteredHistory = history.filter((record) => {
    if (timeRange === 'all') return true;
    const recordDate = new Date(record.date).getTime();
    const now = new Date().getTime();
    const days = parseInt(timeRange, 10);
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">My Wellbeing History</h1>
            <p className="text-slate-500 text-base md:text-lg">
              See how your stress patterns and contributing factors have changed over time.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs md:text-sm font-semibold rounded-xl border border-rose-200 transition shadow-2xs"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Hero Pastel Gradient Banner */}
        <div className="rounded-3xl p-8 md:p-10 mb-8 border border-purple-100/70 shadow-sm relative overflow-hidden bg-gradient-to-r from-[#EDE9FE] via-[#FCE7F3] to-[#FEF3C7]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-pink-200/30 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Track Your Progress</h2>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Review your past check-ins to spot trends, evaluate your resilience, and see how your focus areas evolve week by week.
            </p>
          </div>
        </div>

        {/* Time Range Filter Pills */}
        <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide gap-2.5">
          {[
            { value: '7', label: '7 days' },
            { value: '30', label: '30 days' },
            { value: '90', label: '3 months' },
            { value: 'all', label: 'All time' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                timeRange === option.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-200/80 mb-8">
          <h2 className="text-xl font-bold mb-1 text-slate-900">Stress Level Over Time</h2>
          <p className="text-xs md:text-sm text-slate-500 mb-6">Visual timeline of your recorded check-ins</p>
          <TrendChart data={filteredHistory} />
        </div>

        {/* Assessment History Table */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Assessment History</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">Detailed log of your recent predictions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stress Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Top Stressor</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                          record.stress_level === 'Low'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : record.stress_level === 'Moderate'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {record.stress_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 capitalize">
                      {record.top_stressor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-500 mb-4 text-sm font-medium">No assessments found in this time range.</p>
              <button
                onClick={() => router.push('/student/assessment')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-sm shadow-sm"
              >
                Start Your First Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}