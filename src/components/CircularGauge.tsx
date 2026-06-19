import { useEffect, useState, useRef } from 'react';

interface CircularGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  suffix?: string;
  color?: string;
  semiCircle?: boolean;
}

export default function CircularGauge({
  value,
  size = 128,
  strokeWidth = 10,
  label,
  suffix = '',
  color,
  semiCircle = false,
}: CircularGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  const resolvedColor =
    color ||
    (value >= 80 ? '#34d399' : value >= 50 ? '#ff6b8a' : '#f87171');

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = semiCircle ? circumference * 0.5 : circumference;
  const strokeDashoffset = arcLength - (animatedValue / 100) * arcLength;
  const rotation = semiCircle ? 180 : -90;

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const from = 0;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (value - from) * eased;
      setAnimatedValue(Math.round(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: semiCircle ? size * 0.6 : size }}>
        <svg
          viewBox={`0 0 ${size} ${semiCircle ? size * 0.6 : size}`}
          width={size}
          height={semiCircle ? size * 0.6 : size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2a2348"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={0}
            strokeLinecap={semiCircle ? 'round' : 'round'}
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={resolvedColor}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ marginTop: semiCircle ? '-10px' : 0 }}
        >
          <span className="text-2xl font-bold" style={{ color: resolvedColor }}>
            {animatedValue}
            {suffix}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-violet-text-secondary">
          {label}
        </span>
      )}
    </div>
  );
}
