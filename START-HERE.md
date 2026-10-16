# Cosmisol Energy website handover

**Prepared:** 15 October 2026  
**Purpose:** Technical handover for the public website, legacy HTML frontend, CMS/admin area, backend, hosting and domain operations.

## At a glance

- **Public site:** [https://www.cosmisolenergy.com](https://www.cosmisolenergy.com) (canonical host). The apex [https://cosmisolenergy.com](https://cosmisolenergy.com) redirects to `www`.
- **Admin sign-in:** [https://www.cosmisolenergy.com/admin/login](https://www.cosmisolenergy.com/admin/login). Admins are created privately; there is no public sign-up.
- **Source repository:** [Therightpath-star/sunergy-content-platform](https://github.com/Therightpath-star/sunergy-content-platform), default branch `main`.
- **Hosting:** Vercel project `sunergy-content-platform` in the “The right path” team. The project name retains the original Sunergy name; the public brand is Cosmisol Energy.
- **DNS control panel:** MilesWeb mPanel. The Vercel apex and `www` entries were corrected on 9 October 2026; Vercel showed **Valid Configuration** for both domains afterward.
- **Main app:** this repository (`content-platform-runtime` is its local path under the handover workspace).
- **Static HTML export:** sibling workspace folder `outputs/site/dist/`. Treat it as an export package, not the source of truth for the Vercel app.

## Architecture and source map

The production site is a Next.js application with a server-rendered HTML homepage that preserves the approved legacy HTML design. It is not a separate PHP backend. Supabase provides authentication, PostgreSQL content storage and image storage.

| Area | Source of truth | What it does |
| --- | --- | --- |
| Homepage HTML | `public/legacy/home.html` | HTML template served by `app/(site)/route.ts`; the route adds published projects, blog links, testimonials, canonical/social metadata and structured data. |
| Homepage styling and behavior | `public/legacy/style.css`, `content.css`, `app.js`, `calculator.js`, `motion.js`, `testimonials.js` | Layout, calculator, interactions, animation and the rotating testimonial rail. Anime.js is bundled at `public/legacy/vendor/anime.umd.min.js`. |
| Shared site images | `public/images/` | Cosmisol logos, residential hero, process imagery and partner-brand logos. |
| React routes | `app/(site)/` | About, blog, project, privacy, cookie and terms pages. Published articles and projects have detail routes. |
| Admin/CMS | `app/admin/`, `components/admin/`, `lib/content/` | Private login and create/edit/preview/publish/unpublish/delete tools for blog posts, project proofs and testimonials. |
| Database schema | `supabase/migrations/202609190001_content_platform.sql` | Tables, constraints, indexes, Row Level Security policies, admin helper and `content-media` storage bucket. |
| SEO/discovery | `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, `app/api/rss/route.ts`, `lib/seo/` | Dynamic sitemap, crawler rules, AI-readable site guide, RSS and metadata/JSON-LD. |
| Static HTML copy | `legacy-static/` and `../outputs/site/dist/` | Preserved standalone HTML snapshot/export. These copies can drift; do not assume edits here update Vercel. |

**Editing rule:** For the live homepage, change the active `public/legacy/home.html` template and its `/legacy` assets. The root handler in `app/(site)/route.ts` is what serves it. Change `app/(site)/...` for the dedicated React pages and `app/admin/...` for CMS behavior. Regenerate/review the standalone `outputs/site/dist/` export when a customer also needs the separate HTML package.

## Public site behavior

- Residential, commercial and industrial solar services, five-step installation journey, “Why Cosmisol Energy”, savings calculator, partner logos and client stories.
- The solar calculator is browser-side in `public/legacy/calculator.js`; its assumptions and estimate outputs are illustrative. Commercial/industrial values are not official tariff quotes. Confirm proposals using a bill and site assessment.
- Site-visit enquiries validate in the browser and open WhatsApp for the visitor to review and send. The site does **not** save a form submission to a database or send it to an email/CRM backend. Business contact: `+91 73396 17710`, `contact@cosmisolenergy.com`.
- Published projects and blog posts are inserted into the homepage and exposed on their own routes; the public nav links to Projects or Blog when published content exists. Draft content stays private.
- Testimonials appear only when published; publishing requires confirmation of customer consent in the editor.
- Business locations listed on the site: S. Kulathoor Main Road, Periyakovilambakkam, Chennai-129; 1352/A, Sembakkam Road, Eachamballam, Manampathy, Tamil Nadu 603105; and Casagrand ECR 14, Maya St, Kannathur Reddy Kuppam, Tamil Nadu 603112.

## Admin and content operations

Sign in at `/admin/login` using the private Supabase Auth account. Dashboard sections cover blog posts, projects and testimonials. Create content as a draft, preview it, check copy/images/consent/claims, then publish. To remove it from public pages without losing it, change its status to draft. The fuller operator instructions are in [`admin-guide.md`](admin-guide.md).

Projects can include location, system capacity, completion date, challenge, solution, outcome, image gallery and optional generation/savings claims. Claims require a source (`measured`, `customer_reported` or `estimated`). Do not publish customer details or performance claims without permission and evidence. Image uploads accept JPEG, PNG or WebP, up to 10 MB each; provide descriptive alt text.

### Granting an administrator

1. In the correct Supabase project's Authentication area, invite/create the administrator with a verified email and strong unique password.
2. Copy that user's Auth UUID, then run this in that same project's SQL editor:

   ```sql
   insert into public.admin_profiles (user_id, display_name)
   values ('AUTH-USER-UUID', 'Cosmisol administrator');
   ```

3. Test `/admin/login`, then verify that an authenticated account without an `admin_profiles` entry is still denied admin access. Never put passwords or service-role keys in this file, Git, chat, or a public document.

## Backend and data model

The Supabase migration creates:

- `admin_profiles` — explicit allow-list for admin identities.
- `blog_posts` — rich-text articles, SEO fields, cover image, author/category, draft/published state.
- `projects` and `project_images` — project proof, gallery and evidence-tagged impact figures.
- `testimonials` — quote, attribution/photo, order, project link and consent flag.
- Public `content-media` Storage bucket — public read for published-site media; authenticated administrators can upload, update and delete through protected server actions.

All content tables use Row Level Security. The public can read published records; draft access and writes require an administrator. Admin pages are session-protected by `proxy.ts` / Supabase middleware and re-check authorization in server-side actions with `requireAdmin`. Do not weaken those checks when changing the CMS.

The exact Supabase project ID, live region, backup plan and production secrets are intentionally not recorded here. The owner previously requested Mumbai hosting; confirm the actual project's region in the Supabase dashboard before making a migration plan. The workspace currently has no `.env.local` file.

## Hosting, Git and DNS

- Git remote `origin`: `https://github.com/Therightpath-star/sunergy-content-platform.git`; branch observed locally: `main`.
- Vercel project: `sunergy-content-platform`; custom domains are `www.cosmisolenergy.com` and `cosmisolenergy.com`, with the apex configured to redirect permanently to `www`.
- DNS is managed in MilesWeb mPanel. Current website records after cutover: apex `A @ → 216.198.79.1`; `www CNAME → c70d1a816ff41d02.vercel-dns-017.com`. Vercel reported both domains valid after refresh.
- Mail-specific DNS, SPF, DMARC, Google Search Console verification and provider nameserver records were retained. Avoid replacing the nameserver delegation or deleting mail records during routine web changes.
- Service dashboards: [Vercel project domains](https://vercel.com/the-right-path/sunergy-content-platform/settings/domains), [GitHub repository](https://github.com/Therightpath-star/sunergy-content-platform), [MilesWeb client area](https://my.milesweb.com/clientarea.php). Supabase project link must be obtained from the account owner.

**Repository state at handover:** the local Git worktree has multiple modified, deleted and untracked files. These are not necessarily committed or deployed. Review `git status` and `git diff` before release; do not clean, reset or overwrite this checkout until the owner confirms the pending work has been captured. The Vercel dashboard's valid domain state does not certify every uncommitted source change.

## Environment and local development

Copy `.env.example` to `.env.local` and obtain values from the owner or the appropriate dashboard using a private channel. Never commit `.env.local`.

| Variable | Use |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin; production should be `https://www.cosmisolenergy.com`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anonymous key; access is still constrained by RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged server/maintenance key used by content export and acceptance seeding. Keep server-side only; never prefix with `NEXT_PUBLIC_`. |
| `CONTENT_EXPORT_DIR` | Optional path for JSON content exports; defaults to `exports`. |

From the repository root:

```powershell
npm ci
npm run dev
npm run lint
npm test
npm run build
```

End-to-end checks: `npm run test:e2e` (this runs a production build first). Local admin, content queries and export/seeding require the appropriate environment values and a configured Supabase project.

## Analytics, privacy and search discovery

- Google Analytics 4 measurement ID: `G-0026VFLVWR`, loaded through `public/legacy/analytics-consent.js`. The consent UI offers accept/reject; default consent denies analytics/ad storage. The script skips admin paths and crawler user agents. The public cookie/privacy pages explain current behavior; re-check them when changing tags or adding marketing/CRM tools.
- Public discovery endpoints: `https://www.cosmisolenergy.com/robots.txt`, `/sitemap.xml`, `/llms.txt` and `/api/rss`.
- `/robots.txt` allows public paths and disallows `/admin` and `/admin/`. `llms.txt` describes the company and links published content; sitemap/RSS entries are generated from published records. Crawler files are guidance and cannot guarantee that any particular AI product will fetch/index the site.
- Google Search Console ownership TXT is present in DNS. After publishing new content, inspect the public route and sitemap; indexing still depends on Google crawling and indexing.

## Backup, release and recovery

1. Before bulk edits/releases, run `npm run export:content` with the required environment values and store the JSON in encrypted company storage. It exports database content only, not media files or credentials.
2. Confirm Supabase database backups and Storage object backups are enabled and recoverable. The active bucket is `content-media`.
3. Deploy a reviewed commit through the Vercel/GitHub workflow. Test the public home/about/blog/projects, calculator, WhatsApp enquiry link, admin auth, content create/edit/publish/unpublish, image uploads, cookie choice, sitemap, robots, `llms.txt`, RSS and mobile layout.
4. For an app regression, redeploy the last known-good Vercel deployment, then test the enquiry flow. For a data incident, stop edits, export current content if safe, and restore from a verified Supabase backup. Do not roll back the database schema by guessing; use a reviewed forward migration or tested recovery.
5. Keep a record of the accepted commit, Vercel deployment ID and database backup point with the release.

See [`deployment.md`](deployment.md) for the existing staging/production checklist and recovery procedure. Confirm any stale details there against the current owner dashboards before performing an account or region migration.

## Owner checklist for the incoming maintainer

- Obtain individual GitHub, Vercel, MilesWeb and Supabase access through each provider's invitation flow; do not share the owner's password.
- Confirm who controls production deployments and the Vercel production branch/root directory.
- Confirm the Supabase project ID, region (including the earlier Mumbai request), Auth admin list, storage bucket, backup retention and recovery access.
- Verify the production environment variables in Vercel without copying their values into this handover.
- Review and commit or deliberately discard the current local changes only after confirming they are backed up.
- Verify that production `/`, `/about`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` and `/api/rss` load and that `www` remains the canonical host.
- Decide whether future projects/blogs/testimonials are maintained through the CMS (recommended) or a separate static HTML export workflow; avoid editing two competing copies as if they were both live sources.

