import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Printer } from "lucide-react";
import { getSite } from "@/lib/content";
import { Container, PageHero, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Address, telephone, email and map for the Department of Metallurgical and Materials Engineering, IIT Kharagpur.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const site = getSite();
  const c = site.contact;
  const tel = (s: string) => `tel:${s.replace(/[^+\d]/g, "")}`;
  return (
    <>
      <PageHero title="Contact" crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} intro="Reach the Department office, the Head of the Department or individual faculty." />
      <section className="py-16 lg:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[1.6rem] font-bold text-navy-900">Department address</h2>
            <address className="mt-5 flex gap-3 text-[17px] not-italic leading-relaxed text-steel-700">
              <MapPin className="mt-1.5 size-5 shrink-0 text-maroon-700" aria-hidden />
              <span>
                {c.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </address>

            <dl className="mt-10 divide-y divide-steel-200 border-y border-steel-200">
              <div className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr]">
                <dt className="text-[14px] font-semibold text-steel-500">Head of the Department</dt>
                <dd className="space-y-1.5 text-[15.5px]">
                  <p className="font-semibold text-navy-900">{site.headMessage.name}</p>
                  <p className="flex items-center gap-2">
                    <Mail className="size-4 text-maroon-700" aria-hidden />
                    <a href={`mailto:${c.headEmail}`} className="hover:text-maroon-700 hover:underline">
                      {c.headEmail}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-maroon-700" aria-hidden />
                    <a href={tel(c.headPhone)} className="tabular hover:text-maroon-700">
                      {c.headPhone}
                    </a>
                  </p>
                </dd>
              </div>
              <div className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr]">
                <dt className="text-[14px] font-semibold text-steel-500">Department office</dt>
                <dd className="text-[15.5px] text-steel-700">
                  {c.officeEmail ? (
                    <a href={`mailto:${c.officeEmail}`} className="hover:text-maroon-700 hover:underline">
                      {c.officeEmail}
                    </a>
                  ) : (
                    <span className="text-steel-500">Office email to be added by the department.</span>
                  )}
                </dd>
              </div>
              <div className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr]">
                <dt className="text-[14px] font-semibold text-steel-500">IIT Kharagpur</dt>
                <dd className="space-y-1.5 text-[15.5px]">
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-maroon-700" aria-hidden />
                    <a href={tel(c.institutePhone)} className="tabular hover:text-maroon-700">
                      {c.institutePhone}
                    </a>
                    <span className="text-steel-500">(switchboard)</span>
                  </p>
                  <p className="flex items-center gap-2 text-steel-700">
                    <Printer className="size-4 text-maroon-700" aria-hidden />
                    <span className="tabular">{c.instituteFax}</span>
                    <span className="text-steel-500">(fax)</span>
                  </p>
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-col gap-3">
              <TextLink href="/people/">Faculty directory with individual email addresses</TextLink>
              <TextLink href={site.links.howToReach}>How to reach IIT Kharagpur</TextLink>
              <TextLink href={site.links.campusMap}>Campus map</TextLink>
            </div>
          </div>

          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-steel-200 bg-steel-100">
              <iframe
                title="Map showing the Department of Metallurgical and Materials Engineering, IIT Kharagpur"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&z=15&output=embed`}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`}
              rel="noopener"
              className="mt-3 inline-flex items-center gap-1 text-[14.5px] font-semibold text-maroon-700 hover:underline"
            >
              Open in Google Maps <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <figure className="mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/campus/main-building.webp" alt="The Main Building of IIT Kharagpur" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <figcaption className="mt-2 text-[13px] text-steel-500">
                The Main Building, IIT Kharagpur. Photographs of the department building can be added through the{" "}
                <Link href="/admin/" className="underline">
                  content manager
                </Link>
                .
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>
    </>
  );
}
