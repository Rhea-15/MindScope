'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopStressor {
  feature: string;
  impact: number;
  contribution: number;
}

interface FactorChartProps {
  stressors: TopStressor[];
}

export default function FactorChart({ stressors }: FactorChartProps) {
  const safeStressors = stressors?.length ? stressors : [{ feature: 'no_data', impact: 0, contribution: 0 }];

  const formatted = safeStressors.map((s) => ({
    name: s.feature
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    impact: Math.round(s.impact * 100),
  }));

  return (
    <div className="w-full h-80">
      <h3 className="font-semibold mb-4">What is influencing your result?</h3>
      <p className="text-sm text-gray-600 mb-4">Relative contribution of each factor to this individual prediction</p>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip />
          <Bar dataKey="impact" fill="#6366f1" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
