# Binoj Charuka · Personal Portfolio

An expanded version of **Student Work Atlas**, using the original site's semantic light/dark green theme, serif typography, loading screen, scrolling marquees, reveal animations, buttons and spotlight cards.

Built with React 19, TanStack Start / Router, Vite and Tailwind CSS 4 (the same framework stack supplied in the original ZIP).

## What's inside

**Home** (`/`): Hero, About, Skills & Toolkit, Featured Projects, Leadership & Volunteering, Events & Contributions, Creative Works (interactive accordion), Journey, Certificates and Contact.

**Additional pages**:

- `/projects` — filterable projects grid
- `/projects/:slug` — project overview, highlights and optional demo/source links
- `/events` — events and volunteering archive
- `/events/:slug` — event contribution details
- `/creative-works` — selectable accordion gallery + creative works archive
- `/certificates` — confirmed certificate records or an honest empty state
- `/gallery` — image grid populated by artwork/certificate image paths
- `/admin` — **local Content Studio**, with editable content, import/export and browser-local saving

## Run locally

Install Node.js (22 recommended) and run:

```bash
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` produces a production build. The framework automatically updates `src/routeTree.gen.ts` from `src/routes/` during dev/build.

## Important: personalized content

The original ZIP contained a fictional "Alex Perera" computer-science profile and fictional projects. Those have been replaced with a draft for Binoj Charuka: Electronics undergraduate at Wayamba University, a selection of known student projects, design work, IEEE and community contributions. **Review the descriptions and details before publishing.**

All bundled content is in **`src/data/portfolio.ts`**. You can update it directly and commit the change for permanent publishing. For example, add projects, edit links and text, add certificates, and refine dates.

### Portrait and images

- The original bundled portrait belonged to the starter design and is **not presented as Binoj's photo**.
- The hero and About section currently show an abstract `BC` monogram (`public/portrait-placeholder.svg`).
- To use your own picture: save it as `public/my-photo.jpg` and set `profile.portrait` in `src/data/portfolio.ts` to `"/my-photo.jpg"`.
- For creative images, place them in `public/` and fill the `image` field, e.g. `"/ieeextreme-poster.jpg"`. Those images also populate `/gallery`.
- Certificates start empty, deliberately: add only authentic certificates, issuer names, dates and optional URLs/images.
- `profile.email` and `profile.linkedin` start empty rather than inventing contact details. Add them when you're comfortable publishing those links.

### Local Content Studio — `/admin`

This is **not** a production-authenticated CMS. It is a usable editor for this browser only.

1. Open `/admin`.
2. Select Profile, Projects, Events, Creative works, Certificates, Skills, Leadership or Journey.
3. Add/edit/remove entries and click **Save locally**. Pages in that browser update using `localStorage`.
4. **Export JSON** to preserve edited data. Import JSON to resume editing in another browser, then Save locally.
5. For changes that every visitor will see on a deployed website, put those edits into `src/data/portfolio.ts` and deploy the updated code. A secure production CMS would require separate server authentication, storage and API integration.

No authentication, external database, email delivery or GitHub writes have been implemented, and no such functionality is implied.

## Theme and motion

The original `src/styles.css` theme tokens are preserved; the new sections use `bg-card`, `text-primary`, `font-serif` and shared components. Existing scroll reveal, marquee, masking, typewriter and reduced-motion behavior are reused, rather than introducing a second animation library.

## Project origin

This codebase was initially created with [Lovable](https://lovable.dev). The original `AGENTS.md`, `.lovable/` configuration and app setup are retained. When working with the connected GitHub repository, do not force-push or rewrite published git history, so Lovable history stays intact.
