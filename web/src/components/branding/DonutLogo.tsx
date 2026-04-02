import { useId } from 'react';

type DonutLogoProps = {
  size?: number;
  className?: string;
};

const icingStrands = [
  'M16 17.8C15.7 22 15.5 27 16 31.8C16.4 36.5 16.2 40.8 15.2 45.1',
  'M23.1 15.2C22.3 19.8 22.2 25 22.8 29.8C23.4 35.4 23.1 40.4 21.9 45.3',
  'M30.8 14.4C29.8 19.1 29.4 24.4 29.7 29.4C30 34.9 29.4 40.2 27.5 45.6',
  'M38.8 14.6C37.5 19.4 37.2 24.8 37.8 30.1C38.3 35.4 37.8 40.5 35.9 45.4',
  'M46.6 16.4C45.7 20.8 45.8 25.9 46.5 30.6C47.1 35.3 47 40 46.2 44.3',
] as const;

const sprinklePalette = ['#7ed5ff', '#ffb24d', '#b193ff', '#ffd75c', '#ff9f70', '#92d7cd'] as const;

const sprinkles = [
  { x: 16.6, y: 20.2, rotation: -32, color: sprinklePalette[2] },
  { x: 18.9, y: 26.4, rotation: 54, color: sprinklePalette[4] },
  { x: 22.8, y: 17.9, rotation: 22, color: sprinklePalette[3] },
  { x: 24.4, y: 30.6, rotation: -26, color: sprinklePalette[0] },
  { x: 29.1, y: 18.6, rotation: -48, color: sprinklePalette[0] },
  { x: 31.8, y: 32.5, rotation: 34, color: sprinklePalette[5] },
  { x: 35.2, y: 19.7, rotation: 17, color: sprinklePalette[4] },
  { x: 38.8, y: 28.2, rotation: -20, color: sprinklePalette[2] },
  { x: 41.6, y: 18.1, rotation: 38, color: sprinklePalette[0] },
  { x: 44.7, y: 24.6, rotation: -42, color: sprinklePalette[1] },
  { x: 47.2, y: 31.1, rotation: 14, color: sprinklePalette[3] },
  { x: 27.6, y: 24.9, rotation: -18, color: sprinklePalette[1] },
] as const;

export function DonutLogo({ size = 30, className }: DonutLogoProps) {
  const id = useId().replace(/:/g, '');
  const doughTopGradientId = `${id}-dough-top`;
  const doughSideGradientId = `${id}-dough-side`;
  const icingTopGradientId = `${id}-icing-top`;
  const icingFrontGradientId = `${id}-icing-front`;
  const holeGradientId = `${id}-hole-depth`;
  const drizzleGradientId = `${id}-drizzle`;
  const highlightGradientId = `${id}-highlight`;
  const shadowFilterId = `${id}-shadow`;
  const topRingMaskId = `${id}-top-mask`;
  const sideRingMaskId = `${id}-side-mask`;
  const icingMaskId = `${id}-icing-mask`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      data-testid="donut-logo"
      fill="none"
      height={size}
      viewBox="0 0 64 64"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={doughTopGradientId} x1="15" y1="14" x2="46" y2="39" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffe8bf" />
          <stop offset="50%" stopColor="#f8c57d" />
          <stop offset="100%" stopColor="#e69a4f" />
        </linearGradient>
        <linearGradient id={doughSideGradientId} x1="18" y1="27" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f6bf77" />
          <stop offset="55%" stopColor="#df8e46" />
          <stop offset="100%" stopColor="#b56631" />
        </linearGradient>
        <radialGradient
          id={icingTopGradientId}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(27 18.4) rotate(25) scale(25.5 18.2)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffd6e7" />
          <stop offset="42%" stopColor="#ff88b7" />
          <stop offset="100%" stopColor="#f2508e" />
        </radialGradient>
        <linearGradient id={icingFrontGradientId} x1="17" y1="25" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff95bf" />
          <stop offset="54%" stopColor="#ff5f9d" />
          <stop offset="100%" stopColor="#e3447d" />
        </linearGradient>
        <linearGradient id={holeGradientId} x1="27" y1="23" x2="38" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffc97d" />
          <stop offset="36%" stopColor="#dc8b44" />
          <stop offset="100%" stopColor="#82451f" />
        </linearGradient>
        <radialGradient
          id={highlightGradientId}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(24.4 18.8) rotate(16) scale(18 8.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fffdf8" stopOpacity="0.92" />
          <stop offset="48%" stopColor="#fff6fb" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#fff6fb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={drizzleGradientId} x1="18" y1="13" x2="45" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="100%" stopColor="#eddccf" />
        </linearGradient>
        <filter id={shadowFilterId} x="-22%" y="-18%" width="144%" height="164%">
          <feDropShadow dx="0" dy="6.5" stdDeviation="3.8" floodColor="#7b4b2b" floodOpacity="0.22" />
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#fff7f1" floodOpacity="0.4" />
        </filter>
        <mask id={sideRingMaskId} maskUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="black" />
          <ellipse cx="32" cy="34.5" rx="20.8" ry="13.2" fill="white" />
          <ellipse cx="32" cy="34.1" rx="7.4" ry="5.1" fill="black" />
        </mask>
        <mask id={topRingMaskId} maskUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="black" />
          <ellipse cx="32" cy="24.9" rx="20.5" ry="13" fill="white" />
          <ellipse cx="32" cy="25.5" rx="7" ry="4.8" fill="black" />
        </mask>
        <mask id={icingMaskId} maskUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="black" />
          <ellipse cx="32" cy="24.7" rx="19.5" ry="12.2" fill="white" />
          <ellipse cx="32" cy="25.4" rx="6.6" ry="4.4" fill="black" />
        </mask>
      </defs>

      <ellipse cx="32" cy="54" rx="15.9" ry="4.1" fill="#8b5730" opacity="0.18" />

      <g filter={`url(#${shadowFilterId})`}>
        <g data-layer="donut-body">
          <g mask={`url(#${sideRingMaskId})`}>
            <ellipse cx="32" cy="34.5" rx="20.8" ry="13.2" fill={`url(#${doughSideGradientId})`} />
            <ellipse cx="32" cy="40.5" rx="17.4" ry="6.3" fill="#b96f35" opacity="0.24" />
          </g>

          <g mask={`url(#${topRingMaskId})`}>
            <ellipse cx="32" cy="24.9" rx="20.5" ry="13" fill={`url(#${doughTopGradientId})`} />
            <ellipse cx="24.4" cy="18.8" rx="13" ry="5.9" fill="#fff4d9" opacity="0.32" />
          </g>
        </g>

        <g data-layer="donut-hole">
          <ellipse cx="32" cy="27" rx="7.2" ry="5.3" fill={`url(#${holeGradientId})`} />
          <ellipse cx="31.6" cy="25.7" rx="5.1" ry="3.3" fill="#ffdcaf" opacity="0.24" />
        </g>

        <g data-layer="donut-icing">
          <g mask={`url(#${icingMaskId})`}>
            <ellipse cx="32" cy="24.5" rx="19.5" ry="12.2" fill={`url(#${icingTopGradientId})`} />
            <ellipse cx="24.5" cy="18.7" rx="17" ry="7.7" fill={`url(#${highlightGradientId})`} />
          </g>

          <path
            d="M12.6 24.4C14.2 33.3 21.4 39.5 31.9 39.5C42.5 39.5 49.7 33.2 51.3 24.4C48.8 25.2 47.6 27.7 46.6 30.2C45.6 32.8 44.7 34.9 42.9 34.9C41.1 34.9 40.4 32.5 39.7 29.9C38.9 27 37.9 24.1 35.9 24.1C33.9 24.1 32.8 26.6 31.8 29.5C30.8 32.4 29.9 35.1 28 35.1C26.1 35.1 25.2 32.6 24.2 29.8C23.2 26.9 22.1 24.4 20.2 24.4C18.2 24.4 17.2 27 16.2 29.7C15.3 32.2 14.3 34.5 12.6 24.4Z"
            fill={`url(#${icingFrontGradientId})`}
          />
          <path
            d="M17.2 39.8C20.7 43.3 25.7 45.3 31.8 45.3C38.1 45.3 43.1 43.1 46.4 39.4C45 43 42.2 45.5 38.8 47C31.8 50 23.5 48.9 18.4 44.4C17.8 43.8 17.3 42.5 17.2 39.8Z"
            fill="#ca3f74"
            opacity="0.22"
          />
        </g>

        <g mask={`url(#${icingMaskId})`}>
          {icingStrands.map((path) => (
            <path
              key={path}
              d={path}
              data-layer="icing-strand"
              fill="none"
              opacity="0.98"
              stroke={`url(#${drizzleGradientId})`}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          ))}

          {sprinkles.map((sprinkle, index) => (
            <g
              key={`${sprinkle.x}-${sprinkle.y}-${sprinkle.rotation}`}
              transform={`rotate(${sprinkle.rotation} ${sprinkle.x + 2.05} ${sprinkle.y + 0.8})`}
            >
              <rect
                data-layer="sprinkle"
                fill={sprinkle.color}
                height="1.65"
                rx="0.82"
                width="4.1"
                x={sprinkle.x}
                y={sprinkle.y}
              />
              <rect
                fill="#fffef8"
                height="0.44"
                opacity={index % 2 === 0 ? '0.72' : '0.5'}
                rx="0.22"
                width="2.3"
                x={sprinkle.x + 0.45}
                y={sprinkle.y + 0.18}
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
