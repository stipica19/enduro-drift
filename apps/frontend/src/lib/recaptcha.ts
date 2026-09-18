declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

const SITE_KEY = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY || "";

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA script konnte nicht geladen werden."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

// Gibt ein reCAPTCHA v3 Token zurück, oder undefined wenn kein Site-Key konfiguriert ist
// (z. B. lokale Entwicklung ohne Google-Keys) — das Backend behandelt fehlende Tokens
// in diesem Fall als "übersprungen", nicht als Fehler.
export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  if (!SITE_KEY) return undefined;

  await loadScript();

  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window
        .grecaptcha!.execute(SITE_KEY, { action })
        .then(resolve)
        .catch(() => resolve(undefined));
    });
  });
}
