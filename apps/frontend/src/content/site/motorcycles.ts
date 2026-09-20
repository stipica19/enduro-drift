export interface FleetRow {
  model: string;
  engine: string;
  idealFor: string;
}

export interface FleetPageContent {
  heading: string;
  headingAccent: string;
  intro: string;
  fleetHeading: string;
  columns: { model: string; engine: string; idealFor: string };
  fleet: FleetRow[];
  matchHeading: string;
  matchText: string;
  priceHeading: string;
  priceText: string;
  spareHeading: string;
  spareText: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export interface MotorcyclesContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  headingAccent: string;
  intro: string;
  readyToRace: string;
  bikes: string[];
  equipmentMetaTitle: string;
  equipmentMetaDescription: string;
  equipmentHeading: string;
  equipmentAccent: string;
  equipmentIntro: string;
  equipmentItems: string[];
  freeBadge: string;
  fleetPhotoAlt: string;
  page: FleetPageContent;
}

export const motorcycles: Record<"de" | "en", MotorcyclesContent> = {
  de: {
    metaTitle: "Enduro Leihmotorräder: BETA & KTM | Enduro Drift Bosnien",
    metaDescription:
      "BETA und KTM Enduro-Motorräder für jedes Fahrkönnen - unsere Flotte für geführte Touren in Bosnien und Herzegowina.",
    heading: "Unsere",
    headingAccent: "Motorräder",
    intro:
      "Wir lieben unsere Motorräder. Sie sehen nicht nur toll aus, sondern verhalten sich auch dementsprechend. Unsere BETA- und KTM-Modelle sind leicht, handlich und mit leistungsstarken, zuverlässigen Motoren ausgestattet - perfekt für anspruchsvolle Trails.",
    readyToRace: "„READY TO RACE\"",
    bikes: [
      "BETA 300 XPRO 2026",
      "BETA 300 RR 2023",
      "BETA 300 XTRAINER 2023",
      "KTM 350 EXC-F",
      "KTM 300 EXC",
    ],
    equipmentMetaTitle: "Enduro Ausrüstung inklusive | Enduro Drift Bosnien",
    equipmentMetaDescription:
      "Enduro-Schutzausrüstung kostenlos inklusive - Helme, Stiefel, Handschuhe sowie Knie-, Brust- und Ellbogenschützer in allen Größen.",
    equipmentHeading: "Unsere",
    equipmentAccent: "Ausrüstung",
    equipmentIntro:
      "Wenn Sie ohne Enduro-Ausrüstung anreisen, müssen Sie sich keine Sorgen machen. Wir haben Ihnen die passende Ausrüstung in allen möglichen Größen zur Verfügung gestellt - Helme, Stiefel, Handschuhe sowie Knie-, Brust- und Ellbogenschützer. Die gesamte Ausrüstung wird gründlich gereinigt, bevor sie an Gäste weitergegeben wird.",
    equipmentItems: ["Helme", "Stiefel", "Handschuhe", "Brust- und Ellbogenschützer"],
    freeBadge: "Kostenlos inklusive für alle Gäste",
    fleetPhotoAlt: "Rotes BETA Enduro-Motorrad aus unserer Flotte - Foto",
    // Sadržaj stranice /motorrader (H1 + tijelo). Homepage sekcija koristi heading/intro iznad.
    page: {
      heading: "Unsere",
      headingAccent: "Enduro-Motorräder",
      // TODO: provjeriti je li gorivo uključeno u najam (tekst kaže "getankt").
      intro:
        "Kein eigenes Bike? Kein Problem. Bei allen Touren kannst du eines unserer Enduro-Motorräder mieten. Die Maschinen sind gewartet, getankt und auf die Trails rund um Gornji Vakuf-Uskoplje abgestimmt. Du steigst morgens auf und fährst los. Um Setup, Wartung und Technik kümmert sich unser Team.",
      fleetHeading: "Unsere Flotte",
      columns: { model: "Modell", engine: "Motor", idealFor: "Ideal für" },
      fleet: [
        {
          model: "BETA 300 XPRO (2026)",
          engine: "2-Takt, 300 cm³",
          idealFor: "Unser neuestes Modell, für Fortgeschrittene und Hard-Enduro",
        },
        {
          model: "BETA 300 RR (2023)",
          engine: "2-Takt, 293 cm³",
          idealFor: "Erfahrene Fahrer, technische Trails und steile Anstiege",
        },
        {
          model: "BETA 300 XTRAINER (2023)",
          engine: "2-Takt, 293 cm³",
          idealFor: "Einsteiger. Niedrige Sitzhöhe, sanfte Leistung, sehr verzeihend",
        },
        {
          model: "KTM 350 EXC-F",
          engine: "4-Takt, 350 cm³",
          idealFor: "Längere Medium-Enduro-Etappen und schnelle Schotterpisten",
        },
        {
          model: "KTM 300 EXC",
          engine: "2-Takt, 293 cm³",
          idealFor: "Hard-Enduro-Fans, die das KTM-Fahrgefühl kennen",
        },
      ],
      matchHeading: "Welches Motorrad passt zu mir?",
      matchText:
        "Bist du neu im Gelände, empfehlen wir die BETA XTRAINER. Sie ist leicht, hat eine niedrige Sitzhöhe und verzeiht Fahrfehler. So kannst du dich ganz auf die Linie konzentrieren. Fortgeschrittene und erfahrene Fahrer wählen meist die BETA RR, die XPRO oder die KTM 300 EXC. Sie haben mehr Druck am Hinterrad für steile Auffahrten und Felspassagen. Auf den längeren Medium-Enduro-Tagen mit 80–100 km ist der Viertakter KTM 350 EXC-F besonders angenehm. Unsicher? Schreib uns dein Fahrlevel, und wir reservieren dir das passende Bike.",
      priceHeading: "Was kostet ein Leihmotorrad?",
      // Iznosi (300/400 €) = rentalBikePrice − ownBikePrice iz tourPricing.ts — ažurirati zajedno s cijenama.
      priceText:
        "Die Miete ist im Tourpreis „Mit unserem Motorrad“ bereits enthalten. Der Aufpreis gegenüber der Tour mit eigenem Bike beträgt 300 € (3- und 4-Tage-Tour) bzw. 400 € (5-Tage-Tour). Schutzausrüstung bekommst du kostenlos dazu.",
      spareHeading: "Ersatzmotorräder und Mechaniker",
      // TODO: Kaution / Selbstbeteiligung bei Schäden? (vlasnik nije potvrdio — ne tvrditi ništa dok se ne odluči)
      spareText:
        "Auf jeder Tour haben wir Ersatzmotorräder und einen Mechaniker dabei. Hast du einen technischen Defekt, fährst du weiter und verlierst keinen Tourtag.",
      ctaPrimary: { label: "Touren & Preise ansehen", href: "/de/touren/" },
      ctaSecondary: { label: "Motorrad für deinen Termin anfragen", href: "/de/anmeldung/" },
    },
  },
  en: {
    metaTitle: "Enduro Rental Bikes: BETA & KTM | Enduro Drift Bosnien",
    metaDescription:
      "BETA and KTM enduro motorcycles for every skill level - our fleet for guided tours in Bosnia and Herzegovina.",
    heading: "Our",
    headingAccent: "Motorcycles",
    intro:
      "We love our motorcycles. They don't just look great - they ride great too. Our BETA and KTM models are light, agile and fitted with powerful, reliable engines - perfect for demanding trails.",
    readyToRace: "\"READY TO RACE\"",
    bikes: [
      "BETA 300 XPRO 2026",
      "BETA 300 RR 2023",
      "BETA 300 XTRAINER 2023",
      "KTM 350 EXC-F",
      "KTM 300 EXC",
    ],
    equipmentMetaTitle: "Enduro Gear Included | Enduro Drift Bosnien",
    equipmentMetaDescription:
      "Protective enduro gear included for free - helmets, boots, gloves, and knee, chest and elbow protectors in all sizes.",
    equipmentHeading: "Our",
    equipmentAccent: "Equipment",
    equipmentIntro:
      "If you arrive without enduro gear, don't worry. We provide the right equipment in all sizes - helmets, boots, gloves, and knee, chest and elbow protectors. All gear is thoroughly cleaned before being handed to guests.",
    equipmentItems: ["Helmets", "Boots", "Gloves", "Chest & elbow protectors"],
    freeBadge: "Included free for all guests",
    fleetPhotoAlt: "Red BETA enduro motorcycle from our fleet - photo",
    // Content of the /en/motorcycles page (H1 + body). The homepage section uses heading/intro above.
    page: {
      heading: "Our",
      headingAccent: "Enduro Motorcycles",
      // TODO: check whether fuel is included in the rental (the text says "fuelled").
      intro:
        "No bike of your own? No problem. On every tour you can rent one of our enduro motorcycles. The machines are serviced, fuelled and set up for the trails around Gornji Vakuf-Uskoplje. You hop on in the morning and ride off. Our team takes care of setup, maintenance and technical support.",
      fleetHeading: "Our fleet",
      columns: { model: "Model", engine: "Engine", idealFor: "Ideal for" },
      fleet: [
        {
          model: "BETA 300 XPRO (2026)",
          engine: "2-stroke, 300 cc",
          idealFor: "Our newest model, for advanced riders and hard enduro",
        },
        {
          model: "BETA 300 RR (2023)",
          engine: "2-stroke, 293 cc",
          idealFor: "Experienced riders, technical trails and steep climbs",
        },
        {
          model: "BETA 300 XTRAINER (2023)",
          engine: "2-stroke, 293 cc",
          idealFor: "Beginners. Low seat height, gentle power delivery, very forgiving",
        },
        {
          model: "KTM 350 EXC-F",
          engine: "4-stroke, 350 cc",
          idealFor: "Longer medium-enduro stages and fast gravel tracks",
        },
        {
          model: "KTM 300 EXC",
          engine: "2-stroke, 293 cc",
          idealFor: "Hard-enduro fans who know the KTM ride feel",
        },
      ],
      matchHeading: "Which motorcycle suits me?",
      matchText:
        "If you're new to off-road riding, we recommend the BETA XTRAINER. It's light, has a low seat height and forgives mistakes, so you can concentrate fully on your line. Advanced and experienced riders usually choose the BETA RR, the XPRO or the KTM 300 EXC. They have more punch at the rear wheel for steep climbs and rocky sections. On the longer medium-enduro days of 80–100 km, the four-stroke KTM 350 EXC-F is especially comfortable. Not sure? Tell us your riding level and we'll reserve the right bike for you.",
      priceHeading: "What does a rental motorcycle cost?",
      // Amounts (€300/€400) = rentalBikePrice − ownBikePrice from tourPricing.ts — update together with the prices.
      priceText:
        "Rental is already included in the “With our motorcycle” tour price. The surcharge compared with the tour on your own bike is €300 (3- and 4-day tours) or €400 (5-day tour). Protective gear is included free of charge.",
      spareHeading: "Spare motorcycles and mechanic",
      // TODO: deposit / excess for damage? (not confirmed by the owner — don't claim anything until decided)
      spareText:
        "We bring spare motorcycles and a mechanic on every tour. If you have a technical breakdown, you keep riding and don't lose a tour day.",
      ctaPrimary: { label: "View tours & prices", href: "/en/tours/" },
      ctaSecondary: { label: "Request a bike for your date", href: "/en/booking/" },
    },
  },
};
