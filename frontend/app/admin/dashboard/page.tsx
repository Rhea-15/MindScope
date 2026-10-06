'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState({ dept: 'Computer Engineering', year: 'Year 2', cohort: 'All cohorts', sem: 'Semester 1', period: 'Mid-semester' });

  useEffect(() => {
    // Dynamic mock for rendering Admin Dashboard UI exactly as per video
    setData({
      total: 1100, lowPercent: 31, modPercent: 48, highPercent: 21, avgIndex: 58,
      distribution: [
        { name: 'Low', value: 341, color: '#10b981' },
        { name: 'Moderate', value: 528, color: '#f59e0b' },
        { name: 'High', value: 231, color: '#ef4444' }
      ],
      stressors: [
        { name: 'Study Load', val: 78 }, { name: 'Financial Stress', val: 64 }, 
        { name: 'Anxiety Level', val: 59 }, { name: 'Sleep Quality', val: 47 }, 
        { name: 'Career Concerns', val: 32 }, { name: 'Peer Pressure', val: 24 }
      ]
    });
  }, [filter]);

  if (!data) return null;

  return (
    <div className="p-8 bg-[#f8f9fc] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Wellbeing Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Aggregated and anonymized stress insights across student cohorts.</p>
        </div>
        <button className="border border-slate-300 bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
          Export summary ⬇
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 mb-8 items-end">
        {[
          { label: 'Department', val: filter.dept }, { label: 'Year', val: filter.year }, 
          { label: 'Cohort', val: filter.cohort }, { label: 'Semester', val: filter.sem }, 
          { label: 'Assessment period', val: filter.period }
        ].map((f, i) => (
          <div key={i} className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
            <select className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>{f.val}</option>
            </select>
          </div>
        ))}
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 h-[38px]">Apply filters</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { title: 'Total students', val: data.total.toLocaleString(), sub: '± 1.2% response rate' },
          { title: 'Low stress', val: `${data.lowPercent}%`, sub: 'Minimal intervention' },
          { title: 'Moderate stress', val: `${data.modPercent}%`, sub: 'Elevated monitoring' },
          { title: 'High stress', val: `${data.highPercent}%`, sub: 'Requires intervention', alert: true },
          { title: 'Average risk index', val: data.avgIndex, sub: 'Out of 100 max score' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 mb-2">{kpi.title}</p>
            <p className={`text-3xl font-bold ${kpi.alert ? 'text-red-500' : 'text-slate-900'}`}>{kpi.val}</p>
            <p className="text-xs text-slate-400 mt-2">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Stress level distribution</h3>
          <p className="text-sm text-slate-500 mb-6">Current assessment period</p>
          <div className="flex items-center">
            <div className="w-1/2 h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.distribution} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {data.distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-slate-900">{data.total}</span>
              </div>
            </div>
            <div className="w-1/2 space-y-4">
              {data.distribution.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{Math.round((item.value / data.total) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Top stressors across cohort</h3>
          <p className="text-sm text-slate-500 mb-6">Share of students with elevated factor scores</p>
          <div className="space-y-4">
            {data.stressors.map((str: any, i: number) => (
              <div key={i} className="flex items-center text-sm">
                <span className="w-32 font-medium text-slate-700">{str.name}</span>
                <div className="flex-1 mx-4 bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${str.val}%` }}></div>
                </div>
                <span className="w-10 text-right font-bold text-slate-900">{str.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}