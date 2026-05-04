create policy "Acesso anônimo lê técnicos"
on public.tecnicos for select
to anon
using (true);

create policy "Acesso anônimo cria técnicos"
on public.tecnicos for insert
to anon
with check (true);

create policy "Acesso anônimo lê motos"
on public.motos for select
to anon
using (true);

create policy "Acesso anônimo cria motos"
on public.motos for insert
to anon
with check (true);

create policy "Acesso anônimo lê alimentação"
on public.gastos_alimentacao for select
to anon
using (true);

create policy "Acesso anônimo cria alimentação"
on public.gastos_alimentacao for insert
to anon
with check (true);

create policy "Acesso anônimo lê abastecimento"
on public.gastos_abastecimento for select
to anon
using (true);

create policy "Acesso anônimo cria abastecimento"
on public.gastos_abastecimento for insert
to anon
with check (true);

create policy "Acesso anônimo lê manutenção"
on public.gastos_manutencao for select
to anon
using (true);

create policy "Acesso anônimo cria manutenção"
on public.gastos_manutencao for insert
to anon
with check (true);

create policy "Acesso anônimo lê hospedagem"
on public.gastos_hospedagem for select
to anon
using (true);

create policy "Acesso anônimo cria hospedagem"
on public.gastos_hospedagem for insert
to anon
with check (true);

create policy "Acesso anônimo lê recargas"
on public.recargas_flash for select
to anon
using (true);

create policy "Acesso anônimo cria recargas"
on public.recargas_flash for insert
to anon
with check (true);
