-- ============================================================
-- "For You" page: tables, RLS, and storage for video uploads
-- Run this in Supabase Dashboard → SQL Editor (one block or step by step)
-- ============================================================

-- 1) Table: who is admin vs viewer (you must add rows after creating 2 users in Auth)
create table if not exists public.user_roles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'viewer'))
);

alter table public.user_roles enable row level security;

-- Only allow reading your own role (authenticated users can read their row)
create policy "Users can read own role"
  on public.user_roles for select
  using (auth.uid() = id);

-- No one can insert/update/delete from the client (do it in Dashboard or with service role)
-- So: add your admin and viewer users manually after they exist in Auth:
--   insert into public.user_roles (id, role) values ('<your-auth-user-id>', 'admin');
--   insert into public.user_roles (id, role) values ('<her-auth-user-id>', 'viewer');


-- 2) Table: videos (storage path + caption)
create table if not exists public.for_you_videos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  storage_path text not null,
  caption text not null
);

alter table public.for_you_videos enable row level security;

-- Anyone authenticated (admin or viewer) can read all videos
create policy "Authenticated can read videos"
  on public.for_you_videos for select
  using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid()
    )
  );

-- Only admin can insert/update/delete
create policy "Admin can insert videos"
  on public.for_you_videos for insert
  with check (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can update videos"
  on public.for_you_videos for update
  using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can delete videos"
  on public.for_you_videos for delete
  using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 3) Storage bucket: create in Dashboard or via API, then add policies
-- In Dashboard: Storage → New bucket → name: for-you-videos → Public if you want direct video URLs (recommended for viewing)
-- Then run the policies below (replace 'for-you-videos' if you used another name).

-- Only users in user_roles (admin or viewer) can read objects
create policy "Role users can read for-you-videos"
  on storage.objects for select
  using (
    bucket_id = 'for-you-videos'
    and exists (
      select 1 from public.user_roles
      where id = auth.uid()
    )
  );

-- Only admin can upload/update/delete objects
create policy "Admin can insert for-you-videos"
  on storage.objects for insert
  with check (
    bucket_id = 'for-you-videos'
    and exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can update for-you-videos"
  on storage.objects for update
  using (
    bucket_id = 'for-you-videos'
    and exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can delete for-you-videos"
  on storage.objects for delete
  using (
    bucket_id = 'for-you-videos'
    and exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- AFTER RUNNING THIS:
-- 1. In Supabase: Authentication → Users → create 2 users (e.g. your email + password, her email + password).
-- 2. Copy their UUIDs (Authentication → Users → click user → copy "User UID").
-- 3. In SQL Editor run:
--    insert into public.user_roles (id, role) values ('<YOUR-USER-UID>', 'admin');
--    insert into public.user_roles (id, role) values ('<HER-USER-UID>', 'viewer');
-- 4. Create storage bucket "for-you-videos" in Dashboard → Storage (name must match above). Make it **Public** so video URLs work for viewing.
-- 5. In your app .env set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (from Supabase → Settings → API).
-- ============================================================
