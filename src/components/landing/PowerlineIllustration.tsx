import { AirVent, Fan, Lightbulb, Refrigerator, Tv } from "lucide-react";

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

const FLOATING_ITEMS = [
  { Icon: Refrigerator, top: "8%", left: "4%", delay: 0 },
  { Icon: Fan, top: "62%", left: "2%", delay: 1.1 },
  { Icon: Tv, top: "78%", left: "80%", delay: 0.5 },
  { Icon: Lightbulb, top: "4%", left: "82%", delay: 1.6 },
  { Icon: AirVent, top: "38%", left: "88%", delay: 2.1 },
];

export function PowerlineIllustration() {
  return (
    <div className="relative h-72 w-full sm:h-80">
      <svg viewBox="0 0 400 300" className="h-full w-full text-foreground/55" aria-hidden="true">
        {/* sky birds on wires */}
        <path
          d="M-10,95 Q100,150 210,105 T420,90"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.6}
        />
        <path
          d="M-10,110 Q100,165 210,120 T420,105"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.6}
        />
        <path
          d="M-10,125 Q100,178 210,133 T420,118"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.6}
        />

        {/* utility pole */}
        <rect x={205} y={70} width={7} height={210} fill="currentColor" opacity={0.55} />
        <rect x={168} y={78} width={80} height={6} fill="currentColor" opacity={0.55} />
        <circle cx={175} cy={81} r={3} fill="currentColor" opacity={0.5} />
        <circle cx={241} cy={81} r={3} fill="currentColor" opacity={0.5} />

        {/* transformer can */}
        <rect x={214} y={92} width={26} height={36} rx={6} fill="currentColor" opacity={0.35} />
        <circle cx={221} cy={92} r={2.5} fill="currentColor" opacity={0.45} />
        <circle cx={233} cy={92} r={2.5} fill="currentColor" opacity={0.45} />

        {/* nostalgic bungalow silhouette */}
        <g opacity={0.25}>
          <rect x={40} y={230} width={110} height={60} fill="currentColor" />
          <polygon points="30,230 200,230 115,185" fill="currentColor" />
          <rect x={80} y={255} width={22} height={35} fill="var(--background)" />
        </g>

        {/* ground */}
        <line x1={0} y1={290} x2={400} y2={290} stroke="currentColor" opacity={0.2} />

        {/* birds perched + flying */}
        <g className="text-foreground/80">
          <Bird x={178} y={72} scale={1.4} delay={0} />
          <Bird x={250} y={76} scale={1.2} delay={0.4} />
          <Bird x={55} y={45} scale={1.8} delay={0.2} drift />
          <Bird x={290} y={30} scale={1.5} delay={0.9} drift />
          <Bird x={340} y={70} scale={1.3} delay={1.4} drift />
        </g>
      </svg>

      {FLOATING_ITEMS.map(({ Icon, top, left, delay }, i) => (
        <span
          key={i}
          className="animate-item-float absolute flex h-11 w-11 items-center justify-center rounded-full border border-card-border bg-card-bg shadow-sm"
          style={{ top, left, animationDelay: `${delay}s` }}
        >
          <Icon className="h-5 w-5 text-brand" />
        </span>
      ))}
    </div>
  );
}
