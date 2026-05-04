"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type PeriodOption = "7" | "15" | "month";

const periodOptions: Array<{ label: string; value: PeriodOption }> = [
  { label: "7 dias", value: "7" },
  { label: "15 dias", value: "15" },
  { label: "Mês", value: "month" }
];

function getPeriodRange(period: PeriodOption) {
  const endDate = new Date();
  const startDate = new Date(endDate);

  if (period === "month") {
    startDate.setDate(1);
  } else {
    startDate.setDate(endDate.getDate() - Number(period) + 1);
  }

  return {
    start: startDate.toLocaleDateString("pt-BR"),
    end: endDate.toLocaleDateString("pt-BR")
  };
}

export function ModuleFilters() {
  const [tecnico, setTecnico] = useState("");
  const [placa, setPlaca] = useState("");
  const [period, setPeriod] = useState<PeriodOption>("7");

  const range = useMemo(() => getPeriodRange(period), [period]);

  return (
    <div className="filter-panel">
      <div className="filter-grid">
        <label className="field">
          <span>Técnico</span>
          <input
            name="tecnico"
            onChange={(event) => setTecnico(event.target.value)}
            placeholder="Nome ou matrícula"
            value={tecnico}
          />
        </label>

        <label className="field">
          <span>Placa</span>
          <input
            name="placa"
            onChange={(event) => setPlaca(event.target.value.toUpperCase())}
            placeholder="ABC1D23"
            value={placa}
          />
        </label>

        <div className="field period-field">
          <span>Período</span>
          <div className="segmented-control" role="group" aria-label="Filtro por período">
            {periodOptions.map((option) => (
              <button
                aria-pressed={period === option.value}
                className={period === option.value ? "selected" : ""}
                key={option.value}
                onClick={() => setPeriod(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          <button className="secondary-action icon-action" type="button">
            <Search size={17} />
            Filtrar
          </button>
          <button
            className="ghost-action"
            onClick={() => {
              setTecnico("");
              setPlaca("");
              setPeriod("7");
            }}
            type="button"
          >
            <X size={17} />
            Limpar
          </button>
        </div>
      </div>

      <div className="active-filters" aria-live="polite">
        <span>Período aplicado: {range.start} até {range.end}</span>
        {tecnico && <span>Técnico: {tecnico}</span>}
        {placa && <span>Placa: {placa}</span>}
      </div>
    </div>
  );
}
