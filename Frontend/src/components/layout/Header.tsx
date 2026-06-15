import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand-600 no-underline">
          Casa Certa
        </Link>
        <nav className="flex items-center gap-5">
          {user ? (
            <>
              <Link
                to="/simulacao"
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors no-underline"
              >
                Simular
              </Link>
              <Link
                to="/historico"
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors no-underline"
              >
                Histórico
              </Link>
              <span className="text-gray-400 text-sm hidden sm:inline">
                Olá, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors no-underline"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-700 transition-colors no-underline text-sm"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
