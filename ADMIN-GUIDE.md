# Cosmisol content administration

## Sign in and dashboard

Open `/admin/login` and sign in with the private administrator account. There is no public registration page. The dashboard links to articles, project proofs and testimonials.

## Articles

Create an article as a draft, add a clear title, short excerpt, category, author and cover image, then write the body in the rich-text editor. Use a short lowercase slug with hyphens. Preview the draft while signed in. Publish only after checking facts, links, spelling, SEO text and image alt text. To remove a live article without deleting it, change its status back to draft (unpublish it).

## Project proofs

Create a project as a draft. Record the project type, general location, capacity, completion date, challenge, solution and outcome. Every uploaded image needs concise alt text that describes what is visible. Do not expose a private home address, customer phone number or other identifying detail.

Generation and savings figures must come from evidence. Choose the matching claim source: `measured` for system or meter records, `customer_reported` for information supplied by the customer, or `estimated` for a clearly labelled calculation. Keep the source evidence outside the website with the project record. Leave an unverified claim empty.

Preview before publishing. Unpublish a project by returning it to draft status. Deleting a project also removes its linked gallery records.

## Testimonials

Add a testimonial only after the customer has approved the exact quote, display name, attribution and any photo. Confirm consent in the editor before publishing. Add photo alt text whenever a photo is present. Use display order to control the sequence. Unpublish by returning the testimonial to draft.

## Media

Use JPEG, PNG or WebP files under 10 MB. Crop images before upload and avoid uploading original files that contain unnecessary metadata. Alt text should communicate the image’s purpose in one sentence; do not start it with “image of”.

## Safe publishing checklist

1. Confirm the content belongs to Cosmisol and is accurate.
2. Remove customer identifiers unless publication is authorised.
3. Check every performance or savings claim and its claim source.
4. Add useful alt text and preview on mobile and desktop.
5. Check the slug, page title and description.
6. Publish, open the public URL, then verify it appears in the sitemap and RSS feed where applicable.

## Export and recovery

Run `npm run export:content` from a secured operator machine with the service-role environment variables. Store the resulting JSON in encrypted company storage. The export contains content records, not media binaries or administrator credentials. Supabase database backups and storage backups remain the authoritative recovery source.

