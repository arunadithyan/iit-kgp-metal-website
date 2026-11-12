import { getFaculty, getPublications } from "@/lib/content";

export const dynamic = "force-static";

/** Compact publications index consumed by the client-side publications portal. */
export function GET() {
  const faculty = Object.fromEntries(getFaculty().map((f) => [f.slug, f.name]));
  const items = getPublications().map((p) => [
    p.title,
    p.authors,
    p.venue,
    p.volume,
    p.pages,
    p.year,
    p.type,
    p.faculty,
    p.areas,
    p.doi,
    p.url,
  ]);
  return Response.json({ faculty, items });
}
