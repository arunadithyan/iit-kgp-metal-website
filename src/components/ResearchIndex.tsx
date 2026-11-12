"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface AreaLite {
  slug: string;
  title: string;
  short: string;
  image: string;
  imageAlt: string;
  themes: string[];
  facultyCount: number;
  credit: string;
}

/**
 * Homepage research index: an editorial list of the six areas. Hovering or
 * focusing a row swaps the specimen panel to that area's real research image.
 * On small screens each row carries its own image instead.
 */
export function ResearchIndex({ areas }: { areas: AreaLite[] }) {
  const [active, setActive] = useState(0);
  const a = areas[active];
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <ul className="border-b border-steel-200" onMouseLeave={() => undefined}>
        {areas.map((ar, i) => {
          const on = i === active;
          return (
            <li key={ar.slug} className="border-t border-steel-200">
              <Link
                href={`/research/${ar.slug}/`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[1fr_auto] items-start gap-4 py-5 sm:py-6"
              >
                <span>
                  <span
                    className={`block font-display text-[1.35rem] font-bold leading-tight tracking-[-0.02em] transition-colors duration-300 sm:text-[1.6rem] ${
                      on ? "text-maroon-700" : "text-navy-900"
                    }`}
                  >
                    {ar.title}
                  </span>
                  <span
                    className={`mt-2 block max-w-[54ch] text-[15px] leading-relaxed text-steel-600 transition-[opacity] duration-300 lg:${on ? "opacity-100" : "opacity-100"}`}
                  >
                    {ar.short}
                  </span>
                  {/* mobile image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ar.image} alt={ar.imageAlt} loading="lazy" className="mt-4 aspect-[16/9] w-full bg-navy-950 object-cover lg:hidden" />
                </span>
                <span
                  className={`mt-1.5 flex size-10 items-center justify-center rounded-full border transition-all duration-300 ${
                    on ? "border-maroon-700 bg-maroon-700 text-white" : "border-steel-300 text-navy-900 group-hover:border-maroon-700"
                  }`}
                  aria-hidden
                >
                  <ArrowRight className={`size-4 transition-transform duration-300 ${on ? "translate-x-0.5" : ""}`} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="relative hidden lg:block" aria-hidden>
        <div className="sticky top-32">
          <div className="relative aspect-[4/3] overflow-hidden bg-navy-950">
            {areas.map((ar, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={ar.slug}
                src={ar.image}
                alt=""
                className={`absolute inset-0 h-full w-full object-contain p-6 transition-[opacity,transform,filter] duration-700 ease-[var(--ease-out-expo)] ${
                  i === active ? "scale-100 opacity-100 blur-0" : "scale-[1.03] opacity-0 blur-sm"
                }`}
              />
            ))}
          </div>
          <div className="rule-metal" />
          <div className="flex items-start justify-between gap-6 bg-steel-50 px-6 py-5">
            <div>
              <p className="font-display text-[15px] font-bold text-navy-900">{a.title}</p>
              <p className="mt-1 text-[13.5px] text-steel-600">
                {a.themes.slice(0, 3).join(" · ")}
              </p>
            </div>
            <p className="shrink-0 text-right text-[13px] leading-snug text-steel-500">
              <span className="tabular block font-display text-[1.35rem] font-extrabold text-navy-900">{a.facultyCount}</span>
              faculty
            </p>
          </div>
          <p className="mt-3 text-[12.5px] text-steel-500">Image: research group of {a.credit}, IIT Kharagpur</p>
        </div>
      </div>
    </div>
  );
}
