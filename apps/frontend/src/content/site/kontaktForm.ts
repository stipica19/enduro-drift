export interface KontaktFormContent {
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  /** Kad reCAPTCHA ne prođe ili je skripta blokirana — bez alternative bi upit bio izgubljen. */
  recaptchaError: string;
}

export const kontaktForm: Record<"de" | "en", KontaktFormContent> = {
  de: {
    namePlaceholder: "Ihr Name",
    emailPlaceholder: "Ihre E-Mail",
    messagePlaceholder: "Ihre Nachricht",
    submit: "Nachricht senden",
    submitting: "Wird gesendet…",
    success: "Die Nachricht wurde erfolgreich gesendet!",
    error: "Fehler beim Senden. Bitte versuchen Sie es erneut.",
    recaptchaError:
      "Die Sicherheitsprüfung konnte nicht geladen werden - oft blockiert ein Ad-Blocker reCAPTCHA. Bitte deaktivieren Sie ihn kurz und versuchen Sie es erneut, oder schreiben Sie uns direkt an endurodriftbosnien@gmail.com.",
  },
  en: {
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "Your message",
    submit: "Send message",
    submitting: "Sending…",
    success: "Your message was sent successfully!",
    error: "Something went wrong. Please try again.",
    recaptchaError:
      "The security check could not be loaded - an ad blocker often blocks reCAPTCHA. Please disable it briefly and try again, or email us directly at endurodriftbosnien@gmail.com.",
  },
};
