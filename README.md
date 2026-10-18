# Nagham Jaza — Developer Portfolio

A responsive portfolio built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, and Lucide icons. It includes a dark theme, interactive project previews, project filtering, a skills matrix, a career timeline, and a validated contact form.

## Run locally

Use Node.js 24 LTS and npm. From the repository root:

```sh
npm ci
npm run dev
```

The development server listens on port 3000.

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

`npm start` serves the production build and requires `npm run build` first.

## Personalize the content

Edit `src/lib/portfolio.ts` for the name, public contact links, availability, project descriptions, technology lists, demo/source URLs, and career entries. Section copy and skill categories are in `src/components/portfolio.tsx`; page metadata is in `src/app/layout.tsx`.

Nagham Jaza's GitHub profile is linked at [github.com/nagham-jaza55](https://github.com/nagham-jaza55). At the time of setup, the public profile exposed no repositories, bio, professional email, or LinkedIn URL. The three projects are labeled interactive concepts, and the career timeline is illustrative. Replace this sample content with verified work before publishing. The provided public email, `naghamjaza5@gmail.com`, is included. An unset LinkedIn link is hidden.

Project demos run in the browser with sample state. Their architecture notes describe proposed systems; the portfolio does not implement those projects' production backends. Supply a project's `demoUrl` and `githubUrl` to display external demo and source links.

## Contact

The GitHub Pages version is fully static. The form validates name, email, and message, then provides a prefilled email-app link addressed to `naghamjaza5@gmail.com`. The visitor reviews and sends the message in their own email client. No server, API key, or automatic email delivery is required. Update `profile.email` in `src/lib/portfolio.ts` to change the recipient.

## Structure

```text
src/app/page.tsx                 Page entry point
src/app/layout.tsx               Metadata and bundled fonts
src/app/globals.css              Theme, layout, and responsive styles
src/components/portfolio.tsx     Sections, navigation, filters, and modal
src/components/project-preview.tsx  Interactive concept previews
src/components/project-preview.css  Preview-specific styles
src/components/contact-form.tsx Accessible form and submission states
src/lib/portfolio.ts             Editable profile, projects, and experience
```

## GitHub Pages deployment

Website: https://nagham-jaza55.github.io/nagham-portfolio/

Source lives on `main`; compiled static files live on `gh-pages`. In repository Settings → Pages, use **Deploy from a branch**, choose **gh-pages**, and select **/ (root)**. The `.nojekyll` file ensures Next.js assets are served unchanged.

After changing the source, commit and push it to `main`, then run:

```sh
npm ci
npm run lint
npm run typecheck
npm run deploy:pages
```

The deployment script builds with the `/nagham-portfolio` base path and pushes only generated files to `gh-pages`, without force-pushing. It requires Git push access and a configured Git author. GitHub then publishes the branch; progress is visible under repository Actions and Settings → Pages.

For a local root-path production preview, run `npm run build` followed by `npm start`. For GitHub Pages output only, run `npm run build:pages`; deploy the resulting `out/` directory at `/nagham-portfolio/`. `npm start` serves root-path builds; Pages builds need that URL prefix when previewed.
