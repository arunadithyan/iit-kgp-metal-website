import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSite } from "@/lib/content";
import { NAV } from "@/lib/nav";
import { Container } from "./ui";

export function SiteFooter() {
  const site = getSite();
  const cols = NAV.filter((n) => ["About", "People", "Research", "Academics"].includes(n.label));
  return (
    <footer className="on-dark bg-navy-950 text-navy-100">
      <div className="rule-metal-thick" />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/iitkgp-wordmark-white.png" alt="Indian Institute of Technology Kharagpur" className="h-[52px] w-auto" />
          <p className="mt-6 font-display text-xl font-bold text-white">{site.department}</p>
          <address className="mt-5 space-y-3 text-[15px] not-italic leading-relaxed">
            <p className="flex gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-maroon-100" aria-hidden />
              <span>
                {site.contact.addressLines.slice(1).map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-maroon-100" aria-hidden />
              <a href={`tel:${site.contact.headPhone.replace(/[^+\d]/g, "")}`} className="tabular hover:text-white">
                {site.contact.headPhone}
              </a>
              <span className="text-navy-100/60">(Head’s office)</span>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-maroon-100" aria-hidden />
              <a href={`mailto:${site.contact.headEmail}`} className="break-all hover:text-white">
                {site.contact.headEmail}
              </a>
            </p>
          </address>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {cols.map((c) => (
            <nav key={c.label} aria-label={`${c.label} links`}>
              <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-white">{c.label}</h2>
              <ul className="mt-4 space-y-2.5 text-[14.5px]">
                {c.children!.slice(0, 7).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-[13.5px] text-navy-100/80 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/publications/" className="hover:text-white">Publications</Link>
            <Link href="/events-news/" className="hover:text-white">Events &amp; News</Link>
            <Link href="/contact/" className="hover:text-white">Contact</Link>
            <a href={site.links.institute} className="hover:text-white">IIT Kharagpur</a>
            <a href={site.links.steelTechnologyCentre} className="hover:text-white">Steel Technology Centre</a>
          </div>
          <p>
            © {new Date().getFullYear()} {site.department}, {site.institute}
          </p>
        </Container>
      </div>
    </footer>
  );
}
