import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { apiFetch } from "../../lib/apiClient";

interface Booking {
  _id: string;
  tourNumber: number | null;
  tourType?: string | null;
  customer: {
    name: string;
    email: string;
    address?: string;
  };
  participants: number;
  arrivalMethod?: string;
  rentBike?: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  createdAt: string;
}

function formatDate(iso?: string, full = false) {
  if (!iso) return "-";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("de-DE", {
    ...(full ? { weekday: "long" as const } : {}),
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function computeNights(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return null;

  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }

  return Math.round((end - start) / 86_400_000);
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "search" | "arrow" | "close" | "logout" | "calendar" | "users";
  className?: string;
}) {
  const paths: Record<typeof name, ReactNode> = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    logout: (
      <>
        <path d="M9 4H5v16h4M10 12h10m-4-4 4 4-4 4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-4-5.65" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-medium leading-6 text-slate-900">
        {children}
      </dd>
    </div>
  );
}

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2";

export default function AdminBookingsList() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await apiFetch("/api/admin/bookings");

        if (!active) return;

        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        if (!res.ok) {
          throw new Error("Greška pri učitavanju prijava.");
        }

        const data: Booking[] = await res.json();

        if (active) setBookings(data);
      } catch {
        if (active) {
          setError("Prijave nije moguće učitati. Pokušaj ponovno.");
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;

    if (!dialog.open) dialog.showModal();

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      if (dialog.open) dialog.close();
    };
  }, [selected]);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError(null);

    try {
      const res = await apiFetch("/api/admin/auth/logout", {
        method: "POST",
      });

      if (!res.ok && res.status !== 401) {
        throw new Error("Logout failed");
      }

      window.location.href = "/admin/login";
    } catch {
      setLogoutError("Odjava nije uspjela. Pokušaj ponovno.");
      setLoggingOut(false);
    }
  }

  function closeDetails() {
    dialogRef.current?.close();
  }

  const query = search.trim().toLocaleLowerCase();

  const filteredBookings = (bookings ?? []).filter((booking) =>
    [
      booking.customer.name,
      booking.customer.email,
      booking.tourNumber,
      booking.tourType,
    ].some((value) =>
      String(value ?? "")
        .toLocaleLowerCase()
        .includes(query),
    ),
  );

  const totalParticipants = (bookings ?? []).reduce(
    (sum, booking) => sum + booking.participants,
    0,
  );

  const nights = selected
    ? computeNights(selected.checkInDate, selected.checkOutDate)
    : null;

  return (
    <div className="min-h-screen  bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              Administracija
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Prijave
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Pregled rezervacija, sudionika i detalja putovanja.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60 ${focusClass}`}
          >
            <Icon name="logout" className="h-4 w-4" />
            {loggingOut ? "Odjava..." : "Odjava"}
          </button>
        </header>

        {logoutError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {logoutError}
          </p>
        )}

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Ukupno prijava",
              value: bookings?.length ?? "-",
              icon: "calendar" as const,
              color: "bg-red-50 text-red-600",
            },
            {
              label: "Ukupno sudionika",
              value: bookings ? totalParticipants : "-",
              icon: "users" as const,
              color: "bg-indigo-50 text-indigo-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon name={item.icon} className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings panel */}
        <section
          aria-label="Popis prijava"
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold">Sve prijave</h2>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {bookings?.length ?? "-"}
              </span>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                aria-label="Pretraži prijave"
                placeholder="Pretraži ime, email, turu..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/15"
              />
            </div>
          </div>

          {error ? (
            <div role="alert" className="p-8 text-center">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={`mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 ${focusClass}`}
              >
                Pokušaj ponovno
              </button>
            </div>
          ) : !bookings ? (
            <div role="status" className="p-6">
              <span className="sr-only">Učitavanje prijava...</span>
              <div
                aria-hidden="true"
                className="space-y-4 motion-safe:animate-pulse"
              >
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-16 rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Icon name="search" className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">
                {query ? "Nema pronađenih prijava" : "Još nema prijava"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {query
                  ? "Pokušaj s drugim imenom, emailom ili brojem ture."
                  : "Nove prijave prikazat će se ovdje."}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredBookings.map((booking) => (
                  <article key={booking._id} className="p-5">
                    <div className="flex items-start gap-3">
                   
                      <div className="min-w-0 flex-1">
                        <h3 className="wrap-break-words font-semibold">
                          {booking.customer.name}
                        </h3>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {booking.customer.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Tura {booking.tourNumber ?? "-"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-500">
                        {formatDate(booking.createdAt)}
                        <span className="mx-2">·</span>
                        Osobe: {booking.participants}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelected(booking)}
                        aria-label={`Detalji prijave: ${booking.customer.name}`}
                        className={`inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 ${focusClass}`}
                      >
                        Detalji
                        <Icon name="arrow" className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Prijave za putovanja i podaci o sudionicima
                  </caption>
                  <thead className="border-b border-slate-100 bg-slate-50/80 text-xs text-slate-500">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Korisnik
                      </th>
                      <th scope="col" className="px-5 py-4 font-medium">
                        Tura
                      </th>
                      <th scope="col" className="px-5 py-4 font-medium">
                        Osobe
                      </th>
                      <th scope="col" className="px-5 py-4 font-medium">
                        Datum prijave
                      </th>
                      <th scope="col" className="px-6 py-4">
                        <span className="sr-only">Detalji</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            
                            <div>
                              <p className="font-semibold text-slate-900">
                                {booking.customer.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {booking.customer.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                            #{booking.tourNumber ?? "-"}
                          </span>
                          {booking.tourType && (
                            <p className="mt-1.5 text-xs text-slate-500">
                              {booking.tourType}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                            <Icon
                              name="users"
                              className="h-4 w-4 text-slate-400"
                            />
                            {booking.participants}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <p className="text-slate-700">
                            {formatDate(booking.createdAt)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatTime(booking.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelected(booking)}
                            aria-label={`Detalji prijave: ${booking.customer.name}`}
                            className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 ${focusClass}`}
                          >
                            Detalji
                            <Icon name="arrow" className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {bookings && !error && (
            <div
              role="status"
              className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500"
            >
              Prikazano {filteredBookings.length} od {bookings.length} prijava
            </div>
          )}
        </section>
      </div>

      {/* Details dialog */}
      <dialog
        ref={dialogRef}
        aria-labelledby="booking-dialog-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;

          const rect = event.currentTarget.getBoundingClientRect();

          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            closeDetails();
          }
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm"
      >
        {selected && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Pregled rezervacije
                </p>
                <h2
                  id="booking-dialog-title"
                  className="mt-1 text-xl font-bold tracking-tight"
                >
                  Detalji prijave
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDetails}
                aria-label="Zatvori detalje"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 ${focusClass}`}
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              {/* Customer */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                 
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold">
                      {selected.customer.name}
                    </h3>
                    <a
                      href={`mailto:${selected.customer.email}`}
                      className={`mt-1 inline-block break-all rounded text-sm text-slate-500 hover:text-red-700 hover:underline ${focusClass}`}
                    >
                      {selected.customer.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Trip dates */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
                  <Icon
                    name="calendar"
                    className="h-4 w-4 text-red-600"
                  />
                  Informacije o putovanju
                </div>

                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <DetailItem label="Dolazak · prvo noćenje">
                    {formatDate(selected.checkInDate, true)}
                  </DetailItem>
                  <DetailItem label="Odlazak">
                    {formatDate(selected.checkOutDate, true)}
                  </DetailItem>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                  <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    Noćenja: {nights ?? "-"}
                  </span>
                  <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    Osobe: {selected.participants}
                  </span>
                </div>
              </div>

              {/* Additional details */}
              <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <DetailItem label="Broj ture">
                  {selected.tourNumber ?? "-"}
                </DetailItem>
                <DetailItem label="Vrsta ture">
                  {selected.tourType || "-"}
                </DetailItem>
                <DetailItem label="Adresa">
                  {selected.customer.address || "-"}
                </DetailItem>
                <DetailItem label="Način dolaska">
                  {selected.arrivalMethod || "-"}
                </DetailItem>
                <DetailItem label="Najam bicikla">
                  {selected.rentBike == null
                    ? "-"
                    : selected.rentBike
                      ? "Da"
                      : "Ne"}
                </DetailItem>
                <DetailItem label="Datum prijave">
                  {formatDate(selected.createdAt)}
                  <span className="ml-2 font-normal text-slate-500">
                    {formatTime(selected.createdAt)}
                  </span>
                </DetailItem>
              </dl>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={closeDetails}
                className={`w-full rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto ${focusClass}`}
              >
                Zatvori pregled
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}