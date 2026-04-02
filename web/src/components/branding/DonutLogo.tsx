type DonutLogoProps = {
  size?: number;
  className?: string;
};

export function DonutLogo({ size = 30, className }: DonutLogoProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="partyDonutBase" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffe7f0" />
          <stop offset="42%" stopColor="var(--accent-pink)" />
          <stop offset="100%" stopColor="#df6f98" />
        </radialGradient>
        <radialGradient id="partyDonutHole" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#fffdf5" stopOpacity="1" />
          <stop offset="100%" stopColor="#efe6db" stopOpacity="1" />
        </radialGradient>
        <filter id="partyDonutShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="3.2" floodColor="#553629" floodOpacity="0.26" />
          <feDropShadow dx="-2" dy="2" stdDeviation="1.2" floodColor="#ffffff" floodOpacity="0.28" />
        </filter>
      </defs>

      <g filter="url(#partyDonutShadow)">
        <circle cx="32" cy="32" r="22" fill="url(#partyDonutBase)" />
        <circle cx="32" cy="32" r="10" fill="url(#partyDonutHole)" />
      </g>
      <path
        d="M13 28.5C15.5 18.8 24 12 34 12c7.5 0 14.4 3.8 18.5 10.1-2.7 2.5-6.2 4-10.1 4-4.1 0-6.6-1.8-10-1.8-4.6 0-6.3 3.2-10.9 3.2-3.3 0-6.2-0.8-8.5-2.7Z"
        fill="#FFD7E6"
        opacity="0.88"
      />
      <circle cx="19" cy="22" r="2.4" fill="#FFF3A6" />
      <circle cx="46" cy="21" r="2.2" fill="#8FD6FF" />
      <circle cx="23" cy="43" r="2.2" fill="#FFF3A6" />
      <circle cx="44" cy="42" r="2.4" fill="#FF8C7E" />
      <circle cx="32" cy="46" r="1.8" fill="#8FD6FF" />
    </svg>
  );
}
