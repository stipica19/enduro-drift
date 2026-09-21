export interface BlogArticleContent {
  relatedHeading: string;
}

export const blogArticle: Record<"de" | "en", BlogArticleContent> = {
  de: {
    relatedHeading: "Weitere Beiträge",
  },
  en: {
    relatedHeading: "More from the blog",
  },
};

export interface LatestPostsContent {
  heading: string;
  intro: string;
  allLabel: string;
  allHref: string;
}

export const latestPosts: Record<"de" | "en", LatestPostsContent> = {
  de: {
    heading: "Aus dem Blog",
    intro: "Tipps, Tourberichte und Neuigkeiten rund um Enduro in Bosnien.",
    allLabel: "Alle Beiträge ansehen",
    allHref: "/de/blog/",
  },
  en: {
    heading: "From the Blog",
    intro: "Tips, tour stories and news about enduro in Bosnia.",
    allLabel: "View all posts",
    allHref: "/en/blog/",
  },
};
