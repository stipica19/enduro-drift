import { MongoClient } from "mongodb";
import { env } from "../src/config/env.js";

const OLD_COLLECTION = "galleryimagemodels";

async function main() {
  if (!env.oldMongoDbName) {
    console.error("Postavi OLD_MONGODB_DB_NAME u .env prije pokretanja.");
    process.exit(1);
  }

  const client = new MongoClient(env.mongoUri);
  await client.connect();

  const oldDb = client.db(env.oldMongoDbName);
  const newDb = client.db(env.mongoDbName);

  const oldImages = await oldDb.collection(OLD_COLLECTION).find({}).toArray();

  let imported = 0;

  for (const old of oldImages) {
    if (!old.url) continue;

    await newDb.collection("gallery").updateOne(
      { publicId: old.public_id ?? old.url },
      {
        $set: {
          url: old.url,
          publicId: old.public_id ?? null,
          createdAt: old.createdAt ? new Date(old.createdAt) : new Date(),
        },
      },
      { upsert: true },
    );

    imported++;
  }

  console.log(`Uvezeno/ažurirano: ${imported} od ${oldImages.length} slika.`);

  await client.close();
}

main();
