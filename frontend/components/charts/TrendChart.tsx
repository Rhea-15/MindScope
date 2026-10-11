'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LEVEL_LABELS = ['Low', 'Moderate', 'High'];

interface AssessmentRecord {
  date: string;
  stress_level: string;
  stress_level_code: number;
  confidence: number;
  top_stressor: string;
}

interface TrendChartProps {
  data: AssessmentRecord[];
}

export default function TrendChart({ data }: TrendChartProps) {
  // Use the backend's stress_level_code (0 = Low, 1 = Moderate, 2 = High) directly
  const chartData = data.map((record) => ({
    date: new Date(record.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    stress: record.stress_level_code,
    stressLabel: LEVEL_LABELS[record.stress_level_code] ?? record.stress_level,
    confidence: Math.round(record.confidence * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          yAxisId="left"
          domain={[-0.2, 2.2]}
          ticks={[0, 1, 2]}
          allowDecimals={false}
          label={{ value: 'Stress Level', angle: -90, position: 'insideLeft' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          label={{ value: 'Confidence (%)', angle: 90, position: 'insideRight' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
          formatter={(value: any, name: any, item: any) => {
            if (name === 'Stress Level') return [item.payload.stressLabel, name];
            return [`${value}%`, name];
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