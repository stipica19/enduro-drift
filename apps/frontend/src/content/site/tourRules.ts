export interface TourRulesContent {
  heading: string;
  headingAccent: string;
  rules: string[];
  warning: string;
}

export const tourRules: Record<"de" | "en", TourRulesContent> = {
  de: {
    heading: "Tour-",
    headingAccent: "Regeln",
    rules: [
      "Stellen Sie sicher, dass Ihr Motorrad bereit für die Tour ist",
      "Verlassen Sie die Spur nicht",
      "Ein kleines Erste-Hilfe-Set ist erforderlich",
      "Suchen Sie nicht nach dem Guide, er wird zu Ihnen zurückkommen",
      "Befolgen Sie die Verkehrszeichen und respektieren Sie den Verkehr",
      "Überholen Sie Ihren Guide nicht",
      "Ihr Motorrad reicht vollgetankt für 100 km pro Tag",
      "Nehmen Sie mindestens 1,5 Liter Wasser mit",
      "Nehmen Sie Ihr Handy mit",
      "Nehmen Sie ein paar Bolzen mit",
      "Nehmen Sie Metallkleber mit, um Abdeckungen zu befestigen",
      "Motorradwerkzeug wird benötigt",
      "Wenn Sie mit Schläuchen fahren, nehmen Sie den zweiten Schlauch und eine Pumpe mit",
      "Ersatz-Bremshebel und Kupplungshebel mitnehmen",
      "Geld für das Mittagessen mitnehmen",
    ],
    warning:
      "Falls Sie sich nicht an unsere Unternehmensregeln halten, wird Ihnen jede benötigte Unterstützung extra in Rechnung gestellt.",
  },
  en: {
    heading: "Tour",
    headingAccent: "Rules",
    rules: [
      "Make sure your motorcycle is ready for the tour",
      "Do not leave the trail",
      "A small first-aid kit is required",
      "Don't go looking for the guide - they will come back to you",
      "Follow traffic signs and respect other road users",
      "Do not overtake your guide",
      "A full tank gets your motorcycle through 100 km per day",
      "Bring at least 1.5 litres of water",
      "Bring your mobile phone",
      "Bring a few spare bolts",
      "Bring metal glue to secure panels",
      "Motorcycle tools are required",
      "If you're riding with inner tubes, bring a spare tube and a pump",
      "Bring a spare brake and clutch lever",
      "Bring money for lunch",
    ],
    warning:
      "If you do not follow our company rules, any support you require will be charged extra.",
  },
};
