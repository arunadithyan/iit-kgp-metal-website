import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { facultyForArea, getArea, getAreas, getFaculty, publicationsForArea } from "@/lib/content";
import { Container, PageHero, Portrait, TextLink } from "@/components/ui";
import { PublicationRow } from "@/components/cards";
import type { AreaSlug } from "@/lib/types";

export function generateStaticParams() {
  return getAreas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArea((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: `${a.title} at the Department of Metallurgical and Materials Engineering, IIT Kharagpur. ${a.short}`,
    alternates: { canonical: `/research/${a.slug}/` },
    openGraph: { images: [a.image] },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArea((await params).slug);
  if (!a) notFound();
  const areas = getAreas();
  const idx = areas.findIndex((x) => x.slug === a.slug);
  const next = areas[(idx + 1) % areas.length];
  const fac = facultyForArea(a.slug as AreaSlug);
  const names = Object.fromEntries(getFaculty().map((f) => [f.slug, f.name]));
  const pubs = publicationsForArea(a.slug as AreaSlug).filter((p) => p.type === "Journal" && p.venue);
  // Spread recent papers across faculty rather than letting one prolific group fill the list.
  const picked: typeof pubs = [];
  const seen = new Set<string>();
  for (const p of pubs) {
    if (picked.length >= 6) break;
    if (seen.has(p.faculty[0])) continue;
    seen.add(p.faculty[0]);
    picked.push(p);
  }
  const projects = fac
    .flatMap((f) => f.currentProjects.map((p) => ({ ...p, f })))
    .filter((p) => p.role.startsWith("Principal"))
    .slice(0, 8);
  const groupImages = fac.filter((f) => f.researchImage).slice(0, 4);

  return (
    <>
      <PageHero
        title={a.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Research", href: "/research/" }, { label: a.title }]}
        intro={a.short}
      />

      <section className="py-16 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[1.7rem] font-bold tracking-[-0.02em] text-navy-900">Overview</h2>
            <div className="prose-body mt-5 max-w-[66ch] text-[17px] leading-relaxed text-steel-700">
              {a.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <h2 className="mt-12 font-display text-[1.35rem] font-bold text-navy-900">Major research themes</h2>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {a.themes.map((t) => (
                <li key={t} className="flex items-center gap-3 border-b border-steel-200 py-3 text-[15.5px] text-navy-900">
                  <span className="size-1.5 shrink-0 bg-maroon-700" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <figure>
            <div className="bg-navy-950 p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.image} alt={a.imageAlt} className="w-full" />
            </div>
            <div className="rule-metal" />
            <figcaption className="mt-3 text-[13.5px] text-steel-600">
              {a.imageAlt}. Research group of{" "}
              <Link href={`/people/faculty/${a.imageCredit}/`} className="text-maroon-700 hover:underline">
                Prof. {names[a.imageCredit]}
              </Link>
              .
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="border-t border-steel-200 bg-steel-50 py-16 lg:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[1.9rem] font-extrabold tracking-[-0.025em] text-navy-900">Faculty in this area</h2>
            <p className="tabular text-[14.5px] text-steel-600">{fac.length} faculty, matched from their listed research interests</p>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {fac.map((f) => (
              <li key={f.slug} className="group relative flex items-center gap-4 border-t border-steel-200 py-4">
                <Portrait src={f.photo} name={f.name} className="h-16 w-14 shrink-0 text-sm" />
                <div className="min-w-0">
                  <p className="font-display text-[16px] font-bold text-navy-900">
                    <Link href={`/people/faculty/${f.slug}/`} className="after:absolute after:inset-0 group-hover:text-maroon-700">
                      {f.name}
                    </Link>
                  </p>
                  <p className="truncate text-[13.5px] text-steel-600">{f.researchInterests.slice(0, 2).join(" · ")}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {groupImages.length > 0 && (
        <section className="py-16 lg:py-20">
          <Container>
            <h2 className="mb-8 font-display text-[1.9rem] font-extrabold tracking-[-0.025em] text-navy-900">From the research groups</h2>
            <ul className="grid gap-8 md:grid-cols-2">
              {groupImages.map((f) => (
                <li key={f.slug}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.researchImage!} alt={`Research overview figure from the group of Prof. ${f.name}`} loading="lazy" className="aspect-[16/9] w-full border border-steel-200 bg-white object-contain" />
                    <figcaption className="mt-2 text-[13.5px] text-steel-600">
                      Group of{" "}
                      <Link href={`/people/faculty/${f.slug}/`} className="text-maroon-700 hover:underline">
                        Prof. {f.name}
                      </Link>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="on-dark bg-navy-900 py-16 text-white lg:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[1.9rem] font-extrabold tracking-[-0.025em]">Current research projects</h2>
            {projects.length ? (
              <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
                {projects.map((p, i) => (
                  <li key={i} className="py-5">
                    <p className="font-display text-[1.05rem] font-semibold leading-snug">{p.title}</p>
                    <p className="mt-1.5 text-[14px] text-navy-100">
                      <Link href={`/people/faculty/${p.f.slug}/`} className="text-white hover:underline">
                        Prof. {p.f.name}
                      </Link>
                      {p.funder && <> · {p.funder}</>}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-navy-100">Current projects in this area will be listed here as faculty profiles are updated.</p>
            )}
          </div>
          <div>
            <h2 className="font-display text-[1.35rem] font-bold">Associated laboratories</h2>
            <ul className="mt-6 space-y-2.5">
              {a.labs.map((l) => (
                <li key={l} className="flex gap-3 text-[15.5px] text-navy-100">
                  <span className="mt-2.5 size-1.5 shrink-0 bg-maroon-600" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>
            <TextLink href="/research/facilities/" dark className="mt-8">
              All laboratories and facilities
            </TextLink>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[1.9rem] font-extrabold tracking-[-0.025em] text-navy-900">Selected publications</h2>
            <TextLink href={`/publications/?area=${a.slug}`}>All publications in this area</TextLink>
          </div>
          <div className="divide-y divide-steel-200 border-y border-steel-200">
            {picked.map((p) => (
              <PublicationRow key={p.id} pub={p} facultyNames={names} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-steel-200">
        <Container>
          <Link href={`/research/${next.slug}/`} className="group flex items-center justify-between gap-6 py-10">
            <span>
              <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">Next research area</span>
              <span className="mt-1 block font-display text-2xl font-bold text-navy-900 group-hover:text-maroon-700 sm:text-3xl">{next.title}</span>
            </span>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-steel-300 text-navy-900 transition-colors group-hover:border-maroon-700 group-hover:bg-maroon-700 group-hover:text-white" aria-hidden>
              →
            </span>
          </Link>
        </Container>
      </section>
    </>
  );
}
