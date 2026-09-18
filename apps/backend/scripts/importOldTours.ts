import { MongoClient } from "mongodb";
import { env } from "../src/config/env.js";

async function main() {
  if (!env.oldMongoDbName) {
    console.error("Postavi OLD_MONGODB_DB_NAME u .env prije pokretanja.");
    process.exit(1);
  }

  const client = new MongoClient(env.mongoUri);
  await client.connect();

  const oldDb = client.db(env.oldMongoDbName);
  const newDb = client.db(env.mongoDbName);

  const oldTours = await oldDb.collection("tours").find({}).toArray();
  const activeTours = oldTours.filter((t) => Number(t.tour_number) >= 500);

  let imported = 0;

  for (const old of activeTours) {
    const startDate = new Date(old.checkIn_date);
    const season = String(startDate.getFullYear());

    await newDb.collection("tourDates").updateOne(
      { number: Number(old.tour_number) },
      {
        $set: {
          number: Number(old.tour_number),
          season,
          startDate,
          endDate: new Date(old.checkOut_date),
          capacity: old.tour_space ?? 8,
          bookedCount: old.tour_availability ? 0 : (old.tour_space ?? 8),
        },
      },
      { upsert: true },
    );

    imported++;
  }

  console.log(
    `Uvezeno/ažurirano ${imported} od ${oldTours.length} starih zapisa (${oldTours.length - imported} preskočeno, tour_number < 500 — završeni termini).`,
  );

  await client.close();
}

main();
