"use client";

import { useEffect, useState } from "react";
import { Building2, Pencil, Trash } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  async function fetchTecnicos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tecnicos")
      .select("*")
      .order("nome", { ascending: true });

    if (!error && data) {
      setTecnicos(data);
    }
    setLoading(false);
  }

  async function handleSave(formData: any) {
    setLoading(true);
    const { error } = await supabase.from("tecnicos").insert([
      {
        nome: formData.nome,
        matricula: formData.matricula,
        status: "ativo"
      }
    ]);

    if (error) {
      alert("Erro ao salvar técnico: " + error.message);
    } else {
      await fetchTecnicos();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const activeCount = tecnicos.filter(t => t.status === "ativo").length;

  return (
    <AppShell activePath="/tecnicos">
      <ModulePage
        actionLabel="Novo técnico"
        description="Cadastro e gerenciamento da lista de técnicos operacionais da frota."
        fields={[
          { label: "Nome", name: "nome", placeholder: "Ex: João da Silva" },
          { label: "Matrícula", name: "matricula", placeholder: "Ex: T-98421" }
        ]}
        icon={Building2}
        metrics={[
          { label: "Técnicos cadastrados", value: tecnicos.length.toString() },
          { label: "Técnicos ativos", value: activeCount.toString() },
          { label: "Com lançamentos", value: "0" }, // Futuro: count joins
          { label: "Inativos", value: (tecnicos.length - activeCount).toString() }
        ]}
        tableColumns={[
          { label: "Nome" },
          { label: "Matrícula" },
          { label: "Status" },
          { label: "Data Cadastro" }
        ,
          { label: "Ações" }
        ]}
        title="Gerenciamento de Técnicos"
        formTitle="Cadastrar Novo Técnico"
        data={tecnicos}
        isLoading={loading}
        onSave={handleSave}
        renderRow={(tecnico) => (
          <tr key={tecnico.id}>
            <td>{tecnico.nome}</td>
            <td>{tecnico.matricula}</td>
            <td>
              <span style={{ color: tecnico.status === "ativo" ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                {tecnico.status === "ativo" ? "ATIVO" : "INATIVO"}
              </span>
            </td>
            <td>{new Date(tecnico.created_at).toLocaleDateString("pt-BR")}</td>
          </tr>
        )}
      />
    </AppShell>
  );
}
