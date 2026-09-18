export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface TeamContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  headingAccent: string;
  intro: string;
  members: TeamMember[];
}

export const team: Record<"de" | "en", TeamContent> = {
  de: {
    metaTitle: "Unser Team | Enduro Drift Bosnien",
    metaDescription: "Lernen Sie unser Team von erfahrenen Enduro-Guides in Bosnien kennen.",
    heading: "Unser",
    headingAccent: "Team",
    intro:
      "Erfahrene Guides, die Ihnen Sicherheit, Wissen und Leidenschaft für das Enduro-Fahren mit auf den Weg geben.",
    members: [
      {
        name: "Mladen Brnas (Pinky)",
        role: "Leiter des Führungsteams",
        bio: "Der Leiter unseres Teams ist Mladen Brnas, ein langjährig erfahrener Enduro-Fahrer und Fahrlehrer in seiner eigenen Fahrschule. Mladen nimmt an zahlreichen Enduro-Wettbewerben in Bosnien und Herzegowina teil, bei denen er bemerkenswerte Ergebnisse erzielt hat. Besonders beeindruckend waren seine Leistungen bei den Enduro-Rennen in Visoko und Tomislavgrad. Er ist äußerst freundlich und entschlossen, unseren Gästen das Vergnügen des Enduro-Fahrens zu bieten.",
      },
      {
        name: "Dario Brnas",
        role: "Guide für Anfänger",
        bio: "Dario Brnas, obwohl erst 17 Jahre alt, ist bereits ein leidenschaftlicher Enduro-Fahrer und Guide für Anfänger. Mit seiner Begeisterung für das Geländefahren und seinem hervorragenden Wissen über die Strecken hilft Dario denen, die gerade in die Welt des Enduro-Fahrens einsteigen. Seine Geduld, Energie und sein Enthusiasmus machen ihn zum perfekten Guide für Anfänger, denen er Sicherheit und wertvolle Tipps auf jedem Schritt des Weges bietet. Trotz seines jungen Alters zeigt er bereits außergewöhnliches Können und Verantwortungsbewusstsein, sodass jeder Fahrer sein erstes Enduro-Erlebnis in vollen Zügen genießen kann.",
      },
      {
        name: "Anel Tihak",
        role: "Pro Rider",
        bio: "Anel ist ein erfahrener Pro Rider, bekannt für seine unglaubliche Technik und seinen Mut auf den anspruchsvollsten Enduro-Strecken. Mit jahrelanger Erfahrung und der Teilnahme an zahlreichen Wettbewerben ist er für viele Fahrer ein Vorbild geworden. Seine Geschwindigkeit, Präzision und Fähigkeit, Hindernisse zu überwinden, machen ihn zu einem der Besten im Team. Neben seinen erstklassigen Fahrkünsten ist er immer bereit, Tipps zu geben und andere zu motivieren, ihre eigenen Grenzen zu überschreiten.",
      },
    ],
  },
  en: {
    metaTitle: "Our Team | Enduro Drift Bosnien",
    metaDescription: "Meet our team of experienced enduro guides in Bosnia.",
    heading: "Our",
    headingAccent: "Team",
    intro:
      "Experienced guides who bring you safety, knowledge and passion for enduro riding every step of the way.",
    members: [
      {
        name: "Mladen Brnas (Pinky)",
        role: "Head of the Guide Team",
        bio: "The head of our team is Mladen Brnas, a long-time experienced enduro rider and driving instructor at his own driving school. Mladen competes in numerous enduro competitions across Bosnia and Herzegovina, where he has achieved remarkable results. His performances at the enduro races in Visoko and Tomislavgrad were especially impressive. He is extremely friendly and determined to give our guests the pleasure of enduro riding.",
      },
      {
        name: "Dario Brnas",
        role: "Beginner Guide",
        bio: "Dario Brnas, although only 17 years old, is already a passionate enduro rider and guide for beginners. With his enthusiasm for off-road riding and excellent knowledge of the trails, Dario helps those just entering the world of enduro riding. His patience, energy and enthusiasm make him the perfect guide for beginners, offering safety and valuable tips every step of the way. Despite his young age, he already shows exceptional skill and a sense of responsibility, so every rider can fully enjoy their first enduro experience.",
      },
      {
        name: "Anel Tihak",
        role: "Pro Rider",
        bio: "Anel is an experienced pro rider, known for his incredible technique and courage on the most demanding enduro trails. With years of experience and participation in numerous competitions, he has become a role model for many riders. His speed, precision and ability to overcome obstacles make him one of the best on the team. Besides his top-class riding skills, he is always ready to give tips and motivate others to push their own limits.",
      },
    ],
  },
};
