// Termin je dostupan dok ima slobodnih mjesta; kad je bookedCount jednak ili veći od
// capacity, nije. Nedostajući bookedCount znači 0 (isto kao u rezervaciji u bookings.ts),
// a nedostajući capacity znači da termin nema mjesta.
export function isTourDateAvailable(capacity: unknown, bookedCount: unknown) {
  return (Number(bookedCount) || 0) < (Number(capacity) || 0);
}

// Broj noćenja po vrsti ture (isto kao na starom sajtu i u arrivalNotice.ts na frontendu)
export const NIGHTS_BY_TOUR_TYPE: Record<string, number> = {
  "Tour 1": 4,
  "Tour 2": 5,
  "Tour 3": 7,
};

// Prvo noćenje je uvijek subota — ako početak termina nije subota, pomakni na prvu sljedeću
export function getSaturdayCheckIn(date: Date) {
  const checkIn = new Date(date);
  checkIn.setUTCHours(0, 0, 0, 0);
  const daysUntilSaturday = (6 - checkIn.getUTCDay() + 7) % 7;
  checkIn.setUTCDate(checkIn.getUTCDate() + daysUntilSaturday);
  return checkIn;
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function calculateStay(tourType: string, tourStart: Date) {
  const nights = NIGHTS_BY_TOUR_TYPE[tourType];
  if (!nights) return null;

  const checkInDate = getSaturdayCheckIn(tourStart);
  const checkOutDate = addDays(checkInDate, nights);

  return { nights, checkInDate, checkOutDate };
}
