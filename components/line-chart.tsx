import { chartPoints } from "@/lib/chart";

export function LineChart({ title, values, fixedRange }: { title: string; values: { label: string; value: number }[]; fixedRange?: [number, number] }) {
  if (!values.length) return null;
  const numbers = values.map(({ value }) => value);
  const min = fixedRange?.[0] ?? Math.min(...numbers);
  const max = fixedRange?.[1] ?? Math.max(...numbers);
  const displayMin = min === max ? min - 1 : min;
  const displayMax = min === max ? max + 1 : max;
  const points = chartPoints(numbers, displayMin, displayMax);
  return <figure className="chart card"><figcaption><strong>{title}</strong><small>{values.length} medición(es)</small></figcaption><svg viewBox="0 0 600 180" role="img" aria-label={`Evolución de ${title}`} preserveAspectRatio="none">
    <line x1="24" y1="24" x2="24" y2="156" /><line x1="24" y1="156" x2="576" y2="156" />
    <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
    {points.map(({ x, y }, index) => <g key={`${values[index].label}-${index}`}><circle cx={x} cy={y} r="5" /><title>{values[index].label}: {values[index].value}</title></g>)}
  </svg><div className="chart-legend"><span>{values[0].label}</span><span>{values.at(-1)?.label}</span></div></figure>;
}
