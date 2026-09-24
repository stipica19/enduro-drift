declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

const SITE_KEY = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY || "";

/** Je li reCAPTCHA uopšte uključena u ovom buildu — forme po tome znaju traže li token. */
export const recaptchaConfigured = Boolean(SITE_KEY);

// Blokatori reklama često blokiraju Googleovu skriptu. Ponekad javno padne (onerror),
// a ponekad zahtjev samo visi — zato i vremensko ograničenje, da forma nikad ne ostane
// zaglavljena u stanju "šalje se…".
const TIMEOUT_MS = 8000;

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA-Skript konnte nicht geladen werden."));
    document.head.appendChild(script);
  }).catch((err) => {
    // Neuspjeli pokušaj se ne pamti, inače bi i svako sljedeće slanje odmah palo.
    scriptPromise = null;
    throw err;
  });

  return scriptPromise;
}

function withTimeout<T>(promise: Promise<T>): Promise<T | undefined> {
  return Promise.race([
    promise,
    new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), TIMEOUT_MS)),
  ]);
}

/**
 * reCAPTCHA v3 token, ili undefined ako token nije moguće dobiti (nema site keya, skripta je
 * blokirana ili predugo traje). Nikad ne baca grešku — pozivatelj sam odlučuje šta s praznim
 * tokenom (vidi `recaptchaConfigured`).
 */
export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  if (!SITE_KEY) return undefined;

  try {
    return await withTimeout(
      loadScript().then(
        () =>
          new Promise<string | undefined>((resolve) => {
            window.grecaptcha!.ready(() => {
              window
                .grecaptcha!.execute(SITE_KEY, { action })
                .then(resolve)
                .catch(() => resolve(undefined));
            });
          }),
      ),
    );
  } catch {
    return undefined;
  }
}
