"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, ExternalLink } from "lucide-react";
import { NAV } from "@/lib/nav";
import { Emblem } from "./Emblem";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/#.*$/, "").replace(/\/$/, ""));
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [drawerTop, setDrawerTop] = useState(76);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    if (mobile && headerRef.current) setDrawerTop(Math.round(headerRef.current.getBoundingClientRect().bottom));
  }, [mobile]);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900 focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Institutional strip */}
      <div className="on-dark bg-navy-950 text-[13px] text-navy-100">
        <div className="mx-auto flex h-9 max-w-[88rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <a
            href="https://www.iitkgp.ac.in/"
            className="flex items-center gap-2 font-medium tracking-wide text-white/90 hover:text-white"
          >
            <span>Indian Institute of Technology Kharagpur</span>
          </a>
          <nav aria-label="Institute links" className="hidden items-center gap-5 md:flex">
            {[
              ["Institute website", "https://www.iitkgp.ac.in/"],
              ["ERP", "https://erp.iitkgp.ac.in"],
              ["Central Library", "https://www.iitkgp.ac.in/academics-library"],
              ["Campus map", "https://www.iitkgp.ac.in/campus-map"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-navy-100/80 hover:text-white">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Department bar */}
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-steel-200 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex h-[4.75rem] max-w-[88rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Department of Metallurgical and Materials Engineering, IIT Kharagpur — home">
            <Emblem className="h-11 w-10 shrink-0 bg-navy-900" />
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[14.5px] font-bold leading-[1.15] tracking-[-0.01em] text-navy-900 sm:text-[16.5px]">
                Metallurgical &amp; Materials Engineering
              </span>
              <span className="mt-0.5 block text-[12.5px] text-steel-500">
                IIT Kharagpur<span className="hidden sm:inline"> · Established 1954</span>
              </span>
            </span>
          </Link>

          <nav ref={navRef} aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center">
              {NAV.map((item, idx) => {
                const active = isActive(pathname, item.href);
                const expanded = open === item.label;
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.children && enter(item.label)}
                    onMouseLeave={() => item.children && leave()}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        aria-current={active && pathname === item.href ? "page" : undefined}
                        className={`relative px-3 py-2 text-[13.5px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                          active ? "text-maroon-700" : "text-navy-900 hover:text-maroon-700"
                        }`}
                      >
                        {item.label}
                        {active && (
                          <span aria-hidden className="absolute inset-x-3 -bottom-[1.1rem] h-[3px] bg-maroon-700" />
                        )}
                      </Link>
                      {item.children && (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`menu-${item.label}`}
                          aria-label={`${item.label} menu`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpen(expanded ? null : item.label);
                          }}
                          className="-ml-2 mr-1 rounded p-1 text-steel-500 hover:text-maroon-700"
                        >
                          <ChevronDown
                            className={`size-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                      )}
                    </div>
                    {item.children && (
                      <div
                        id={`menu-${item.label}`}
                        className={`absolute ${idx >= NAV.length - 3 ? "right-0" : "left-0"} top-full pt-[1.15rem] transition-[opacity,transform] duration-200 ease-[var(--ease-out-expo)] ${
                          expanded ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                        }`}
                      >
                        <ul className="min-w-[19rem] border border-steel-200 border-t-maroon-700 border-t-2 bg-white py-2 shadow-[0_18px_40px_-18px_rgba(10,31,61,0.35)]">
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className="block px-5 py-2.5 text-[14.5px] text-steel-700 hover:bg-steel-50 hover:text-maroon-700 focus-visible:bg-steel-50"
                                onClick={() => setOpen(null)}
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-sm border border-steel-200 px-3 py-2 text-sm font-semibold text-navy-900 xl:hidden"
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            Menu
          </button>
        </div>

      </header>
        {/* Mobile drawer */}
      <div
        id="mobile-menu"
        hidden={!mobile}
        style={{ top: drawerTop }}
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-steel-200 bg-white xl:hidden"
      >
        <nav aria-label="Main mobile" className="mx-auto max-w-2xl px-4 pb-16 pt-2 sm:px-6">
          <ul className="divide-y divide-steel-200">
            {NAV.map((item) => {
              const expanded = mobileSection === item.label;
              return (
                <li key={item.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={`flex-1 py-4 font-display text-lg font-semibold ${
                        isActive(pathname, item.href) ? "text-maroon-700" : "text-navy-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-label={`Show ${item.label} pages`}
                        onClick={() => setMobileSection(expanded ? null : item.label)}
                        className="p-3 text-steel-500"
                      >
                        <ChevronDown className={`size-5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                    )}
                  </div>
                  {item.children && expanded && (
                    <ul className="pb-4">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block py-2 pl-4 text-[15px] text-steel-600 hover:text-maroon-700">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-steel-600">
            <a href="https://www.iitkgp.ac.in/" className="inline-flex items-center gap-1">
              Institute website <ExternalLink className="size-3.5" aria-hidden />
            </a>
            <a href="https://erp.iitkgp.ac.in" className="inline-flex items-center gap-1">
              ERP <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
        </nav>
      </div>

    </>
  );
}
