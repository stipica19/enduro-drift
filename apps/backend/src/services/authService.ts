import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  return bcrypt.compare(password, stored);
}

// Hash slučajne lozinke koju niko ne zna — služi samo da provjera za nepostojeći email traje
// jednako dugo kao za postojeći. Bez toga brz odgovor odaje da taj korisnik ne postoji.
const DUMMY_HASH = "$2b$12$bAvvZZ1bJlBrF/zhqa2igefnvK07eZ2mkYrDi.gpEVUqbZDphiHCy";

/** Uvijek vraća false, ali potroši isto vrijeme kao prava provjera lozinke. */
export async function burnPasswordTime(password: string): Promise<boolean> {
  await bcrypt.compare(password, DUMMY_HASH);
  return false;
}
