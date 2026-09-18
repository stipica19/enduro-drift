import { MongoClient } from "mongodb";
import { env } from "../src/config/env.js";
const OLD_COLLECTION = "anmeldungs";
const IMPORT_LAST_N = 25;
function parseDate(value) {
    if (!value)
        return undefined;
    const d = new Date(value);
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
    const lastBookings = await oldDb
        .collection(OLD_COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .limit(IMPORT_LAST_N)
        .toArray();
    // tour_number na anmeldung zapisu je ObjectId referenca na staru tours kolekciju,
    // ne sam broj — treba lookup na pravi tours.tour_number.
    const oldTours = await oldDb.collection("tours").find({}).toArray();
    const tourNumberById = new Map(oldTours.map((t) => [t._id.toString(), Number(t.tour_number)]));
    let imported = 0;
    for (const old of lastBookings) {
        const tourNumber = old.tour_number ? (tourNumberById.get(old.tour_number.toString()) ?? null) : null;
        await newDb.collection("bookings").updateOne({ legacyId: old._id.toString() }, {
            $set: {
                legacyId: old._id.toString(),
                tourNumber,
                tourType: old.tour_type ?? null,
                customer: {
                    name: old.name ?? "",
                    email: old.email ?? "",
                    phone: old.phone || old.mobitel || undefined,
                    address: old.address || undefined,
                },
                participants: old.number_person ?? 1,
                arrivalMethod: old.transport || old.traveling || undefined,
                rentBike: Boolean(old.rentaBike),
                message: old.message || undefined,
                checkInDate: parseDate(old.checkIn_date),
                checkOutDate: parseDate(old.checkOut_date),
                internalNotes: "Uvezeno iz stare baze (zadnjih 25 prijava).",
                createdAt: parseDate(old.createdAt) ?? new Date(),
            },
            $unset: { status: "" },
        }, { upsert: true });
        imported++;
    }
    console.log(`Uvezeno/ažurirano: ${imported} od zadnjih ${IMPORT_LAST_N} prijava.`);
    await client.close();
}
main();
