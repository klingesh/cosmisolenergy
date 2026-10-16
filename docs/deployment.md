# Cosmisol deployment and recovery guide

## Required services and variables

Create separate Supabase projects for staging and production, and a Vercel project connected to this repository. Configure the following in each Vercel environment:

- `NEXT_PUBLIC_SITE_URL`: the exact canonical origin for that environment.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anonymous key.
- `SUPABASE_SERVICE_ROLE_KEY`: server-side operations key. Keep it secret and never expose it to browser code.
- `CONTENT_EXPORT_DIR`: optional local export directory; defaults to `exports`.

## Database and first administrator

1. Apply `supabase/migrations/202609190001_content_platform.sql` to a new Supabase project.
2. In Supabase Authentication, create the first administrator with a strong unique password and verified email.
3. Copy that user’s UUID and add the profile in the SQL editor:

```sql
insert into public.admin_profiles (user_id, display_name)
values ('AUTH-USER-UUID', 'Cosmisol administrator');
```

4. Sign in at `/admin/login`. Confirm a normal authenticated user without an `admin_profiles` row cannot enter the admin area.

## Staging deployment

1. Add staging environment variables to Vercel and deploy a preview build.
2. Run `npm run seed:acceptance` against staging. It creates one clearly marked SAMPLE draft article and one SAMPLE draft project. It does not create testimonials or publish customer claims.
3. Test mobile, tablet and desktop layouts; calculator output; the WhatsApp enquiry; admin create/edit/preview/publish/unpublish/delete; image upload and alt text; metadata; social previews; `/robots.txt`; `/sitemap.xml`; `/llms.txt`; `/api/rss`; and Google Rich Results.
4. Delete or rewrite SAMPLE records before launch. Never publish the sample project as customer proof.

## Backups and exports

Before a release or bulk edit, run `npm run export:content`. Store the JSON export with the deployment record. Also confirm Supabase point-in-time or scheduled database backups and storage-object backups are active for the chosen plan. The JSON export does not replace database and media backups.

## Production release

Promote only the exact preview deployment accepted by Cosmisol. Set the production `NEXT_PUBLIC_SITE_URL` to `https://www.cosmisolenergy.com`, connect the domain, verify HTTPS and preferred-host redirects, then run the full acceptance checks again. Submit `/sitemap.xml` in Google Search Console after ownership is verified and inspect the canonical homepage plus one published article and project. `/llms.txt` provides AI assistants with a public guide to the company and published content.

## Rollback

If application behavior fails, immediately redeploy the last known-good Vercel deployment and verify the public enquiry flow. If the content database is affected, disable editing, export the current state, and restore the Supabase backup selected in the incident record. If DNS was changed during cutover, restore the recorded pre-cutover values and allow for DNS propagation. Keep the current static deployment URL and its build ID in the launch report until the new platform is stable.

Never roll back a database schema by guessing. Restore from a tested backup or apply a reviewed forward migration.

