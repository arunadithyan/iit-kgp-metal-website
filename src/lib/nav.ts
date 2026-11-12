export interface NavChild {
  label: string;
  href: string;
  note?: string;
}
export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about/",
    children: [
      { label: "Department overview", href: "/about/" },
      { label: "History", href: "/about/#history" },
      { label: "Vision and mission", href: "/about/#vision" },
      { label: "Message from the Head", href: "/about/#head" },
      { label: "Achievements", href: "/about/#achievements" },
      { label: "Collaborations", href: "/about/#collaborations" },
      { label: "Photo gallery", href: "/about/#gallery" },
    ],
  },
  {
    label: "People",
    href: "/people/",
    children: [
      { label: "Faculty members", href: "/people/" },
      { label: "Emeritus faculty", href: "/people/emeritus/" },
      { label: "Visiting faculty", href: "/people/visiting/" },
      { label: "Postdoctoral researchers", href: "/people/postdocs/" },
      { label: "Research scholars", href: "/people/scholars/" },
      { label: "Technical and administrative staff", href: "/people/staff/" },
      { label: "Former faculty", href: "/people/former-faculty/" },
    ],
  },
  {
    label: "Research",
    href: "/research/",
    children: [
      { label: "Physical & Mechanical Metallurgy", href: "/research/physical-mechanical/" },
      { label: "Extractive & Process Metallurgy", href: "/research/extractive-process/" },
      { label: "Ceramics & Composites", href: "/research/ceramics-composites/" },
      { label: "Computational Materials Science & AI", href: "/research/computational-ai/" },
      { label: "Functional Materials & Devices", href: "/research/functional-devices/" },
      { label: "Materials for Energy & Sustainability", href: "/research/energy-sustainability/" },
      { label: "Laboratories and facilities", href: "/research/facilities/" },
    ],
  },
  { label: "Publications", href: "/publications/" },
  {
    label: "Events & News",
    href: "/events-news/",
    children: [
      { label: "Events and seminars", href: "/events-news/#events" },
      { label: "News and achievements", href: "/events-news/#news" },
    ],
  },
  {
    label: "Academics",
    href: "/academics/",
    children: [
      { label: "Programmes", href: "/academics/#programmes" },
      { label: "Curriculum", href: "/academics/#curriculum" },
      { label: "Admissions", href: "/academics/#admissions" },
      { label: "Scholarships and fellowships", href: "/academics/#scholarships" },
      { label: "Regulations and student resources", href: "/academics/#resources" },
    ],
  },
  { label: "Contact", href: "/contact/" },
];
