import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFacultyBySlug, getNews, getNewsItem } from "@/lib/content";
import { Container, PageHero, TextLink } from "@/components/ui";
import { formatNewsDate } from "@/components/cards";

export function generateStaticParams() {
  return getNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = getNewsItem((await params).slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.body.slice(0, 160),
    alternates: { canonical: `/news/${n.slug}/` },
    openGraph: n.image ? { images: [n.image] } : undefined,
  };
}

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNewsItem((await params).slug);
  if (!n) notFound();
  const f = n.faculty ? getFacultyBySlug(n.faculty) : undefined;
  const more = getNews().filter((x) => x.slug !== n.slug).slice(0, 3);
  return (
    <>
      <PageHero
        title={n.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Events & News", href: "/events-news/#news" }, { label: n.category }]}
        intro={
          <p className="text-[15px]">
            <span className="font-semibold uppercase tracking-[0.08em] text-maroon-100">{n.category}</span>
            <span className="mx-2 text-navy-100/50">·</span>
            <span className="tabular">{formatNewsDate(n)}</span>
          </p>
        }
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_20rem] lg:gap-16 lg:py-16">
        <article>
          {n.image && (
            <figure className="mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.image} alt={n.imageAlt ?? ""} className="w-full" />
              {n.imageAlt && <figcaption className="mt-2 text-[13.5px] text-steel-500">{n.imageAlt}</figcaption>}
            </figure>
          )}
          <div className="prose-body max-w-[68ch] text-[18px] leading-relaxed text-steel-700">
            {n.body.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {(n.dateNote || n.source) && (
            <p className="mt-10 max-w-[68ch] border-t border-steel-200 pt-5 text-[13.5px] text-steel-500">
              {n.dateNote && <span className="block">{n.dateNote}</span>}
              {n.source && (
                <span className="block">
                  Source:{" "}
                  {n.sourceUrl ? (
                    <a href={n.sourceUrl} className="underline hover:text-maroon-700">
                      {n.source}
                    </a>
                  ) : (
                    n.source
                  )}
                </span>
              )}
            </p>
          )}
          {f && (
            <TextLink href={`/people/faculty/${f.slug}/`} className="mt-8">
              Profile of Prof. {f.name}
            </TextLink>
          )}
        </article>
        <aside>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel-500">More news</h2>
          <ul className="mt-3 divide-y divide-steel-200 border-y border-steel-200">
            {more.map((m) => (
              <li key={m.slug} className="py-4">
                <Link href={`/news/${m.slug}/`} className="font-display text-[16px] font-bold leading-snug text-navy-900 hover:text-maroon-700">
                  {m.title}
                </Link>
                <p className="mt-1 text-[13px] text-steel-500">{formatNewsDate(m)}</p>
              </li>
            ))}
          </ul>
          <TextLink href="/events-news/#news" className="mt-5">
            All news
          </TextLink>
        </aside>
      </Container>
    </>
  );
}
