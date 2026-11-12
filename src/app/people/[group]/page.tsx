import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PEOPLE_GROUPS, getFaculty, getPeopleGroup } from "@/lib/content";
import { Container, EmptyState, PageHero } from "@/components/ui";
import { PeopleNav } from "@/components/PeopleNav";
import { ScholarList } from "@/components/ScholarList";

export function generateStaticParams() {
  return PEOPLE_GROUPS.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string }> }): Promise<Metadata> {
  const { group } = await params;
  const g = PEOPLE_GROUPS.find((x) => x.slug === group);
  return g ? { title: g.title, alternates: { canonical: `/people/${g.slug}/` } } : {};
}

const INTRO: Record<string, string> = {
  emeritus: "Emeritus professors who continue their association with the Department.",
  visiting: "Visiting and adjunct faculty teaching or collaborating with the Department.",
  postdocs: "Postdoctoral researchers working in the Department’s research groups.",
  scholars: "Ph.D. scholars working with department faculty, as listed on each faculty member’s group page.",
  staff: "Technical and administrative staff who run the Department’s laboratories, workshops and office.",
  "former-faculty": "Faculty members who have served the Department in the past.",
};

export default async function GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const slug = (await params).group;
  const meta = PEOPLE_GROUPS.find((g) => g.slug === slug);
  if (!meta) notFound();
  const group = getPeopleGroup(slug);
  const facultyNames = Object.fromEntries(getFaculty().map((f) => [f.slug, f.name]));

  return (
    <>
      <PageHero title={meta.title} crumbs={[{ label: "Home", href: "/" }, { label: "People", href: "/people/" }, { label: meta.title }]} intro={INTRO[slug]} />
      <PeopleNav current={slug} />
      <section className="py-14 lg:py-16">
        <Container>
          {group.people.length === 0 ? (
            <EmptyState title={`No ${meta.title.toLowerCase()} are listed yet`}>
              This list is maintained by the department office and will be published here once it is available. For enquiries, contact the
              department through the <Link href="/contact/" className="font-semibold text-maroon-700 underline">contact page</Link>.
            </EmptyState>
          ) : slug === "scholars" ? (
            <ScholarList
              people={group.people.map((p) => ({ name: p.name, area: p.area, supervisor: p.supervisorSlug }))}
              facultyNames={facultyNames}
            />
          ) : (
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {group.people.map((p) => (
                <li key={p.name} className="border-b border-steel-200 py-5">
                  <p className="font-display text-[17px] font-bold text-navy-900">{p.name}</p>
                  {p.designation && <p className="mt-0.5 text-[14.5px] text-steel-600">{p.designation}</p>}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
