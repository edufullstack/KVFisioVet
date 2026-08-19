export function ageParts(date: Date | null, now = new Date()) {
  if (!date) return null;
  let months = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
  if (now.getDate() < date.getDate()) months--;
  if (months < 0) months = 0;
  return { years: Math.floor(months / 12), months: months % 12 };
}

export function birthDateFromAge(years: number, months: number, now = new Date()) {
  const year = now.getFullYear() - years;
  const month = now.getMonth() - months;
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(now.getDate(), lastDay), 12);
}

export function ageFromBirthDate(date: Date | null, now = new Date()) {
  const age = ageParts(date, now);
  if (!age) return "Sin fecha";
  const parts = [];
  if (age.years) parts.push(`${age.years} ${age.years === 1 ? "año" : "años"}`);
  if (age.months) parts.push(`${age.months} ${age.months === 1 ? "mes" : "meses"}`);
  return parts.join(" y ") || "Menos de 1 mes";
}
