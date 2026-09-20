export interface NavItem {
  href: string;
  label: string;
}

export const nav: Record<"de" | "en", NavItem[]> = {
  de: [
    { href: "/de/", label: "Startseite" },
    { href: "/de/touren/", label: "Touren" },
    { href: "/de/anmeldung/", label: "Anmeldung" },
    { href: "/de/galerie/", label: "Galerie" },
    // Stranica /reisefuhrer sadrži tim vodiča (odluka vlasnika), pa je label "Team" — isto kao u footeru.
    { href: "/de/reisefuhrer/", label: "Team" },
    { href: "/de/blog/", label: "Blog" },
    { href: "/de/gastebuch/", label: "Gästebuch" },
    { href: "/de/kontakt/", label: "Kontakt" },
    { href: "/de/termine/", label: "Termine" },
  ],
  en: [
    { href: "/en/", label: "Home" },
    { href: "/en/tours/", label: "Tours" },
    { href: "/en/booking/", label: "Booking" },
    { href: "/en/gallery/", label: "Gallery" },
    { href: "/en/guide/", label: "Team" },
    { href: "/en/blog/", label: "Blog" },
    // TODO: CLAUDE.md ne navodi eksplicitan EN URL za Gästebuch — pretpostavka, potvrditi.
    { href: "/en/guestbook/", label: "Guestbook" },
    { href: "/en/contact/", label: "Contact" },
    { href: "/en/dates/", label: "Dates" },
  ],
};
