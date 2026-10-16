create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published');
create type public.project_type as enum ('residential', 'commercial', 'industrial');
create type public.claim_source as enum ('measured', 'customer_reported', 'estimated');

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  excerpt text not null, cover_image_url text not null, cover_image_alt text not null,
  body jsonb not null default '{"type":"doc","content":[]}'::jsonb, category text not null,
  author_name text not null, featured boolean not null default false,
  status public.content_status not null default 'draft', published_at timestamptz,
  seo_title text, seo_description text, social_image_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint blog_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blog_publish_date check (status = 'draft' or published_at is not null)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  summary text not null, project_type public.project_type not null, location text not null,
  capacity_value numeric not null check (capacity_value > 0), capacity_unit text not null check (capacity_unit in ('kW','MW')),
  completion_date date not null, cover_image_url text not null, cover_image_alt text not null,
  challenge jsonb, solution jsonb not null, outcome jsonb not null,
  generation_value numeric, generation_period text, generation_source public.claim_source,
  savings_value numeric, savings_period text, savings_source public.claim_source,
  testimonial text, customer_display_name text, testimonial_consent_confirmed boolean not null default false, featured boolean not null default false,
  status public.content_status not null default 'draft', published_at timestamptz,
  seo_title text, seo_description text, social_image_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint project_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint project_publish_date check (status = 'draft' or published_at is not null),
  constraint generation_claim_complete check (generation_value is null or (generation_period is not null and generation_source is not null)),
  constraint savings_claim_complete check (savings_value is null or (savings_period is not null and savings_source is not null)),
  constraint project_testimonial_publish_consent check (status = 'draft' or testimonial is null or testimonial_consent_confirmed)
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null, alt_text text not null, width integer not null check (width > 0),
  height integer not null check (height > 0), display_order integer not null check (display_order >= 0),
  created_at timestamptz not null default now(), unique(project_id, display_order)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(), customer_name text not null, attribution text,
  quote text not null, photo_url text, photo_alt text, project_id uuid references public.projects(id) on delete set null,
  featured boolean not null default false, display_order integer not null default 0 check (display_order >= 0),
  consent_confirmed boolean not null default false, status public.content_status not null default 'draft',
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint testimonial_photo_alt check (photo_url is null or nullif(trim(photo_alt), '') is not null),
  constraint testimonial_publish_consent check (status = 'draft' or (consent_confirmed and published_at is not null))
);

create index blog_posts_public_idx on public.blog_posts(status, published_at desc);
create index projects_public_idx on public.projects(status, completion_date desc);
create index testimonials_public_idx on public.testimonials(status, display_order);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger blog_posts_updated before update on public.blog_posts for each row execute function public.set_updated_at();
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();
create trigger testimonials_updated before update on public.testimonials for each row execute function public.set_updated_at();

create or replace function public.is_admin(user_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.admin_profiles where admin_profiles.user_id = is_admin.user_id);
$$;

alter table public.admin_profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.testimonials enable row level security;

create policy "Admins read profiles" on public.admin_profiles for select using (public.is_admin(auth.uid()));
create policy "Public reads published blog posts" on public.blog_posts for select using (status = 'published');
create policy "Public reads published projects" on public.projects for select using (status = 'published');
create policy "Public reads published project images" on public.project_images for select using (
  exists(select 1 from public.projects where projects.id = project_images.project_id and projects.status = 'published')
);
create policy "Public reads published testimonials" on public.testimonials for select using (status = 'published');

create policy "Admins manage blog posts" on public.blog_posts for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admins manage projects" on public.projects for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admins manage project images" on public.project_images for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('content-media', 'content-media', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads content media" on storage.objects for select using (bucket_id = 'content-media');
create policy "Admins upload content media" on storage.objects for insert with check (bucket_id = 'content-media' and public.is_admin(auth.uid()));
create policy "Admins update content media" on storage.objects for update using (bucket_id = 'content-media' and public.is_admin(auth.uid()));
create policy "Admins delete content media" on storage.objects for delete using (bucket_id = 'content-media' and public.is_admin(auth.uid()));

create or replace function public.replace_project_images(p_project_id uuid, p_images jsonb)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin(auth.uid()) then raise exception 'Administrator access required'; end if;
  if jsonb_array_length(p_images) < 1 then raise exception 'At least one project image is required'; end if;
  delete from public.project_images where project_id = p_project_id;
  insert into public.project_images (project_id, image_url, alt_text, width, height, display_order)
  select p_project_id, image_url, alt_text, width, height, display_order
  from jsonb_to_recordset(p_images) as image(image_url text, alt_text text, width integer, height integer, display_order integer);
end;
$$;
grant execute on function public.replace_project_images(uuid, jsonb) to authenticated;
