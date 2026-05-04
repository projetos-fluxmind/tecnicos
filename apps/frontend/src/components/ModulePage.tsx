import type { LucideIcon } from "lucide-react";
import { ModuleFilters } from "./ModuleFilters";

export type FieldConfig = {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "select";
  options?: Array<{ label: string; value: string }>;
};

export type TableColumn = {
  label: string;
};

type ModulePageProps = {
  actionLabel: string;
  description: string;
  fields: FieldConfig[];
  icon: LucideIcon;
  metrics: Array<{ label: string; value: string }>;
  tableColumns: TableColumn[];
  title: string;
  // Novas props para integração
  data?: any[];
  isLoading?: boolean;
  onSave?: (data: any) => Promise<void>;
  renderRow?: (item: any) => React.ReactNode;
  formTitle?: string;
  editingItem?: any;
};

export function ModulePage({
  actionLabel,
  description,
  fields,
  icon: Icon,
  metrics,
  tableColumns,
  title,
  data = [],
  isLoading = false,
  onSave,
  renderRow,
  formTitle = "Registrar Novo",
  editingItem = null
}: ModulePageProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onSave) return;
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    
    // Add the ID if we are editing
    if (editingItem?.id) {
      payload.id = editingItem.id;
    }
    
    await onSave(payload);
    form.reset();
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <button className="primary-action">{actionLabel}</button>
      </header>

      <section className="metrics-grid" aria-label={`Indicadores de ${title}`}>
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <h2>{editingItem ? "Editar Registro" : formTitle}</h2>
          </div>
          <Icon size={24} />
        </div>

        <form className="form-grid" onSubmit={handleSubmit} key={editingItem?.id || 'new'}>
          {fields.map((field) => {
            // format date values if needed
            let defValue = editingItem ? editingItem[field.name] : "";
            if (field.type === "date" && defValue) {
              defValue = defValue.split('T')[0];
            }

            return (
              <label className="field" key={field.name}>
                <span>{field.label}</span>
                {field.type === "select" ? (
                  <select name={field.name} required defaultValue={defValue}>
                    <option value="">{field.placeholder || "Selecione..."}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type ?? "text"}
                    required
                    defaultValue={defValue}
                  />
                )}
              </label>
            );
          })}
          <div style={{ display: 'flex', gap: '16px', gridColumn: '1 / -1' }}>
            <button className="secondary-action" type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : (editingItem ? "Salvar Alterações" : "Salvar Registro")}
            </button>
            {editingItem && (
              <button 
                type="button" 
                className="secondary-action" 
                style={{ background: '#333', borderColor: '#444' }}
                onClick={() => {
                  const evt = new CustomEvent('cancelEdit');
                  window.dispatchEvent(evt);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <h2>Filtros e Listagem</h2>
          </div>
        </div>

        <ModuleFilters />

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {tableColumns.map((column) => (
                  <th key={column.label}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && data.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length}>Carregando...</td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  renderRow ? renderRow(item) : (
                    <tr key={item.id || index}>
                      {Object.values(item).map((val: any, i) => (
                        <td key={i}>{String(val)}</td>
                      ))}
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan={tableColumns.length}>Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
