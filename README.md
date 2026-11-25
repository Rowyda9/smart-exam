# Smart Exam marketing website

Independent marketing website for Smart Exam, an enterprise examination platform. This repository contains the marketing website source and approved public assets. It has no connection to an examination database or live candidate system.

## Stack

Astro 7, TypeScript, responsive CSS, self-hosted Manrope Variable fonts and small browser scripts. Astro builds static HTML into `dist/`. A separate Node HTTP service serves that directory and provides the protected inquiry API.

## Local development

Use Node.js 22.23.4 or later. The project was verified with Node.js 24.22.3.

```sh
npm ci
npm run dev
```

The Astro development server is for editing. To preview the complete static website and inquiry API:

```sh
npm run check
npm run build
npm test
npm run verify
npm start
```

Open `http://127.0.0.1:4321`. Stop the local server with Ctrl+C. On Windows, `Start-Website.ps1` can select a compatible installed Node runtime and start the built site. Pass `-Build` to rebuild first or `-NodeExecutable` to select a runtime explicitly.

## Structure

```text
src/components/       Reusable brand, layout, form and synthetic product visuals
src/data/             Public configuration, product messaging and resource articles
src/layouts/          Shared metadata, navigation and footer
src/pages/            English pages, Arabic introduction, robots and sitemap
src/styles/           Responsive design system
public/               Public assets, browser scripts and product brochure
server/               Static-root HTTP server and protected CRM lead adapter
scripts/              Astro launcher and built-output checks
tests/                Lead validation, CSRF, delivery and access-boundary tests
.env.example          Blank service configuration template
```

## Configuration

Public product and contact fields are in `src/data/site.ts`. Company identity and contact fields remain blank until approved. Rebuild after changing public data. Never add credentials to source files or browser-accessible variables.

Copy `.env.example` to an ignored `.env` for private runtime configuration. Lead delivery is disabled by default. Activation requires all of:

- `LEAD_FORMS_ENABLED=true`
- `LEGAL_ENTITY_APPROVED=true` and `PRIVACY_NOTICE_APPROVED=true`, after updating the actual public legal/contact/privacy content
- `SITE_URL` matching the exact browser origin
- A private `FORM_SECRET` of at least 32 characters
- An approved HTTPS `CRM_WEBHOOK_URL` and private `CRM_WEBHOOK_TOKEN`

Until configured, forms stay disabled and the API reports that delivery is unavailable. No local lead queue or pretend confirmation is used. Teams scheduling, business email, phone and WhatsApp channels are configurable public fields; they are not operational integrations by default.

The adapter sends authenticated HTTPS JSON with `schemaVersion`, a stable `reference`, UTC `receivedAt`, `qualificationStatus: new_inquiry` and validated inquiry fields. The receiving CRM must durably accept and deduplicate the `Idempotency-Key` before returning success. A timeout is reported as unconfirmed delivery and does not book a meeting.

## Preview and deployment

Default builds are protected from indexing: noindex metadata, disallow-all robots, an empty sitemap and an `X-Robots-Tag` header from the Node service. `SITE_INDEXABLE=true` must be deliberately supplied at both build and runtime for a later approved production release. Privacy and terms pages remain noindex.

Serve only `dist/` as the public static root. The optional Node service and private environment must remain outside that root. Static-only hosting cannot process the inquiry API. Public hosting, DNS and production service setup are separate actions; this repository does not contain a deployment workflow.

Before production use, configure HTTPS, process supervision, monitoring, a supported runtime, approved legal/privacy content and verified CRM/email delivery. The in-process rate limiter uses the socket address and does not trust forwarded headers. A reverse proxy or multi-instance deployment needs an approved client-address/edge-rate-limit design and durable downstream idempotency.

No third-party tracking is loaded by default. PII-free `smart-exam:conversion` browser events provide an integration hook for a separately reviewed analytics setup. Never send form contents or private customer data as analytics properties.

## Content and assets

The walkthrough and workspace visuals are explanatory illustrations using synthetic data. They are not live product screenshots or customer records. Monitoring is described as advisory human review. Provider integrations, operating capacity and deployment behavior require acceptance for each product engagement.

The repository includes the public brochure and social assets. Private market research, pricing recommendations, prospect lists, sales operations files, credentials, original product source and customer material are excluded.

## Validation

`npm run check` validates Astro/TypeScript. `npm test` exercises lead gates, origin/CSRF/schema protections, body limits, disabled delivery, failure handling and deduplication. `npm run verify` checks the default preview build's links, metadata, noindex and public-output patterns. It intentionally expects a preview build, not an indexing-enabled release.
