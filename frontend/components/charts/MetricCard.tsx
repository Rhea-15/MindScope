interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'amber' | 'red';
}

export default function MetricCard({
  label,
  value,
  subtitle,
  color = 'blue',
}: MetricCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`rounded-lg p-6 shadow-sm border border-gray-200 ${colors[color]}`}>
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colors[color].split(' ')[1]}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}