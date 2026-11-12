import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Mail } from "lucide-react";
import type { EventItem, Faculty, NewsItem, Publication } from "@/lib/types";
import { Badge, Portrait } from "./ui";

export function scholarSearch(title: string) {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(`"${title}"`)}`;
}

export function venueLine(p: Pick<Publication, "venue" | "volume" | "pages">) {
  return [p.venue, p.volume && `vol. ${p.volume}`, p.pages && `pp. ${p.pages}`].filter(Boolean).join(", ");
}

export function PublicationRow({
  pub,
  facultyNames,
  compact = false,
}: {
  pub: Publication;
  facultyNames: Record<string, string>;
  compact?: boolean;
}) {
  const link = pub.doi ? `https://doi.org/${pub.doi}` : pub.url ?? scholarSearch(pub.title);
  return (
    <article className="group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[5.5rem_1fr]">
      <p className="tabular font-display text-[15px] font-bold text-maroon-700">{pub.year ?? "—"}</p>
      <div className="min-w-0">
        <h3 className="font-display text-[17.5px] font-bold leading-snug tracking-[-0.01em] text-navy-900">
          <a href={link} rel="noopener" className="decoration-maroon-700/40 hover:underline">
            {pub.title}
          </a>
        </h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-steel-600">{pub.authors}</p>
        {pub.venue && <p className="mt-0.5 text-[14.5px] italic text-steel-700">{venueLine(pub)}</p>}
        {!compact && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="navy">{pub.type}</Badge>
            {pub.faculty.map((s) => (
              <Link key={s} href={`/people/faculty/${s}/`} className="text-[13px] font-medium text-steel-600 hover:text-maroon-700 hover:underline">
                {facultyNames[s] ?? s}
              </Link>
            ))}
            <a
              href={link}
              rel="noopener"
              className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-maroon-700 hover:underline"
            >
              {pub.doi ? `DOI ${pub.doi}` : "Find this paper"}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export function FacultyCard({ f, showAreas = true }: { f: Faculty; showAreas?: boolean }) {
  return (
    <article className="group relative flex gap-5 border-t border-steel-200 py-6">
      <Portrait src={f.photo} name={f.name} className="h-[7.5rem] w-24 shrink-0 text-xl transition-transform duration-500 group-hover:scale-[1.02]" />
      <div className="min-w-0">
        <h3 className="font-display text-[18px] font-bold leading-tight text-navy-900">
          <Link href={`/people/faculty/${f.slug}/`} className="after:absolute after:inset-0 hover:text-maroon-700">
            {f.name}
          </Link>
        </h3>
        <p className="mt-1 text-[14px] font-medium text-maroon-700">
          {f.designation}
          {f.isHead && <span className="text-steel-600"> · Head of the Department</span>}
        </p>
        {showAreas && f.researchInterests.length > 0 && (
          <p className="mt-2.5 line-clamp-2 text-[14px] leading-relaxed text-steel-600">{f.researchInterests.join(" · ")}</p>
        )}
        {f.email && (
          <a
            href={`mailto:${f.email}`}
            className="relative z-10 mt-2.5 inline-flex max-w-full items-center gap-1.5 text-[13.5px] text-steel-600 hover:text-maroon-700"
          >
            <Mail className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{f.email}</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function formatNewsDate(n: Pick<NewsItem, "date" | "year">) {
  if (n.date)
    return new Date(n.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  if (n.year) return String(n.year);
  return "From the department archive";
}

export function NewsCard({ n, large = false }: { n: NewsItem; large?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col">
      {n.image && (
        <div className={`overflow-hidden bg-steel-100 ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={n.image}
            alt={n.imageAlt ?? ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className={n.image ? "pt-5" : ""}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
          <span className="font-semibold uppercase tracking-[0.08em] text-maroon-700">{n.category}</span>
          <time className="tabular text-steel-500" dateTime={n.date ?? (n.year ? String(n.year) : undefined)}>
            {formatNewsDate(n)}
          </time>
        </p>
        <h3
          className={`mt-2 font-display font-bold leading-snug tracking-[-0.015em] text-navy-900 ${
            large ? "text-[1.6rem]" : "text-[1.15rem]"
          }`}
        >
          <Link href={`/news/${n.slug}/`} className="after:absolute after:inset-0 group-hover:text-maroon-700">
            {n.title}
          </Link>
        </h3>
        {large && <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-steel-600">{n.body}</p>}
      </div>
    </article>
  );
}

export function formatEventDate(e: Pick<EventItem, "start" | "end">) {
  if (!e.start) return "Date to be announced";
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  const s = new Date(e.start);
  const out = s.toLocaleDateString("en-IN", opts);
  const time = e.start.length > 10 ? s.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : null;
  if (e.end && e.end.slice(0, 10) !== e.start.slice(0, 10)) return `${out} – ${new Date(e.end).toLocaleDateString("en-IN", opts)}`;
  return time ? `${out}, ${time}` : out;
}

export function EventCard({ e }: { e: EventItem }) {
  const d = e.start ? new Date(e.start) : null;
  return (
    <article className={`group relative grid grid-cols-[4.5rem_1fr] gap-5 border-t border-steel-200 py-6 ${e.placeholder ? "opacity-90" : ""}`}>
      <div className="flex h-[4.5rem] flex-col items-center justify-center border border-steel-200 bg-white text-center">
        {d ? (
          <>
            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-maroon-700">
              {d.toLocaleDateString("en-IN", { month: "short" })}
            </span>
            <span className="tabular font-display text-[1.6rem] font-extrabold leading-none text-navy-900">{d.getDate()}</span>
          </>
        ) : (
          <CalendarDays className="size-6 text-steel-400" aria-hidden />
        )}
      </div>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="font-semibold uppercase tracking-[0.08em] text-maroon-700">{e.category}</span>
          {e.placeholder && <Badge tone="amber">Placeholder — not a real event</Badge>}
        </p>
        <h3 className="mt-1.5 font-display text-[1.15rem] font-bold leading-snug text-navy-900">
          <Link href={`/events/${e.slug}/`} className="after:absolute after:inset-0 group-hover:text-maroon-700">
            {e.title}
          </Link>
        </h3>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-steel-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            {formatEventDate(e)}
          </span>
          {e.venue && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {e.venue}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
