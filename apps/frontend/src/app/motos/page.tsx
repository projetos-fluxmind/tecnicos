"use client";

import { useEffect, useState } from "react";
import { Bike, Pencil, Trash } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function MotosPage() {
  const [motos, setMotos] = useState<any[]>([]);
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
    if (!confirm("Tem certeza que deseja inativar esta moto?")) return;
    
    setLoading(true);
    const { error } = await supabase.from("motos").update({ status: 'inativa' }).eq("id", id);
    if (error) {
      alert("Erro ao inativar: " + error.message);
    } else {
      fetchMotos();
    }
    setLoading(false);
  }

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
    
    let error;
    if (formData.id) {
      // Update
      const { error: updateError } = await supabase.from("motos")
        .update({
        placa: formData.placa,
        hodometro_atual: parseInt(formData.km_atual) || 0,
        modelo: formData.modelo || "N/A",
        marca: formData.marca || "N/A",
        ano: parseInt(formData.ano) || new Date().getFullYear(),
        status: "ativa"
      })
        .eq("id", formData.id);
      error = updateError;
      setEditingItem(null);
    } else {
      // Insert
      const { error: insertError } = await supabase.from("motos").insert([
        {
        placa: formData.placa,
        hodometro_atual: parseInt(formData.km_atual) || 0,
        modelo: formData.modelo || "N/A",
        marca: formData.marca || "N/A",
        ano: parseInt(formData.ano) || new Date().getFullYear(),
        status: "ativa"
      }
      ]);
      error = insertError;
    }

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
        editingItem={editingItem}
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
            <td style={{ display: 'flex', gap: '8px' }}>
              <button className="action-btn edit" onClick={() => handleEdit(moto)} title="Editar">
                <Pencil size={16} />
              </button>
              <button className="action-btn delete" onClick={() => handleDelete(moto.id)} title="Excluir">
                <Trash size={16} />
              </button>
            </td>
          </tr>
        )}
      />
    </AppShell>
  );
}
