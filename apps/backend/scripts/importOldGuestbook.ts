import { MongoClient } from "mongodb";
import { env } from "../src/config/env.js";

const OLD_COLLECTION = "guestbooks";
const IMPORT_FIRST_N = 10;

function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value as string | number | Date);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function main() {
  if (!env.oldMongoDbName) {
    console.error("Postavi OLD_MONGODB_DB_NAME u .env prije pokretanja.");
    process.exit(1);
  }

  const client = new MongoClient(env.mongoUri);
  await client.connect();

  const oldDb = client.db(env.oldMongoDbName);
  const newDb = client.db(env.mongoDbName);

  const oldEntries = await oldDb
    .collection(OLD_COLLECTION)
    .find({})
    .sort({ createdAt: 1 })
    .limit(IMPORT_FIRST_N)
    .toArray();

  // Drugi pokreni ove skripte ne bi trebali ostaviti stare guestbook zapise
  // koji više nisu dio odabranih "prvih N" — obriši ih prije ponovnog uvoza.
  await newDb.collection("reviews").deleteMany({ source: "guestbook" });

  let imported = 0;

  for (const old of oldEntries) {
    if (!old.name || !old.message) continue;

    await newDb.collection("reviews").updateOne(
      { legacyId: old._id.toString() },
      {
        $set: {
          legacyId: old._id.toString(),
          name: old.name,
          city: old.city?.trim() || undefined,
          text: old.message,
          rating: null,
          source: "guestbook",
          isVisible: Boolean(old.isVisible),
          date: parseDate(old.createdAt) ?? new Date(),
        },
      },
      { upsert: true },
    );

    imported++;
  }

  console.log(`Uvezeno: ${imported} (prvih ${IMPORT_FIRST_N} po datumu) iz gostinjske knjige.`);

  await client.close();
}

main();
