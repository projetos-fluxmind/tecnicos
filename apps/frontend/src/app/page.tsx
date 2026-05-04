"use client";

import { useEffect, useState } from "react";
import {
  Bike,
  Building2,
  CreditCard,
  Fuel,
  Hotel,
  ReceiptText,
  Utensils
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const modules = [
  { name: "Alimentação", href: "/alimentacao", status: "Operacional", icon: Utensils },
  { name: "Abastecimento", href: "/abastecimento", status: "Operacional", icon: Fuel },
  { name: "Manutenção", href: "/manutencao", status: "Frota", icon: ReceiptText },
  { name: "Hospedagem", href: "/hospedagem", status: "Operacional", icon: Hotel },
  { name: "Recarga Flash", href: "/recarga-flash", status: "Financeiro", icon: CreditCard },
  { name: "Técnicos", href: "/tecnicos", status: "Cadastro", icon: Building2 },
  { name: "Motos", href: "/motos", status: "Cadastro", icon: Bike }
];

export default function HomePage() {
  const [metrics, setMetrics] = useState([
    { label: "Gasto total", value: "R$ 0,00" },
    { label: "Técnicos ativos", value: "0" },
    { label: "Motos ativas", value: "0" },
    { label: "Média Alimentação", value: "R$ 0,00" }
  ]);
  const supabase = getSupabaseBrowserClient();

  async function fetchDashboardData() {
    // Busca contadores com os campos corretos do banco legado
    const { count: tecnicosCount } = await supabase.from("tecnicos").select("*", { count: "exact", head: true }).eq("status", "ativo");
    const { count: motosCount } = await supabase.from("motos").select("*", { count: "exact", head: true }).eq("status", "ativa");

    // Busca todas as despesas da tabela unificada
    const { data: despesas } = await supabase.from("despesas").select("valor, categoria");

    const total = despesas?.reduce((acc, v) => acc + v.valor, 0) || 0;
    
    const alimentacao = despesas?.filter(d => d.categoria === "alimentacao") || [];
    const avgAlimentacao = alimentacao.length > 0 
      ? alimentacao.reduce((acc, v) => acc + v.valor, 0) / alimentacao.length 
      : 0;

    setMetrics([
      { label: "Gasto total acumulado", value: `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
      { label: "Técnicos em campo", value: (tecnicosCount || 0).toString() },
      { label: "Motos na frota", value: (motosCount || 0).toString() },
      { label: "Média Refeição", value: `R$ ${avgAlimentacao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` }
    ]);
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AppShell activePath="/">
      <header className="topbar">
        <div>
          <span className="eyebrow">Sistema de Gestão</span>
          <h1>Visão Geral Operacional</h1>
          <p className="page-description">Acompanhamento centralizado de gastos da frota técnica.</p>
        </div>
        <Link className="primary-action action-link" href="/alimentacao">
          Novo lançamento
        </Link>
      </header>

      <section className="metrics-grid" aria-label="Indicadores principais">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="work-area">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Estrutura por módulos</span>
            <h2>Operacional</h2>
          </div>
        </div>

        <div className="module-grid">
          {modules.map((item) => (
            <Link className="module-card module-link" href={item.href} key={item.name}>
              <item.icon size={22} />
              <div>
                <strong>{item.name}</strong>
                <span>{item.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
