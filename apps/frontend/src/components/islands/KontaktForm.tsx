import { useState } from "react";
import { apiFetch } from "../../lib/apiClient";
import { getRecaptchaToken } from "../../lib/recaptcha";
import { kontaktForm } from "../../content/site/kontaktForm";

interface FormState {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

interface Props {
  lang?: "de" | "en";
}

const initialState: FormState = { name: "", email: "", message: "", honeypot: "" };

export default function KontaktForm({ lang = "de" }: Props) {
  const t = kontaktForm[lang];
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot: botovi popune skriveno polje, ljudi ga ne vide — ako je popunjeno, tiho odustani
    if (form.honeypot) return;

    setStatus("loading");

    const recaptchaToken = await getRecaptchaToken("contact");

    const res = await apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
        honeypot: form.honeypot,
        lang,
        recaptchaToken,
      }),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="honeypot"
        value={form.honeypot}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <input
        type="text"
        name="name"
        placeholder={t.namePlaceholder}
        value={form.name}
        onChange={handleChange}
        required
        className="rounded-lg border border-neutral-300 p-3 text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-red-500"
      />

      <input
        type="email"
        name="email"
        placeholder={t.emailPlaceholder}
        value={form.email}
        onChange={handleChange}
        required
        className="rounded-lg border border-neutral-300 p-3 text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-red-500"
      />

      <textarea
        name="message"
        placeholder={t.messagePlaceholder}
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        className="rounded-lg border border-neutral-300 p-3 text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-red-500"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-red-600 py-3 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-red-500 disabled:opacity-60"
      >
        {status === "loading" ? t.submitting : t.submit}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-600">{t.success}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{t.error}</p>
      )}
    </form>
  );
}
