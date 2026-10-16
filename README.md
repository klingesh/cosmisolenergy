# Cosmisol Energy — full website handover

Open `START-HERE.md` first. The editable Next.js/Supabase application is in `content-platform-runtime/`; it contains the active legacy HTML/CSS/JavaScript homepage assets, React pages and routes, admin CMS, database migration, tests and setup docs. The project is ready for `npm ci` after the operator obtains environment secrets securely; no `.env.local`, Git history, `node_modules`, or generated build caches are included.

`standalone-html-export/` is the HTML/CSS/JS package found in the workspace at handover time. It is an older static export (18 September 2026); the current editable homepage source is `content-platform-runtime/public/legacy/home.html` and its assets in `content-platform-runtime/public/legacy/` and `content-platform-runtime/public/images/`. The live Vercel application uses the Next.js project, not this old export folder. See `START-HERE.md` for the distinction and the current deployment details.
