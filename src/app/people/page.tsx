import type { Metadata } from "next";
import { getAreas, getFaculty, facultyRank } from "@/lib/content";
import { Container, PageHero } from "@/components/ui";
import { PeopleNav } from "@/components/PeopleNav";
import { FacultyDirectory } from "@/components/FacultyDirectory";

export const metadata: Metadata = {
  title: "Faculty",
  description: "Faculty directory of the Department of Metallurgical and Materials Engineering, IIT Kharagpur. Search by name, research area or designation.",
  alternates: { canonical: "/people/" },
};

export default function PeoplePage() {
  const faculty = [...getFaculty()].sort(
    (a, b) => Number(b.isHead) - Number(a.isHead) || facultyRank(a) - facultyRank(b) || a.name.localeCompare(b.name),
  );
  const areas = getAreas().map((a) => ({ slug: a.slug, title: a.title }));
  return (
    <>
      <PageHero
        title="People"
        crumbs={[{ label: "Home", href: "/" }, { label: "People" }]}
        intro={`${faculty.length} faculty members lead teaching and research in the Department. Search by name or research interest, or filter by research area and designation.`}
      />
      <PeopleNav current="" />
      <section className="pb-24 pt-6">
        <Container>
          <FacultyDirectory
            faculty={faculty.map((f) => ({
              slug: f.slug,
              name: f.name,
              designation: f.designation,
              isHead: f.isHead,
              email: f.email,
              photo: f.photo,
              researchInterests: f.researchInterests,
              areas: f.areas,
            }))}
            areas={areas}
          />
          <p className="mt-10 text-[13.5px] text-steel-500">
            Faculty information is drawn from IIT Kharagpur institute profiles. Faculty members can update their entries through the department’s content
            manager.
          </p>
        </Container>
      </section>
    </>
  );
}
