import {
  Bike,
  Building2,
  CreditCard,
  Fuel,
  Hotel,
  LayoutDashboard,
  ReceiptText,
  Utensils
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { TopBar } from "./TopBar";

export type NavigationItem = {
  href: string;
  name: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  { href: "/", name: "Dashboard", icon: LayoutDashboard },
  { href: "/alimentacao", name: "Alimentação", icon: Utensils },
  { href: "/abastecimento", name: "Abastecimento", icon: Fuel },
  { href: "/manutencao", name: "Manutenção", icon: ReceiptText },
  { href: "/hospedagem", name: "Hospedagem", icon: Hotel },
  { href: "/recarga-flash", name: "Recarga Flash", icon: CreditCard },
  { href: "/tecnicos", name: "Técnicos", icon: Building2 },
  { href: "/motos", name: "Motos", icon: Bike }
];

type AppShellProps = {
  activePath: string;
  children: React.ReactNode;
};

export function AppShell({ activePath, children }: AppShellProps) {
  return (
    <>
      <TopBar />
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-mark">CG</div>
            <div>
              <strong>Controle de Gastos</strong>
              <span>Frota técnica</span>
            </div>
          </div>

          <nav className="nav-list" aria-label="Navegação principal">
            {navigationItems.map((item) => (
              <Link
                className={`nav-item ${activePath === item.href ? "active" : ""}`}
                href={item.href}
                key={item.href}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="content">{children}</main>
    </>
  );
}
