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
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    const handleCancel = () => setEditingItem(null);
    window.addEventListener("cancelEdit", handleCancel);
    return () => window.removeEventListener("cancelEdit", handleCancel);
  }, []);
  const supabase = getSupabaseBrowserClient();

  
  function handleEdit(item: any) {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    let error;
    if (formData.id) {
      // Update
      const { error: updateError } = await supabase.from("despesas")
        .update({
        tecnico_id: parseInt(formData.tecnico_id),
        valor: parseFloat(formData.valor.replace(",", ".")),
        descricao: formData.motivo,
        data: formData.data_gasto,
        categoria: "hospedagem",
        aprovado_supervisor: true
      })
        .eq("id", formData.id);
      error = updateError;
      setEditingItem(null);
    } else {
      // Insert
      const { error: insertError } = await supabase.from("despesas").insert([
        {
        tecnico_id: parseInt(formData.tecnico_id),
        valor: parseFloat(formData.valor.replace(",", ".")),
        descricao: formData.motivo,
        data: formData.data_gasto,
        categoria: "hospedagem",
        aprovado_supervisor: true
      }
      ]);
      error = insertError;
    }

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
      <ModulePage editingItem={editingItem}
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
            <td style={{ display: 'flex', gap: '8px' }}>
                <button className="action-btn edit" onClick={() => handleEdit(gasto)} title="Editar">
                  <Pencil size={16} />
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(gasto.id)} title="Excluir">
                  <Trash size={16} />
                </button>
              </td>
            </tr>
        )}
      />
    </AppShell>
  );
}
