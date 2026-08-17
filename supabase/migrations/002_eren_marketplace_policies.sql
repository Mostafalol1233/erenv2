do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'eren_marketplace_comments' and policyname = 'public_read_eren_comments') then
    create policy public_read_eren_comments on public.eren_marketplace_comments for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'eren_marketplace_comments' and policyname = 'public_insert_eren_comments') then
    create policy public_insert_eren_comments on public.eren_marketplace_comments for insert to anon, authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'eren_marketplace_comments' and policyname = 'admin_delete_eren_comments') then
    create policy admin_delete_eren_comments on public.eren_marketplace_comments for delete to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'eren_marketplace_packages' and policyname = 'public_read_eren_packages') then
    create policy public_read_eren_packages on public.eren_marketplace_packages for select to anon, authenticated using (is_active = true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'eren_marketplace_packages' and policyname = 'admin_write_eren_packages') then
    create policy admin_write_eren_packages on public.eren_marketplace_packages for all to anon, authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'eren_marketplace_settings' and policyname = 'public_read_eren_settings') then
    create policy public_read_eren_settings on public.eren_marketplace_settings for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'eren_marketplace_settings' and policyname = 'admin_write_eren_settings') then
    create policy admin_write_eren_settings on public.eren_marketplace_settings for all to anon, authenticated using (true) with check (true);
  end if;
end $$;
