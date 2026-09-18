// URL backenda koji se koristi SAMO u .astro frontmatteru (server-side), tj. tokom
// `astro build` kad se stranice prerenderuju i povlače podatke iz API-ja.
//
// Namjerno NIJE PUBLIC_ varijabla: PUBLIC_ varijable Vite ugrađuje i u klijentski
// bundle, a ovdje nam treba INTERNA adresa backenda (npr. ime Docker servisa),
// koja iz browsera uopšte nije dostupna. Browser koristi PUBLIC_API_URL preko
// lib/apiClient.ts — to su dvije različite adrese istog backenda.
export const SERVER_API_URL = import.meta.env.API_INTERNAL_URL || "http://localhost:3001";
