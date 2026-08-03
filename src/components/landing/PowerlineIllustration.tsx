function Bird({
  x,
  y,
  scale = 1,
  delay = 0,
  drift = false,
}: {
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  drift?: boolean;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className={`animate-bird-flap${drift ? " animate-bird-drift" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <path
        d="M0,5 Q5,-3 10,5 Q15,-3 20,5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </g>
  );
}

function Refrigerator({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 0)`} className="text-foreground/60">
      <rect x={0} y={0} width={48} height={95} rx={4} fill="currentColor" opacity={0.5} />
      <rect x={4} y={4} width={40} height={30} rx={2} fill="var(--background-warm)" opacity={0.8} />
      <rect x={4} y={38} width={40} height={53} rx={2} fill="var(--background-warm)" opacity={0.8} />
      <rect x={40} y={8} width={3} height={16} rx={1.5} fill="currentColor" />
      <rect x={40} y={44} width={3} height={16} rx={1.5} fill="currentColor" />
    </g>
  );
}

function StandingFan({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 0)`} className="text-foreground/60">
      <rect x={18} y={60} width={6} height={35} fill="currentColor" opacity={0.5} />
      <rect x={4} y={93} width={34} height={5} rx={2.5} fill="currentColor" opacity={0.5} />
      <circle cx={21} cy={38} r={26} fill="none" stroke="currentColor" strokeWidth={2.5} opacity={0.55} />
      <g className="animate-bird-flap" style={{ transformOrigin: "21px 38px", animationDuration: "0.5s" }}>
        <path d="M21,38 L21,16 M21,38 L40,50 M21,38 L2,50" stroke="currentColor" strokeWidth={2.5} opacity={0.55} />
      </g>
      <circle cx={21} cy={38} r={3.5} fill="currentColor" opacity={0.7} />
    </g>
  );
}

function AirConditioner({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 0)`} className="text-foreground/60">
      <rect x={0} y={0} width={72} height={26} rx={5} fill="currentColor" opacity={0.5} />
      <rect x={6} y={8} width={60} height={3} rx={1.5} fill="var(--background-warm)" opacity={0.9} />
      <rect x={6} y={14} width={60} height={3} rx={1.5} fill="var(--background-warm)" opacity={0.9} />
      <rect x={6} y={20} width={40} height={3} rx={1.5} fill="var(--background-warm)" opacity={0.9} />
    </g>
  );
}

function Television({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 0)`} className="text-foreground/60">
      <rect x={0} y={0} width={60} height={40} rx={3} fill="currentColor" opacity={0.5} />
      <rect x={4} y={4} width={52} height={32} rx={2} fill="var(--background-warm)" opacity={0.85} />
      <path d="M14,32 L20,20 L28,28 L38,12 L46,32" stroke="currentColor" strokeWidth={2} fill="none" opacity={0.5} />
      <rect x={25} y={40} width={10} height={8} fill="currentColor" opacity={0.5} />
      <rect x={12} y={48} width={36} height={3} rx={1.5} fill="currentColor" opacity={0.5} />
    </g>
  );
}

function Generator({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 0)`} className="text-foreground/60">
      <rect x={0} y={10} width={70} height={40} rx={6} fill="currentColor" opacity={0.5} />
      <rect x={8} y={18} width={20} height={14} rx={2} fill="var(--background-warm)" opacity={0.85} />
      <circle cx={12} cy={52} r={7} fill="currentColor" opacity={0.6} />
      <circle cx={58} cy={52} r={7} fill="currentColor" opacity={0.6} />
      <rect x={58} y={2} width={5} height={12} rx={2} fill="currentColor" opacity={0.55} />
    </g>
  );
}

function Bulb({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g className="animate-bolt-flicker text-yellow-500">
        <circle cx={0} cy={0} r={13} fill="currentColor" opacity={0.9} />
        <rect x={-4} y={11} width={8} height={7} rx={1.5} fill="currentColor" opacity={0.7} />
      </g>
      <path
        d="M-3,-16 L3,-16 L-1,-6 L4,-6 L-5,8 L-1,-3 L-6,-3 Z"
        fill="var(--brand-dark)"
        className="animate-spark-pop"
        style={{ animationDelay: "0.3s" }}
        transform="translate(18,-8) scale(0.7)"
      />
    </g>
  );
}

function Tree({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 0)`} className="text-brand/40">
      <rect x={14} y={40} width={6} height={30} fill="currentColor" opacity={0.6} />
      <circle cx={17} cy={30} r={20} fill="currentColor" />
      <circle cx={4} cy={40} r={14} fill="currentColor" opacity={0.85} />
      <circle cx={30} cy={40} r={14} fill="currentColor" opacity={0.85} />
    </g>
  );
}

export function PowerlineIllustration() {
  return (
    <div className="relative h-64 w-full sm:h-80 lg:h-96">
      <svg viewBox="0 0 1200 340" className="h-full w-full" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        {/* sky wires */}
        <g className="text-foreground/35">
          <path d="M-20,95 Q300,155 600,110 T1220,95" fill="none" stroke="currentColor" strokeWidth={1.4} />
          <path d="M-20,112 Q300,172 600,127 T1220,112" fill="none" stroke="currentColor" strokeWidth={1.4} />
          <path d="M-20,129 Q300,186 600,142 T1220,129" fill="none" stroke="currentColor" strokeWidth={1.4} />
        </g>

        {/* utility pole (center) */}
        <g className="text-foreground/55">
          <rect x={597} y={70} width={8} height={225} fill="currentColor" />
          <rect x={555} y={80} width={95} height={7} fill="currentColor" />
          <circle cx={563} cy={83.5} r={3.5} fill="currentColor" />
          <circle cx={639} cy={83.5} r={3.5} fill="currentColor" />
          <rect x={608} y={96} width={30} height={40} rx={7} fill="currentColor" opacity={0.7} />
        </g>

        {/* house behind the pole */}
        <g className="text-foreground/30" opacity={0.9}>
          <rect x={430} y={210} width={160} height={85} />
          <polygon points="415,210 605,210 510,150" />
          <rect x={480} y={240} width={30} height={55} fill="var(--background-warm)" />
        </g>

        {/* birds */}
        <g className="text-foreground/70">
          <Bird x={520} y={55} scale={1.5} delay={0} drift />
          <Bird x={575} y={70} scale={1.1} delay={0.4} />
          <Bird x={660} y={62} scale={1.2} delay={0.9} drift />
          <Bird x={200} y={40} scale={1.6} delay={0.2} drift />
          <Bird x={950} y={35} scale={1.4} delay={1.1} drift />
        </g>

        {/* ground line */}
        <line x1={0} y1={295} x2={1200} y2={295} stroke="currentColor" className="text-foreground/20" />

        {/* foreground appliances, arranged along the ground */}
        <g transform="translate(60,200)">
          <Tree x={0} />
        </g>
        <g transform="translate(160,200)">
          <Refrigerator x={0} />
        </g>
        <g transform="translate(260,205)">
          <StandingFan x={0} />
        </g>
        <Bulb x={600} y={70} />
        <g transform="translate(720,255)">
          <AirConditioner x={0} />
        </g>
        <g transform="translate(830,245)">
          <Television x={0} />
        </g>
        <g transform="translate(960,235)">
          <Generator x={0} />
        </g>
        <g transform="translate(1090,200)">
          <Tree x={0} />
        </g>
      </svg>
    </div>
  );
}
