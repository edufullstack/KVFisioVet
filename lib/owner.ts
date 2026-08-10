export function ownerData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!name || (!phone && !email) || (email && !email.includes("@"))) return null;
  return { name, phone, email };
}
