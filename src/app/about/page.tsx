import type { Metadata } from "next";
import Link from "next/link";
import { getAreas, getFaculty, getFunders, getHead, getLabs, getNews, getSite } from "@/lib/content";
import { Container, PageHero, Portrait, TextLink } from "@/components/ui";
import { formatNewsDate } from "@/components/cards";

export const metadata: Metadata = {
  title: "About the Department",
  description:
    "History, vision and mission of the Department of Metallurgical and Materials Engineering at IIT Kharagpur, established in 1954.",
  alternates: { canonical: "/about/" },
};

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-navy-900 sm:text-[2.3rem]">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  const site = getSite();
  const head = getHead();
  const faculty = getFaculty();
  const labs = getLabs();
  const areas = getAreas();
  const news = getNews();
  const funders = getFunders().filter((f) => !/^(Ms|Mr|Dr|Prof)\.|Various|internal|Department of Metallurgical/i.test(f.name));
  const gallery = [
    { src: "/images/campus/main-building.webp", alt: "The Main Building of IIT Kharagpur", credit: "IIT Kharagpur" },
    { src: "/images/research/people-jayanta-das-group.webp", alt: "Members of Prof. Jayanta Das’s research group outside the department", credit: "Group of Prof. Jayanta Das" },
    { src: "/images/research/news-gg-roy-metallurgist-of-year.webp", alt: "Prof. Gour Gopal Roy at the National Metallurgists’ Day Awards 2015", credit: "Department archive" },
    { src: "/images/campus/main-building-celebration.webp", alt: "Students celebrating in front of the Main Building", credit: "IIT Kharagpur" },
    { src: "/images/research/area-energy-sustainability.webp", alt: "Electron micrographs of alloy particles", credit: "Group of Prof. Chetan Singh" },
    { src: "/images/research/area-physical-mechanical.webp", alt: "Orientation map of a polycrystalline alloy", credit: "Group of Prof. Indrani Sen" },
  ];
  return (
    <>
      <PageHero
        title="About the Department"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        intro="One of the founding engineering disciplines at IIT Kharagpur, the Department has taught and researched metallurgy since 1954 and materials engineering in its full breadth since 1994."
        image="/images/campus/main-building.webp"
      />

      <nav aria-label="On this page" className="sticky top-[4.75rem] z-20 border-b border-steel-200 bg-white/95 backdrop-blur-sm">
        <Container className="flex gap-1 overflow-x-auto">
          {[
            ["Overview", "overview"],
            ["History", "history"],
            ["Vision and mission", "vision"],
            ["Head’s message", "head"],
            ["Academics and research", "excellence"],
            ["Achievements", "achievements"],
            ["Collaborations", "collaborations"],
            ["Gallery", "gallery"],
          ].map(([l, id]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap px-3 py-3.5 text-[14px] font-semibold text-steel-600 hover:text-maroon-700">
              {l}
            </a>
          ))}
        </Container>
      </nav>

      <section id="overview" className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <H2 id="overview-h">Department overview</H2>
          <div className="prose-body max-w-[68ch] text-[17.5px] leading-relaxed text-steel-700">
            {site.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Container>
      </section>

      <section id="history" className="border-t border-steel-200 bg-steel-50 py-16 lg:py-24">
        <Container>
          <H2 id="history-h">History and evolution</H2>
          <ol className="mt-12 grid gap-px bg-steel-200 md:grid-cols-3">
            {site.milestones.map((m) => (
              <li key={m.year} className="bg-steel-50 py-2 md:px-8 md:first:pl-0">
                <p className="tabular font-display text-[3rem] font-extrabold leading-none tracking-[-0.04em] text-maroon-700">{m.year}</p>
                <div className="rule-metal mt-5 w-16" />
                <p className="mt-5 max-w-[40ch] text-[16.5px] leading-relaxed text-steel-700">{m.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="vision" className="on-dark bg-navy-900 py-16 text-white lg:py-24">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-[1.6rem] font-bold text-maroon-100">Vision</h2>
            <p className="mt-5 font-display text-[1.55rem] font-semibold leading-[1.4] tracking-[-0.015em] sm:text-[1.8rem]">{site.vision}</p>
          </div>
          <div>
            <h2 className="font-display text-[1.6rem] font-bold text-maroon-100">Mission</h2>
            <p className="mt-5 text-[18px] leading-relaxed text-navy-100">{site.mission}</p>
            <p className="mt-5 text-[18px] leading-relaxed text-navy-100">
              The Department has been publishing, on average, more than 90 papers per year in peer-reviewed journals over the last five years, and undertakes a
              large number of sponsored and consultancy projects each year.
            </p>
          </div>
        </Container>
      </section>

      {head && (
        <section id="head" className="py-16 lg:py-24">
          <Container className="grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-20">
            <div>
              <Portrait src={head.photo} name={head.name} className="aspect-[4/5] w-full max-w-[18rem]" />
              <p className="mt-5 font-display text-xl font-bold text-navy-900">{site.headMessage.name}</p>
              <p className="text-[15px] text-maroon-700">{site.headMessage.role}</p>
              <p className="mt-3 text-[14.5px] text-steel-600">
                <a href={`mailto:${site.contact.headEmail}`} className="hover:text-maroon-700">
                  {site.contact.headEmail}
                </a>
                <br />
                <span className="tabular">{site.contact.headPhone}</span>
              </p>
            </div>
            <div>
              <H2 id="head-h">Message from the Head</H2>
              <div className="prose-body mt-8 max-w-[66ch] text-[18px] leading-relaxed text-steel-700">
                {site.headMessage.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      <section id="excellence" className="border-t border-steel-200 bg-steel-50 py-16 lg:py-24">
        <Container>
          <H2 id="excellence-h">Academic excellence and research infrastructure</H2>
          <div className="mt-12 grid gap-px bg-steel-200 md:grid-cols-3">
            {[
              {
                t: "Programmes",
                d: "B.Tech in Metallurgical and Materials Engineering with Double Major options, M.Tech in Metallurgical and Materials Engineering and in Steel Technology, and the Ph.D.",
                href: "/academics/",
                l: "Academic programmes",
              },
              {
                t: `${faculty.length} faculty in six research areas`,
                d: areas.map((a) => a.title).join(" · "),
                href: "/research/",
                l: "Research areas",
              },
              {
                t: `${labs.groups.reduce((n, g) => n + g.items.length, 0)} laboratories`,
                d: "Electron microscopy, X-ray diffraction, mechanical testing, thermal analysis, processing and computing, including Central Research Facility instruments.",
                href: "/research/facilities/",
                l: "Laboratories and facilities",
              },
            ].map((c) => (
              <div key={c.t} className="bg-steel-50 py-6 md:px-8 md:first:pl-0">
                <h3 className="font-display text-[1.3rem] font-bold text-navy-900">{c.t}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-steel-700">{c.d}</p>
                <TextLink href={c.href} className="mt-5">
                  {c.l}
                </TextLink>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="achievements" className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <H2 id="achievements-h">Achievements</H2>
            <p className="mt-4 max-w-[48ch] text-[16.5px] leading-relaxed text-steel-600">
              Recognition for the Department’s faculty, students and alumni, as listed on the IIT Kharagpur department page.
            </p>
            <h3 className="mt-12 text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">Notable alumni</h3>
            <ul className="mt-3 divide-y divide-steel-200 border-y border-steel-200">
              {site.alumni.map((a) => (
                <li key={a.name} className="py-4">
                  <p className="font-display text-[17px] font-bold text-navy-900">{a.name}</p>
                  <p className="text-[14.5px] text-steel-600">{a.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <ul className="divide-y divide-steel-200 border-y border-steel-200">
            {news.map((n) => (
              <li key={n.slug} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-maroon-700">
                  {n.category}
                  <span className="tabular mt-1 block font-normal normal-case tracking-normal text-steel-500">{n.year ?? ""}</span>
                </p>
                <Link href={`/news/${n.slug}/`} className="font-display text-[17px] font-bold leading-snug text-navy-900 hover:text-maroon-700">
                  {n.title}
                  {!n.year && <span className="sr-only"> ({formatNewsDate(n)})</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="collaborations" className="border-t border-steel-200 bg-steel-50 py-16 lg:py-24">
        <Container>
          <H2 id="collaborations-h">Industry and institutional collaborations</H2>
          <p className="mt-4 max-w-[64ch] text-[16.5px] leading-relaxed text-steel-600">
            Government agencies, industry and institutions that fund or partner in faculty research projects, as listed on faculty profiles. The number shows how
            many projects each has supported.
          </p>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {funders.map((f) => (
              <li key={f.name} className="flex items-baseline justify-between gap-4 border-b border-steel-200 py-3">
                <span className="text-[15px] text-navy-900">{f.name}</span>
                <span className="tabular text-[14px] text-steel-500">{f.count}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="gallery" className="py-16 lg:py-24">
        <Container>
          <H2 id="gallery-h">Photo gallery</H2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g) => (
              <li key={g.src}>
                <figure className="group">
                  <div className="overflow-hidden bg-navy-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.src}
                      alt={g.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-2 text-[13px] text-steel-500">{g.credit}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[13.5px] text-steel-500">
            Photographs of the department building, laboratories and events can be added through the content manager.
          </p>
        </Container>
      </section>
    </>
  );
}
