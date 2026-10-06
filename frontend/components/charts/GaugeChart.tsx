'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  stressLevel: number;
  stressLabel: string;
  color: string;
}

export default function GaugeChart({ stressLevel, stressLabel, color }: GaugeChartProps) {
  const data = [
    { name: 'LOW', value: 33, color: '#10b981' },
    { name: 'MODERATE', value: 34, color: '#f59e0b' },
    { name: 'HIGH', value: 33, color: '#ef4444' },
  ];

  const gaugePercent = stressLevel === 0 ? 16 : stressLevel === 1 ? 50 : 84;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div
          className="absolute left-1/2 top-[70%] h-16 w-1 -translate-x-1/2 rounded-full"
          style={{
            background: color,
            transform: `translateX(-50%) rotate(${gaugePercent - 50}deg)`,
            transformOrigin: 'bottom center',
          }}
        />
        <div className="absolute left-1/2 top-[70%] h-8 w-8 -translate-x-1/2 rounded-full bg-gray-800" />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">Current level</p>
        <p className="text-3xl font-bold" style={{ color }}>
          {stressLabel.toUpperCase()}
        </p>
      </div>

      <div className="flex gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>LOW</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span>MODERATE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>HIGH</span>
        </div>
      </div>
    </div>
  );
}
