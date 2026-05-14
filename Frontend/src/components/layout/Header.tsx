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
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-emerald-600 no-underline">
          Casa Certa
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/simulacao" className="text-gray-600 hover:text-emerald-600 no-underline">
                Simular
              </Link>
              <span className="text-gray-500 text-sm">Olá, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 cursor-pointer bg-transparent border-none"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-emerald-600 no-underline">
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 no-underline text-sm"
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
