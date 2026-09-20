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
  equipmentGuide: { text: string; label: string; href: string };
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
      "KTM 350 EXC",
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
    equipmentGuide: {
      text: "Mehr zur richtigen Ausrüstung für Ihre Tour lesen Sie in unserem Ratgeber:",
      label: "Enduro Ausrüstung - Was du für deine Bosnien Tour brauchst",
      href: "/de/blog/enduro-ausruestung-bosnien/",
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
      "KTM 350 EXC",
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
    equipmentGuide: {
      text: "Read more about the right gear for your tour in our guide:",
      label: "Enduro Gear - What You Need for Your Bosnia Tour",
      href: "/en/blog/enduro-ausruestung-bosnien/",
    },
  },
};
