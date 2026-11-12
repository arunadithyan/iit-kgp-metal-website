"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, Search, X } from "lucide-react";
import { PublicationRow } from "./cards";
import type { AreaSlug, Publication } from "@/lib/types";

type Row = [string, string, string | null, string | null, string | null, number | null, string, string[], AreaSlug[], string | null, string | null];

const PAGE = 25;

function toPub(r: Row, i: number): Publication {
  const [title, authors, venue, volume, pages, year, type, faculty, areas, doi, url] = r;
  return { id: String(i), title, authors, venue, volume, pages, year, type, faculty, areas, doi, url, abstract: null };
}

function csvCell(v: unknown) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function download(name: string, text: string, mime: string) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function PublicationsExplorer({ areas }: { areas: { slug: string; title: string }[] }) {
  const [data, setData] = useState<{ faculty: Record<string, string>; pubs: Publication[] } | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [year, setYear] = useState("all");
  const [area, setArea] = useState("all");
  const [type, setType] = useState("all");
  const [fac, setFac] = useState("all");
  const [sort, setSort] = useState("newest");
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("area")) setArea(p.get("area")!);
    if (p.get("faculty")) setFac(p.get("faculty")!);
    if (p.get("type")) setType(p.get("type")!);
    if (p.get("year")) setYear(p.get("year")!);
    if (p.get("q")) setQ(p.get("q")!);
    fetch("/data/publications.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((j: { faculty: Record<string, string>; items: Row[] }) => setData({ faculty: j.faculty, pubs: j.items.map(toPub) }))
      .catch(() => setError(true));
  }, []);

  // keep the URL shareable
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (year !== "all") p.set("year", year);
    if (area !== "all") p.set("area", area);
    if (type !== "all") p.set("type", type);
    if (fac !== "all") p.set("faculty", fac);
    const s = p.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
    setShown(PAGE);
  }, [q, year, area, type, fac]);

  const options = useMemo(() => {
    if (!data) return { years: [] as number[], types: [] as [string, number][] };
    const years = [...new Set(data.pubs.map((p) => p.year).filter(Boolean) as number[])].sort((a, b) => b - a);
    const tc = new Map<string, number>();
    data.pubs.forEach((p) => tc.set(p.type, (tc.get(p.type) ?? 0) + 1));
    return { years, types: [...tc.entries()].sort((a, b) => b[1] - a[1]) };
  }, [data]);

  const results = useMemo(() => {
    if (!data) return [];
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = data.pubs.filter((p) => {
      if (year !== "all" && String(p.year) !== year) return false;
      if (area !== "all" && !p.areas.includes(area as AreaSlug)) return false;
      if (type !== "all" && p.type !== type) return false;
      if (fac !== "all" && !p.faculty.includes(fac)) return false;
      if (terms.length) {
        const hay = `${p.title} ${p.authors} ${p.venue ?? ""} ${p.faculty.map((s) => data.faculty[s]).join(" ")}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      }
      return true;
    });
    if (sort === "oldest") list.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
    else if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    return list;
  }, [data, q, year, area, type, fac, sort]);

  const active = q || year !== "all" || area !== "all" || type !== "all" || fac !== "all";
  const sel =
    "h-12 w-full rounded-sm border border-steel-300 bg-white px-3 text-[15px] text-ink focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15";

  const exportCsv = () => {
    const head = ["Title", "Authors", "Venue", "Volume", "Pages", "Year", "Type", "Department faculty", "DOI"];
    const rows = results.map((p) =>
      [p.title, p.authors, p.venue, p.volume, p.pages, p.year, p.type, p.faculty.map((s) => data!.faculty[s]).join("; "), p.doi].map(csvCell).join(","),
    );
    download("mme-iitkgp-publications.csv", [head.join(","), ...rows].join("\n"), "text/csv;charset=utf-8");
  };
  const exportBib = () => {
    const out = results.map((p, i) => {
      const kind = p.type === "Journal" ? "article" : p.type.startsWith("Book") ? "incollection" : p.type === "Patent" ? "misc" : "inproceedings";
      const key = `mme${p.year ?? "nd"}_${i}`;
      const f = [
        `  title = {${p.title}}`,
        `  author = {${p.authors.replace(/\.,\s*/g, ". and ")}}`,
        p.venue && `  ${kind === "article" ? "journal" : "booktitle"} = {${p.venue}}`,
        p.volume && `  volume = {${p.volume}}`,
        p.pages && `  pages = {${p.pages}}`,
        p.year && `  year = {${p.year}}`,
        p.doi && `  doi = {${p.doi}}`,
      ].filter(Boolean);
      return `@${kind}{${key},\n${f.join(",\n")}\n}`;
    });
    download("mme-iitkgp-publications.bib", out.join("\n\n"), "application/x-bibtex");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-14">
      <aside aria-label="Filter publications" className="lg:sticky lg:top-28 lg:self-start">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-600">Search</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-400" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Title, author or journal"
                className="h-12 w-full rounded-sm border border-steel-300 bg-white pl-10 pr-3 text-[15px] placeholder:text-steel-500 focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-600">Research area</span>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={sel}>
              <option value="all">All areas</option>
              {areas.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-600">Year</span>
            <select value={year} onChange={(e) => setYear(e.target.value)} className={sel}>
              <option value="all">All years</option>
              {options.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-600">Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className={sel}>
              <option value="all">All types</option>
              {options.types.map(([t, n]) => (
                <option key={t} value={t}>
                  {t} ({n})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-600">Faculty member</span>
            <select value={fac} onChange={(e) => setFac(e.target.value)} className={sel}>
              <option value="all">All faculty</option>
              {data &&
                Object.entries(data.faculty)
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map(([s, n]) => (
                    <option key={s} value={s}>
                      {n}
                    </option>
                  ))}
            </select>
          </label>
          {active && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setYear("all");
                setArea("all");
                setType("all");
                setFac("all");
              }}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-maroon-700 hover:underline"
            >
              <X className="size-4" aria-hidden /> Clear all filters
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-4 border-b-2 border-navy-900 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular text-[15px] text-steel-700" aria-live="polite">
            {data ? (
              <>
                <strong className="font-semibold text-navy-900">{results.length.toLocaleString("en-IN")}</strong> of{" "}
                {data.pubs.length.toLocaleString("en-IN")} publications
              </>
            ) : error ? (
              "The publications index could not be loaded."
            ) : (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden /> Loading publications…
              </span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[14px] text-steel-600">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-sm border border-steel-300 bg-white px-2 text-[14px] text-ink">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
              </select>
            </label>
            <button
              type="button"
              disabled={!results.length}
              onClick={exportCsv}
              className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-steel-300 px-3 text-[14px] font-semibold text-navy-900 hover:border-navy-900 disabled:opacity-40"
            >
              <Download className="size-4" aria-hidden /> CSV
            </button>
            <button
              type="button"
              disabled={!results.length}
              onClick={exportBib}
              className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-steel-300 px-3 text-[14px] font-semibold text-navy-900 hover:border-navy-900 disabled:opacity-40"
            >
              <Download className="size-4" aria-hidden /> BibTeX
            </button>
          </div>
        </div>

        {error && (
          <p className="py-10 text-steel-700">Please reload the page. If the problem continues, the publications index file may be missing from this deployment.</p>
        )}

        {data && results.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-display text-lg font-bold text-navy-900">No publications match these filters</p>
            <p className="mt-2 text-steel-600">Check the spelling, try fewer words, or clear a filter.</p>
          </div>
        )}

        {!data && !error && (
          <div className="space-y-6 py-6" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid gap-3 md:grid-cols-[5.5rem_1fr]">
                <div className="h-4 w-12 animate-pulse bg-steel-100" />
                <div className="space-y-2">
                  <div className="h-4 w-4/5 animate-pulse bg-steel-100" />
                  <div className="h-3 w-3/5 animate-pulse bg-steel-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {data && results.length > 0 && (
          <>
            <div className="divide-y divide-steel-200">
              {results.slice(0, shown).map((p) => (
                <PublicationRow key={p.id} pub={p} facultyNames={data.faculty} />
              ))}
            </div>
            {shown < results.length && (
              <div className="border-t border-steel-200 pt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShown((s) => s + PAGE * 2)}
                  className="inline-flex h-12 items-center rounded-sm bg-navy-900 px-6 font-semibold text-white hover:bg-navy-800"
                >
                  Show more ({(results.length - shown).toLocaleString("en-IN")} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
