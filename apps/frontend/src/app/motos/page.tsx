"use client";

import { useEffect, useState } from "react";
import { Bike, Pencil, Trash } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function MotosPage() {
  const [motos, setMotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  async function fetchMotos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("motos")
      .select("*")
      .order("placa", { ascending: true });

    if (!error && data) {
      setMotos(data);
    }
    setLoading(false);
  }

  async function handleSave(formData: any) {
    setLoading(true);
    const { error } = await supabase.from("motos").insert([
      {
        placa: formData.placa,
        hodometro_atual: parseInt(formData.km_atual) || 0,
        modelo: formData.modelo || "N/A",
        marca: formData.marca || "N/A",
        ano: parseInt(formData.ano) || new Date().getFullYear(),
        status: "ativa"
      }
    ]);

    if (error) {
      alert("Erro ao salvar moto: " + error.message);
    } else {
      await fetchMotos();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMotos();
  }, []);

  const activeCount = motos.filter(m => m.status === "ativa").length;
  const maxKm = motos.length > 0 ? Math.max(...motos.map(m => m.hodometro_atual || 0)) : 0;
  const avgKm = motos.length > 0 ? motos.reduce((acc, m) => acc + (m.hodometro_atual || 0), 0) / motos.length : 0;

  return (
    <AppShell activePath="/motos">
      <ModulePage
        actionLabel="Nova moto"
        description="Cadastro da frota, acompanhamento do KM atual e status das motos disponíveis para lançamentos."
        fields={[
          { label: "Placa", name: "placa", placeholder: "ABC1D23" },
          { label: "Modelo", name: "modelo", placeholder: "Ex: CG 160 Fan" },
          { label: "Marca", name: "marca", placeholder: "Ex: Honda" },
          { label: "Ano", name: "ano", placeholder: "Ex: 2023", type: "number" },
          { label: "KM inicial", name: "km_atual", placeholder: "0", type: "number" }
        ]}
        icon={Bike}
        metrics={[
          { label: "Motos cadastradas", value: motos.length.toString() },
          { label: "Motos ativas", value: activeCount.toString() },
          { label: "KM médio", value: avgKm.toFixed(0) },
          { label: "Maior KM", value: maxKm.toString() }
        ]}
        tableColumns={[
          { label: "Placa" },
          { label: "Modelo" },
          { label: "KM atual" },
          { label: "Status" }
        ,
          { label: "Ações" }
        ]}
        title="Gerenciamento de Motos"
        formTitle="Cadastrar Nova Moto"
        data={motos}
        isLoading={loading}
        onSave={handleSave}
        renderRow={(moto) => (
          <tr key={moto.id}>
            <td><strong>{moto.placa}</strong></td>
            <td>{moto.modelo}</td>
            <td>{(moto.hodometro_atual || 0).toLocaleString("pt-BR")} KM</td>
            <td>
              <span style={{ 
                color: moto.status === "ativa" ? "var(--success)" : "var(--warning)", 
                fontWeight: 700 
              }}>
                {moto.status?.toUpperCase() || "N/A"}
              </span>
            </td>
          </tr>
        )}
      />
    </AppShell>
  );
}
