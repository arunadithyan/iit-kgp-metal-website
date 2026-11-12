import Link from "next/link";
import { Container } from "./ui";

const TABS = [
  { slug: "", label: "Faculty" },
  { slug: "emeritus", label: "Emeritus" },
  { slug: "visiting", label: "Visiting" },
  { slug: "postdocs", label: "Postdoctoral" },
  { slug: "scholars", label: "Research scholars" },
  { slug: "staff", label: "Staff" },
  { slug: "former-faculty", label: "Former faculty" },
];

export function PeopleNav({ current }: { current: string }) {
  return (
    <div className="border-b border-steel-200 bg-white">
      <Container>
        <nav aria-label="People sections" className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const on = t.slug === current;
            return (
              <Link
                key={t.slug}
                href={`/people/${t.slug ? t.slug + "/" : ""}`}
                aria-current={on ? "page" : undefined}
                className={`whitespace-nowrap border-b-[3px] px-4 py-4 text-[14.5px] font-semibold transition-colors ${
                  on ? "border-maroon-700 text-maroon-700" : "border-transparent text-steel-600 hover:text-navy-900"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
