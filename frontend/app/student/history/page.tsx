'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TrendChart from '@/components/charts/TrendChart';
import { getAssessmentHistory, clearAssessmentHistory, deleteAssessmentRecord } from '@/lib/api';

const Icons = {
  Trash: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
};

interface AssessmentRecord {
  id: number;
  date: string;
  stress_level: string;
  stress_level_code: number;
  confidence: number;
  top_stressor: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getAssessmentHistory();
        const formatted = data.map((item: any) => ({
          ...item,
          top_stressor: item.top_stressor.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
        }));
        setHistory(formatted);
      } catch (e) {
        console.error('Failed to parse assessment history', e);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire assessment history?')) {
      await clearAssessmentHistory();
      setHistory([]);
      localStorage.removeItem('latestPrediction');
    }
  };

  const handleDeleteSingle = async (id: number) => {
    if (window.confirm('Delete this assessment record?')) {
      const success = await deleteAssessmentRecord(id);
      if (success) {
        setHistory(prev => prev.filter(record => record.id !== id));
      }
    }
  };

  const filteredHistory = history.filter((record) => {
    if (timeRange === 'all') return true;
    const recordDate = new Date(record.date).getTime();
    const now = new Date().getTime();
    const days = parseInt(timeRange, 10);
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  });

  if (loading) return <div className="min-h-screen p-10 flex justify-center items-center">Loading history...</div>;

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">My Wellbeing History</h1>
            <p className="text-slate-500 text-base md:text-lg">See how your stress patterns and contributing factors have changed over time.</p>
          </div>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs md:text-sm font-semibold rounded-xl border border-rose-200 transition shadow-2xs">
              Clear All
            </button>
          )}
        </div>

        <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide gap-2.5">
          {[
            { value: '7', label: '7 days' }, { value: '30', label: '30 days' }, { value: '90', label: '3 months' }, { value: 'all', label: 'All time' },
          ].map((option) => (
            <button
              key={option.value} onClick={() => setTimeRange(option.value as any)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                timeRange === option.value ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-200/80 mb-8">
          <h2 className="text-xl font-bold mb-1 text-slate-900">Stress Level Over Time</h2>
          <TrendChart data={filteredHistory} />
        </div>

        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Assessment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF8F5] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stress Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Top Factor</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                          record.stress_level_code === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : record.stress_level_code === 2 ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                        {record.stress_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 capitalize">{record.top_stressor}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteSingle(record.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50"
                        title="Delete record"
                      >
                        <Icons.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredHistory.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-500 mb-4 text-sm font-medium">No assessments found in this time range.</p>
              <button onClick={() => router.push('/student/assessment')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-sm shadow-sm">
                Start Your First Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}