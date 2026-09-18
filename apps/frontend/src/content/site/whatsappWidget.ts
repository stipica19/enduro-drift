export interface WhatsappWidgetContent {
  ariaLabel: string;
  message: string;
}

export const whatsappWidget: Record<"de" | "en", WhatsappWidgetContent> = {
  de: {
    ariaLabel: "Über WhatsApp kontaktieren",
    message: "Hallo! Ich habe eine Frage zu einer Enduro-Tour.",
  },
  en: {
    ariaLabel: "Contact us on WhatsApp",
    message: "Hi! I have a question about an enduro tour.",
  },
};
