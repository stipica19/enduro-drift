import type { FaqItem } from "@/content/site/faq";
import type { TourId } from "@/content/site/tourPricing";

// Tekst detalj-stranica tura (/de/touren/<slug>/, /en/tours/<slug>/). Cijene, dani, noćenja i
// dan dolaska/odlaska NE pišu se ovdje nego kao {ownBikePrice}, {rentalBikePrice}, {ridingDays},
// {nights}, {arrival}, {departure} — popunjava ih getTour() iz kartice u tourPricing.ts.
// {name} je kratki naziv ture; {included}, {additionalCosts}, {excluded} su liste iz tourPricing.ts.
//
// Sve činjenice su preuzete s postojećih stranica (motorcycles.ts, equipmentPage.ts, location.ts,
// team.ts, dates.ts, booking.ts, tourRules.ts). Novi tekst ne smije uvesti nepotvrđene podatke.
// TODO: vlasnik da potvrdi tip terena po turi (Tour 1 i 2 = Medium Enduro, Tour 3 = Hard Enduro,
// kao u apps/backend/scripts/seedTours.ts).

export interface TourDetail {
  /** Kratki naziv: breadcrumb, linkovi među turama, TouristTrip name. */
  name: string;
  metaTitle: string;
  metaDescription: string;
  level: string;
  terrain: "medium" | "hard";
  heading: string;
  headingAccent: string;
  intro: string;
  audience: string[];
  routeText: string;
  bikesText: string;
  guidesText: string;
  /** Pitanja specifična za turu; zajednička (cijena, booking) dodaje getTour() iz labela. */
  faq: FaqItem[];
  /** Slugovi blog objava istog jezika. */
  relatedPosts: string[];
}

interface Link {
  label: string;
  href: string;
}

export interface TourDetailLabels {
  home: string;
  tours: string;
  facts: { ridingDays: string; nights: string; arrival: string; departure: string };
  priceHeading: string;
  ctaBook: string;
  datesLink: Link;
  depositNote: string;
  audienceHeading: string;
  routeHeading: string;
  scheduleHeading: string;
  schedule: { title: string; text: string }[];
  includedHeading: string;
  bikesHeading: string;
  bikesLink: Link;
  equipmentLink: Link;
  guidesHeading: string;
  guidesLink: Link;
  faqHeading: string;
  otherToursHeading: string;
  otherTourMeta: string;
  compareLink: Link;
  blogHeading: string;
  ctaHeading: string;
  ctaText: string;
  contactLink: Link;
  commonFaq: FaqItem[];
}

export const tourDetailLabels: Record<"de" | "en", TourDetailLabels> = {
  de: {
    home: "Startseite",
    tours: "Touren",
    facts: { ridingDays: "Fahrtage", nights: "Übernachtungen", arrival: "Anreise", departure: "Abreise" },
    priceHeading: "Preis der Tour",
    ctaBook: "Diese Tour anfragen",
    datesLink: { label: "Freie Termine ansehen", href: "/de/termine/" },
    depositNote: "100 € Anzahlung nach deiner Anfrage, den Rest zahlst du bei Ankunft in Bosnien.",
    audienceHeading: "Für wen ist diese Tour?",
    routeHeading: "Gelände & Strecke",
    scheduleHeading: "Ablauf der Tour",
    schedule: [
      {
        title: "{arrival}: Anreise",
        text: "Anreise nach Gornji Vakuf-Uskoplje im Herzen Bosniens, etwa 2,5 Stunden von Sarajevo. Den Transfer vom Flughafen Sarajevo organisieren wir auf Wunsch. Die erste Übernachtung ist die Nacht von Samstag auf Sonntag.",
      },
      {
        title: "Sonntag: erster Fahrtag",
        text: "Nach dem Frühstück liegen deine Schutzausrüstung und – falls gebucht – dein Leihmotorrad bereit. Dann geht es mit dem Guide auf die Trails.",
      },
      {
        title: "{ridingDays} Fahrtage",
        text: "Jeden Tag geführt unterwegs im Gelände rund um Gornji Vakuf-Uskoplje. Mittagessen kannst du dazubuchen.",
      },
      {
        title: "{departure}: Abreise",
        text: "Nach {nights} Übernachtungen mit Frühstück geht es nach Hause – mit Staub auf den Stiefeln und vielen Geschichten im Gepäck.",
      },
    ],
    includedHeading: "Leistungen & Preise",
    bikesHeading: "Motorrad & Ausrüstung",
    bikesLink: { label: "Alle Motorräder ansehen", href: "/de/motorraeder/" },
    equipmentLink: { label: "Ausrüstung im Detail", href: "/de/ausruestung/" },
    guidesHeading: "Deine Guides",
    guidesLink: { label: "Das Team kennenlernen", href: "/de/team/" },
    faqHeading: "Häufige Fragen zur",
    otherToursHeading: "Weitere Touren",
    otherTourMeta: "{ridingDays} Fahrtage · ab {ownBikePrice} €",
    compareLink: { label: "Alle Touren vergleichen", href: "/de/touren/" },
    blogHeading: "Passende Beiträge aus dem Blog",
    ctaHeading: "Bereit für die {name}?",
    ctaText:
      "Schick uns deine Anfrage mit Wunschtermin – wir melden uns persönlich bei dir und bestätigen deinen Platz.",
    contactLink: { label: "Frage stellen", href: "/de/kontakt/" },
    commonFaq: [
      {
        question: "Was kostet die {name} und was ist inklusive?",
        answer:
          "Mit eigenem Motorrad kostet die {name} {ownBikePrice} €, mit einem unserer Motorräder {rentalBikePrice} €. Inklusive: {included}. Die Schutzausrüstung bekommst du kostenlos. Zusätzliche Kosten: {additionalCosts}. Nicht inbegriffen: {excluded}.",
      },
      {
        question: "Wie buche ich die {name}?",
        answer:
          "Wähle im Anmeldeformular die Tour und deinen Wunschtermin und schick uns die Anfrage. Wir melden uns persönlich bei dir und senden dir eine Rechnung über 100 € Anzahlung (PayPal oder Banküberweisung). Nach Eingang der Anzahlung erhältst du die Buchungsbestätigung, den Rest zahlst du bei Ankunft in Bosnien und Herzegowina.",
      },
    ],
  },
  en: {
    home: "Home",
    tours: "Tours",
    facts: { ridingDays: "Riding days", nights: "Nights", arrival: "Arrival", departure: "Departure" },
    priceHeading: "Tour price",
    ctaBook: "Request this tour",
    datesLink: { label: "See available dates", href: "/en/dates/" },
    depositNote: "€100 deposit after your request, the rest is paid on arrival in Bosnia.",
    audienceHeading: "Who is this tour for?",
    routeHeading: "Terrain & route",
    scheduleHeading: "How the tour works",
    schedule: [
      {
        title: "{arrival}: arrival",
        text: "Travel to Gornji Vakuf-Uskoplje in the heart of Bosnia, about 2.5 hours from Sarajevo. We can arrange your transfer from Sarajevo airport on request. Your first night is Saturday to Sunday.",
      },
      {
        title: "Sunday: first riding day",
        text: "After breakfast your protective gear and – if booked – your rental motorcycle are ready for you. Then you head out onto the trails with your guide.",
      },
      {
        title: "{ridingDays} riding days",
        text: "Every day guided through the terrain around Gornji Vakuf-Uskoplje. Lunch can be added as an option.",
      },
      {
        title: "{departure}: departure",
        text: "After {nights} nights with breakfast it's time to head home – with dust on your boots and plenty of stories to tell.",
      },
    ],
    includedHeading: "What's included & prices",
    bikesHeading: "Motorcycle & gear",
    bikesLink: { label: "View all motorcycles", href: "/en/motorcycles/" },
    equipmentLink: { label: "Gear in detail", href: "/en/equipment/" },
    guidesHeading: "Your guides",
    guidesLink: { label: "Meet the team", href: "/en/team/" },
    faqHeading: "Questions about the",
    otherToursHeading: "More tours",
    otherTourMeta: "{ridingDays} riding days · from €{ownBikePrice}",
    compareLink: { label: "Compare all tours", href: "/en/tours/" },
    blogHeading: "Related blog posts",
    ctaHeading: "Ready for the {name}?",
    ctaText: "Send us your request with your preferred date – we'll get back to you personally and confirm your spot.",
    contactLink: { label: "Ask a question", href: "/en/contact/" },
    commonFaq: [
      {
        question: "How much does the {name} cost and what's included?",
        answer:
          "With your own motorcycle the {name} costs €{ownBikePrice}, with one of our motorcycles €{rentalBikePrice}. Included: {included}. Protective gear is provided free of charge. Additional costs: {additionalCosts}. Not included: {excluded}.",
      },
      {
        question: "How do I book the {name}?",
        answer:
          "Choose the tour and your preferred date in the booking form and send us your request. We'll get back to you personally and send you an invoice for the €100 deposit (PayPal or bank transfer). Once we receive the deposit you'll get your booking confirmation; the rest is paid on arrival in Bosnia and Herzegovina.",
      },
    ],
  },
};

export const tourDetails: Record<"de" | "en", Record<TourId, TourDetail>> = {
  de: {
    einsteiger: {
      name: "Einsteiger-Tour",
      metaTitle: "Enduro Tour für Einsteiger in Bosnien | Enduro Drift Bosnien",
      metaDescription:
        "Geführte Enduro-Tour für Einsteiger in Bosnien: {ridingDays} Fahrtage, {nights} Übernachtungen mit Frühstück, ab {ownBikePrice} €. Leihmotorrad und Ausrüstung vor Ort.",
      level: "Einsteiger & Genussfahrer",
      terrain: "medium",
      heading: "Enduro Tour für Einsteiger",
      headingAccent: "in Bosnien",
      intro:
        "Du fährst sicher Motorrad, hast aber wenig oder gar keine Offroad-Erfahrung? Dann ist die Einsteiger-Tour dein Start ins Endurofahren: {ridingDays} geführte Fahrtage in den Bergen rund um Gornji Vakuf-Uskoplje in Zentralbosnien, {nights} Übernachtungen mit Frühstück und ein Guide an deiner Seite. Route und Tempo passen wir deinem Fahrkönnen an – hier zählt der Spaß, nicht die Stoppuhr.",
      audience: [
        "Motorradfahrer mit grundlegender Fahrpraxis, die zum ersten Mal ins Gelände wollen",
        "Genussfahrer, denen Landschaft und Natur wichtiger sind als Tempo",
        "Alle, die Enduro erst einmal ausprobieren möchten, bevor sie eine längere Tour buchen",
        "Voraussetzung: Anfahren, Bremsen und Schalten sollten sicher sitzen",
      ],
      routeText:
        "Die Einsteiger-Tour ist eine Medium-Enduro-Tour. Die Route führt als Rundstrecke durch die Umgebung von Gornji Vakuf-Uskoplje bis zum Prokoško-See – über Wege und Trails mit gemischtem Schwierigkeitsgrad, durch eine Landschaft mit Bergen bis 2.100 m.",
      bikesText:
        "Kein eigenes Bike? Für Einsteiger empfehlen wir die BETA 300 XTRAINER: niedrige Sitzhöhe, sanfte Leistung und sehr verzeihend, wenn mal etwas nicht klappt. Helm, Stiefel, Handschuhe, Brustpanzer sowie Knie- und Ellbogenschützer bekommst du kostenlos – in allen gängigen Größen und nach jeder Tour gründlich gereinigt.",
      guidesText:
        "Unsere Guides sprechen Deutsch und Englisch. Mit Dario Brnas haben wir einen eigenen Guide für Anfänger im Team.",
      faq: [
        {
          question: "Brauche ich Offroad-Erfahrung für die Einsteiger-Tour?",
          answer:
            "Nein. Spezielle Offroad-Erfahrung ist nicht nötig, du solltest aber sicher anfahren, bremsen und schalten können. Route und Tempo passen wir deinem Fahrkönnen an. Wenn du unsicher bist, welche Tour zu dir passt, schreib uns vor der Buchung.",
        },
        {
          question: "Welches Motorrad eignet sich für Einsteiger?",
          answer:
            "Wir empfehlen die BETA 300 XTRAINER aus unserer Flotte: niedrige Sitzhöhe, sanfte Leistungsentfaltung und sehr verzeihend. Mit Leihmotorrad kostet die Einsteiger-Tour {rentalBikePrice} €, mit eigenem Motorrad {ownBikePrice} €.",
        },
        {
          question: "Wann findet die Einsteiger-Tour statt?",
          answer:
            "Wir fahren im Frühjahr (Mai bis Juni) und im Herbst (September bis Oktober). Die Tour beginnt immer am {arrival} mit der Anreise, Abreise ist am {departure}. Alle freien Termine findest du auf unserer Terminseite.",
        },
      ],
      relatedPosts: ["top-5-grunde-enduro-bosnien", "enduro-ausruestung-bosnien", "enduro-urlaub-balkan"],
    },
    bestseller: {
      name: "Bestseller-Tour",
      metaTitle: "Enduro Tour für Fortgeschrittene in Bosnien | Enduro Drift",
      metaDescription:
        "Unsere beliebteste Enduro-Tour in Bosnien: {ridingDays} geführte Fahrtage, {nights} Übernachtungen mit Frühstück, ab {ownBikePrice} €. Ideal für Fortgeschrittene.",
      level: "Fortgeschrittene",
      terrain: "medium",
      heading: "Enduro Tour für Fortgeschrittene",
      headingAccent: "– unser Bestseller",
      intro:
        "Die Bestseller-Tour ist unsere beliebteste Tour: {ridingDays} geführte Fahrtage geben dir genug Zeit, um richtig in den Offroad-Rhythmus zu kommen und die Bergwelt rund um Gornji Vakuf-Uskoplje ausgiebig zu erkunden. Dazu kommen {nights} Übernachtungen mit Frühstück und ein Guide, der die Route an dein Fahrkönnen anpasst.",
      audience: [
        "Fahrer mit ersten Enduro- oder Offroad-Erfahrungen, die mehr Strecke sehen wollen",
        "Alle, denen drei Fahrtage zu kurz sind",
        "Freundesgruppen mit unterschiedlichem Fahrkönnen – Route und Tempo passen wir an",
        "Fahrer, die Landschaft und Fahrspaß verbinden wollen, ohne die Härte einer reinen Hard-Enduro-Tour",
      ],
      routeText:
        "Auch die Bestseller-Tour ist eine Medium-Enduro-Tour: längere, landschaftlich reizvolle Strecken mit gemischtem Schwierigkeitsgrad. Unterwegs bist du im Gelände rund um Gornji Vakuf-Uskoplje – mehr als 3.000 km² mit Bergen bis 2.100 m, dem Vranica-Gebirge und Seen wie dem Prokoško-See in der Region.",
      bikesText:
        "Für längere Medium-Enduro-Etappen und schnelle Schotterpisten empfehlen wir die KTM 350 EXC-F (4-Takt). Wer technischere Passagen mag, fährt die BETA 300 RR; für Einsteiger ist die BETA 300 XTRAINER die beste Wahl. Die komplette Schutzausrüstung ist kostenlos inklusive.",
      guidesText:
        "Unser Guide-Team leitet Mladen Brnas (Pinky). Die Guides sprechen Deutsch und Englisch und passen Tempo und Streckenwahl an die Gruppe an.",
      faq: [
        {
          question: "Für wen eignet sich die Bestseller-Tour?",
          answer:
            "Für Fahrer mit ersten Offroad-Erfahrungen, die mehr als ein verlängertes Wochenende auf dem Enduro verbringen wollen. Es ist eine Medium-Enduro-Tour mit gemischtem Schwierigkeitsgrad; Route und Tempo passen wir an dein Fahrkönnen an. Wenn du unsicher bist, berät dich unser Team gern vorab.",
        },
        {
          question: "Wie viele Kilometer fahren wir pro Tag?",
          answer:
            "Auf Medium-Enduro-Strecken sind es rund 80 bis 100 km pro Tag. Die Tour umfasst {ridingDays} Fahrtage, Anreise ist am {arrival}, Abreise am {departure}.",
        },
        {
          question: "Wie komme ich nach Gornji Vakuf-Uskoplje?",
          answer:
            "Am einfachsten mit dem Flugzeug nach Sarajevo – von dort sind es etwa 2,5 Stunden, den Flughafentransfer organisieren wir auf Wunsch (70 € hin und zurück). Mit dem Auto sind es zum Beispiel ab Wien rund 720 km, ab München rund 905 km und ab Zürich rund 1.170 km.",
        },
      ],
      relatedPosts: [
        "enduro-tour-bosnien-2027-saisonstart",
        "enduro-urlaub-balkan",
        "oida-style-youtuber-besuch-enduro-drift",
      ],
    },
    hardEnduro: {
      name: "Hard-Enduro-Woche",
      metaTitle: "Hard Enduro Woche in Bosnien: {ridingDays} Fahrtage | Enduro Drift",
      metaDescription:
        "Hard Enduro in Bosnien für erfahrene Fahrer: {ridingDays} Fahrtage in technischem Gelände, {nights} Übernachtungen mit Frühstück und Guide – ab {ownBikePrice} €.",
      level: "Erfahrene Fahrer",
      terrain: "hard",
      heading: "Hard Enduro Woche",
      headingAccent: "in Bosnien",
      intro:
        "Eine Woche, {ridingDays} Fahrtage, technisches Gelände: Die Hard-Enduro-Woche ist unsere maximale Herausforderung für erfahrene Fahrer. Hier geht es nicht ums Kilometersammeln, sondern um steile Anstiege, technische Trails und anspruchsvolles Gelände in den Bergen rund um Gornji Vakuf-Uskoplje. Du wohnst {nights} Nächte mit Frühstück vor Ort, ein Guide führt dich durchs Gelände.",
      audience: [
        "Erfahrene Enduro-Fahrer, die technisches Gelände und steile Anstiege suchen",
        "Fahrer, die ihr Können auf neuem Terrain in den Bergen Bosniens testen wollen",
        "Alle, die eine ganze Woche Enduro-Urlaub planen – Anreise am {arrival}, Abreise am {departure}",
        "Voraussetzung: gute Kondition und sichere Fahrtechnik im Gelände",
      ],
      routeText:
        "Die Hard-Enduro-Woche führt in herausforderndes Gelände: technische Trails, steile Anstiege und Passagen, bei denen jede Linie zählt. Deshalb sind die Tagesetappen mit 30 bis 40 km bewusst kurz. Rund um Gornji Vakuf-Uskoplje gibt es dafür mehr als 3.000 km² Gelände mit Bergen bis 2.100 m.",
      bikesText:
        "Für Hard Enduro empfehlen wir die BETA 300 XPRO (2026), unser neuestes Modell, die BETA 300 RR oder die KTM 300 EXC – leichte, handliche Zweitakter für technische Trails und steile Anstiege. Die komplette Schutzausrüstung ist kostenlos inklusive; viele erfahrene Fahrer bringen zusätzlich eigenen Helm und Stiefel mit.",
      guidesText:
        "Mit Anel Tihak ist ein Pro Rider im Team, das Guide-Team leitet Mladen Brnas (Pinky). Die Guides sprechen Deutsch und Englisch.",
      faq: [
        {
          question: "Wie schwer ist die Hard-Enduro-Woche?",
          answer:
            "Es ist unsere anspruchsvollste Tour: technische Trails, steile Anstiege und herausforderndes Gelände bei 30 bis 40 km pro Tag. Sie richtet sich an erfahrene Fahrer mit guter Kondition. Wenn du dir nicht sicher bist, ist die Bestseller-Tour der bessere Einstieg – oder du fragst uns vorab um Rat.",
        },
        {
          question: "Kann ich mit meinem eigenen Motorrad teilnehmen?",
          answer:
            "Ja, mit eigenem Motorrad kostet die Hard-Enduro-Woche {ownBikePrice} €. Dein Motorrad muss tourbereit sein; laut unseren Tour-Regeln gehören Motorradwerkzeug, ein paar Ersatzschrauben, Ersatz-Brems- und Kupplungshebel und – wenn du mit Schlauch fährst – ein zweiter Schlauch samt Pumpe ins Gepäck. Für das eigene Motorrad fällt eine Vignette von 25 € pro Monat an.",
        },
        {
          question: "Was muss ich selbst mitbringen?",
          answer:
            "Die Schutzausrüstung stellen wir kostenlos. Mitbringen solltest du eine eigene Enduro-Brille, Funktionsunterwäsche und Enduro-Hose/Jersey, eine Regenjacke, einen Trinkrucksack für 1,5 bis 2 Liter pro Tag und ein kleines Erste-Hilfe-Set – das ist laut unseren Tour-Regeln Pflicht.",
        },
      ],
      relatedPosts: [
        "enduro-ausruestung-bosnien",
        "enduro-tour-bosnien-2026-saisonstart",
        "top-5-grunde-enduro-bosnien",
      ],
    },
  },
  en: {
    einsteiger: {
      name: "Beginner Tour",
      metaTitle: "Enduro Tour for Beginners in Bosnia | Enduro Drift Bosnien",
      metaDescription:
        "Guided enduro tour for beginners in Bosnia: {ridingDays} riding days, {nights} nights with breakfast, from €{ownBikePrice}. Rental bikes and protective gear on site.",
      level: "Beginners & leisure riders",
      terrain: "medium",
      heading: "Enduro Tour for Beginners",
      headingAccent: "in Bosnia",
      intro:
        "You ride a motorcycle confidently but have little or no off-road experience? Then the Beginner Tour is your way into enduro riding: {ridingDays} guided riding days in the mountains around Gornji Vakuf-Uskoplje in central Bosnia, {nights} nights with breakfast and a guide by your side. We adapt the route and pace to your riding skills – this is about fun, not the stopwatch.",
      audience: [
        "Riders with basic motorcycle experience heading off-road for the first time",
        "Leisure riders who care more about scenery and nature than speed",
        "Anyone who wants to try enduro before booking a longer tour",
        "Requirement: you should be confident starting off, braking and shifting gears",
      ],
      routeText:
        "The Beginner Tour is a medium enduro tour. The route is a loop through the area around Gornji Vakuf-Uskoplje out to Lake Prokoško – on tracks and trails of mixed difficulty, through a landscape of mountains up to 2,100 m.",
      bikesText:
        "No bike of your own? For beginners we recommend the BETA 300 XTRAINER: low seat height, smooth power and very forgiving when something doesn't go to plan. Helmet, boots, gloves, chest protector and knee and elbow guards are included free of charge – in all common sizes and thoroughly cleaned after every tour.",
      guidesText:
        "Our guides speak German and English. With Dario Brnas we have a dedicated beginner guide on the team.",
      faq: [
        {
          question: "Do I need off-road experience for the Beginner Tour?",
          answer:
            "No. You don't need specific off-road experience, but you should be confident starting off, braking and shifting gears. We adapt the route and pace to your riding skills. If you're unsure which tour suits you, get in touch before booking.",
        },
        {
          question: "Which motorcycle is best for beginners?",
          answer:
            "We recommend the BETA 300 XTRAINER from our fleet: low seat height, smooth power delivery and very forgiving. With a rental motorcycle the Beginner Tour costs €{rentalBikePrice}, with your own motorcycle €{ownBikePrice}.",
        },
        {
          question: "When does the Beginner Tour take place?",
          answer:
            "We ride in spring (May to June) and autumn (September to October). The tour always starts with arrival on {arrival}; departure is on {departure}. You'll find all available dates on our dates page.",
        },
      ],
      relatedPosts: ["top-5-grunde-enduro-bosnien", "enduro-ausruestung-bosnien", "enduro-urlaub-balkan"],
    },
    bestseller: {
      name: "Bestseller Tour",
      metaTitle: "Enduro Tour for Intermediate Riders in Bosnia | Enduro Drift",
      metaDescription:
        "Our most popular enduro tour in Bosnia: {ridingDays} guided riding days, {nights} nights with breakfast, from €{ownBikePrice}. Ideal for intermediate riders.",
      level: "Intermediate riders",
      terrain: "medium",
      heading: "Enduro Tour for Intermediate Riders",
      headingAccent: "– Our Bestseller",
      intro:
        "The Bestseller Tour is our most popular tour: {ridingDays} guided riding days give you enough time to really find your off-road rhythm and explore the mountains around Gornji Vakuf-Uskoplje properly. On top of that you get {nights} nights with breakfast and a guide who adapts the route to your riding skills.",
      audience: [
        "Riders with some enduro or off-road experience who want to see more terrain",
        "Anyone for whom three riding days are too short",
        "Groups of friends with different skill levels – we adapt route and pace",
        "Riders who want scenery and riding fun without the intensity of a pure hard enduro tour",
      ],
      routeText:
        "The Bestseller Tour is also a medium enduro tour: longer, scenic routes of mixed difficulty. You'll ride in the terrain around Gornji Vakuf-Uskoplje – more than 3,000 km² with mountains up to 2,100 m, the Vranica range and lakes such as Lake Prokoško in the region.",
      bikesText:
        "For longer medium enduro stages and fast gravel tracks we recommend the KTM 350 EXC-F (4-stroke). If you like more technical sections, take the BETA 300 RR; for beginners the BETA 300 XTRAINER is the best choice. Full protective gear is included free of charge.",
      guidesText:
        "Our guide team is led by Mladen Brnas (Pinky). The guides speak German and English and adapt the pace and route choice to the group.",
      faq: [
        {
          question: "Who is the Bestseller Tour for?",
          answer:
            "For riders with some off-road experience who want to spend more than a long weekend on an enduro bike. It's a medium enduro tour of mixed difficulty, and we adapt the route and pace to your riding skills. If you're unsure, our team is happy to advise you beforehand.",
        },
        {
          question: "How many kilometres do we ride per day?",
          answer:
            "On medium enduro routes it's around 80 to 100 km per day. The tour includes {ridingDays} riding days, with arrival on {arrival} and departure on {departure}.",
        },
        {
          question: "How do I get to Gornji Vakuf-Uskoplje?",
          answer:
            "The easiest way is to fly to Sarajevo – from there it's about 2.5 hours, and we can arrange the airport transfer on request (€70 return). By car it's around 720 km from Vienna, 905 km from Munich and 1,170 km from Zurich, for example.",
        },
      ],
      relatedPosts: [
        "enduro-tour-bosnia-2027-season-open",
        "enduro-urlaub-balkan",
        "enduro-abenteuer-vranica-berg",
      ],
    },
    hardEnduro: {
      name: "Hard Enduro Week",
      metaTitle: "Hard Enduro Week in Bosnia: {ridingDays} Riding Days | Enduro Drift",
      metaDescription:
        "Hard enduro in Bosnia for experienced riders: {ridingDays} riding days in technical terrain, {nights} nights with breakfast and a guide – from €{ownBikePrice}.",
      level: "Experienced riders",
      terrain: "hard",
      heading: "Hard Enduro Week",
      headingAccent: "in Bosnia",
      intro:
        "One week, {ridingDays} riding days, technical terrain: the Hard Enduro Week is our ultimate challenge for experienced riders. It's not about racking up kilometres but about steep climbs, technical trails and demanding terrain in the mountains around Gornji Vakuf-Uskoplje. You stay {nights} nights with breakfast, and a guide leads you through the terrain.",
      audience: [
        "Experienced enduro riders looking for technical terrain and steep climbs",
        "Riders who want to test their skills on new ground in the Bosnian mountains",
        "Anyone planning a full week of enduro – arrival on {arrival}, departure on {departure}",
        "Requirement: good fitness and solid off-road riding technique",
      ],
      routeText:
        "The Hard Enduro Week takes you into challenging terrain: technical trails, steep climbs and sections where every line counts. That's why the daily stages are deliberately short at 30 to 40 km. Around Gornji Vakuf-Uskoplje there are more than 3,000 km² of terrain with mountains up to 2,100 m.",
      bikesText:
        "For hard enduro we recommend the BETA 300 XPRO (2026), our newest model, the BETA 300 RR or the KTM 300 EXC – light, agile two-strokes for technical trails and steep climbs. Full protective gear is included free of charge; many experienced riders also bring their own helmet and boots.",
      guidesText:
        "Pro rider Anel Tihak is part of the team, and the guide team is led by Mladen Brnas (Pinky). The guides speak German and English.",
      faq: [
        {
          question: "How hard is the Hard Enduro Week?",
          answer:
            "It's our most demanding tour: technical trails, steep climbs and challenging terrain at 30 to 40 km per day. It's aimed at experienced riders with good fitness. If you're not sure, the Bestseller Tour is the better starting point – or ask us for advice beforehand.",
        },
        {
          question: "Can I take part with my own motorcycle?",
          answer:
            "Yes – with your own motorcycle the Hard Enduro Week costs €{ownBikePrice}. Your bike must be tour-ready; according to our tour rules that means tools, a few spare bolts, spare brake and clutch levers and, if you ride with inner tubes, a spare tube and a pump. For your own motorcycle a road tax of €25 per month applies.",
        },
        {
          question: "What do I need to bring myself?",
          answer:
            "We provide protective gear free of charge. You should bring your own enduro goggles, base layers and enduro pants/jersey, a rain jacket, a hydration pack for 1.5 to 2 litres per day and a small first-aid kit – it's mandatory according to our tour rules.",
        },
      ],
      relatedPosts: [
        "enduro-ausruestung-bosnien",
        "enduro-tour-bosnia-2026-season-launch",
        "top-5-grunde-enduro-bosnien",
      ],
    },
  },
};
