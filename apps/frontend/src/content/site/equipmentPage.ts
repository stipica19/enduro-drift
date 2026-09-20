export interface EquipmentItem {
  title: string;
  text?: string;
}

export interface EquipmentPageContent {
  heading: string;
  headingAccent: string;
  intro: string;
  includedHeading: string;
  // Redoslijed odgovara ikonama u EquipmentDetails.astro (kaciga, čizme, rukavice, prsni oklop, koljena/laktovi).
  included: EquipmentItem[];
  sizesNote: string;
  bringHeading: string;
  bring: { title: string; text: string }[];
  ownHeading: string;
  ownText: string;
  guideText: string;
  guideLink: { label: string; href: string };
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export const equipmentPage: Record<"de" | "en", EquipmentPageContent> = {
  de: {
    heading: "Enduro-Ausrüstung –",
    headingAccent: "kostenlos inklusive",
    intro:
      "Du musst keine komplette Enduro-Ausrüstung im Flugzeug mitschleppen. Bei Enduro Drift Bosnien bekommst du die Schutzausrüstung kostenlos gestellt, in allen gängigen Größen. Jedes Teil wird nach jeder Tour gründlich gereinigt, bevor der nächste Gast es trägt.",
    includedHeading: "Das ist inklusive",
    included: [
      // TODO: provjeriti stvarne veličine kaciga (XS–XXL) i čizama (39–47).
      { title: "Helm", text: "Offroad-Helme in den Größen XS–XXL" },
      { title: "Enduro-Stiefel", text: "Größen 39–47" },
      { title: "Handschuhe", text: "Leichte Offroad-Handschuhe für guten Griff" },
      { title: "Brustpanzer", text: "Schutz für Brust und Rücken" },
      { title: "Knie- und Ellbogenschützer" },
    ],
    // TODO: booking forma nema polje za veličine (samo slobodna "Nachricht") — ili dodati polje ili reći "in der Nachricht".
    sizesNote:
      "Gib bei der Anmeldung einfach deine Helm- und Schuhgröße an. Dann liegt alles am ersten Morgen bereit.",
    bringHeading: "Was du selbst mitbringen solltest",
    bring: [
      {
        title: "Enduro-Brille.",
        text: "Am besten eine eigene, weil sie gut auf deinen Helm passen muss",
      },
      {
        title: "Funktionsunterwäsche und Enduro-Hose/Jersey.",
        text: "Atmungsaktiv, denn im Mai und Juni kann es tagsüber warm werden",
      },
      {
        title: "Regenjacke.",
        text: "In den Bergen bis 2.100 m ändert sich das Wetter schnell",
      },
      { title: "Trinkrucksack.", text: "1,5–2 Liter pro Tag" },
      {
        title: "Kleines Erste-Hilfe-Set.",
        text: "Laut unseren Tour-Regeln Pflicht",
      },
    ],
    ownHeading: "Eigene Ausrüstung mitbringen?",
    ownText:
      "Natürlich kannst du deine eigene Ausrüstung mitbringen, wenn du dich darin wohler fühlst. Viele Gäste bringen Helm und Stiefel mit und leihen den Rest bei uns. Das spart Gepäck und ist perfekt eingefahren.",
    guideText: "Mehr Tipps findest du in unserem Ratgeber:",
    guideLink: {
      label: "Enduro Ausrüstung – Was du für deine Bosnien Tour brauchst",
      href: "/de/blog/enduro-ausruestung-bosnien/",
    },
    ctaPrimary: { label: "Touren & Preise ansehen", href: "/de/touren/" },
    ctaSecondary: { label: "Tour anfragen", href: "/de/anmeldung/" },
  },
  en: {
    heading: "Enduro Gear –",
    headingAccent: "Included for Free",
    intro:
      "You don't have to lug a full set of enduro gear onto the plane. At Enduro Drift Bosnien we provide the protective gear free of charge, in all common sizes. Every item is thoroughly cleaned after each tour before the next guest wears it.",
    includedHeading: "What's included",
    included: [
      // TODO: check the actual helmet (XS–XXL) and boot (39–47) sizes.
      { title: "Helmet", text: "Off-road helmets in sizes XS–XXL" },
      { title: "Enduro boots", text: "EU sizes 39–47" },
      { title: "Gloves", text: "Lightweight off-road gloves for a good grip" },
      { title: "Chest protector", text: "Protection for chest and back" },
      { title: "Knee and elbow guards" },
    ],
    // TODO: the booking form has no size field (only a free-text "Message") — add a field or say "in the message".
    sizesNote:
      "Just enter your helmet and boot size when you register. Then everything is ready for you on the first morning.",
    bringHeading: "What you should bring yourself",
    bring: [
      {
        title: "Enduro goggles.",
        text: "Ideally your own, as they need to fit your helmet well",
      },
      {
        title: "Base layers and enduro pants/jersey.",
        text: "Breathable, because it can get warm during the day in May and June",
      },
      {
        title: "Rain jacket.",
        text: "The weather changes quickly in the mountains up to 2,100 m",
      },
      { title: "Hydration pack.", text: "1.5–2 litres per day" },
      {
        title: "Small first-aid kit.",
        text: "Mandatory according to our tour rules",
      },
    ],
    ownHeading: "Bring your own gear?",
    ownText:
      "Of course you can bring your own gear if you feel more comfortable in it. Many guests bring their helmet and boots and borrow the rest from us. That saves luggage and it's perfectly broken in.",
    guideText: "You'll find more tips in our guide:",
    guideLink: {
      label: "Enduro Gear – What You Need for Your Bosnia Tour",
      href: "/en/blog/enduro-ausruestung-bosnien/",
    },
    ctaPrimary: { label: "View tours & prices", href: "/en/tours/" },
    ctaSecondary: { label: "Request a tour", href: "/en/booking/" },
  },
};
