# Department of Metallurgical and Materials Engineering — IIT Kharagpur

Website for the Department of Metallurgical and Materials Engineering, Indian Institute of Technology Kharagpur.

Built with Next.js 15 (App Router, static export), TypeScript, Tailwind CSS 4 and Lucide icons. All content lives in
plain JSON and Markdown files under `content/`, edited through a browser-based content manager (Decap CMS) at `/admin`.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static site written to ./out
npm start          # preview ./out locally
```

## Deployment

`npm run build` produces a fully static site in `out/`. It can be hosted on any static host or web server:

- **Institute server (Apache/Nginx):** copy the contents of `out/` to the web root. Pages use trailing slashes
  (`/people/` → `people/index.html`), so no rewrite rules are needed.
- **Netlify / Vercel / Cloudflare Pages / GitHub Pages:** build command `npm run build`, output directory `out`.

Set `NEXT_PUBLIC_SITE_URL` to the production address (default `https://www.metal.iitkgp.ac.in`) so canonical URLs,
`sitemap.xml` and `robots.txt` point to the right domain.

## Updating content

### With the content manager (recommended for department staff)

Open `/admin/` on the deployed site. Editors sign in with a GitHub account that has write access to this repository.
Every save becomes a commit, and the site rebuilds automatically if the host is connected to the repository.

Sign-in on hosts other than Netlify needs a small GitHub OAuth proxy; set its address as `base_url` in
`public/admin/config.yml`. See the [Decap CMS GitHub backend docs](https://decapcms.org/docs/github-backend/).

The content manager edits:

| Collection | Files | Notes |
| --- | --- | --- |
| News | `content/news/*.md` | Use `year` when only the year is known. |
| Events | `content/events/*.md` | Upcoming and past are worked out from the dates. Tick *Placeholder* for example entries. |
| Faculty | `content/faculty/*.json` | One file per faculty member. `areas` controls which research area pages they appear on. |
| Publications | `content/publications/*.json` | One file per faculty member. A paper is stored once; co-authors are listed in `faculty`. |
| Research areas | `content/research-areas/*.json` | Overview, themes, image and laboratories for each of the six areas. |
| Department pages | `content/site.json`, `academics.json`, `labs.json` | Facts, Head's message, contact details, programmes, laboratories. |

### By editing files directly

Edit the files in `content/` and commit. Images go in `public/images/`.

## Project structure

```
content/                 all editable content (JSON and Markdown)
public/admin/            Decap CMS (content manager)
public/images/           faculty portraits, research figures, campus photographs
src/app/                 pages (one folder per route)
src/components/          reusable UI components
src/lib/content.ts       loads and joins content at build time
src/lib/nav.ts           main navigation and dropdowns
```

## Where the content came from

Everything on the site is taken from official IIT Kharagpur sources. Nothing was invented.

- **Department facts, history, Head's message, achievements, laboratory list, research areas listed by faculty** —
  [IIT Kharagpur department page](https://www.iitkgp.ac.in/department/MT).
- **Faculty, former faculty and staff** — the institute's people listings for the department.
- **Faculty profiles, publications (2,441 after de-duplication), projects, awards, Ph.D. scholars and research figures** —
  each faculty member's IIT Kharagpur profile page.
- **Programmes and curricula** — [IIT Kharagpur ERP curricula pages](https://erp.iitkgp.ac.in/ERPWebServices/curricula/specialisationList_new_currver2.jsp?stuType=UG).
- **Campus photographs and the institute emblem** — [iitkgp.ac.in](https://www.iitkgp.ac.in/).

The six research-area overviews are written summaries of what department faculty list as their research. Each
faculty member is placed in research areas by matching their listed interests, and these assignments can be edited.

## Content the department still needs to add

These spots are clearly marked on the site. Placeholders are labelled; nothing fake is presented as real.

- **Events:** no verified events were available. Three example entries are marked *Placeholder — not a real event*.
  Delete them once real events are added.
- **News dates:** most achievements on the institute page have no date and show *From the department archive*.
- **Department office email** (Contact page) and **faculty office numbers, qualifications and ORCID iDs**: not
  published on the institute pages.
- **Emeritus faculty, visiting faculty and postdoctoral researchers:** no list was published. These pages show an
  empty state until lists are added.
- **DOIs and abstracts** for publications: the source records have none. Until they are added, *Find this paper*
  searches Google Scholar for the exact title.
- **Laboratory and event photographs:** only photographs of the department's own facilities should be used.

## Accessibility and performance

- Semantic landmarks, a skip link, visible focus styles, keyboard-operable dropdowns (Escape closes them), and
  labelled form controls.
- Respects `prefers-reduced-motion`.
- Static HTML for every page. Images are pre-compressed WebP. The publications index (`/data/publications.json`) is
  generated at build time and loaded only on the publications page.
