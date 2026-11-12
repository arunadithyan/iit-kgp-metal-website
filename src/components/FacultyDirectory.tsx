"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Mail, Search, X } from "lucide-react";

interface F {
  slug: string;
  name: string;
  designation: string;
  isHead: boolean;
  email: string | null;
  photo: string | null;
  researchInterests: string[];
  areas: string[];
}

const RANKS = ["All", "Professor", "Associate Professor", "Assistant Professor"];

export function FacultyDirectory({ faculty, areas }: { faculty: F[]; areas: { slug: string; title: string }[] }) {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("all");
  const [rank, setRank] = useState("All");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return faculty.filter((f) => {
      if (area !== "all" && !f.areas.includes(area)) return false;
      if (rank !== "All") {
        if (rank === "Professor" && !/^(Distinguished )?Professor$/.test(f.designation)) return false;
        if (rank !== "Professor" && !f.designation.startsWith(rank)) return false;
      }
      if (!needle) return true;
      return (f.name + " " + f.researchInterests.join(" ")).toLowerCase().includes(needle);
    });
  }, [faculty, q, area, rank]);

  return (
    <div>
      <div className="sticky top-[4.75rem] z-20 -mx-4 border-b border-steel-200 bg-white/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_0.8fr]">
          <label className="relative block">
            <span className="sr-only">Search faculty by name or research interest</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-400" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or research interest"
              className="h-12 w-full rounded-sm border border-steel-300 bg-white pl-10 pr-4 text-[15px] text-ink placeholder:text-steel-500 focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by research area</span>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-12 w-full rounded-sm border border-steel-300 bg-white px-3 text-[15px] text-ink focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15"
            >
              <option value="all">All research areas</option>
              {areas.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter by designation</span>
            <select
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="h-12 w-full rounded-sm border border-steel-300 bg-white px-3 text-[15px] text-ink focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15"
            >
              {RANKS.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All designations" : r + "s"}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 flex items-center gap-3 text-[14px] text-steel-600" aria-live="polite">
          <span className="tabular">
            {list.length} of {faculty.length} faculty
          </span>
          {(q || area !== "all" || rank !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setArea("all");
                setRank("All");
              }}
              className="inline-flex items-center gap-1 font-semibold text-maroon-700 hover:underline"
            >
              <X className="size-3.5" aria-hidden /> Clear filters
            </button>
          )}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-lg font-bold text-navy-900">No faculty match these filters</p>
          <p className="mt-2 text-steel-600">Try a broader search term, or clear the filters.</p>
        </div>
      ) : (
        <ul className="grid gap-x-10 pt-2 md:grid-cols-2 xl:grid-cols-3">
          {list.map((f) => (
            <li key={f.slug} className="group relative flex gap-5 border-b border-steel-200 py-7">
              {f.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.photo}
                  alt=""
                  loading="lazy"
                  className="h-32 w-[6.5rem] shrink-0 bg-steel-100 object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-32 w-[6.5rem] shrink-0 items-center justify-center bg-navy-50 font-display text-2xl font-bold text-navy-700" aria-hidden>
                  {f.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-display text-[18px] font-bold leading-tight text-navy-900">
                  <Link href={`/people/faculty/${f.slug}/`} className="after:absolute after:inset-0 group-hover:text-maroon-700">
                    {f.name}
                  </Link>
                </h3>
                <p className="mt-1 text-[14px] font-medium text-maroon-700">
                  {f.designation}
                  {f.isHead && <span className="block text-steel-600">Head of the Department</span>}
                </p>
                {f.researchInterests.length > 0 && (
                  <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-steel-600">{f.researchInterests.join(" · ")}</p>
                )}
                {f.email && (
                  <a
                    href={`mailto:${f.email}`}
                    className="relative z-10 mt-3 inline-flex max-w-full items-center gap-1.5 text-[13.5px] text-steel-600 hover:text-maroon-700"
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{f.email}</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
