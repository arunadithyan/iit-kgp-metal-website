import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  AreaSlug,
  EventItem,
  Faculty,
  NewsItem,
  PersonGroup,
  Publication,
  ResearchArea,
} from "./types";

const ROOT = path.join(process.cwd(), "content");

function readJson<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")) as T;
}

function listFiles(dir: string, ext: string): string[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext))
    .sort();
}

/* ---------- site ---------- */

export interface Site {
  department: string;
  shortName: string;
  institute: string;
  tagline: string;
  established: number;
  renamed: number;
  about: string[];
  vision: string;
  mission: string;
  headMessage: { name: string; facultySlug: string; role: string; paragraphs: string[] };
  stats: { value: string; label: string; source: string }[];
  milestones: { year: string; text: string }[];
  alumni: { name: string; note: string }[];
  contact: {
    addressLines: string[];
    headEmail: string;
    headPhone: string;
    officeEmail: string | null;
    institutePhone: string;
    instituteFax: string;
    mapQuery: string;
  };
  links: Record<string, string>;
  sources: { label: string; url: string }[];
}

let siteCache: Site | null = null;
export function getSite(): Site {
  return (siteCache ??= readJson<Site>("site.json"));
}

/* ---------- faculty ---------- */

const RANK: Record<string, number> = {
  "Distinguished Professor": 0,
  Professor: 1,
  "Associate Professor": 2,
  "Assistant Professor Grade-I": 3,
  "Assistant Professor Grade-II": 4,
};

let facultyCache: Faculty[] | null = null;
export function getFaculty(): Faculty[] {
  if (facultyCache) return facultyCache;
  const list = listFiles("faculty", ".json").map((f) => readJson<Faculty>(`faculty/${f}`));
  list.sort((a, b) => a.name.localeCompare(b.name));
  return (facultyCache = list);
}

export function getFacultyBySlug(slug: string): Faculty | undefined {
  return getFaculty().find((f) => f.slug === slug);
}

export function facultyRank(f: Faculty): number {
  return RANK[f.designation] ?? 9;
}

export function getHead(): Faculty | undefined {
  return getFaculty().find((f) => f.isHead);
}

/* ---------- research areas ---------- */

let areaCache: ResearchArea[] | null = null;
export function getAreas(): ResearchArea[] {
  if (areaCache) return areaCache;
  const list = listFiles("research-areas", ".json").map((f) =>
    readJson<ResearchArea>(`research-areas/${f}`),
  );
  list.sort((a, b) => a.order - b.order);
  return (areaCache = list);
}

export function getArea(slug: string): ResearchArea | undefined {
  return getAreas().find((a) => a.slug === slug);
}

export function facultyForArea(slug: AreaSlug): Faculty[] {
  return getFaculty()
    .filter((f) => f.areas.includes(slug))
    .sort((a, b) => facultyRank(a) - facultyRank(b) || a.name.localeCompare(b.name));
}

/* ---------- publications ---------- */

type RawPub = Omit<Publication, "id" | "areas">;

let pubCache: Publication[] | null = null;
export function getPublications(): Publication[] {
  if (pubCache) return pubCache;
  const fac = new Map(getFaculty().map((f) => [f.slug, f]));
  const out: Publication[] = [];
  for (const file of listFiles("publications", ".json")) {
    const data = readJson<{ faculty: string; items: RawPub[] }>(`publications/${file}`);
    data.items.forEach((p, i) => {
      const areas = new Set<AreaSlug>();
      p.faculty.forEach((s) => fac.get(s)?.areas.forEach((a) => areas.add(a)));
      out.push({ ...p, id: `${data.faculty}-${i}`, areas: [...areas] });
    });
  }
  out.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title));
  return (pubCache = out);
}

export function publicationsForFaculty(slug: string): Publication[] {
  return getPublications().filter((p) => p.faculty.includes(slug));
}

export function publicationsForArea(slug: AreaSlug): Publication[] {
  return getPublications().filter((p) => p.areas.includes(slug));
}

export function publicationsByYear(from: number, to: number) {
  const counts = new Map<number, number>();
  for (let y = from; y <= to; y++) counts.set(y, 0);
  for (const p of getPublications()) {
    if (p.year && p.year >= from && p.year <= to && p.type === "Journal")
      counts.set(p.year, (counts.get(p.year) ?? 0) + 1);
  }
  return [...counts.entries()].map(([year, count]) => ({ year, count }));
}

/* ---------- news & events ---------- */

function readMd<T>(dir: string, file: string): T {
  const raw = fs.readFileSync(path.join(ROOT, dir, file), "utf8");
  const { data, content } = matter(raw);
  const norm: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    norm[k] = v instanceof Date ? v.toISOString().slice(0, 10) : v;
  }
  return { slug: file.replace(/\.md$/, ""), ...norm, body: content.trim() } as T;
}

export function getNews(): NewsItem[] {
  const list = listFiles("news", ".md").map((f) => {
    const n = readMd<Partial<NewsItem>>("news", f);
    const defaults = { year: null, date: null, image: null, imageAlt: null, faculty: null, dateNote: null };
    return Object.assign(defaults, n) as NewsItem;
  });
  const key = (n: NewsItem) => n.date ?? (n.year ? `${n.year}` : "0000");
  return list
    .filter((n) => !n.placeholder)
    .sort((a, b) => key(b).localeCompare(key(a)) || a.title.localeCompare(b.title));
}

export function getNewsItem(slug: string) {
  return getNews().find((n) => n.slug === slug);
}

export function getEvents(): EventItem[] {
  return listFiles("events", ".md")
    .map((f) => Object.assign({ speakers: [], gallery: [] }, readMd<Partial<EventItem>>("events", f)) as EventItem)
    .sort((a, b) => (a.start ?? "9999").localeCompare(b.start ?? "9999"));
}

export function getEvent(slug: string) {
  return getEvents().find((e) => e.slug === slug);
}

export function splitEvents(today = new Date().toISOString().slice(0, 10)) {
  const all = getEvents();
  const real = all.filter((e) => !e.placeholder && e.start);
  return {
    upcoming: real.filter((e) => (e.end ?? e.start)! >= today),
    past: real.filter((e) => (e.end ?? e.start)! < today).reverse(),
    placeholders: all.filter((e) => e.placeholder),
  };
}

/* ---------- people groups, labs, academics ---------- */

export const PEOPLE_GROUPS = [
  { slug: "emeritus", title: "Emeritus Faculty" },
  { slug: "visiting", title: "Visiting Faculty" },
  { slug: "postdocs", title: "Postdoctoral Researchers" },
  { slug: "scholars", title: "Research Scholars" },
  { slug: "staff", title: "Technical and Administrative Staff" },
  { slug: "former-faculty", title: "Former Faculty" },
] as const;

export function getPeopleGroup(slug: string): PersonGroup {
  return readJson<PersonGroup>(`people/${slug}.json`);
}

export interface Labs {
  note: string;
  groups: { group: string; items: string[] }[];
}
export function getLabs(): Labs {
  return readJson<Labs>("labs.json");
}

export interface Academics {
  intro: string;
  programmes: {
    slug: string;
    level: string;
    name: string;
    code: string;
    duration: string;
    summary: string;
    curriculumKey: string | null;
  }[];
  admissions: { title: string; text: string; url: string }[];
  scholarships: { title: string; url: string }[];
  regulations: { title: string; url: string }[];
  resources: { title: string; url: string }[];
}
export function getAcademics(): Academics {
  return readJson<Academics>("academics.json");
}

export interface Curricula {
  note: string;
  sourceUrl: string;
  [key: string]:
    | string
    | {
        course: string;
        semesters: {
          semester: number;
          subjects: { type: string; code: string; name: string; ltp: string; credits: number | null }[];
        }[];
      };
}
export function getCurricula(): Curricula {
  return readJson<Curricula>("curricula.json");
}

/* ---------- derived ---------- */

export function getFunders(): { name: string; count: number }[] {
  const m = new Map<string, number>();
  for (const f of getFaculty())
    for (const p of [...f.currentProjects, ...f.completedProjects])
      if (p.funder) m.set(p.funder, (m.get(p.funder) ?? 0) + 1);
  return [...m.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getCurrentProjects() {
  const out: { project: { title: string; role: string; funder: string | null }; faculty: Faculty }[] = [];
  for (const f of getFaculty())
    for (const p of f.currentProjects) out.push({ project: p, faculty: f });
  return out;
}
