import { MongoClient, ObjectId } from "mongodb";
import { env } from "../src/config/env.js";
// TODO: sve cijene/datume/kapacitete potvrditi sa vlasnikom prije produkcije —
// ovo su placeholder vrijednosti preuzete sa starog sajta radi testiranja.
const tours = [
    {
        slug: "einsteiger",
        lang: "de",
        title: "Ideal für Einsteiger & Genussfahrer",
        difficulty: "medium",
        pricing: { ownBike: 490, rentalBike: 790 },
        included: ["3 Tage geführtes Endurofahren", "4 Übernachtungen, Frühstück, Guide"],
        excluded: ["Abendessen in der Stadt", "Vignette: 25 €/Monat (eigenes Motorrad)"],
    },
    {
        slug: "bestseller",
        lang: "de",
        title: "Unser Bestseller - perfekt für Fortgeschrittene",
        difficulty: "medium",
        pricing: { ownBike: 590, rentalBike: 890 },
        included: ["4 Tage geführtes Endurofahren", "5 Übernachtungen, Frühstück, Guide"],
        excluded: ["Abendessen in der Stadt", "Vignette: 25 €/Monat (eigenes Motorrad)"],
    },
    {
        slug: "maximale-herausforderung",
        lang: "de",
        title: "Maximale Herausforderung für erfahrene Fahrer",
        difficulty: "hard",
        pricing: { ownBike: 790, rentalBike: 1190 },
        included: ["5 Tage geführtes Endurofahren", "7 Übernachtungen, Frühstück, Guide"],
        excluded: ["Abendessen in der Stadt", "Vignette: 25 €/Monat (eigenes Motorrad)"],
    },
];
// Datumi + brojevi termina sa starog sajta (screenshot /anmeldung), samo za test podatke.
const rawDates = [
    { number: 509, season: "2026", startDate: "2026-09-12", endDate: "2026-09-19", available: false },
    { number: 510, season: "2026", startDate: "2026-09-19", endDate: "2026-09-26", available: false },
    { number: 511, season: "2026", startDate: "2026-09-26", endDate: "2026-10-03", available: true },
    { number: 512, season: "2026", startDate: "2026-10-03", endDate: "2026-10-10", available: true },
    { number: 513, season: "2026", startDate: "2026-10-10", endDate: "2026-10-17", available: true },
    { number: 514, season: "2026", startDate: "2026-10-17", endDate: "2026-10-24", available: true },
    { number: 515, season: "2026", startDate: "2026-10-24", endDate: "2026-10-31", available: true },
    { number: 600, season: "2027", startDate: "2027-05-01", endDate: "2027-05-08", available: true },
    { number: 601, season: "2027", startDate: "2027-05-08", endDate: "2027-05-15", available: true },
    { number: 602, season: "2027", startDate: "2027-05-15", endDate: "2027-05-22", available: true },
    { number: 603, season: "2027", startDate: "2027-05-22", endDate: "2027-05-29", available: true },
    { number: 604, season: "2027", startDate: "2027-05-29", endDate: "2027-06-05", available: true },
    { number: 605, season: "2027", startDate: "2027-06-05", endDate: "2027-06-12", available: true },
    { number: 606, season: "2027", startDate: "2027-06-12", endDate: "2027-06-19", available: true },
];
async function main() {
    const client = new MongoClient(env.mongoUri);
    await client.connect();
    const db = client.db(env.mongoDbName);
    const tourIds = [];
    for (const tour of tours) {
        const result = await db
            .collection("tours")
            .findOneAndUpdate({ slug: tour.slug, lang: tour.lang }, { $set: tour }, { upsert: true, returnDocument: "after" });
        if (result?._id)
            tourIds.push(result._id.toString());
    }
    await db.collection("tourDates").deleteMany({});
    const tourDates = rawDates.map((d, i) => ({
        tourId: new ObjectId(tourIds[i % tourIds.length]),
        number: d.number,
        season: d.season,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        capacity: 8,
        bookedCount: d.available ? 0 : 8,
    }));
    await db.collection("tourDates").insertMany(tourDates);
    console.log(`Seedano: ${tours.length} ture, ${tourDates.length} termina.`);
    await client.close();
}
main();
