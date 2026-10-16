# Cosmisol Content Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current static Cosmisol site with an SEO-ready Next.js application that preserves the approved public experience and adds a private Supabase-backed publishing panel for blog articles and verified project case studies.

**Architecture:** Next.js App Router renders public pages on the server and uses server actions for authenticated editorial mutations. Supabase provides authentication, PostgreSQL, Row Level Security and image storage; public queries expose published content only. Vercel hosts staging and production after local and browser validation.

**Tech Stack:** Next.js App Router, React, TypeScript, Supabase Auth/PostgreSQL/Storage, Zod, TipTap, Anime.js, Vitest, Testing Library, Playwright, Vercel

**Spec:** `docs/superpowers/specs/2026-09-19-content-platform-design.md`

## Global Constraints

- Preserve the current approved responsive design, calculators, WhatsApp enquiry flow, legal pages and restrained Anime.js motion.
- Keep the current public deployment available until production-domain verification succeeds.
- Public visitors may read only records with `status = 'published'`; only authenticated administrators may mutate content or upload media.
- Draft and preview pages must be excluded from listings, feeds, sitemap and search indexing.
- Blog bodies use structured rich text with an allowlist; arbitrary HTML and scripts are rejected.
- Every public image requires useful alternative text; project performance claims identify whether they are measured, customer-reported or estimated.
- No public registration, comments, newsletter, scheduled publishing, multilingual content, customer portal, analytics dashboard, AI writing or video hosting in the MVP.
- Keep existing CTA design and behavior unchanged.

## Review Focus

- A guessed admin URL without a valid session redirects to `/admin/login` and cannot read drafts through database calls.
- Duplicate, empty or unsafe slugs are rejected before persistence and never create ambiguous public URLs.
- Draft-to-published and published-to-draft transitions immediately update public pages, sitemap and RSS output.
- Rich text containing scripts, event handlers or unsupported nodes is rejected or safely omitted during rendering.
- Missing, oversized or unsupported images fail with a clear editor error and never produce inaccessible public content.

---

## File structure

- `app/(site)/` — public layouts, home, About, legal, Blog and Projects routes.
- `app/admin/` — login, dashboard, content lists, editors and protected previews.
- `app/api/` — RSS, preview and cache-revalidation endpoints that require HTTP responses.
- `components/site/` — migrated header, footer, hero, calculators, process, services, brand rail and enquiry form.
- `components/content/` — article/project cards, rich-text renderer, gallery and structured metadata.
- `components/admin/` — shared editor controls, media uploader and status actions.
- `lib/supabase/` — browser, server and privileged clients plus middleware helpers.
- `lib/content/` — Zod schemas, public queries, admin queries, slug logic and rich-text sanitisation for blogs, projects and testimonials.
- `lib/seo/` — metadata, JSON-LD, sitemap and RSS helpers.
- `supabase/migrations/` — schema, indexes, triggers, RLS and storage policies.
- `tests/` — Vitest unit/component tests and Playwright end-to-end checks.
- `public/` — migrated approved images, logos and fonts.
- `legacy-static/` — preserved snapshot of the current `dist/` implementation during migration.

### Task 1: Establish the Next.js testable application shell

**Files:**
- Move: `dist/` to `legacy-static/`
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `.env.example`
- Create: `app/layout.tsx`, `app/globals.css`, `app/(site)/page.tsx`
- Create: `tests/unit/smoke.test.tsx`, `tests/e2e/home.spec.ts`

**Interfaces:**
- Produces: Next.js App Router application, `npm run dev`, `npm run build`, `npm run test`, `npm run test:e2e`.

- [ ] **Step 1: Preserve the current implementation and scaffold the application**

Move `dist/` intact to `legacy-static/`. Create the Next.js TypeScript package with scripts for `dev`, `build`, `lint`, `test` and `test:e2e`; install Supabase, Zod, TipTap, Anime.js, Vitest, Testing Library and Playwright dependencies.

- [ ] **Step 2: Write the failing shell tests**

```tsx
// tests/unit/smoke.test.tsx
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/(site)/page';

it('renders Cosmisol and the primary site-visit action', () => {
  render(<HomePage />);
  expect(screen.getByRole('heading', { name: /right solar solution/i })).toBeVisible();
  expect(screen.getByRole('link', { name: /book a free site visit/i })).toBeVisible();
});
```

Run: `npm test -- tests/unit/smoke.test.tsx`

Expected: FAIL because the migrated page does not exist.

- [ ] **Step 3: Implement the shell and global design tokens**

Create a semantic root layout with Cosmisol metadata and a minimal homepage that satisfies the smoke test. Copy only approved brand tokens from `legacy-static/style.css` into CSS custom properties in `app/globals.css`.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/smoke.test.tsx && npm run build`

Expected: tests PASS and Next.js production build succeeds.

Commit: `git commit -m "build: establish Next.js application shell"`

### Task 2: Add Supabase schema, policies and typed clients

**Files:**
- Create: `supabase/migrations/202609190001_content_platform.sql`
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/admin.ts`, `lib/supabase/middleware.ts`
- Create: `types/database.ts`, `types/content.ts`
- Create: `middleware.ts`
- Test: `tests/unit/content-schema.test.ts`, `tests/integration/rls.test.ts`

**Interfaces:**
- Produces: `createBrowserClient()`, `createServerClient()`, `createAdminClient()`, `BlogPost`, `Project`, `ProjectImage`, `Testimonial`, `ContentStatus`.

- [ ] **Step 1: Write schema-contract and RLS tests**

```ts
it('rejects a draft from the anonymous published-content parser', () => {
  expect(() => publicBlogPostSchema.parse({ ...validPost, status: 'draft' })).toThrow();
});

it('prevents an anonymous client from selecting draft rows', async () => {
  const { data } = await anonymous.from('blog_posts').select('slug').eq('status', 'draft');
  expect(data).toEqual([]);
});
```

Run: `npm test -- tests/unit/content-schema.test.ts tests/integration/rls.test.ts`

Expected: FAIL because schemas, tables and policies are absent.

- [ ] **Step 2: Create database schema and storage policies**

Create `blog_posts`, `projects`, `project_images`, `testimonials` and `admin_profiles` tables with UUID primary keys, unique slugs where applicable, `draft|published` status checks, timestamps and published indexes. Testimonials include display order, optional project reference and required consent state. Add updated-at triggers. Enable RLS: anonymous/authenticated public access reads published rows only; users present in `admin_profiles` may perform CRUD. Create a `content-media` bucket with public reads and administrator writes.

- [ ] **Step 3: Add typed clients and middleware**

`createAdminClient()` must be server-only and throw when `SUPABASE_SERVICE_ROLE_KEY` is missing. Middleware refreshes auth cookies and protects `/admin/:path*`, except `/admin/login`.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/content-schema.test.ts tests/integration/rls.test.ts && npm run build`

Commit: `git commit -m "feat: add Supabase content schema and access policies"`

### Task 3: Migrate the approved public site and interactions

**Files:**
- Create: `components/site/Header.tsx`, `Footer.tsx`, `Hero.tsx`, `Services.tsx`, `SolarJourney.tsx`, `WhyCosmisol.tsx`, `SolarCalculator.tsx`, `BrandRail.tsx`, `EnquiryForm.tsx`, `MotionProvider.tsx`
- Create: `lib/calculators/solar.ts`, `lib/enquiry/whatsapp.ts`
- Create: `app/(site)/about/page.tsx`, `app/(site)/privacy/page.tsx`, `app/(site)/cookies/page.tsx`, `app/(site)/terms/page.tsx`
- Copy: approved assets from `legacy-static/` to `public/images/`
- Test: `tests/unit/solar-calculator.test.ts`, `tests/unit/whatsapp.test.ts`, `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Produces: `calculateSolar(monthlyBill: number): SolarEstimate`, `buildWhatsAppUrl(input: EnquiryInput): string`, reusable public-site components.

- [ ] **Step 1: Pin calculator and enquiry behavior with failing tests**

```ts
expect(calculateSolar(4600)).toMatchObject({ recommendedKw: 2.6, annualSavings: 27600 });
expect(() => calculateSolar(2499)).toThrow(/between/i);
expect(buildWhatsAppUrl(validEnquiry)).toContain('7339617710');
```

Also add Playwright assertions for mobile navigation, service disclosure, process sequence, calculator output, legal links and the WhatsApp URL.

- [ ] **Step 2: Migrate semantic markup, responsive styling and approved assets**

Rebuild the existing sections as focused components. Preserve copy, contact details, hero treatment, icon timeline, moving brand rail and existing action styling. Keep the Calculator section on the homepage and outside the main navigation.

- [ ] **Step 3: Restore restrained motion accessibly**

Load Anime.js only in `MotionProvider`. When `matchMedia('(prefers-reduced-motion: reduce)')` matches, skip timelines and render final states immediately.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/solar-calculator.test.ts tests/unit/whatsapp.test.ts && npm run test:e2e -- tests/e2e/public-site.spec.ts && npm run build`

Commit: `git commit -m "feat: migrate approved Cosmisol public site"`

### Task 4: Build authentication and the private admin shell

**Files:**
- Create: `app/admin/login/page.tsx`, `app/admin/layout.tsx`, `app/admin/page.tsx`
- Create: `app/admin/actions.ts`, `components/admin/LoginForm.tsx`, `components/admin/AdminNav.tsx`, `components/admin/DashboardStats.tsx`
- Create: `lib/auth/require-admin.ts`
- Test: `tests/unit/require-admin.test.ts`, `tests/e2e/admin-auth.spec.ts`

**Interfaces:**
- Produces: `requireAdmin(): Promise<AdminProfile>`, `loginAction(formData)`, `logoutAction()`.

- [ ] **Step 1: Write failing route-protection tests**

Assert an anonymous visit to `/admin` redirects to `/admin/login`, invalid credentials show a generic error, valid administrator credentials reach the dashboard, and an authenticated non-admin is signed out and denied.

- [ ] **Step 2: Implement server-verified authentication**

Use Supabase password authentication with no public registration route. `requireAdmin()` must verify both the session and an `admin_profiles` row. Login errors must not reveal whether an email exists.

- [ ] **Step 3: Build the dashboard shell**

Display draft/published counts, recent updates and links to create Blog or Project content. Add logout and an accessible navigation landmark.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/require-admin.test.ts && npm run test:e2e -- tests/e2e/admin-auth.spec.ts`

Commit: `git commit -m "feat: add private admin authentication"`

### Task 5: Implement blog authoring and public article pages

**Files:**
- Create: `lib/content/blog-schema.ts`, `lib/content/blog-queries.ts`, `lib/content/blog-actions.ts`, `lib/content/slug.ts`, `lib/content/rich-text.ts`
- Create: `components/admin/BlogEditor.tsx`, `components/admin/RichTextEditor.tsx`, `components/content/RichText.tsx`, `components/content/BlogCard.tsx`
- Create: `app/admin/blog/page.tsx`, `app/admin/blog/new/page.tsx`, `app/admin/blog/[id]/page.tsx`
- Create: `app/(site)/blog/page.tsx`, `app/(site)/blog/[slug]/page.tsx`
- Test: `tests/unit/blog-schema.test.ts`, `tests/unit/rich-text.test.ts`, `tests/integration/blog-actions.test.ts`, `tests/e2e/blog.spec.ts`

**Interfaces:**
- Produces: `blogInputSchema`, `createBlogPost`, `updateBlogPost`, `setBlogStatus`, `deleteBlogPost`, `getPublishedPosts`, `getPublishedPostBySlug`.

- [ ] **Step 1: Write validation and mutation tests**

Cover empty/duplicate/unsafe slugs, missing alt text, overly long metadata, rejected script nodes, draft exclusion, publish/unpublish cache updates and delete confirmation.

- [ ] **Step 2: Implement schemas, structured rich text and query functions**

Allow headings, paragraphs, lists, links, quotes and inline images only. Render external links with safe `rel` values. Public functions hard-code `status = 'published'`; admin functions call `requireAdmin()`.

- [ ] **Step 3: Build editor, preview and public pages**

Support save draft, protected preview, publish, unpublish and delete. Show unsaved-change warnings and field-level errors. Generate article metadata, canonical URL, Open Graph data and Article/BreadcrumbList JSON-LD.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/blog-schema.test.ts tests/unit/rich-text.test.ts tests/integration/blog-actions.test.ts && npm run test:e2e -- tests/e2e/blog.spec.ts && npm run build`

Commit: `git commit -m "feat: add blog publishing workflow"`

### Task 6: Implement media upload and project-proof publishing

**Files:**
- Create: `lib/media/validation.ts`, `lib/media/storage.ts`
- Create: `lib/content/project-schema.ts`, `lib/content/project-queries.ts`, `lib/content/project-actions.ts`
- Create: `components/admin/MediaUploader.tsx`, `components/admin/ProjectEditor.tsx`, `components/content/ProjectCard.tsx`, `components/content/ProjectGallery.tsx`
- Create: `app/admin/projects/page.tsx`, `app/admin/projects/new/page.tsx`, `app/admin/projects/[id]/page.tsx`
- Create: `app/(site)/projects/page.tsx`, `app/(site)/projects/[slug]/page.tsx`
- Test: `tests/unit/media-validation.test.ts`, `tests/unit/project-schema.test.ts`, `tests/integration/project-actions.test.ts`, `tests/e2e/projects.spec.ts`

**Interfaces:**
- Produces: `validateImage(file)`, `uploadContentImage(file, path)`, `projectInputSchema`, project CRUD/status/query functions.

- [ ] **Step 1: Write failing media and evidence tests**

Test JPEG/PNG/WebP acceptance, configured size-limit rejection, missing alt rejection, image ordering, invalid claim-source rejection, anonymous draft exclusion and publish/unpublish behavior.

- [ ] **Step 2: Implement storage and project domain rules**

Store images under administrator-scoped folders, generate collision-resistant names, persist width/height/alt/order and remove abandoned uploads. Require every performance figure to use `measured`, `customer_reported` or `estimated`.

- [ ] **Step 3: Build project editor and public proof pages**

Support residential/commercial/industrial type, location, capacity/unit, completion date, ordered gallery, challenge, solution, outcome, optional claims and consented testimonial. Render accessible gallery controls and project metadata/JSON-LD without unsupported factual claims.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/media-validation.test.ts tests/unit/project-schema.test.ts tests/integration/project-actions.test.ts && npm run test:e2e -- tests/e2e/projects.spec.ts && npm run build`

Commit: `git commit -m "feat: add project proof publishing"`

### Task 7: Add editable testimonials

**Files:**
- Create: `lib/content/testimonial-schema.ts`, `lib/content/testimonial-queries.ts`, `lib/content/testimonial-actions.ts`
- Create: `components/admin/TestimonialEditor.tsx`, `components/content/TestimonialCard.tsx`, `components/content/Testimonials.tsx`
- Create: `app/admin/testimonials/page.tsx`, `app/admin/testimonials/new/page.tsx`, `app/admin/testimonials/[id]/page.tsx`
- Test: `tests/unit/testimonial-schema.test.ts`, `tests/integration/testimonial-actions.test.ts`, `tests/e2e/testimonials.spec.ts`

**Interfaces:**
- Produces: `testimonialInputSchema`, `createTestimonial`, `updateTestimonial`, `reorderTestimonials`, `setTestimonialStatus`, `deleteTestimonial`, `getPublishedTestimonials`.

- [ ] **Step 1: Write failing consent, validation and access tests**

```ts
expect(() => testimonialInputSchema.parse({ ...validTestimonial, consentConfirmed: false, status: 'published' })).toThrow(/consent/i);
expect(() => testimonialInputSchema.parse({ ...validTestimonial, photoUrl: '/customer.webp', photoAlt: '' })).toThrow(/alt/i);
```

Also assert anonymous queries exclude drafts, customer contact details are absent from the public type, duplicate display positions are normalised, and publish/unpublish invalidates the homepage.

- [ ] **Step 2: Implement testimonial domain and admin mutations**

Require display name, quote, display order and status. Allow optional role/company or property type, photo, related project and featured state. Block publishing until consent is confirmed. Every mutation calls `requireAdmin()` and returns structured field errors.

- [ ] **Step 3: Build testimonial list, editor, ordering and homepage section**

Provide create, edit, preview, reorder, publish, unpublish and confirmed delete actions. Render published testimonials in configured order and omit the section when none exist. Never render customer email, phone or internal consent notes.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/testimonial-schema.test.ts tests/integration/testimonial-actions.test.ts && npm run test:e2e -- tests/e2e/testimonials.spec.ts && npm run build`

Commit: `git commit -m "feat: add editable customer testimonials"`

### Task 8: Add homepage discovery, sitemap and RSS

**Files:**
- Modify: `app/(site)/page.tsx`
- Create: `components/content/LatestPosts.tsx`, `components/content/FeaturedProjects.tsx`
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/api/rss/route.ts`
- Create: `lib/seo/metadata.ts`, `lib/seo/json-ld.ts`, `lib/seo/rss.ts`
- Test: `tests/unit/seo.test.ts`, `tests/integration/discovery.test.ts`, `tests/e2e/discovery.spec.ts`

**Interfaces:**
- Produces: `siteMetadata()`, `articleMetadata(post)`, `projectMetadata(project)`, `buildRss(posts)`, public discovery routes.

- [ ] **Step 1: Write failing discovery tests**

Assert draft URLs never appear, published canonical URLs appear exactly once, XML escapes titles safely, empty homepage collections render no empty section and robots allows public routes while disallowing `/admin`.

- [ ] **Step 2: Implement homepage and machine-readable discovery**

Render up to three featured/latest published articles and projects. Add canonical metadata, Organization/BreadcrumbList/Article structured data using verified details only. Generate sitemap and RSS dynamically from published content.

- [ ] **Step 3: Verify and commit**

Run: `npm test -- tests/unit/seo.test.ts tests/integration/discovery.test.ts && npm run test:e2e -- tests/e2e/discovery.spec.ts && npm run build`

Commit: `git commit -m "feat: add SEO discovery and homepage content"`

### Task 9: Harden privacy, accessibility and failure behavior

**Files:**
- Modify: `next.config.ts`, `app/(site)/privacy/page.tsx`, `app/(site)/cookies/page.tsx`
- Create: `app/not-found.tsx`, `app/error.tsx`, `app/admin/error.tsx`
- Test: `tests/e2e/accessibility.spec.ts`, `tests/e2e/security.spec.ts`

**Interfaces:**
- Consumes: all public/admin routes and renderers.
- Produces: security headers, accurate policy copy, accessible error behavior.

- [ ] **Step 1: Add failing browser checks**

Test keyboard navigation, visible focus, landmark/headings, image alt, reduced motion, admin noindex, draft noindex, CSP presence, cross-site script rejection and safe 404 behavior.

- [ ] **Step 2: Add headers and policy disclosures**

Configure CSP, Referrer-Policy, Permissions-Policy and frame protection compatible with Supabase and approved assets. Update policies to name Supabase/Vercel processing and state that analytics/cookies beyond essentials are disabled until deliberately configured.

- [ ] **Step 3: Verify and commit**

Run: `npm run test:e2e -- tests/e2e/accessibility.spec.ts tests/e2e/security.spec.ts && npm run build`

Commit: `git commit -m "fix: harden privacy accessibility and security"`

### Task 10: Seed acceptance content and prepare staging deployment

**Files:**
- Create: `scripts/seed-acceptance-content.ts`, `scripts/export-content.ts`
- Create: `docs/admin-guide.md`, `docs/deployment.md`
- Modify: `.env.example`, `package.json`
- Test: `tests/e2e/acceptance.spec.ts`

**Interfaces:**
- Produces: `npm run seed:acceptance`, `npm run export:content`, operator documentation and staging checklist.

- [ ] **Step 1: Create representative seed fixtures without invented customer claims**

Seed one clearly marked sample article and one clearly marked sample project. Keep the testimonial collection empty until Cosmisol supplies verified customer feedback and consent. Do not publish identifiable customer data or performance claims without verification.

- [ ] **Step 2: Document administration and recovery**

Document login, drafting, previews, publishing, media alt text, claim-source labels, unpublishing, exports, backups, environment variables, first-admin creation, Vercel setup and rollback to the current static deployment.

- [ ] **Step 3: Run the full acceptance gate**

Run: `npm test && npm run test:e2e && npm run build`

Expected: all suites pass; build has no type or route errors.

- [ ] **Step 4: Deploy staging and validate**

Deploy to a Vercel preview URL. Verify mobile/tablet/desktop layout, calculators, WhatsApp enquiry, admin CRUD, images, publish/unpublish, metadata, social previews, sitemap, RSS and Google Rich Results. Keep the existing public site unchanged.

- [ ] **Step 5: Commit**

Commit: `git commit -m "docs: add content operations and deployment guide"`

### Task 11: Production cutover after staging approval

**Files:**
- Modify: `docs/deployment.md`
- Create: `docs/launch-report.md`

**Interfaces:**
- Consumes: approved staging deployment and Cosmisol domain access.
- Produces: production domain, Search Console verification, submitted sitemap and rollback record.

- [ ] **Step 1: Capture pre-cutover evidence**

Record production build ID, database export location, current DNS values, legacy URL, Lighthouse results and successful acceptance run.

- [ ] **Step 2: Connect the permanent domain and verify HTTPS**

Apply Vercel-provided DNS records, verify the canonical origin and confirm HTTP-to-HTTPS plus preferred-host redirects.

- [ ] **Step 3: Verify Google discovery**

Verify Search Console ownership, submit `/sitemap.xml`, inspect the homepage plus one article and project URL, and confirm robots/metadata/structured-data output.

- [ ] **Step 4: Record launch and rollback instructions**

Write actual timestamps, domain, deployment ID, verification results and the exact DNS/deployment rollback steps in `docs/launch-report.md`.

- [ ] **Step 5: Commit**

Commit: `git commit -m "docs: record production content-platform launch"`

