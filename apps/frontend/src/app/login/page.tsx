"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message === "Invalid login credentials" 
        ? "Email ou senha incorretos." 
        : loginError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <div className="brand-mark">CG</div>
          <h1>Bem-vindo</h1>
          <p>Acesse o controle de gastos operacionais</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <label className="field">
            <span>E-mail</span>
            <input
              required
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button 
            className="primary-action" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>

        <footer className="login-footer">
          <p>© 2026 Controle de Gastos Frota</p>
        </footer>
      </div>
    </div>
  );
}
