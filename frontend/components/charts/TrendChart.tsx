'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AssessmentRecord {
  date: string;
  stress_level: string;
  confidence: number;
  top_stressor: string;
}

interface TrendChartProps {
  data: AssessmentRecord[];
}

export default function TrendChart({ data }: TrendChartProps) {
  // Transform data for chart
  const chartData = data.map((record) => ({
    date: new Date(record.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    stress: record.stress_level === 'Low' ? 1 : record.stress_level === 'Moderate' ? 2 : 3,
    confidence: Math.round(record.confidence * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" label={{ value: 'Stress Level', angle: -90, position: 'insideLeft' }} domain={[0, 3]} />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: 'Confidence (%)', angle: 90, position: 'insideRight' }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
          formatter={(value) => {
            if (typeof value === 'number' && value <= 3) {
              const levels = ['', 'Low', 'Moderate', 'High'];
              return levels[value];
            }
            return value;
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="stress"
          stroke="#8b5cf6"
          name="Stress Level"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="confidence"
          stroke="#06b6d4"
          name="Confidence (%)"
          strokeWidth={2}
          dot={{ fill: '#06b6d4', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}