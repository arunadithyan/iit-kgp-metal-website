import type { Metadata } from "next";
import { getAreas, getPublications } from "@/lib/content";
import { Container, PageHero } from "@/components/ui";
import { PublicationsExplorer } from "@/components/PublicationsExplorer";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Search journal articles, conference papers, books, book chapters and patents by faculty of the Department of Metallurgical and Materials Engineering, IIT Kharagpur.",
  alternates: { canonical: "/publications/" },
};

export default function PublicationsPage() {
  const pubs = getPublications();
  const count = (t: string) => pubs.filter((p) => p.type === t).length;
  const areas = getAreas().map((a) => ({ slug: a.slug, title: a.title }));
  const summary = [
    ["Journal articles", count("Journal")],
    ["Conference papers", count("Conferences") + count("Symposium") + count("Workshop") + count("Congress")],
    ["Books and chapters", count("Book") + count("Book Chapter/Section") + count("Edited Volume") + count("Monograph")],
    ["Patents", count("Patent")],
  ] as const;
  return (
    <>
      <PageHero
        title="Publications"
        crumbs={[{ label: "Home", href: "/" }, { label: "Publications" }]}
        intro="Journal articles, conference proceedings, books, chapters and patents by the Department’s faculty. Search by title or author, filter by year, research area or type, and export the results."
      >
        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
          {summary.map(([label, n]) => (
            <div key={label}>
              <dt className="text-[13.5px] text-navy-100">{label}</dt>
              <dd className="tabular mt-1 font-display text-[1.9rem] font-extrabold leading-none">{n.toLocaleString("en-IN")}</dd>
            </div>
          ))}
        </dl>
      </PageHero>
      <section className="py-12 lg:py-16">
        <Container>
          <PublicationsExplorer areas={areas} />
          <p className="mt-12 max-w-[80ch] border-t border-steel-200 pt-6 text-[13.5px] leading-relaxed text-steel-500">
            Publication records are taken from faculty profiles on the IIT Kharagpur website and de-duplicated where several faculty co-authored a paper.
            Research areas are assigned through the department faculty on each paper. Where no DOI is recorded, “Find this paper” searches Google Scholar
            for the exact title. Records, DOIs and abstracts can be added through the content manager.
          </p>
        </Container>
      </section>
    </>
  );
}
