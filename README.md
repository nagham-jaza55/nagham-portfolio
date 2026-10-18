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

## Enable contact delivery

The form validates input in the browser and again in `src/app/api/contact/route.ts`. Email is sent server-side through Resend.

Copy `.env.example` to `.env.local` and set:

| Variable             | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `RESEND_API_KEY`     | Resend API key with permission to send email.  |
| `CONTACT_EMAIL`      | Inbox that receives portfolio messages.        |
| `CONTACT_FROM_EMAIL` | Sender address on a domain verified in Resend. |

Restart the development server after changing environment variables. Update `profile.email` separately if you change the public email address.

Email delivery is unavailable until the server environment is configured. A public contact form additionally requires deployment with these variables set in the hosting provider's environment settings. The API reports a configuration or delivery error instead of claiming a message was sent. The form then offers a prefilled email-app link; the visitor reviews and sends that message in their own email client. Keep keys on the server; do not use a `NEXT_PUBLIC_` prefix or commit secret values. Local `.env` files are ignored by Git.

## Structure

```text
src/app/page.tsx                 Page entry point
src/app/layout.tsx               Metadata and bundled fonts
src/app/globals.css              Theme, layout, and responsive styles
src/app/api/contact/route.ts     Validated server-side email endpoint
src/components/portfolio.tsx     Sections, navigation, filters, and modal
src/components/project-preview.tsx  Interactive concept previews
src/components/project-preview.css  Preview-specific styles
src/components/contact-form.tsx Accessible form and submission states
src/lib/portfolio.ts             Editable profile, projects, and experience
```

## Deploy

For Vercel, import this repository, select the Next.js framework preset, use Node.js 24, and add the three contact variables to the appropriate deployment environment. Vercel runs the production build automatically.

For a Node.js host, install dependencies with `npm ci`, run `npm run build`, then run `npm start` behind your host's HTTPS proxy. Configure the same server environment variables and keep the process running through the hosting platform. A static-only export cannot serve the contact API.

This repository is prepared for deployment; it has not been published automatically.
