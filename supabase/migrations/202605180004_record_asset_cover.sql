alter table public.record_assets
add column if not exists is_cover boolean not null default false;

create unique index if not exists record_assets_one_cover_per_record
on public.record_assets (record_id)
where is_cover;
