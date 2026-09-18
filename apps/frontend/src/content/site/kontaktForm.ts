export interface KontaktFormContent {
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
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
  },
  en: {
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "Your message",
    submit: "Send message",
    submitting: "Sending…",
    success: "Your message was sent successfully!",
    error: "Something went wrong. Please try again.",
  },
};
