"use client";

import { useEffect, useState } from "react";
import { Hotel, Pencil, Trash } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function HospedagemPage() {
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
    
    // Busca despesas do tipo hospedagem
    const { data: gastosData } = await supabase
      .from("despesas")
      .select("*, tecnicos(nome)")
      .eq("categoria", "hospedagem")
      .order("data", { ascending: false });

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
        descricao: formData.motivo,
        data: formData.data_gasto,
        categoria: "hospedagem",
        aprovado_supervisor: true
      }
    ]);

    if (error) {
      alert("Erro ao salvar hospedagem: " + error.message);
    } else {
      await fetchData();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalValue = gastos.reduce((acc, g) => acc + g.valor, 0);

  return (
    <AppShell activePath="/hospedagem">
      <ModulePage
        actionLabel="Nova hospedagem"
        description="Registro de hospedagens por técnico, valor, motivo e período de operação."
        fields={[
          { 
            label: "Técnico", 
            name: "tecnico_id", 
            type: "select",
            options: tecnicos.map(t => ({ label: t.nome, value: t.id }))
          },
          { label: "Data", name: "data_gasto", type: "date" },
          { label: "Valor pago", name: "valor", placeholder: "0,00", type: "text" },
          { label: "Motivo", name: "motivo", placeholder: "Ex: atendimento fora da base" }
        ]}
        icon={Hotel}
        metrics={[
          { label: "Total em hospedagem", value: `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "Hospedagens", value: gastos.length.toString() },
          { label: "Técnico destaque", value: "-" },
          { label: "Ticket médio", value: `R$ ${(gastos.length > 0 ? totalValue / gastos.length : 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` }
        ]}
        tableColumns={[
          { label: "Data" },
          { label: "Técnico" },
          { label: "Motivo" },
          { label: "Valor" }
        ,
          { label: "Ações" }
        ]}
        title="Gastos com Hospedagem"
        formTitle="Lançar Hospedagem"
        data={gastos}
        isLoading={loading}
        onSave={handleSave}
        renderRow={(gasto) => (
          <tr key={gasto.id}>
            <td>{new Date(gasto.data).toLocaleDateString("pt-BR")}</td>
            <td>{gasto.tecnicos?.nome}</td>
            <td>{gasto.descricao}</td>
            <td>R$ {gasto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        )}
      />
    </AppShell>
  );
}
