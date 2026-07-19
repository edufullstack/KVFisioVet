export function chartPoints(values: number[], min: number, max: number, width = 600, height = 180, padding = 24) {
  const span = max - min || 1;
  const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
  return values.map((value, index) => ({ x: padding + step * index, y: height - padding - ((value - min) / span) * (height - padding * 2) }));
}
