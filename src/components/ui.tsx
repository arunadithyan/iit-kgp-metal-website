import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function SectionHeading({
  title,
  intro,
  action,
  as: Tag = "h2",
  dark = false,
  id,
}: {
  title: string;
  intro?: ReactNode;
  action?: { label: string; href: string };
  as?: "h1" | "h2" | "h3";
  dark?: boolean;
  id?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <Tag
          id={id}
          className={`font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[2.5rem] ${
            dark ? "text-white" : "text-navy-900"
          }`}
        >
          {title}
        </Tag>
        {intro && (
          <p className={`mt-4 max-w-[62ch] text-[17px] leading-relaxed ${dark ? "text-navy-100" : "text-steel-600"}`}>{intro}</p>
        )}
      </div>
      {action && <TextLink href={action.href} dark={dark}>{action.label}</TextLink>}
    </div>
  );
}

export function TextLink({
  href,
  children,
  dark = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  const external = /^https?:/.test(href);
  const cls = `group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold ${
    dark ? "text-white hover:text-maroon-100" : "text-maroon-700 hover:text-maroon-800"
  } ${className}`;
  const inner = (
    <>
      <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">{children}</span>
      {external ? (
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      ) : (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      )}
    </>
  );
  return external ? (
    <a href={href} className={cls} rel="noopener">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost-light" | "secondary";
}) {
  const styles = {
    primary:
      "bg-maroon-700 text-white hover:bg-maroon-800 shadow-[0_8px_20px_-10px_rgba(110,22,34,0.7)] active:translate-y-px",
    "ghost-light": "border border-white/60 text-white hover:bg-white hover:text-navy-900 active:translate-y-px",
    secondary: "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white active:translate-y-px",
  }[variant];
  return (
    <Link
      href={href}
      className={`group inline-flex h-12 items-center gap-2 rounded-sm px-6 text-[15px] font-semibold tracking-[0.01em] transition-[background-color,color,transform] duration-200 ${styles}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13.5px]">
      <ol className="flex flex-wrap items-center gap-1 text-navy-100">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 text-navy-100/60" aria-hidden />}
            {it.href ? (
              <Link href={it.href} className="hover:text-white hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-white">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Inner-page header band: navy, with a metallic hairline at its foot. */
export function PageHero({
  title,
  intro,
  crumbs,
  children,
  image,
}: {
  title: string;
  intro?: ReactNode;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy-900 text-white">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-900/60" />
        </>
      )}
      <Container className="relative py-14 sm:py-16 lg:py-20">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-6 max-w-4xl font-display text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem]">
          {title}
        </h1>
        {intro && <div className="mt-5 max-w-[64ch] text-[17.5px] leading-relaxed text-navy-100">{intro}</div>}
        {children}
      </Container>
      <div className="rule-metal-thick relative" />
    </section>
  );
}

export function Badge({ children, tone = "steel" }: { children: ReactNode; tone?: "steel" | "maroon" | "navy" | "amber" }) {
  const t = {
    steel: "bg-steel-100 text-steel-700",
    maroon: "bg-maroon-50 text-maroon-700",
    navy: "bg-navy-50 text-navy-700",
    amber: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  }[tone];
  return <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[12px] font-semibold tracking-[0.02em] ${t}`}>{children}</span>;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-dashed border-steel-300 bg-steel-50 px-6 py-10 text-center sm:px-10">
      <p className="font-display text-lg font-bold text-navy-900">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-[56ch] text-[15px] leading-relaxed text-steel-600">{children}</div>}
    </div>
  );
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function Portrait({
  src,
  name,
  className = "",
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  if (!src)
    return (
      <div
        className={`flex items-center justify-center bg-navy-50 font-display font-bold text-navy-700 ${className}`}
        aria-hidden
      >
        <span className="text-[1.4em]">{initials(name)}</span>
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`Portrait of ${name}`} loading="lazy" className={`bg-steel-100 object-cover object-top ${className}`} />;
}
