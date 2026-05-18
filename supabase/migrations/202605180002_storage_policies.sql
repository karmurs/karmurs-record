insert into storage.buckets (id, name, public)
values ('record-assets', 'record-assets', true)
on conflict (id) do nothing;

create policy "Public can read public record asset files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'record-assets');

create policy "Admins can upload record asset files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'record-assets' and public.is_admin());

create policy "Admins can update record asset files"
on storage.objects for update
to authenticated
using (bucket_id = 'record-assets' and public.is_admin())
with check (bucket_id = 'record-assets' and public.is_admin());

create policy "Admins can delete record asset files"
on storage.objects for delete
to authenticated
using (bucket_id = 'record-assets' and public.is_admin());
