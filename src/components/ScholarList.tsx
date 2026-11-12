"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export function ScholarList({
  people,
  facultyNames,
}: {
  people: { name: string; area: string; supervisor: string }[];
  facultyNames: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    const sorted = [...people].sort((a, b) => a.name.localeCompare(b.name));
    return n ? sorted.filter((p) => `${p.name} ${p.area} ${facultyNames[p.supervisor]}`.toLowerCase().includes(n)) : sorted;
  }, [people, q, facultyNames]);
  return (
    <>
      <label className="relative block max-w-xl">
        <span className="sr-only">Search scholars by name, research area or supervisor</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-400" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, research area or supervisor"
          className="h-12 w-full rounded-sm border border-steel-300 bg-white pl-10 pr-4 text-[15px] placeholder:text-steel-500 focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15"
        />
      </label>
      <p className="tabular mt-3 text-[14px] text-steel-600" aria-live="polite">
        {list.length} of {people.length} scholars
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-[15px]">
          <thead>
            <tr className="border-b-2 border-navy-900 text-[13px] uppercase tracking-[0.08em] text-steel-500">
              <th scope="col" className="py-3 pr-6 font-semibold">Scholar</th>
              <th scope="col" className="py-3 pr-6 font-semibold">Area of research</th>
              <th scope="col" className="py-3 font-semibold">Supervisor</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => (
              <tr key={p.name + i} className="border-b border-steel-200 align-top hover:bg-steel-50">
                <td className="py-3.5 pr-6 font-medium text-navy-900">{p.name}</td>
                <td className="py-3.5 pr-6 text-steel-700">{p.area}</td>
                <td className="py-3.5">
                  <Link href={`/people/faculty/${p.supervisor}/`} className="text-maroon-700 hover:underline">
                    Prof. {facultyNames[p.supervisor]}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
