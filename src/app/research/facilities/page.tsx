import type { Metadata } from "next";
import Link from "next/link";
import { getAreas, getLabs } from "@/lib/content";
import { Badge, Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Laboratories and Facilities",
  description: "Teaching and research laboratories of the Department of Metallurgical and Materials Engineering, IIT Kharagpur, including Central Research Facility instruments.",
  alternates: { canonical: "/research/facilities/" },
};

export default function FacilitiesPage() {
  const labs = getLabs();
  const areas = getAreas();
  const total = labs.groups.reduce((n, g) => n + g.items.length, 0);
  const areasFor = (lab: string) => {
    const base = lab.replace(/, (CRF|SNST)$/, "").toLowerCase();
    return areas.filter((a) => a.labs.some((l) => base.startsWith(l.toLowerCase().replace(/, (crf|snst)$/, ""))));
  };
  return (
    <>
      <PageHero
        title="Laboratories and facilities"
        crumbs={[{ label: "Home", href: "/" }, { label: "Research", href: "/research/" }, { label: "Facilities" }]}
        intro={`${total} teaching and research laboratories, from metallography and heat treatment to electron microscopy, nanoindentation and spark plasma sintering.`}
        image="/images/research/area-functional-devices.webp"
      />
      <section className="py-16 lg:py-20">
        <Container>
          <p className="max-w-[70ch] text-[15px] text-steel-600">{labs.note}</p>
          <div className="mt-12 space-y-14">
            {labs.groups.map((g) => (
              <section key={g.group} aria-labelledby={`g-${g.group}`} className="grid gap-6 border-t-2 border-navy-900 pt-6 lg:grid-cols-[18rem_1fr] lg:gap-12">
                <div>
                  <h2 id={`g-${g.group}`} className="font-display text-[1.45rem] font-bold tracking-[-0.02em] text-navy-900">
                    {g.group}
                  </h2>
                  <p className="tabular mt-1 text-[14px] text-steel-500">
                    {g.items.length} {g.items.length === 1 ? "laboratory" : "laboratories"}
                  </p>
                </div>
                <ul className="divide-y divide-steel-200">
                  {g.items.map((l) => {
                    const crf = /, CRF$/.test(l);
                    const snst = /, SNST$/.test(l);
                    const name = l.replace(/, (CRF|SNST)$/, "");
                    const related = areasFor(l);
                    return (
                      <li key={l} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="flex flex-wrap items-center gap-2 text-[16px] font-medium text-navy-900">
                          {name}
                          {crf && <Badge tone="navy">Central Research Facility</Badge>}
                          {snst && <Badge tone="navy">School of Nano Science and Technology</Badge>}
                        </span>
                        {related.length > 0 && (
                          <span className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                            {related.map((a) => (
                              <Link key={a.slug} href={`/research/${a.slug}/`} className="text-steel-600 hover:text-maroon-700 hover:underline">
                                {a.title}
                              </Link>
                            ))}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <div className="mt-16 border border-dashed border-steel-300 bg-steel-50 p-6 text-[15px] text-steel-700">
            Instrument specifications, booking procedures and laboratory photographs can be added for each facility through the content manager. Only
            photographs of the department’s own laboratories should be used here.
          </div>
        </Container>
      </section>
    </>
  );
}
