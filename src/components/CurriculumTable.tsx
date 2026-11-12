"use client";

import { useState } from "react";

interface Cur {
  key: string;
  label: string;
  data: {
    course: string;
    semesters: { semester: number; subjects: { type: string; code: string; name: string; ltp: string; credits: number | null }[] }[];
  };
}

export function CurriculumTable({ curricula }: { curricula: Cur[] }) {
  const [active, setActive] = useState(0);
  const cur = curricula[active];
  return (
    <div>
      <div role="tablist" aria-label="Programme" className="flex flex-wrap gap-2">
        {curricula.map((c, i) => (
          <button
            key={c.key}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`cur-${c.key}`}
            onClick={() => setActive(i)}
            className={`rounded-sm border px-4 py-2.5 text-[14.5px] font-semibold transition-colors ${
              i === active ? "border-navy-900 bg-navy-900 text-white" : "border-steel-300 bg-white text-navy-900 hover:border-navy-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div id={`cur-${cur.key}`} role="tabpanel" className="mt-8 grid gap-10 xl:grid-cols-2">
        {cur.data.semesters.map((s) => {
          const total = s.subjects.reduce((n, x) => n + (x.credits ?? 0), 0);
          return (
            <div key={s.semester} className="overflow-x-auto bg-white">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[14.5px]">
                <caption className="border-b-2 border-navy-900 px-4 py-3 text-left">
                  <span className="font-display text-[1.1rem] font-bold text-navy-900">Semester {s.semester}</span>
                  <span className="tabular ml-3 text-[13.5px] text-steel-500">{total} credits listed</span>
                </caption>
                <thead>
                  <tr className="text-[12px] uppercase tracking-[0.08em] text-steel-500">
                    <th scope="col" className="px-4 py-2.5 font-semibold">Code</th>
                    <th scope="col" className="py-2.5 pr-4 font-semibold">Subject</th>
                    <th scope="col" className="py-2.5 pr-4 font-semibold">L–T–P</th>
                    <th scope="col" className="py-2.5 pr-4 text-right font-semibold">Credits</th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {s.subjects.map((x) => (
                    <tr key={x.code} className="border-t border-steel-200 align-top">
                      <td className="whitespace-nowrap px-4 py-2.5 text-steel-600">{x.code}</td>
                      <td className={`py-2.5 pr-4 ${x.code.startsWith("MT") ? "font-semibold text-navy-900" : "text-steel-700"}`}>{x.name}</td>
                      <td className="py-2.5 pr-4 text-steel-600">{x.ltp}</td>
                      <td className="py-2.5 pr-4 text-right text-navy-900">{x.credits ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-[13.5px] text-steel-500">Department subjects (code MT) are shown in bold.</p>
    </div>
  );
}
