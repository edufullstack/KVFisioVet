export function ageFromBirthDate(date: Date | null, now = new Date()) {
  if (!date) return "Sin fecha";
  let years = now.getFullYear() - date.getFullYear();
  if (now < new Date(now.getFullYear(), date.getMonth(), date.getDate())) years--;
  return years < 1 ? "Menos de 1 año" : `${years} ${years === 1 ? "año" : "años"}`;
}
