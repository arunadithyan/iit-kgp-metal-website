export type AreaSlug =
  | "physical-mechanical"
  | "extractive-process"
  | "ceramics-composites"
  | "computational-ai"
  | "functional-devices"
  | "energy-sustainability";

export interface Project {
  title: string;
  role: string;
  funder: string | null;
}

export interface Faculty {
  name: string;
  slug: string;
  designation: string;
  isHead: boolean;
  email: string | null;
  phone: string | null;
  office: string | null;
  qualifications: string[];
  researchInterests: string[];
  areas: AreaSlug[];
  researchStatement: string[];
  awards: string[];
  currentProjects: Project[];
  completedProjects: Project[];
  photo: string | null;
  researchImage: string | null;
  website: string | null;
  googleScholar: string | null;
  orcid: string | null;
  profileUrl: string | null;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string | null;
  volume: string | null;
  pages: string | null;
  year: number | null;
  type: string;
  faculty: string[];
  areas: AreaSlug[];
  doi: string | null;
  url: string | null;
  abstract: string | null;
}

export interface ResearchArea {
  slug: AreaSlug;
  order: number;
  title: string;
  short: string;
  overview: string[];
  themes: string[];
  image: string;
  imageCredit: string;
  imageAlt: string;
  labs: string[];
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string | null;
  year: number | null;
  category: string;
  image: string | null;
  imageAlt: string | null;
  faculty: string | null;
  source: string | null;
  sourceUrl: string | null;
  dateNote: string | null;
  placeholder: boolean;
  body: string;
}

export interface EventItem {
  slug: string;
  title: string;
  start: string | null;
  end: string | null;
  category: string;
  venue: string | null;
  speakers: { name: string; affiliation?: string }[];
  registrationUrl: string | null;
  poster: string | null;
  gallery: string[];
  placeholder: boolean;
  body: string;
}

export interface PersonGroup {
  title: string;
  note?: string;
  people: Record<string, string>[];
}
