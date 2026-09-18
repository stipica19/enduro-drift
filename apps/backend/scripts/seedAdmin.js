import { MongoClient } from "mongodb";
import { hashPassword } from "../src/services/authService.js";
import { env } from "../src/config/env.js";
async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        console.error("Postavi ADMIN_EMAIL i ADMIN_PASSWORD u .env prije pokretanja skripte.");
        process.exit(1);
    }
    const client = new MongoClient(env.mongoUri);
    await client.connect();
    const db = client.db(env.mongoDbName);
    const passwordHash = await hashPassword(password);
    await db.collection("adminUsers").updateOne({ email }, { $set: { email, passwordHash } }, { upsert: true });
    console.log(`Admin korisnik "${email}" je spreman.`);
    await client.close();
}
main();
