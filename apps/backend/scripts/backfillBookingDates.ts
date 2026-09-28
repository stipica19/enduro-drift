import { MongoClient, ObjectId } from "mongodb";
import { env } from "../src/config/env.js";
import { NIGHTS_BY_TOUR_TYPE, addDays } from "../src/services/bookingService.js";

// Uvezene stare prijave (legacyId) često nemaju vlastite datume — stajali su na starom tours
// dokumentu (termin subota→subota). Dolazak se uzima s termina, a odlazak se računa kao u novoj
// formi: dolazak + broj noćenja po vrsti ture. Prijave koje su u staroj bazi imale vlastite
// datume se ne diraju. Bez --apply samo ispisuje što bi upisala.
const OLD_COLLECTION = "anmeldungs";
const APPLY = process.argv.includes("--apply");

function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value as string | number | Date);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function fmt(date?: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "-";
}

// Stara baza ima "tour 1", "Tour 1 " itd. — svodi na ključ iz NIGHTS_BY_TOUR_TYPE
function normalizeTourType(value: unknown) {
  const match = String(value ?? "").match(/tour\s*(\d)/i);
  return match ? `Tour ${match[1]}` : null;
}

async function main() {
  if (!env.oldMongoDbName) {
    console.error("Postavi OLD_MONGODB_DB_NAME u .env prije pokretanja.");
    process.exit(1);
  }

  const client = new MongoClient(env.mongoUri);
  await client.connect();

  const oldDb = client.db(env.oldMongoDbName);
  const bookings = client.db(env.mongoDbName).collection("bookings");

  const legacyBookings = await bookings.find({ legacyId: { $exists: true } }).toArray();

  const oldTours = new Map(
    (await oldDb.collection("tours").find({}).toArray()).map((t) => [t._id.toString(), t]),
  );

  let changed = 0;
  const skipped: string[] = [];

  for (const booking of legacyBookings) {
    const old = ObjectId.isValid(booking.legacyId)
      ? await oldDb.collection(OLD_COLLECTION).findOne({ _id: new ObjectId(booking.legacyId) })
      : null;

    // Gost je u staroj bazi imao vlastite datume — to su stvarni podaci, ne diraj
    if (parseDate(old?.checkIn_date) && parseDate(old?.checkOut_date)) continue;

    const oldTour = old?.tour_number ? oldTours.get(old.tour_number.toString()) : undefined;
    const checkInDate = parseDate(oldTour?.checkIn_date);
    const tourType = normalizeTourType(booking.tourType);
    const nights = tourType ? NIGHTS_BY_TOUR_TYPE[tourType] : undefined;

    if (!checkInDate || !nights) {
      skipped.push(
        `${booking.legacyId} (tura ${booking.tourNumber ?? "-"}, vrsta "${booking.tourType ?? ""}")`,
      );
      continue;
    }

    const checkOutDate = addDays(checkInDate, nights);

    if (
      booking.checkInDate?.getTime() === checkInDate.getTime() &&
      booking.checkOutDate?.getTime() === checkOutDate.getTime()
    ) {
      continue;
    }

    console.log(
      `${booking.legacyId}  tura ${booking.tourNumber ?? "-"}  ${tourType} (${nights} noći)  ` +
        `${fmt(checkInDate)} → ${fmt(checkOutDate)}  (bilo: ${fmt(booking.checkOutDate)})`,
    );

    if (APPLY) {
      await bookings.updateOne({ _id: booking._id }, { $set: { checkInDate, checkOutDate } });
    }
    changed++;
  }

  console.log(`\n${APPLY ? "Upisano" : "Bi se upisalo (dry run)"}: ${changed} prijava.`);
  if (skipped.length) {
    console.log(`Preskočeno (${skipped.length}):\n  ${skipped.join("\n  ")}`);
  }
  if (!APPLY) console.log("Pokreni s --apply za stvarni upis.");

  await client.close();
}

main();
