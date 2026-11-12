import type { MetadataRoute } from "next";
import { PEOPLE_GROUPS, getAreas, getEvents, getFaculty, getNews } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about/",
    "/people/",
    "/research/",
    "/research/facilities/",
    "/publications/",
    "/events-news/",
    "/academics/",
    "/contact/",
    ...PEOPLE_GROUPS.map((g) => `/people/${g.slug}/`),
    ...getFaculty().map((f) => `/people/faculty/${f.slug}/`),
    ...getAreas().map((a) => `/research/${a.slug}/`),
    ...getNews().map((n) => `/news/${n.slug}/`),
    ...getEvents()
      .filter((e) => !e.placeholder)
      .map((e) => `/events/${e.slug}/`),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}` }));
}
