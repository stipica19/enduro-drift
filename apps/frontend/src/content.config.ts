import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    // Cijeli <title> tag (s brendom) kad je naslov objave predug za SERP; inače je naslov + brend.
    metaTitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    // Datum zadnje izmjene, ide u Article shemu (dateModified) samo ako je zadan.
    updated: z.coerce.date().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
