"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function RecargaFlashPage() {
  const [recargas, setRecargas] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  async function fetchData() {
    setLoading(true);
    
    // Busca despesas do tipo outros e filtra por recarga no frontend
    const { data: recargasData } = await supabase
      .from("despesas")
      .select("*, tecnicos(nome)")
      .eq("categoria", "outros")
      .order("data", { ascending: false });

    const { data: tecnicosData } = await supabase
      .from("tecnicos")
      .select("id, nome")
      .eq("status", "ativo")
      .order("nome");

    if (recargasData) {
      // Filtra apenas o que é recarga flash
      const filtered = recargasData.filter((r: any) => {
        try {
          const obs = JSON.parse(r.observacoes || "{}");
          return obs.tipo_real === "recarga_flash";
        } catch { return false; }
      });
      setRecargas(filtered);
    }
    if (tecnicosData) setTecnicos(tecnicosData);
    
    setLoading(false);
  }

  async function handleSave(formData: any) {
    setLoading(true);
    const { error } = await supabase.from("despesas").insert([
      {
        tecnico_id: parseInt(formData.tecnico_id),
        valor: parseFloat(formData.valor.replace(",", ".")),
        data: formData.data_recarga,
        categoria: "outros",
        descricao: "Recarga Cartão Flash",
        observacoes: JSON.stringify({ tipo_real: "recarga_flash" }),
        aprovado_supervisor: true
      }
    ]);

    if (error) {
      alert("Erro ao salvar recarga: " + error.message);
    } else {
      await fetchData();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalValue = recargas.reduce((acc: number, r: any) => acc + r.valor, 0);

  return (
    <AppShell activePath="/recarga-flash">
      <ModulePage
        actionLabel="Nova recarga"
        description="Controle de créditos e recargas no cartão Flash por técnico."
        fields={[
          { 
            label: "Técnico", 
            name: "tecnico_id", 
            type: "select",
            options: tecnicos.map(t => ({ label: t.nome, value: t.id }))
          },
          { label: "Data", name: "data_recarga", type: "date" },
          { label: "Valor", name: "valor", placeholder: "0,00", type: "text" }
        ]}
        icon={CreditCard}
        metrics={[
          { label: "Total recarregado", value: `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "Recargas realizadas", value: recargas.length.toString() },
          { label: "Técnico destaque", value: "-" },
          { label: "Média por recarga", value: `R$ ${(recargas.length > 0 ? totalValue / recargas.length : 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` }
        ]}
        tableColumns={[
          { label: "Data" },
          { label: "Técnico" },
          { label: "Valor" }
        ]}
        title="Recargas Flash"
        formTitle="Lançar Recarga"
        data={recargas}
        isLoading={loading}
        onSave={handleSave}
        renderRow={(recarga) => (
          <tr key={recarga.id}>
            <td>{new Date(recarga.data).toLocaleDateString("pt-BR")}</td>
            <td>{recarga.tecnicos?.nome}</td>
            <td>R$ {recarga.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        )}
      />
    </AppShell>
  );
}
