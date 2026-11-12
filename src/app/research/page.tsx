import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { facultyForArea, getAreas, getFaculty, publicationsForArea } from "@/lib/content";
import { Container, PageHero, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Six research areas of the Department of Metallurgical and Materials Engineering, IIT Kharagpur: physical and mechanical metallurgy, extractive and process metallurgy, ceramics and composites, computational materials science and AI, functional materials, and materials for energy and sustainability.",
  alternates: { canonical: "/research/" },
};

export default function ResearchPage() {
  const areas = getAreas();
  const names = Object.fromEntries(getFaculty().map((f) => [f.slug, f.name]));
  return (
    <>
      <PageHero
        title="Research"
        crumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
        intro="Research in the Department runs from classical iron and steel metallurgy to batteries, biomaterials and data-driven alloy design. It is organised into six areas; most faculty work across more than one."
        image="/images/research/area-energy-sustainability.webp"
      />
      <section className="py-16 lg:py-24">
        <Container>
          <ol className="space-y-20 lg:space-y-28">
            {areas.map((a, i) => {
              const fac = facultyForArea(a.slug);
              const pubCount = publicationsForArea(a.slug).length;
              const flip = i % 2 === 1;
              return (
                <li key={a.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <Link
                    href={`/research/${a.slug}/`}
                    className={`group relative block overflow-hidden bg-navy-950 ${flip ? "lg:order-2" : ""}`}
                    aria-label={a.title}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.image}
                      alt={a.imageAlt}
                      loading={i < 2 ? "eager" : "lazy"}
                      className="aspect-[16/10] w-full object-contain p-5 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-0 left-0 bg-white/95 px-3 py-1.5 text-[12px] text-steel-600">
                      Research group of Prof. {names[a.imageCredit]}
                    </span>
                  </Link>
                  <div>
                    <h2 className="font-display text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-navy-900 sm:text-[2.4rem]">
                      <Link href={`/research/${a.slug}/`} className="hover:text-maroon-700">
                        {a.title}
                      </Link>
                    </h2>
                    <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-steel-700">{a.overview[0]}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {a.themes.map((t) => (
                        <li key={t} className="border border-steel-200 px-3 py-1.5 text-[13.5px] text-steel-700">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="tabular mt-6 text-[14.5px] text-steel-600">
                      <strong className="font-semibold text-navy-900">{fac.length}</strong> faculty ·{" "}
                      <strong className="font-semibold text-navy-900">{pubCount.toLocaleString("en-IN")}</strong> publications by those faculty
                    </p>
                    <TextLink href={`/research/${a.slug}/`} className="mt-6">
                      Explore {a.title}
                    </TextLink>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>
      <section className="border-t border-steel-200 bg-steel-50 py-16">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-900">Laboratories and facilities</h2>
            <p className="mt-2 max-w-[60ch] text-steel-600">Electron microscopy, diffraction, mechanical testing, processing and computing facilities that support all six areas.</p>
          </div>
          <Link
            href="/research/facilities/"
            className="group inline-flex h-12 items-center gap-2 rounded-sm bg-navy-900 px-6 font-semibold text-white hover:bg-navy-800"
          >
            View facilities <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Container>
      </section>
    </>
  );
}
