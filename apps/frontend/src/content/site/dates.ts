export interface DatesContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  arrivalHeading: string;
  arrivalIntro: string;
  tours: { title: string; text: string }[];
  transfer: string;
  seasonHeading: string;
  seasonText: string;
  groupHeading: string;
  groupText: string;
  cta: { label: string; href: string };
}

export const dates: Record<"de" | "en", DatesContent> = {
  de: {
    metaTitle: "Enduro Termine Bosnien | Enduro Drift Bosnien",
    metaDescription:
      "Aktuelle Termine für Enduro-Touren in Bosnien: Wählen Sie Ihre Tour und Ihren Wunschtermin und reservieren Sie rechtzeitig - die Plätze sind begrenzt.",
    heading: "Enduro Tour Termine 2026 & 2027",
    // TODO: provjeriti vrijeme odgovora ("meist innerhalb von 24 Stunden").
    intro:
      "Alle Touren beginnen am Samstag. So passt die Anreise gut in deinen Urlaub, und Flüge nach Sarajevo sind am Wochenende leicht zu finden. Unten siehst du alle freien Termine. Wähle deinen Wunschtermin und schick uns eine Anfrage. Wir bestätigen die Verfügbarkeit persönlich, meist innerhalb von 24 Stunden.",
    arrivalHeading: "An- und Abreise",
    arrivalIntro:
      "Die erste Übernachtung ist immer die Nacht von Samstag auf Sonntag. Am Sonntag geht es auf die Trails. Der Abreisetag hängt von der Tour ab:",
    tours: [
      {
        title: "Tour 1 – Einsteiger:",
        text: "3 Fahrtage, 4 Übernachtungen, Abreise am Mittwoch",
      },
      // TODO: kartice tura (tourPricing.ts, homepage i /touren) kažu za Tour 2 odlazak u petak — uskladiti.
      // 5 noćenja od subote = četvrtak, a arrivalNotice.ts (booking stranica) već kaže četvrtak.
      {
        title: "Tour 2 – Fortgeschrittene:",
        text: "4 Fahrtage, 5 Übernachtungen, Abreise am Donnerstag",
      },
      {
        title: "Tour 3 – Erfahrene:",
        text: "5 Fahrtage, 7 Übernachtungen, Abreise am Samstag",
      },
    ],
    transfer: "Flughafentransfer ab Sarajevo (ca. 2,5 Std.): 70 € hin und zurück.",
    seasonHeading: "Wann ist die beste Reisezeit?",
    seasonText:
      "Wir fahren im Frühjahr (Mai bis Juni) und im Herbst (September bis Oktober). Im Frühling sind die Wiesen am Vranica-Gebirge grün, und die Temperaturen sind ideal zum Fahren. Der Herbst bringt trockenere Trails, klare Sicht und bunte Wälder. Im Hochsommer ist es für längere Etappen oft zu heiß. Im Winter liegt auf den Gipfeln bis 2.100 m Schnee.",
    groupHeading: "Kleine Gruppen – früh buchen",
    // TODO: upisati stvarni maksimalan broj vozača po terminu (8 je iz nacrta teksta, nije potvrđen).
    groupText:
      "Pro Termin nehmen wir maximal 8 Fahrer mit, damit jeder individuell betreut wird. Viele Gäste buchen den gleichen Termin mit Freunden. Wenn ihr als Gruppe kommt, fragt am besten früh an. Dein Termin ist ausgebucht? Schreib uns trotzdem. Oft finden wir eine Lösung oder setzen dich auf die Warteliste.",
    cta: { label: "Jetzt Termin anfragen", href: "/de/anmeldung/" },
  },
  en: {
    metaTitle: "Enduro Tour Dates Bosnia | Enduro Drift Bosnien",
    metaDescription:
      "Current dates for enduro tours in Bosnia: choose your tour and preferred date and book early - places are limited.",
    heading: "Enduro Tour Dates 2026 & 2027",
    // TODO: check the response time ("usually within 24 hours").
    intro:
      "All tours start on a Saturday. That way the journey fits easily into your holiday, and flights to Sarajevo are easy to find at weekends. Below you can see all available dates. Choose your preferred date and send us a request. We confirm availability personally, usually within 24 hours.",
    arrivalHeading: "Arrival and departure",
    arrivalIntro:
      "The first night is always the night from Saturday to Sunday. On Sunday you head out onto the trails. The departure day depends on the tour:",
    tours: [
      {
        title: "Tour 1 – Beginner:",
        text: "3 riding days, 4 nights, departure on Wednesday",
      },
      // TODO: the tour cards (tourPricing.ts, homepage and /tours) say Friday for Tour 2 — align.
      // 5 nights from Saturday = Thursday, and arrivalNotice.ts (booking page) already says Thursday.
      {
        title: "Tour 2 – Intermediate:",
        text: "4 riding days, 5 nights, departure on Thursday",
      },
      {
        title: "Tour 3 – Experienced:",
        text: "5 riding days, 7 nights, departure on Saturday",
      },
    ],
    transfer: "Airport transfer from Sarajevo (approx. 2.5 hrs): €70 return.",
    seasonHeading: "When is the best time to travel?",
    seasonText:
      "We ride in spring (May to June) and autumn (September to October). In spring the meadows in the Vranica mountains are green and the temperatures are ideal for riding. Autumn brings drier trails, clear views and colourful forests. In high summer it's often too hot for longer stages. In winter there is snow on the summits up to 2,100 m.",
    groupHeading: "Small groups – book early",
    // TODO: enter the real maximum number of riders per date (8 comes from the draft text, not confirmed).
    groupText:
      "We take a maximum of 8 riders per date, so everyone gets individual attention. Many guests book the same date with friends. If you're coming as a group, it's best to ask early. Your date is fully booked? Write to us anyway. We can often find a solution or put you on the waiting list.",
    cta: { label: "Request a date now", href: "/en/booking/" },
  },
};
