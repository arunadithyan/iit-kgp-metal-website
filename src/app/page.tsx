import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  getAreas,
  getCurrentProjects,
  getFaculty,
  getFunders,
  getHead,
  getLabs,
  getNews,
  getPublications,
  getSite,
  facultyForArea,
  publicationsByYear,
  splitEvents,
} from "@/lib/content";
import { ButtonLink, Container, EmptyState, Portrait, SectionHeading, TextLink } from "@/components/ui";
import { EventCard, NewsCard, PublicationRow } from "@/components/cards";
import { OutputChart } from "@/components/OutputChart";
import { ResearchIndex } from "@/components/ResearchIndex";

export default function HomePage() {
  const site = getSite();
  const faculty = getFaculty();
  const facultyNames = Object.fromEntries(faculty.map((f) => [f.slug, f.name]));
  const areas = getAreas();
  const pubs = getPublications();
  const thisYear = new Date().getFullYear();
  const latest = pubs.filter((p) => p.type === "Journal" && p.venue).slice(0, 5);
  const chart = publicationsByYear(thisYear - 11, thisYear);
  const news = getNews();
  const { upcoming } = splitEvents();
  const head = getHead();
  const labs = getLabs();
  const labCount = labs.groups.reduce((n, g) => n + g.items.length, 0);
  const funders = getFunders().filter((f) => !/^(Ms|Mr|Dr|Prof)\.|Various|internal|Department of Metallurgical/i.test(f.name));

  // One current project per faculty, spread across areas, for the highlights strip.
  const projects = getCurrentProjects()
    .filter((p) => p.project.role.startsWith("Principal") && p.project.funder)
    .filter((p, i, arr) => arr.findIndex((q) => q.faculty.slug === p.faculty.slug) === i)
    .slice(0, 4);

  const portraits = faculty.filter((f) => f.photo && f.designation === "Professor" && !f.isHead).slice(0, 8);

  return (
    <>
      {/* 3 · Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/campus/main-building.webp"
          alt="The Main Building of IIT Kharagpur"
          className="hero-media absolute inset-0 -z-20 h-full w-full object-cover object-[60%_45%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,20,40,0.94)_0%,rgba(6,20,40,0.82)_42%,rgba(6,20,40,0.35)_75%,rgba(6,20,40,0.2)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
        <Container className="flex min-h-[min(84svh,52rem)] flex-col justify-end pb-16 pt-24 sm:pb-20 lg:pb-24">
          <p className="enter text-[15px] font-medium text-navy-100">{site.institute}</p>
          <h1 className="enter enter-d1 mt-4 max-w-[17ch] font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.9rem]">
            {site.department}
          </h1>
          <div className="enter enter-d2 mt-7 h-[3px] w-24 bg-maroon-600" aria-hidden />
          <p className="enter enter-d2 mt-7 max-w-[34ch] font-display text-xl font-semibold leading-snug text-white/95 sm:text-2xl">
            {site.tagline}
          </p>
          <div className="enter enter-d3 mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/research/">Explore Research</ButtonLink>
            <ButtonLink href="/people/" variant="ghost-light">
              Meet Our Faculty
            </ButtonLink>
          </div>
        </Container>
        <div className="rule-metal-thick" />
      </section>

      {/* 4 · Introduction + 7 · verified statistics */}
      <section className="py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <h2 className="font-display text-[1.9rem] font-bold leading-[1.18] tracking-[-0.025em] text-navy-900 sm:text-[2.35rem]">
              Since 1954, the Department has trained metallurgists for India’s steel industry — and today pairs that
              tradition with advanced materials for energy and healthcare.
            </h2>
            <div className="prose-body text-[17px] leading-relaxed text-steel-700">
              <p>{site.about[0]}</p>
              <p>{site.about[1]}</p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <TextLink href="/about/">About the Department</TextLink>
                <TextLink href="/about/#head">Message from the Head</TextLink>
              </div>
            </div>
          </div>

          <dl className="mt-20 grid border-y border-steel-200 sm:grid-cols-2 lg:grid-cols-4">
            {site.stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-7 sm:px-7 ${i > 0 ? "border-t border-steel-200 sm:border-t-0" : ""} ${
                  i % 2 === 1 ? "sm:border-l" : ""
                } ${i >= 2 ? "sm:border-t lg:border-t-0" : ""} lg:border-l lg:first:border-l-0 lg:first:pl-0 border-steel-200`}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="tabular block font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.03em] text-navy-900">
                    {s.value}
                  </span>
                  <span className="mt-3 block max-w-[30ch] text-[14.5px] leading-snug text-steel-600">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] text-steel-500">
            Figures as published on the{" "}
            <a href={site.links.departmentPage} className="underline hover:text-maroon-700">
              IIT Kharagpur department page
            </a>
            .
          </p>
        </Container>
      </section>

      {/* 5 · Research areas */}
      <section className="bg-steel-50 py-20 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            title="Six areas of research"
            intro="From iron and steel to batteries, biomaterials and machine-learned alloys. Each area brings together faculty, laboratories and projects across the department."
            action={{ label: "All research areas", href: "/research/" }}
          />
          <ResearchIndex
            areas={areas.map((a) => ({
              slug: a.slug,
              title: a.title,
              short: a.short,
              image: a.image,
              imageAlt: a.imageAlt,
              themes: a.themes,
              facultyCount: facultyForArea(a.slug).length,
              credit: facultyNames[a.imageCredit] ? `Prof. ${facultyNames[a.imageCredit]}` : "the department",
            }))}
          />
        </Container>
      </section>

      {/* 6 · Research highlights: output + funded projects */}
      <section className="on-dark bg-navy-900 py-20 text-white sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            dark
            title="Research in progress"
            intro="Current sponsored projects led by department faculty, and the department’s journal output year by year."
          />
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <h3 className="font-display text-lg font-bold">Journal papers per year</h3>
              <p className="mt-1 text-[14px] text-navy-100">
                Counted from faculty publication lists on IIT Kharagpur profiles. {thisYear} is the year to date.
              </p>
              <div className="mt-6">
                <OutputChart data={chart} dark partialYear={thisYear} />
              </div>
              <p className="mt-4 text-[14px] text-navy-100">
                <span className="tabular font-semibold text-white">{pubs.length.toLocaleString("en-IN")}</span> publications are
                indexed in the{" "}
                <Link href="/publications/" className="font-semibold text-white underline hover:text-maroon-100">
                  publications portal
                </Link>
                .
              </p>
            </div>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {projects.map(({ project, faculty: f }) => (
                <li key={project.title} className="py-6">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-maroon-100">{project.funder}</p>
                  <p className="mt-2 font-display text-[1.15rem] font-semibold leading-snug">{project.title}</p>
                  <p className="mt-2 text-[14.5px] text-navy-100">
                    Principal investigator:{" "}
                    <Link href={`/people/faculty/${f.slug}/`} className="text-white underline-offset-4 hover:underline">
                      Prof. {f.name}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 7 · Latest publications */}
      <section className="py-20 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            title="Latest publications"
            intro="Recent journal papers by department faculty. Search all of them by author, year, research area or type."
            action={{ label: "Open the publications portal", href: "/publications/" }}
          />
          <div className="divide-y divide-steel-200 border-y border-steel-200">
            {latest.map((p) => (
              <PublicationRow key={p.id} pub={p} facultyNames={facultyNames} />
            ))}
          </div>
        </Container>
      </section>

      {/* 8 · Events  +  9 · News */}
      <section className="border-t border-steel-200 bg-steel-50 py-20 sm:py-24 lg:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <SectionHeading title="Upcoming events" action={{ label: "All events", href: "/events-news/#events" }} />
            {upcoming.length ? (
              <div className="border-b border-steel-200">
                {upcoming.slice(0, 3).map((e) => (
                  <EventCard key={e.slug} e={e} />
                ))}
              </div>
            ) : (
              <EmptyState title="No events are scheduled right now">
                Seminars, distinguished lectures, workshops and conferences will be listed here as they are announced.
              </EmptyState>
            )}
          </div>
          <div>
            <SectionHeading title="News and achievements" action={{ label: "All news", href: "/events-news/#news" }} />
            <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
              {news[0] && <NewsCard n={news[0]} large />}
              <div className="divide-y divide-steel-200 border-y border-steel-200">
                {news.slice(1, 5).map((n) => (
                  <div key={n.slug} className="py-5">
                    <NewsCard n={n} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10 · Faculty highlights */}
      <section className="py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {head && (
              <figure>
                <div className="flex items-center gap-5">
                  <Portrait src={head.photo} name={head.name} className="h-28 w-24" />
                  <figcaption>
                    <p className="font-display text-xl font-bold text-navy-900">Prof. {head.name}</p>
                    <p className="text-[14.5px] text-maroon-700">Head of the Department</p>
                  </figcaption>
                </div>
                <blockquote className="mt-8 border-l-2 border-maroon-700 pl-6 font-display text-[1.3rem] font-medium leading-[1.5] tracking-[-0.01em] text-navy-900 sm:text-[1.45rem]">
                  “We are proud that our Department is among the very few Institutes of excellence in India that still embraces
                  the classical metallurgy like iron and steel research along with advanced materials, which is the need of the
                  nation today.”
                </blockquote>
                <TextLink href="/about/#head" className="mt-6">
                  Read the full message
                </TextLink>
              </figure>
            )}
            <div>
              <SectionHeading
                title={`${faculty.length} faculty members`}
                intro="Professors, associate and assistant professors working across all six research areas."
                action={{ label: "Faculty directory", href: "/people/" }}
              />
              <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
                {portraits.map((f) => (
                  <li key={f.slug} className="group relative">
                    <Portrait src={f.photo} name={f.name} className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02]" />
                    <p className="mt-3 font-display text-[15px] font-bold leading-snug text-navy-900">
                      <Link href={`/people/faculty/${f.slug}/`} className="after:absolute after:inset-0 group-hover:text-maroon-700">
                        {f.name}
                      </Link>
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[13px] text-steel-500">{f.researchInterests[0]}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 11 · Research infrastructure */}
      <section className="on-dark relative overflow-hidden bg-navy-950 py-20 text-white sm:py-24 lg:py-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/research/area-energy-sustainability.webp"
          alt=""
          className="pointer-events-none absolute -right-40 bottom-0 hidden w-[40rem] opacity-30 xl:block"
        />
        <Container className="relative">
          <SectionHeading
            dark
            title="Research infrastructure"
            intro={`${labCount} teaching and research laboratories, including the department’s facilities at IIT Kharagpur’s Central Research Facility.`}
            action={{ label: "Laboratories and facilities", href: "/research/facilities/" }}
          />
          <ul className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 xl:w-[64%]">
            {labs.groups.slice(0, 6).map((g) => (
              <li key={g.group} className="bg-navy-950/90 p-6">
                <p className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[1.05rem] font-bold">{g.group}</span>
                  <span className="tabular text-[13px] text-navy-100">{g.items.length}</span>
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-navy-100">
                  {[...new Set(g.items.map((i) => i.replace(/, (CRF|SNST)$/, "")))].join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 12 · Collaborations & institutional links */}
      <section className="py-20 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            title="Sponsors and collaborators"
            intro="Agencies and organisations funding current and completed faculty projects, as listed on faculty profiles."
          />
          <ul className="flex flex-wrap gap-x-3 gap-y-3">
            {funders.slice(0, 18).map((f) => (
              <li key={f.name} className="border border-steel-200 px-4 py-2.5 text-[14.5px] font-medium text-navy-900">
                {f.name}
                <span className="tabular ml-2 text-steel-500">{f.count}</span>
              </li>
            ))}
          </ul>
          <div className="mt-16 grid gap-px overflow-hidden border border-steel-200 bg-steel-200 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Indian Institute of Technology Kharagpur", site.links.institute],
              ["Steel Technology Centre", site.links.steelTechnologyCentre],
              ["Materials Science Centre", site.links.materialsScienceCentre],
              ["Career Development Centre", site.links.cdc],
            ].map(([label, href]) => (
              <a key={href} href={href} rel="noopener" className="group flex items-center justify-between gap-4 bg-white p-6 hover:bg-steel-50">
                <span className="font-display text-[15.5px] font-bold text-navy-900 group-hover:text-maroon-700">{label}</span>
                <ArrowUpRight className="size-4 shrink-0 text-steel-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-maroon-700" aria-hidden />
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
