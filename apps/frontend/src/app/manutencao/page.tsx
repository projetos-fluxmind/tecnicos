"use client";

import { useEffect, useState } from "react";
import { ReceiptText, Pencil, Trash } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function ManutencaoPage() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [motos, setMotos] = useState<any[]>([]);
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
    
    // Busca despesas do tipo outros e filtra por manutencao no frontend
    const { data: gastosData } = await supabase
      .from("despesas")
      .select("*, tecnicos(nome)")
      .eq("categoria", "outros")
      .order("data", { ascending: false });

    const { data: motosData } = await supabase
      .from("motos")
      .select("id, placa")
      .eq("status", "ativa")
      .order("placa");

    const { data: tecnicosData } = await supabase
      .from("tecnicos")
      .select("id, nome")
      .eq("status", "ativo")
      .order("nome");

    if (gastosData) {
      // Filtra apenas o que é manutenção
      const filtered = gastosData.filter((g: any) => {
        try {
          const obs = JSON.parse(g.observacoes || "{}");
          return obs.tipo_real === "manutencao";
        } catch { return false; }
      });
      setGastos(filtered);
    }
    if (motosData) setMotos(motosData);
    if (tecnicosData) setTecnicos(tecnicosData);
    
    setLoading(false);
  }

  async function handleSave(formData: any) {
    setLoading(true);
    
    const moto = motos.find(m => m.id.toString() === formData.moto_id);
    
    const { error } = await supabase.from("despesas").insert([
      {
        tecnico_id: parseInt(formData.tecnico_id),
        valor: parseFloat(formData.valor.replace(",", ".")),
        descricao: formData.descricao,
        data: formData.data_gasto,
        categoria: "outros",
        observacoes: JSON.stringify({
          tipo_real: "manutencao",
          moto_id: formData.moto_id,
          placa: moto?.placa || "N/A"
        }),
        aprovado_supervisor: true
      }
    ]);

    if (error) {
      alert("Erro ao salvar manutenção: " + error.message);
    } else {
      await fetchData();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalValue = gastos.reduce((acc: number, g: any) => acc + g.valor, 0);
  const avgValue = gastos.length > 0 ? totalValue / gastos.length : 0;

  return (
    <AppShell activePath="/manutencao">
      <ModulePage
        actionLabel="Nova manutenção"
        description="Acompanhamento de custos de manutenção por moto, descrição do serviço e data do gasto."
        fields={[
          { 
            label: "Técnico Responsável", 
            name: "tecnico_id", 
            type: "select",
            options: tecnicos.map(t => ({ label: t.nome, value: t.id }))
          },
          { 
            label: "Moto", 
            name: "moto_id", 
            type: "select",
            options: motos.map(m => ({ label: m.placa, value: m.id }))
          },
          { label: "Data", name: "data_gasto", type: "date" },
          { label: "Valor gasto", name: "valor", placeholder: "0,00", type: "text" },
          { label: "Descrição", name: "descricao", placeholder: "Ex: troca de relação" }
        ]}
        icon={ReceiptText}
        metrics={[
          { label: "Total em manutenção", value: `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "Serviços", value: gastos.length.toString() },
          { label: "Moto destaque", value: "-" },
          { label: "Ticket médio", value: `R$ ${avgValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` }
        ]}
        tableColumns={[
          { label: "Data" },
          { label: "Técnico" },
          { label: "Placa" },
          { label: "Descrição" },
          { label: "Valor" }
        ,
          { label: "Ações" }
        ]}
        title="Gastos com Manutenção"
        formTitle="Lançar Manutenção"
        data={gastos}
        isLoading={loading}
        onSave={handleSave}
        renderRow={(gasto) => {
          let obsData = { placa: "N/A" };
          try { obsData = JSON.parse(gasto.observacoes || "{}"); } catch(e) {}
          
          return (
            <tr key={gasto.id}>
              <td>{new Date(gasto.data).toLocaleDateString("pt-BR")}</td>
              <td>{gasto.tecnicos?.nome}</td>
              <td><strong>{obsData.placa}</strong></td>
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
          );
        }}
      />
    </AppShell>
  );
}
