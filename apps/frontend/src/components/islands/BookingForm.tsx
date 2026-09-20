import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/apiClient";
import { bookingForm } from "../../content/site/bookingForm";
import { fetchTourDates, formatTourDateLabel } from "../../lib/tourDates";

interface TourDateOption {
  id: string;
  label: string;
}

interface Props {
  tours: string[];
  tourDates: TourDateOption[];
  // Trebaju za sastavljanje oznaka termina kad se popis osvježi u browseru
  dateLabelPrefix: string;
  dateLocale: string;
  initialTour?: string;
  lang?: "de" | "en";
}

interface FormState {
  tourId: string;
  tourDateId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  participants: string;
  arrivalMethod: string;
  rentBike: string;
  message: string;
}

const initialState: FormState = {
  tourId: "",
  tourDateId: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  participants: "3",
  arrivalMethod: "",
  rentBike: "nein",
  message: "",
};

export default function BookingForm({
  tours,
  tourDates,
  dateLabelPrefix,
  dateLocale,
  initialTour,
  lang = "de",
}: Props) {
  const t = bookingForm[lang];
  const [dateOptions, setDateOptions] = useState(tourDates);
  const [form, setForm] = useState<FormState>({
    ...initialState,
    tourId: initialTour && tours.includes(initialTour) ? initialTour : "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Stranica je statična (SSG) — Astro.url.searchParams na serveru nema pristup
  // stvarnom query stringu iz browsera, pa ?tour= čitamo ovdje, na klijentu.
  useEffect(() => {
    const tourFromUrl = new URLSearchParams(window.location.search).get("tour");

    if (tourFromUrl && tours.includes(tourFromUrl)) {
      setForm((prev) => ({ ...prev, tourId: tourFromUrl }));
    }
  }, [tours]);

  // Popis termina iz builda je zastario čim se netko prijavi (stranica je statična),
  // pa se pri učitavanju osvježi iz API-ja. Ako API ne odgovori, ostaje popis iz builda.
  useEffect(() => {
    let cancelled = false;

    fetchTourDates().then((list) => {
      if (cancelled || !list) return;

      const options = list
        .filter((d) => d.available)
        .map((d) => ({ id: d._id, label: formatTourDateLabel(d, dateLabelPrefix, dateLocale) }));

      setDateOptions(options);
      // Ako je odabrani termin u međuvremenu postao pun, ne ostavljaj ga odabranog
      setForm((prev) =>
        options.some((o) => o.id === prev.tourDateId) ? prev : { ...prev, tourDateId: "" },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [dateLabelPrefix, dateLocale]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        tourId: form.tourId,
        tourDateId: form.tourDateId,
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          address: form.address || undefined,
        },
        participants: Number(form.participants),
        arrivalMethod: form.arrivalMethod || undefined,
        rentBike: form.rentBike === "ja",
        message: form.message || undefined,
        lang,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.code === "NOT_ENOUGH_SPOTS" ? t.notEnoughSpots : t.error);
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm(initialState);
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-center text-green-700">
        {t.success}
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 transition-colors placeholder:text-neutral-400 hover:border-neutral-300 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10";

  const labelClass =
    "mb-2 block text-sm font-medium text-neutral-700";

  const radioLabelClass =
    "flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 transition-colors hover:border-neutral-300 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 has-[:checked]:text-red-700";

  const radioClass =
    "h-4 w-4 shrink-0 accent-red-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600";

  return (
    <form
      onSubmit={handleSubmit}
      className=" bg-white p-3  sm:p-8"
      aria-busy={status === "loading"}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {t.heading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {t.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-tour" className={labelClass}>
            {t.tourLabel} <span className="text-red-600">*</span>
          </label>
          <select
            id="booking-tour"
            name="tourId"
            value={form.tourId}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">{t.choosePlaceholder}</option>
            {tours.map((tour) => (
              <option key={tour} value={tour}>
                {tour}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="booking-date" className={labelClass}>
            {t.dateLabel} <span className="text-red-600">*</span>
          </label>
          <select
            id="booking-date"
            name="tourDateId"
            value={form.tourDateId}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">{t.choosePlaceholder}</option>
            {dateOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="my-2 border-t border-neutral-100 sm:col-span-2" />

        <div>
          <label htmlFor="booking-name" className={labelClass}>
            {t.nameLabel} <span className="text-red-600">*</span>
          </label>
          <input
            id="booking-name"
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder={t.namePlaceholder}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="booking-email" className={labelClass}>
            {t.emailLabel} <span className="text-red-600">*</span>
          </label>
          <input
            id="booking-email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder={t.emailPlaceholder}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="booking-phone" className={labelClass}>
            {t.phoneLabel}
          </label>
          <input
            id="booking-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder={t.phonePlaceholder}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="booking-participants" className={labelClass}>
            {t.participantsLabel} <span className="text-red-600">*</span>
            <span className="ml-2 font-normal text-neutral-500">
              {t.participantsHint}
            </span>
          </label>
          <input
            id="booking-participants"
            type="number"
            name="participants"
            min={3}
            step={1}
            value={form.participants}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="booking-address" className={labelClass}>
            {t.addressLabel}
          </label>
          <input
            id="booking-address"
            type="text"
            name="address"
            autoComplete="street-address"
            value={form.address}
            onChange={handleChange}
            placeholder={t.addressPlaceholder}
            className={inputClass}
          />
        </div>

        <div className="my-2 border-t border-neutral-100 sm:col-span-2" />

        <fieldset className="min-w-0">
          <legend className={labelClass}>{t.arrivalLabel}</legend>
          <div className="flex flex-wrap gap-3">
            <label className={radioLabelClass}>
              <input
                type="radio"
                name="arrivalMethod"
                value="flugzeug"
                checked={form.arrivalMethod === "flugzeug"}
                onChange={handleChange}
                className={radioClass}
              />
              {t.arrivalFlight}
            </label>

            <label className={radioLabelClass}>
              <input
                type="radio"
                name="arrivalMethod"
                value="auto"
                checked={form.arrivalMethod === "auto"}
                onChange={handleChange}
                className={radioClass}
              />
              {t.arrivalCar}
            </label>
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className={labelClass}>
            {t.rentBikeLabel}
          </legend>
          <div className="flex flex-wrap gap-3">
            <label className={radioLabelClass}>
              <input
                type="radio"
                name="rentBike"
                value="ja"
                checked={form.rentBike === "ja"}
                onChange={handleChange}
                className={radioClass}
              />
              {t.yes}
            </label>

            <label className={radioLabelClass}>
              <input
                type="radio"
                name="rentBike"
                value="nein"
                checked={form.rentBike === "nein"}
                onChange={handleChange}
                className={radioClass}
              />
              {t.no}
            </label>
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="booking-message" className={labelClass}>
            {t.messageLabel}
            <span className="ml-2 font-normal text-neutral-500">
              {t.messageOptional}
            </span>
          </label>
          <textarea
            id="booking-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder={t.messagePlaceholder}
            className={`${inputClass} min-h-32 resize-y`}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          <span className="text-red-600">*</span> {t.requiredNote}
        </p>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-red-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? t.submitting : t.submit}
        </button>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700"
        >
          {errorMessage || t.error}
        </p>
      )}
    </form>
  );
}
