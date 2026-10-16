# Cosmisol Content Platform Design

**Date:** 19 September 2026

**Status:** Proposed for user review
**Scope:** Migrate the existing Cosmisol marketing site to an SEO-ready application with a private publishing panel for blogs and completed-project proof.

## 1. Goals

Cosmisol needs to publish useful solar articles that attract visitors from Google and completed-project evidence that helps prospective customers verify its work. A nontechnical administrator must be able to create, preview, publish, update and unpublish this content without editing code.

The migration must preserve the current site's visual direction, responsive behavior, solar and EMI calculators, WhatsApp enquiry flow, legal pages and restrained Anime.js motion.

### Success criteria

- A Cosmisol administrator can publish a blog post or project case study from a private dashboard.
- Every published item has a permanent, readable URL and complete SEO metadata.
- Google can crawl the content without relying on client-side rendering.
- Project evidence supports structured facts, a photo gallery and testimonial content.
- Draft content is excluded from public pages, feeds, sitemaps and search engines.
- The migrated site matches the current approved design on mobile and desktop.

## 2. Recommended architecture

Use **Next.js** for the website and admin interface, **Supabase** for authentication, PostgreSQL content storage and uploaded media, and **Vercel** for hosting. Connect Cosmisol's permanent domain after acceptance testing.

### Why this architecture

- Next.js renders indexable article and project pages with item-specific metadata.
- Supabase provides a managed database, administrator authentication and image storage without exposing privileged server credentials to browsers.
- Vercel supports Next.js rendering, previews, cache invalidation and domain configuration directly.
- The stack can later add more administrators, enquiry storage, scheduled publishing or analytics without replacing the content model.

The current `chatgpt.site` publication stays live during development. Domain cutover happens only after the new deployment passes content, SEO, responsive and enquiry-flow checks.

## 3. Public information architecture

### Existing pages and sections

- `/` — migrated homepage, including solutions, process, Why Cosmisol, calculator, brands and enquiry form.
- `/about` — current About Us content.
- `/privacy`, `/cookies`, `/terms` — current legal pages.

### New content pages

- `/blog` — paginated published-article listing with category filters.
- `/blog/[slug]` — individual article.
- `/projects` — published-project listing with project-type filters.
- `/projects/[slug]` — individual project case study.

The homepage displays up to three featured or newest projects and three newest articles. Empty sections do not render until at least one corresponding item is published.

The homepage also displays a curated testimonial section when at least one testimonial is published. Testimonials are managed independently so Cosmisol can reuse verified customer feedback without attaching it to a project case study.

### Site navigation

Desktop and mobile navigation gain **Projects** and **Blog** links. The calculator remains accessible on the homepage and may be linked contextually without returning it to the primary navigation unless requested later.

## 4. Private admin panel

### Routes

- `/admin/login`
- `/admin`
- `/admin/blog`
- `/admin/blog/new`
- `/admin/blog/[id]`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]`
- `/admin/testimonials`
- `/admin/testimonials/new`
- `/admin/testimonials/[id]`

All routes except login require an authenticated administrator session. The MVP supports one administrator account created directly in Supabase. Public registration is never exposed.

### Dashboard

The dashboard shows counts for drafts and published content, recent edits and direct actions for **New blog post**, **New project** and **New testimonial**.

### Editor behavior

All content editors provide:

- Save draft
- Preview unpublished content through a protected preview URL
- Publish
- Unpublish
- Delete with explicit confirmation
- Automatic timestamps
- Field validation and clear error messages
- Unsaved-change warning

Publishing or unpublishing invalidates affected page caches so public pages update promptly.

## 5. Content models

### Blog post

| Field | Type | Requirement |
|---|---|---|
| Title | Short text | Required |
| Slug | Generated/editable | Required and unique |
| Excerpt | Short text | Required |
| Cover image | Image | Required |
| Cover alt text | Short text | Required |
| Article body | Rich text | Required |
| Category | Controlled value | Required |
| Author display name | Short text | Required |
| Published date | Date/time | Set on first publish |
| Updated date | Date/time | Automatic |
| Featured | Boolean | Optional |
| Status | Draft/published | Required |
| SEO title | Short text | Optional override |
| SEO description | Short text | Optional override |
| Social image | Image | Optional; cover is fallback |

The MVP rich-text editor supports headings, paragraphs, ordered and unordered lists, links, quotes and inline images. Raw HTML and arbitrary embeds are excluded initially to reduce security and layout risks.

### Project proof

| Field | Type | Requirement |
|---|---|---|
| Project title | Short text | Required |
| Slug | Generated/editable | Required and unique |
| Summary | Short text | Required |
| Project type | Residential/commercial/industrial | Required |
| Location | Short text | Required at city/area level |
| System capacity | Numeric kW/MW value | Required |
| Completion date | Date | Required |
| Cover image | Image | Required |
| Gallery | Ordered images | At least one image |
| Image alt text | Short text per image | Required |
| Challenge | Rich text | Optional |
| Cosmisol solution | Rich text | Required |
| Outcome | Rich text | Required |
| Generation figure | Numeric plus period | Optional and labelled |
| Savings figure | Numeric plus period | Optional and labelled |
| Testimonial | Text | Optional |
| Customer display name | Short text | Optional and consent-dependent |
| Featured | Boolean | Optional |
| Status | Draft/published | Required |
| SEO title/description | Short text | Optional overrides |
| Social image | Image | Optional; cover is fallback |

Project performance figures must state whether they are measured, customer-reported or estimated. The editor displays this reminder beside result fields.

### Testimonial

| Field | Type | Requirement |
|---|---|---|
| Customer display name | Short text | Required and consent-dependent |
| Role/company or property type | Short text | Optional |
| Testimonial quote | Long text | Required |
| Customer photo | Image | Optional |
| Photo alt text | Short text | Required when a photo is supplied |
| Related project | Project reference | Optional |
| Featured | Boolean | Optional |
| Display order | Integer | Required; defaults after existing items |
| Consent confirmed | Boolean | Required before publishing |
| Status | Draft/published | Required |
| Published date | Date/time | Set on first publish |
| Updated date | Date/time | Automatic |

Testimonials can be created, edited, reordered, previewed, published, unpublished and deleted from the admin panel. Publishing is blocked until consent is confirmed. Public pages display only published testimonials and never expose customer contact details.

## 6. Media handling

- Upload JPEG, PNG or WebP images with a defined maximum source size.
- Validate file type and size on the client and server.
- Store originals in Supabase Storage under content-specific folders.
- Render responsive images with explicit dimensions to reduce layout movement.
- Require alt text for public content images.
- Allow reorder and removal before publishing.
- Prevent orphan accumulation by deleting replaced media only when it is no longer referenced.

The first version does not include video uploads. YouTube links may be added later through an approved embed field.

## 7. SEO and discovery

Each article and project page is server-rendered and includes:

- Unique HTML title and meta description
- Canonical URL under Cosmisol's permanent domain
- Open Graph and social-sharing metadata
- Article or project-specific social image
- Breadcrumbs
- JSON-LD structured data
- Meaningful headings and image alt text

The application generates:

- `sitemap.xml` containing only public canonical pages
- `robots.txt`
- RSS feed for published blog posts
- `Article` structured data for posts
- `BreadcrumbList` data for detail pages
- Appropriate organization/local-business data using only verified business information

Draft and preview URLs send `noindex` directives and never appear in listings, sitemap or RSS.

Redirects will preserve any relevant old URLs during migration. The current temporary Sites URL should redirect to the permanent domain if the hosting platform supports it; otherwise the old page will display a canonical link and migration notice until retired.

## 8. Motion and accessibility

- Preserve the existing restrained Anime.js entrance and interaction language.
- Use motion to clarify hierarchy, state changes and scroll progression rather than animate every decorative element continuously.
- Respect `prefers-reduced-motion` and show all content immediately when enabled.
- Preserve keyboard access, visible focus indicators, semantic headings and native controls.
- Meet practical WCAG 2.2 AA contrast and touch-target expectations.
- Admin editors and dialogs must be fully keyboard operable.

## 9. Security and privacy

- Supabase public keys may be present in the browser; privileged service credentials remain server-only.
- PostgreSQL Row Level Security permits public reads only for published rows.
- Only authenticated administrator users can create, update, publish or delete content and upload media.
- Admin routes verify the session server-side, not only through hidden navigation.
- Rich text is stored in a structured format and rendered through an allowlist; arbitrary scripts and HTML are rejected.
- Login attempts rely on Supabase protections and may add rate limiting if required.
- Security headers include a restrictive Content Security Policy compatible with required assets.
- No visitor accounts or public comments are included in the MVP.

The Privacy and Cookie policies must be updated before launch to describe Supabase/Vercel processing and any analytics that are actually enabled.

## 10. Analytics and editorial feedback

The MVP records no custom visitor profile. Search performance will be monitored through Google Search Console after domain verification. Privacy-conscious traffic analytics may be added only after selecting the provider and updating consent/policy behavior as required.

Admin content lists show status and updated date. Page-view analytics inside the admin panel are deferred until reliable analytics data exists.

## 11. Migration and launch

1. Build the new application alongside the current public site.
2. Recreate the current approved pages and interactions in Next.js components.
3. Configure Supabase schema, authentication, storage and Row Level Security.
4. Build admin editors and previews.
5. Build public Blog and Projects pages with SEO metadata.
6. Seed at least one real project and one article for acceptance testing.
7. Run responsive, accessibility, calculator, enquiry, authentication, CRUD, publish/unpublish and metadata checks.
8. Deploy to a staging URL for review.
9. Connect Cosmisol's domain and submit the sitemap after approval.

The existing public site remains available until step 9 succeeds. Database backups and an export path are documented before launch.

## 12. MVP exclusions

- Multiple roles or editorial approval workflows
- Public comments
- Newsletter sending
- Scheduled publishing
- Multilingual content
- Customer login or project portal
- Built-in analytics dashboard
- Automatic AI writing
- Video hosting

These can be added without changing the core content model when usage justifies them.

## 13. Validation

### Automated checks

- Authentication and route protection
- Row Level Security behavior
- Blog/project create, edit, preview, publish, unpublish and delete flows
- Slug uniqueness and redirects after an approved slug change
- Metadata, canonical URL, sitemap and RSS output
- Calculator outputs and validation
- Enquiry/WhatsApp behavior
- Responsive image and required-alt validation
- Reduced-motion behavior

### Manual checks

- Mobile, tablet and desktop layout parity with the approved site
- Admin usability for a nontechnical publisher
- Keyboard navigation and focus order
- Social-sharing preview for representative pages
- Google Rich Results and Search Console readiness
- Production domain, HTTPS and redirects

## 14. Delivery estimate

Estimated implementation time is **4–6 working days** for the defined MVP, assuming Supabase and Vercel accounts can be configured and one representative article/project is available for acceptance testing. Domain DNS work happens after staging approval and does not block development.

