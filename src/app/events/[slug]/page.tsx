import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Mic } from "lucide-react";
import { getEvent, getEvents } from "@/lib/content";
import { Badge, ButtonLink, Container, PageHero, TextLink } from "@/components/ui";
import { formatEventDate } from "@/components/cards";

export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = getEvent((await params).slug);
  if (!e) return {};
  return {
    title: e.title,
    description: e.body.slice(0, 160),
    alternates: { canonical: `/events/${e.slug}/` },
    robots: e.placeholder ? { index: false } : undefined,
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = getEvent((await params).slug);
  if (!e) notFound();
  const past = e.start ? (e.end ?? e.start) < new Date().toISOString().slice(0, 10) : false;
  return (
    <>
      <PageHero
        title={e.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Events & News", href: "/events-news/#events" }, { label: e.category }]}
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-[15px] font-semibold uppercase tracking-[0.08em] text-maroon-100">{e.category}</span>
          {e.placeholder && <Badge tone="amber">Placeholder — not a real event</Badge>}
        </div>
      </PageHero>
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_22rem] lg:gap-16 lg:py-16">
        <article>
          {e.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={e.poster} alt={`Poster for ${e.title}`} className="mb-10 w-full max-w-xl border border-steel-200" />
          )}
          <div className="prose-body max-w-[68ch] text-[17.5px] leading-relaxed text-steel-700">
            {e.body.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {e.speakers.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold text-navy-900">Speakers</h2>
              <ul className="mt-4 divide-y divide-steel-200 border-y border-steel-200">
                {e.speakers.map((s) => (
                  <li key={s.name} className="flex gap-3 py-4">
                    <Mic className="mt-1 size-4 text-maroon-700" aria-hidden />
                    <span>
                      <span className="block font-semibold text-navy-900">{s.name}</span>
                      {s.affiliation && <span className="text-[14.5px] text-steel-600">{s.affiliation}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {past && e.gallery.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold text-navy-900">Photo gallery</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {e.gallery.map((g) => (
                  <li key={g}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <TextLink href="/events-news/#events" className="mt-10">
            All events
          </TextLink>
        </article>
        <aside className="self-start border border-steel-200 bg-steel-50 p-6">
          <dl className="space-y-4 text-[15px]">
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-maroon-700" aria-hidden />
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">Date and time</dt>
                <dd className="mt-0.5 text-navy-900">{formatEventDate(e)}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-maroon-700" aria-hidden />
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">Venue</dt>
                <dd className="mt-0.5 text-navy-900">{e.venue ?? "To be announced"}</dd>
              </div>
            </div>
          </dl>
          {e.registrationUrl && !past && (
            <div className="mt-6">
              <ButtonLink href={e.registrationUrl}>Register</ButtonLink>
            </div>
          )}
        </aside>
      </Container>
    </>
  );
}
