import * as React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({ value, onValueChange, min = 0, max = 5, step = 1, className = '', ...props }: SliderProps) {
  const current = Array.isArray(value) && value.length > 0 ? value[0] : 0;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      className={`w-full accent-blue-600 ${className}`.trim()}
      onChange={(event) => onValueChange?.([Number(event.target.value)])}
      {...props}
    />
  );
}
