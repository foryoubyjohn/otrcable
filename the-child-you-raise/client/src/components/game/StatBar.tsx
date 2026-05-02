/*
 * Design: Storybook Realism — Stat Bar
 * Warm toned progress bars with auto-coloring
 */
interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
}

export default function StatBar({ label, value, max = 100, color = 'bg-primary', showValue = true }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getColor = () => {
    if (color !== 'auto') return color;
    if (percentage >= 70) return 'bg-[#7a9e7e]';
    if (percentage >= 40) return 'bg-[#d4a853]';
    return 'bg-[#c75c5c]';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-body font-semibold text-[#5a4a3a]">{label}</span>
        {showValue && (
          <span className="text-xs font-mono text-[#8a7a6a]">{Math.round(value)}</span>
        )}
      </div>
      <div className="h-2 bg-[#f0e8dc] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
