grant usage on schema public to anon, authenticated;

grant select
on public.records,
  public.record_assets,
  public.racing_laps,
  public.racing_setups,
  public.codex_daily_logs
to anon, authenticated;

grant select on public.admin_profiles to authenticated;

grant insert, update, delete
on public.records,
  public.record_assets,
  public.racing_laps,
  public.racing_setups,
  public.codex_daily_logs
to authenticated;
