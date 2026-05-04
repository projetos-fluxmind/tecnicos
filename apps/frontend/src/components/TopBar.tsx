import { Bell, CircleHelp } from "lucide-react";

export function TopBar() {
  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <strong>Flash Expense Manager</strong>
        <span>Sistema de Controle de Gastos</span>
      </div>

      <nav className="top-nav-links" aria-label="Navegação secundária">
        <a className="active" href="#">Dashboard</a>
        <a href="#">Relatórios</a>
        <a href="#">Configurações</a>
      </nav>

      <div className="top-nav-actions">
        <button aria-label="Notificações" type="button">
          <Bell size={20} />
        </button>
        <button aria-label="Ajuda" type="button">
          <CircleHelp size={20} />
        </button>
        <div className="avatar" aria-label="Avatar do gestor">M</div>
      </div>
    </header>
  );
}
