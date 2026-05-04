"use client";

import { useEffect, useState } from "react";
import { Utensils, Pencil, Trash } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AlimentacaoPage() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  
  function handleEdit(item: any) {
    alert("Editar funcionalidade em construção para o ID: " + item.id);
  }

  async function handleDelete(id: string | number) {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;
    
    setLoading(true);
    let table = "despesas";
    if (window.location.pathname.includes("tecnicos")) table = "tecnicos";
    if (window.location.pathname.includes("motos")) table = "motos";

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir: " + error.message);
    } else {
      fetchData();
    }
    setLoading(false);
  }

  async function fetchData() {
    setLoading(true);
    
    // Busca despesas do tipo alimentação
    const { data: gastosData } = await supabase
      .from("despesas")
      .select("*, tecnicos(nome)")
      .eq("categoria", "alimentacao")
      .order("data", { ascending: false });

    // Busca técnicos para o select
    const { data: tecnicosData } = await supabase
      .from("tecnicos")
      .select("id, nome")
      .eq("status", "ativo")
      .order("nome");

    if (gastosData) setGastos(gastosData);
    if (tecnicosData) setTecnicos(tecnicosData);
    
    setLoading(false);
  }

  async function handleSave(formData: any) {
    setLoading(true);
    const { error } = await supabase.from("despesas").insert([
      {
        tecnico_id: parseInt(formData.tecnico_id),
        valor: parseFloat(formData.valor.replace(",", ".")),
        data: formData.data_gasto,
        categoria: "alimentacao",
        descricao: "Alimentação técnico",
        aprovado_supervisor: true
      }
    ]);

    if (error) {
      alert("Erro ao salvar gasto: " + error.message);
    } else {
      await fetchData();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalValue = gastos.reduce((acc, g) => acc + g.valor, 0);
  const aboveLimit = gastos.filter(g => g.valor > 35).length;
  const avgValue = gastos.length > 0 ? totalValue / gastos.length : 0;

  return (
    <AppShell activePath="/alimentacao">
      <ModulePage
        actionLabel="Nova refeição"
        description="Controle de refeições por técnico, com alerta automático para valores acima de R$ 35,00."
        fields={[
          { 
            label: "Técnico", 
            name: "tecnico_id", 
            type: "select",
            options: tecnicos.map(t => ({ label: t.nome, value: t.id }))
          },
          { label: "Data", name: "data_gasto", type: "date" },
          { label: "Valor", name: "valor", placeholder: "0,00", type: "text" }
        ]}
        icon={Utensils}
        metrics={[
          { label: "Total do período", value: `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "Refeições", value: gastos.length.toString() },
          { label: "Acima do limite", value: aboveLimit.toString() },
          { label: "Média por refeição", value: `R$ ${avgValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` }
        ]}
        tableColumns={[
          { label: "Data" },
          { label: "Técnico" },
          { label: "Valor" },
          { label: "Status" }
        ,
          { label: "Ações" }
        ]}
        title="Gastos com Alimentação"
        formTitle="Lançar Refeição"
        data={gastos}
        isLoading={loading}
        onSave={handleSave}
        renderRow={(gasto) => (
          <tr key={gasto.id}>
            <td>{new Date(gasto.data).toLocaleDateString("pt-BR")}</td>
            <td>{gasto.tecnicos?.nome}</td>
            <td>R$ {gasto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td>
              {gasto.valor > 35 ? (
                <span style={{ color: "var(--danger)", fontWeight: 700 }}>⚠️ ACIMA DO LIMITE (R$ 35)</span>
              ) : (
                <span style={{ color: "var(--success)" }}>DENTRO DO LIMITE</span>
              )}
            </td>
          </tr>
        )}
      />
    </AppShell>
  );
}
