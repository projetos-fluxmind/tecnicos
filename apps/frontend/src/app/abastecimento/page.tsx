"use client";

import { useEffect, useState } from "react";
import { Fuel } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AbastecimentoPage() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [motos, setMotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  async function fetchData() {
    setLoading(true);
    
    // Busca despesas do tipo combustível
    const { data: gastosData } = await supabase
      .from("despesas")
      .select("*, tecnicos(nome)")
      .eq("categoria", "combustivel")
      .order("data", { ascending: false });

    const { data: tecnicosData } = await supabase
      .from("tecnicos")
      .select("id, nome")
      .eq("status", "ativo")
      .order("nome");

    const { data: motosData } = await supabase
      .from("motos")
      .select("id, placa, hodometro_atual")
      .order("placa");

    if (gastosData) setGastos(gastosData);
    if (tecnicosData) setTecnicos(tecnicosData);
    if (motosData) setMotos(motosData);
    
    setLoading(false);
  }

  async function handleSave(formData: any) {
    setLoading(true);
    
    // Encontra a placa da moto selecionada para salvar na observação
    const moto = motos.find(m => m.id.toString() === formData.moto_id);
    
    const { error } = await supabase.from("despesas").insert([
      {
        tecnico_id: parseInt(formData.tecnico_id),
        valor: parseFloat(formData.valor.replace(",", ".")),
        data: formData.data_gasto,
        categoria: "combustivel",
        descricao: `Abastecimento - Moto ${moto?.placa || "N/A"}`,
        observacoes: JSON.stringify({
          moto_id: formData.moto_id,
          placa: moto?.placa,
          km: formData.km_registrado
        }),
        aprovado_supervisor: true
      }
    ]);

    if (error) {
      alert("Erro ao salvar abastecimento: " + error.message);
    } else {
      // Atualiza o hodômetro da moto
      await supabase.from("motos")
        .update({ hodometro_atual: parseInt(formData.km_registrado) })
        .eq("id", formData.moto_id);
        
      await fetchData();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalValue = gastos.reduce((acc, g) => acc + g.valor, 0);
  
  // Extrai o maior KM das observações JSON
  const getKm = (g: any) => {
    try {
      const obs = JSON.parse(g.observacoes || "{}");
      return parseInt(obs.km) || 0;
    } catch { return 0; }
  };
  
  const totalKm = gastos.length > 0 ? Math.max(...gastos.map(getKm)) : 0;

  return (
    <AppShell activePath="/abastecimento">
      <ModulePage
        actionLabel="Novo abastecimento"
        description="Registro de abastecimentos com atualização automática do hodômetro da moto."
        fields={[
          { 
            label: "Técnico", 
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
          { label: "Valor pago", name: "valor", placeholder: "0,00", type: "text" },
          { label: "KM atual", name: "km_registrado", placeholder: "0", type: "number" }
        ]}
        icon={Fuel}
        metrics={[
          { label: "Total abastecido", value: `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "Abastecimentos", value: gastos.length.toString() },
          { label: "Maior KM", value: totalKm.toLocaleString("pt-BR") },
          { label: "Motos em uso", value: motos.length.toString() }
        ]}
        tableColumns={[
          { label: "Data" },
          { label: "Técnico" },
          { label: "Moto / KM" },
          { label: "Valor" }
        ]}
        title="Gastos com Abastecimento"
        formTitle="Lançar Abastecimento"
        data={gastos}
        isLoading={loading}
        onSave={handleSave}
        renderRow={(gasto) => {
          let obsData = { placa: "N/A", km: 0 };
          try { obsData = JSON.parse(gasto.observacoes || "{}"); } catch(e) {}
          
          return (
            <tr key={gasto.id}>
              <td>{new Date(gasto.data).toLocaleDateString("pt-BR")}</td>
              <td>{gasto.tecnicos?.nome}</td>
              <td>
                <strong>{obsData.placa}</strong>
                <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{obsData.km?.toLocaleString("pt-BR")} KM</div>
              </td>
              <td>R$ {gasto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            </tr>
          );
        }}
      />
    </AppShell>
  );
}
