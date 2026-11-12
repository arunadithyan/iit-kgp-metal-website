import type { Metadata } from "next";
import { getNews, splitEvents } from "@/lib/content";
import { Container, EmptyState, PageHero } from "@/components/ui";
import { EventCard, NewsCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "Events & News",
  description: "Seminars, conferences, workshops and news from the Department of Metallurgical and Materials Engineering, IIT Kharagpur.",
  alternates: { canonical: "/events-news/" },
};

const EVENT_TYPES = [
  "International conferences",
  "National conferences",
  "Workshops",
  "Faculty seminars",
  "Distinguished lectures",
  "Department symposiums",
  "Student activities",
  "Research workshops",
];

export default function EventsNewsPage() {
  const { upcoming, past, placeholders } = splitEvents();
  const news = getNews();
  const categories = [...new Set(news.map((n) => n.category))];
  return (
    <>
      <PageHero
        title="Events & News"
        crumbs={[{ label: "Home", href: "/" }, { label: "Events & News" }]}
        intro="Conferences, seminars, distinguished lectures and workshops hosted by the Department, alongside news of faculty, student and alumni achievements."
      >
        <nav aria-label="On this page" className="mt-8 flex gap-6 text-[15px] font-semibold">
          <a href="#events" className="text-white underline-offset-4 hover:underline">Events</a>
          <a href="#news" className="text-white underline-offset-4 hover:underline">News</a>
        </nav>
      </PageHero>

      <section id="events" className="py-16 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.03em] text-navy-900">Events</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-steel-600">The Department lists:</p>
            <ul className="mt-3 space-y-1.5 text-[14.5px] text-steel-700">
              {EVENT_TYPES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">Upcoming</h3>
            {upcoming.length ? (
              <div className="mt-2 border-b border-steel-200">
                {upcoming.map((e) => (
                  <EventCard key={e.slug} e={e} />
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="No upcoming events have been announced">
                  New seminars, lectures and conferences will appear here with their dates, venues, speakers and registration links.
                </EmptyState>
              </div>
            )}

            {past.length > 0 && (
              <>
                <h3 className="mt-14 text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">Past events</h3>
                <div className="mt-2 border-b border-steel-200">
                  {past.map((e) => (
                    <EventCard key={e.slug} e={e} />
                  ))}
                </div>
              </>
            )}

            {placeholders.length > 0 && (
              <div className="mt-14 border border-amber-200 bg-amber-50/50 p-6">
                <h3 className="font-display text-lg font-bold text-navy-900">Example entries</h3>
                <p className="mt-1 max-w-[64ch] text-[14.5px] text-steel-700">
                  These placeholders show how events will look. They are not real events. Replace or delete them in the content manager.
                </p>
                <div className="mt-2">
                  {placeholders.map((e) => (
                    <EventCard key={e.slug} e={e} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section id="news" className="border-t border-steel-200 bg-steel-50 py-16 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.03em] text-navy-900">News</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-steel-600">
              Faculty achievements, awards, student achievements, alumni news and department announcements.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c} className="border border-steel-300 bg-white px-3 py-1 text-[13px] text-steel-700">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
              {news.map((n, i) => (
                <div key={n.slug} className={`border-t border-steel-200 py-7 ${i === 0 ? "md:col-span-2" : ""}`}>
                  <NewsCard n={n} large={i === 0} />
                </div>
              ))}
            </div>
            <p className="mt-8 text-[13.5px] text-steel-500">
              Items marked “From the department archive” are listed on the IIT Kharagpur department page without a date.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
