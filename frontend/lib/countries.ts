/** Common shipping countries for checkout (ISO-style labels). */
export const CHECKOUT_COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Ireland",
  "New Zealand",
  "Japan",
  "United Arab Emirates",
  "Singapore",
  "Other",
] as const;

export function zipRequiredForCountry(country: string): boolean {
  const c = country.trim().toLowerCase();
  return (
    c === "united states" ||
    c === "usa" ||
    c === "us" ||
    c === "canada"
  );
}
