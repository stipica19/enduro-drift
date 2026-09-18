export interface NavItem {
  href: string;
  label: string;
}

export const nav: Record<"de" | "en", NavItem[]> = {
  de: [
    { href: "/de", label: "Startseite" },
    { href: "/de/anmeldung", label: "Anmeldung" },
    { href: "/de/galerie", label: "Galerie" },
    { href: "/de/reisefuhrer", label: "Reiseführer" },
    { href: "/de/blog", label: "Blog" },
    { href: "/de/gastebuch", label: "Gästebuch" },
    { href: "/de/kontakt", label: "Kontakt" },
    { href: "/de/termine", label: "Termine" },
  ],
  en: [
    { href: "/en", label: "Home" },
    { href: "/en/booking", label: "Booking" },
    { href: "/en/gallery", label: "Gallery" },
    { href: "/en/guide", label: "Guide" },
    { href: "/en/blog", label: "Blog" },
    // TODO: CLAUDE.md ne navodi eksplicitan EN URL za Gästebuch — pretpostavka, potvrditi.
    { href: "/en/guestbook", label: "Guestbook" },
    { href: "/en/contact", label: "Contact" },
    { href: "/en/dates", label: "Dates" },
  ],
};
