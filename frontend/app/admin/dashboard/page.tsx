'use client';

import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import MetricCard from '@/components/cards/MetricCard';

const MOCK_COHORT_DATA = {
  total_students: 1100,
  low_stress: 341,
  moderate_stress: 528,
  high_stress: 231,
};

const MOCK_TOP_STRESSORS = [
  { name: 'Study Load', value: 78 },
  { name: 'Financial Stress', value: 64 },
  { name: 'Anxiety Level', value: 59 },
  { name: 'Career Concerns', value: 53 },
  { name: 'Sleep Quality', value: 47 },
  { name: 'Peer Pressure', value: 32 },
];

const MOCK_DEPARTMENT_DATA = [
  {
    department: 'Computer Eng. - Y2',
    low: 28,
    moderate: 51,
    high: 21,
  },
  {
    department: 'Information Tech. - Y2',
    low: 35,
    moderate: 47,
    high: 18,
  },
  {
    department: 'AI & Data Science - Y2',
    low: 32,
    moderate: 45,
    high: 23,
  },
];

const MOCK_TRENDS = [
  { week: 'Week 1', low: 35, moderate: 40, high: 25 },
  { week: 'Week 4', low: 32, moderate: 42, high: 26 },
  { week: 'Week 7', low: 30, moderate: 44, high: 26 },
  { week: 'Midterm', low: 28, moderate: 46, high: 26 },
  { week: 'Week 12', low: 29, moderate: 45, high: 26 },
  { week: 'Finals', low: 25, moderate: 48, high: 27 },
];

export default function AdminDashboard() {
  const [filters, setFilters] = useState({
    department: 'Computer Engineering',
    year: 'Year 2',
    semester: 'Semester 1',
  });

  const pieData = [
    { name: 'Low', value: MOCK_COHORT_DATA.low_stress, color: '#10b981' },
    { name: 'Moderate', value: MOCK_COHORT_DATA.moderate_stress, color: '#f59e0b' },
    { name: 'High', value: MOCK_COHORT_DATA.high_stress, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Student Wellbeing Overview</h1>
          <p className="text-gray-600">
            Aggregated and anonymized stress insights across student cohorts.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            >
              <option>Computer Engineering</option>
              <option>Information Technology</option>
              <option>AI & Data Science</option>
            </select>

            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            >
              <option>Year 1</option>
              <option>Year 2</option>
              <option>Year 3</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm">
              <option>All cohorts</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm">
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>

            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm">
              Apply filters
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <MetricCard label="Total Students" value={MOCK_COHORT_DATA.total_students} subtitle="1,100 responses" />
          <MetricCard
            label="Low Stress"
            value="31%"
            subtitle={`${MOCK_COHORT_DATA.low_stress} responses`}
            color="green"
          />
          <MetricCard
            label="Moderate Stress"
            value="48%"
            subtitle={`${MOCK_COHORT_DATA.moderate_stress} responses`}
            color="amber"
          />
          <MetricCard
            label="High Stress"
            value="21%"
            subtitle={`${MOCK_COHORT_DATA.high_stress} responses`}
            color="red"
          />
          <MetricCard
            label="Risk Index"
            value="58"
            subtitle="Out of 100"
            color="blue"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stress Distribution */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Stress Level Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Current assessment period</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    {item.name}
                  </span>
                  <span className="font-semibold">
                    {Math.round((item.value / MOCK_COHORT_DATA.total_students) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Stressors */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Top Stressors Across Cohort</h3>
            <p className="text-sm text-gray-600 mb-4">Share of students with elevated factor scores</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_TOP_STRESSORS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress Trends */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
          <h3 className="font-semibold text-lg mb-6 text-gray-900">Stress Distribution Trend</h3>
          <p className="text-sm text-gray-600 mb-4">Spring semester · Six assessment periods</p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={MOCK_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="low" stroke="#10b981" name="Low Stress" strokeWidth={2} />
              <Line type="monotone" dataKey="moderate" stroke="#f59e0b" name="Moderate Stress" strokeWidth={2} />
              <Line type="monotone" dataKey="high" stroke="#ef4444" name="High Stress" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
          <h3 className="font-semibold text-lg mb-6 text-gray-900">Stress by Department</h3>
          <p className="text-sm text-gray-600 mb-6">Distribution of LOW, MODERATE, and HIGH</p>

          <div className="space-y-6">
            {MOCK_DEPARTMENT_DATA.map((dept) => (
              <div key={dept.department}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{dept.department}</span>
                  <span className="text-xs text-gray-600">
                    {dept.low}% Low · {dept.moderate}% Moderate · {dept.high}% High
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
                  <div
                    className="bg-green-500"
                    style={{ width: `${dept.low}%` }}
                  ></div>
                  <div
                    className="bg-amber-500"
                    style={{ width: `${dept.moderate}%` }}
                  ></div>
                  <div
                    className="bg-red-500"
                    style={{ width: `${dept.high}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
            Generate Report
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}