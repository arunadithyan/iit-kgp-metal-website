import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getAcademics, getCurricula } from "@/lib/content";
import { Container, PageHero } from "@/components/ui";
import { CurriculumTable } from "@/components/CurriculumTable";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "B.Tech, Double Major, M.Tech and Ph.D. programmes of the Department of Metallurgical and Materials Engineering, IIT Kharagpur, with curriculum, admissions and scholarships.",
  alternates: { canonical: "/academics/" },
};

function LinkList({ items }: { items: { title: string; url: string }[] }) {
  return (
    <ul className="divide-y divide-steel-200 border-y border-steel-200">
      {items.map((i) => (
        <li key={i.url + i.title}>
          <a href={i.url} rel="noopener" className="group flex items-center justify-between gap-4 py-4 text-[15.5px] font-medium text-navy-900 hover:text-maroon-700">
            {i.title}
            <ArrowUpRight className="size-4 shrink-0 text-steel-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-maroon-700" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function AcademicsPage() {
  const a = getAcademics();
  const c = getCurricula();
  const levels = ["Undergraduate", "Postgraduate", "Doctoral"];
  const curricula = a.programmes
    .filter((p) => p.curriculumKey && typeof c[p.curriculumKey] === "object")
    .map((p) => ({ key: p.curriculumKey!, label: p.name, data: c[p.curriculumKey!] as Exclude<(typeof c)[string], string> }));
  return (
    <>
      <PageHero title="Academics" crumbs={[{ label: "Home", href: "/" }, { label: "Academics" }]} intro={a.intro}>
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
          {[
            ["Programmes", "programmes"],
            ["Curriculum", "curriculum"],
            ["Admissions", "admissions"],
            ["Scholarships", "scholarships"],
            ["Regulations and resources", "resources"],
          ].map(([l, id]) => (
            <a key={id} href={`#${id}`} className="text-white underline-offset-4 hover:underline">
              {l}
            </a>
          ))}
        </nav>
      </PageHero>

      <section id="programmes" className="py-16 lg:py-24">
        <Container>
          <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.03em] text-navy-900 sm:text-[2.3rem]">Programmes</h2>
          <div className="mt-10 space-y-14">
            {levels.map((lvl) => (
              <div key={lvl} className="grid gap-6 border-t-2 border-navy-900 pt-6 lg:grid-cols-[14rem_1fr] lg:gap-12">
                <h3 className="font-display text-[1.2rem] font-bold text-maroon-700">{lvl}</h3>
                <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                  {a.programmes
                    .filter((p) => p.level === lvl)
                    .map((p) => (
                      <li key={p.slug} id={p.slug}>
                        <p className="font-display text-[1.3rem] font-bold leading-snug tracking-[-0.015em] text-navy-900">{p.name}</p>
                        <p className="tabular mt-1.5 text-[13.5px] text-steel-500">
                          {p.code !== "—" && <>Code {p.code} · </>}
                          {p.duration}
                        </p>
                        <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-steel-700">{p.summary}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="curriculum" className="border-t border-steel-200 bg-steel-50 py-16 lg:py-24">
        <Container>
          <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.03em] text-navy-900 sm:text-[2.3rem]">Curriculum and course structure</h2>
          <p className="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-steel-600">
            {c.note}{" "}
            <a href={c.sourceUrl} className="font-semibold text-maroon-700 underline">
              Full curricula on the ERP
            </a>
            .
          </p>
          <div className="mt-10">
            <CurriculumTable curricula={curricula} />
          </div>
        </Container>
      </section>

      <section id="admissions" className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-3 lg:gap-12">
          <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.03em] text-navy-900 sm:text-[2.3rem]">Admissions</h2>
          <ul className="grid gap-px bg-steel-200 lg:col-span-2 sm:grid-cols-3">
            {a.admissions.map((ad) => (
              <li key={ad.title} className="flex flex-col bg-white py-2 sm:px-6 sm:first:pl-0">
                <h3 className="font-display text-[1.1rem] font-bold text-navy-900">{ad.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-steel-700">{ad.text}</p>
                <a href={ad.url} rel="noopener" className="mt-4 inline-flex items-center gap-1 text-[14.5px] font-semibold text-maroon-700 hover:underline">
                  Admission details <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-steel-200 py-16 lg:py-24">
        <Container className="grid gap-14 md:grid-cols-3">
          <div id="scholarships">
            <h2 className="font-display text-[1.5rem] font-bold text-navy-900">Scholarships and fellowships</h2>
            <div className="mt-5">
              <LinkList items={a.scholarships} />
            </div>
          </div>
          <div id="regulations">
            <h2 className="font-display text-[1.5rem] font-bold text-navy-900">Academic regulations</h2>
            <div className="mt-5">
              <LinkList items={a.regulations} />
            </div>
          </div>
          <div id="resources">
            <h2 className="font-display text-[1.5rem] font-bold text-navy-900">Student resources</h2>
            <div className="mt-5">
              <LinkList items={a.resources} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
