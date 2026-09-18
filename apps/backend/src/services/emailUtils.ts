export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

// "Ime <adresa>" za From header. Ime dolazi i od korisnika, pa se čisti od znakova
// koji bi pokvarili format; ako je adresa već u "Ime <adresa>" obliku, ostaje netaknuta.
export function fromWithName(displayName: string, from: string) {
  if (from.includes("<")) return from;

  const safeName = singleLine(displayName).replace(/["<>\\]/g, "").slice(0, 60).trim();
  return safeName ? `${safeName} <${from}>` : from;
}
