export interface GalleryContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  sections: { heading: string; text: string }[];
  empty: string;
  altPrefix: string;
  ctaText: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export const gallery: Record<"de" | "en", GalleryContent> = {
  de: {
    metaTitle: "Galerie: Enduro Touren in Bosnien | Enduro Drift Bosnien",
    metaDescription:
      "Fotos von unseren geführten Enduro-Touren in Bosnien: Trails, Berglandschaften und Motorräder rund um Gornji Vakuf-Uskoplje.",
    heading: "Galerie – Enduro in Bosnien in Bildern",
    intro:
      "Bilder sagen mehr als jede Tourbeschreibung. Hier siehst du, was dich auf unseren geführten Enduro-Touren rund um Gornji Vakuf-Uskoplje erwartet: Bergwiesen auf fast 2.000 m, einsame Schotterwege und technische Waldpassagen. Dazu kommen Mittagspausen an der Feuerstelle und Abende mit bosnischer Küche. Alle Fotos stammen von echten Touren mit unseren Gästen.",
    sections: [
      {
        heading: "Das Vranica-Gebirge",
        text: "Unsere Trails führen durch das Vranica-Gebirge in Zentralbosnien. Auf den grünen Höhenrücken fährst du stundenlang, ohne einem Auto zu begegnen. Einer der Höhepunkte ist die Auffahrt über den Wanderweg „Fenix“ Richtung Idovac (1.956 m) mit Blick über halb Bosnien.",
      },
      {
        heading: "Prokoško-See",
        // TODO: provjeriti visinu jezera (u tekstu 1.660 m; izvori navode i nešto manje vrijednosti).
        text: "Der Prokoško-See liegt auf rund 1.660 m und ist von traditionellen Holzhäusern umgeben. Er ist eines der schönsten Fotomotive der Tour und ein fester Stopp auf unserer Einsteiger-Route.",
      },
      {
        heading: "Unterwegs und am Abend",
        text: "Enduro ist bei uns mehr als Fahren. Mittagessen auf einer Berghütte, Grillen unter einem Felsüberhang und nach dem Tag zurück ins Motel Saraj. Dort warten Frühstück, saubere Zimmer und ein sicherer Platz für die Motorräder.",
      },
    ],
    empty: "Aktuell sind keine Bilder verfügbar.",
    // TODO: pojedinačni alt tekstovi (npr. "Enduro-Gruppe auf einer Bergwiese im Vranica-Gebirge") umjesto
    // numeriranog prefiksa — slike dolaze iz API-ja (samo url/publicId), pa treba dodati opis u bazu/Cloudinary.
    altPrefix: "Enduro-Tour Bosnien - Foto",
    ctaText: "Du willst selbst auf diesen Bildern sein?",
    ctaPrimary: { label: "Touren & Preise ansehen", href: "/de/touren/" },
    ctaSecondary: { label: "Tour anfragen", href: "/de/anmeldung/" },
  },
  en: {
    metaTitle: "Gallery: Enduro Tours in Bosnia | Enduro Drift Bosnien",
    metaDescription:
      "Photos from our guided enduro tours in Bosnia: trails, mountain landscapes and motorcycles around Gornji Vakuf-Uskoplje.",
    heading: "Gallery – Enduro in Bosnia in Pictures",
    intro:
      "Pictures say more than any tour description. Here you can see what awaits you on our guided enduro tours around Gornji Vakuf-Uskoplje: mountain meadows at almost 2,000 m, remote gravel tracks and technical forest sections. Add lunch breaks at the fireplace and evenings with Bosnian cuisine. All photos come from real tours with our guests.",
    sections: [
      {
        heading: "The Vranica mountains",
        text: "Our trails lead through the Vranica mountains in central Bosnia. On the green ridges you ride for hours without meeting a car. One of the highlights is the climb along the “Fenix” hiking trail towards Idovac (1,956 m) with a view over half of Bosnia.",
      },
      {
        heading: "Lake Prokoško",
        // TODO: check the lake's elevation (the text says 1,660 m; sources also give slightly lower values).
        text: "Lake Prokoško lies at around 1,660 m and is surrounded by traditional wooden houses. It is one of the most beautiful photo spots of the tour and a fixed stop on our beginner route.",
      },
      {
        heading: "On the road and in the evening",
        text: "Enduro is more than riding for us. Lunch at a mountain hut, barbecue under a rock overhang and back to Motel Saraj after the day. Breakfast, clean rooms and a safe place for the motorcycles are waiting there.",
      },
    ],
    empty: "No images are currently available.",
    // TODO: individual alt texts (e.g. "Enduro group on a mountain meadow in the Vranica range") instead of the
    // numbered prefix — images come from the API (url/publicId only), so descriptions must be added to the DB/Cloudinary.
    altPrefix: "Enduro tour Bosnia - photo",
    ctaText: "Want to be in these pictures yourself?",
    ctaPrimary: { label: "View tours & prices", href: "/en/tours/" },
    ctaSecondary: { label: "Request a tour", href: "/en/booking/" },
  },
};
