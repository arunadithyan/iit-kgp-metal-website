import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Globe, Mail, MapPin, Phone } from "lucide-react";
import { getArea, getFaculty, getFacultyBySlug, getPeopleGroup, publicationsForFaculty } from "@/lib/content";
import { Badge, Container, PageHero, Portrait } from "@/components/ui";
import { PublicationRow } from "@/components/cards";

export function generateStaticParams() {
  return getFaculty().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = getFacultyBySlug((await params).slug);
  if (!f) return {};
  return {
    title: `Prof. ${f.name}`,
    description: `${f.designation}, Department of Metallurgical and Materials Engineering, IIT Kharagpur. Research: ${f.researchInterests.slice(0, 5).join(", ")}.`,
    alternates: { canonical: `/people/faculty/${f.slug}/` },
    openGraph: f.photo ? { images: [f.photo] } : undefined,
  };
}

function Block({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="border-t border-steel-200 py-10">
      <h2 className="font-display text-[1.45rem] font-bold tracking-[-0.02em] text-navy-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function FacultyPage({ params }: { params: Promise<{ slug: string }> }) {
  const f = getFacultyBySlug((await params).slug);
  if (!f) notFound();
  const pubs = publicationsForFaculty(f.slug);
  const journal = pubs.filter((p) => p.type === "Journal");
  const names = Object.fromEntries(getFaculty().map((x) => [x.slug, x.name]));
  const scholars = getPeopleGroup("scholars").people.filter((s) => s.supervisorSlug === f.slug);
  const links = [
    f.website && { label: "Personal website", href: f.website, icon: Globe },
    f.googleScholar && { label: "Google Scholar", href: f.googleScholar, icon: ArrowUpRight },
    f.orcid && { label: "ORCID", href: `https://orcid.org/${f.orcid}`, icon: ArrowUpRight },
    f.profileUrl && { label: "IIT Kharagpur profile", href: f.profileUrl, icon: ArrowUpRight },
  ].filter(Boolean) as { label: string; href: string; icon: typeof Globe }[];

  return (
    <>
      <PageHero
        title={`Prof. ${f.name}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "People", href: "/people/" }, { label: f.name }]}
        intro={
          <p>
            {f.designation}
            {f.isHead && " · Head of the Department"}
            <span className="block text-navy-100/80">Department of Metallurgical and Materials Engineering</span>
          </p>
        }
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[18rem_1fr] lg:gap-16 lg:py-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Portrait src={f.photo} name={f.name} className="aspect-[4/5] w-full max-w-[18rem] text-4xl" />
          <ul className="mt-6 space-y-3 text-[14.5px] text-steel-700">
            {f.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-maroon-700" aria-hidden />
                <a href={`mailto:${f.email}`} className="break-all hover:text-maroon-700 hover:underline">
                  {f.email}
                </a>
              </li>
            )}
            {f.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-maroon-700" aria-hidden />
                <a href={`tel:${f.phone.replace(/[^+\d]/g, "")}`} className="tabular hover:text-maroon-700">
                  {f.phone}
                </a>
              </li>
            )}
            {f.office && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-maroon-700" aria-hidden />
                {f.office}
              </li>
            )}
          </ul>
          {links.length > 0 && (
            <ul className="mt-6 space-y-2 border-t border-steel-200 pt-6">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} rel="noopener" className="group inline-flex items-center gap-2 text-[14.5px] font-semibold text-maroon-700 hover:underline">
                    {l.label}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
          {f.areas.length > 0 && (
            <div className="mt-6 border-t border-steel-200 pt-6">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">Research areas</p>
              <ul className="mt-3 space-y-1.5">
                {f.areas.map((a) => (
                  <li key={a}>
                    <Link href={`/research/${a}/`} className="text-[14.5px] text-navy-900 hover:text-maroon-700 hover:underline">
                      {getArea(a)?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className="min-w-0">
          {f.researchInterests.length > 0 && (
            <ul className="flex flex-wrap gap-2 pb-10">
              {f.researchInterests.map((r) => (
                <li key={r}>
                  <Badge tone="navy">{r}</Badge>
                </li>
              ))}
            </ul>
          )}

          {f.qualifications.length > 0 && (
            <Block title="Qualifications">
              <ul className="space-y-1.5 text-[16px] text-steel-700">
                {f.qualifications.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </Block>
          )}

          {f.researchStatement.length > 0 && (
            <Block title="Research">
              <div className="prose-body max-w-[70ch] text-[16.5px] leading-relaxed text-steel-700">
                {f.researchStatement.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Block>
          )}

          {f.researchImage && (
            <figure className="border-t border-steel-200 py-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.researchImage} alt={`Research overview figure from the group of Prof. ${f.name}`} loading="lazy" className="w-full bg-white" />
              <figcaption className="mt-3 text-[13px] text-steel-500">From the research group of Prof. {f.name}</figcaption>
            </figure>
          )}

          {(f.currentProjects.length > 0 || f.completedProjects.length > 0) && (
            <Block title="Research projects">
              {[
                ["Current", f.currentProjects],
                ["Completed", f.completedProjects],
              ].map(([label, list]) =>
                (list as typeof f.currentProjects).length ? (
                  <div key={label as string} className="mb-8 last:mb-0">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">{label as string}</h3>
                    <ul className="mt-3 divide-y divide-steel-200 border-y border-steel-200">
                      {(list as typeof f.currentProjects).map((p, i) => (
                        <li key={i} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                          <span className="text-[15.5px] font-medium leading-snug text-navy-900">{p.title}</span>
                          <span className="text-[13.5px] text-steel-600 sm:max-w-[16rem] sm:text-right">
                            {p.role}
                            {p.funder && <span className="block text-steel-500">{p.funder}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </Block>
          )}

          {pubs.length > 0 && (
            <Block title="Selected publications" id="publications">
              <p className="-mt-2 mb-2 text-[14.5px] text-steel-600">
                {journal.length} journal papers and {pubs.length - journal.length} other publications on record.{" "}
                <Link href={`/publications/?faculty=${f.slug}`} className="font-semibold text-maroon-700 hover:underline">
                  View all {pubs.length} in the publications portal
                </Link>
              </p>
              <div className="divide-y divide-steel-200 border-b border-steel-200">
                {(journal.length ? journal : pubs).slice(0, 8).map((p) => (
                  <PublicationRow key={p.id} pub={p} facultyNames={names} />
                ))}
              </div>
            </Block>
          )}

          {f.awards.length > 0 && (
            <Block title="Awards and recognition">
              <ul className="grid gap-x-8 gap-y-3 text-[15.5px] text-steel-700 sm:grid-cols-2">
                {f.awards.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span className="mt-2.5 size-1.5 shrink-0 bg-maroon-700" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {scholars.length > 0 && (
            <Block title="Ph.D. scholars">
              <ul className="grid gap-x-8 sm:grid-cols-2">
                {scholars.map((s) => (
                  <li key={s.name} className="border-b border-steel-200 py-3">
                    <p className="font-medium text-navy-900">{s.name}</p>
                    <p className="text-[14px] text-steel-600">{s.area}</p>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      </Container>
    </>
  );
}
