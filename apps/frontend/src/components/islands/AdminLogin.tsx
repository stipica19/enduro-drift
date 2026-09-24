import { useState } from "react";
import { apiFetch } from "../../lib/apiClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let res: Response;
    try {
      res = await apiFetch("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch {
      setLoading(false);
      setError("Server nije dostupan. Provjeri vezu i pokušaj ponovo.");
      return;
    }

    setLoading(false);

    if (res.status === 401) {
      setError("Pogrešan email ili lozinka.");
      return;
    }

    // Backend dozvoljava 10 pokušaja u 15 minuta po IP-u (zaštita od pogađanja lozinke)
    if (res.status === 429) {
      setError("Previše pokušaja prijave. Pričekaj 15 minuta pa pokušaj ponovo.");
      return;
    }

    // Sve osim 401 nije problem s lozinkom (npr. 500 kad backendu fali SESSION_SECRET)
    if (!res.ok) {
      setError(`Greška na serveru (HTTP ${res.status}). Provjeri logove backenda.`);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Lozinka
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Prijava..." : "Prijavi se"}
      </button>
    </form>
  );
}
