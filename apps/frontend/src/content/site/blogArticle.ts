export interface BlogArticleContent {
  breadcrumbHome: string;
  breadcrumbBlog: string;
  relatedHeading: string;
}

export const blogArticle: Record<"de" | "en", BlogArticleContent> = {
  de: {
    breadcrumbHome: "Startseite",
    breadcrumbBlog: "Blog",
    relatedHeading: "Weitere Beiträge",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbBlog: "Blog",
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
