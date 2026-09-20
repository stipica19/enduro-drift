import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { blogTranslations } from "@/content/blogTranslations.mjs";

export type Lang = "de" | "en";
export type BlogPost = CollectionEntry<"blog">;

const translations: Record<string, string> = blogTranslations;

export const blogPath = (lang: Lang, slug: string) => `/${lang}/blog/${slug}/`;

export const slugOf = (post: BlogPost) => post.id.replace(/^(de|en)\//, "");

/** Objave jednog jezika, najnovije prve. */
export async function getPosts(lang: Lang) {
  const all = await getCollection("blog");
  return all
    .filter((post) => post.id.startsWith(`${lang}/`))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** de↔en putanje za hreflang i jezički prekidač; undefined ako objava nema prijevod u mapi. */
export function blogAlternates(lang: Lang, slug: string): { de: string; en: string } | undefined {
  const deSlug = lang === "de" ? slug : Object.keys(translations).find((de) => translations[de] === slug);
  const enSlug = lang === "en" ? slug : translations[slug];
  if (!deSlug || !enSlug) return undefined;
  return { de: blogPath("de", deSlug), en: blogPath("en", enSlug) };
}
