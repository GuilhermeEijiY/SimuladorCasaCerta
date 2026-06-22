import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";

export function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="bg-gradient-to-br from-[#111c2e] to-[#0a201b] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Compare e escolha a melhor forma de adquirir seu imóvel
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Simule financiamento (SAC e PRICE) e consórcio lado a lado.
            Receba uma recomendação personalizada baseada no seu perfil financeiro.
          </p>
          <Link to={user ? "/simulacao" : "/register"}>
            <Button size="lg">
              {user ? "Fazer Simulação" : "Comece Agora"}
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Como funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg hover:shadow-brand-500/20">
            <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-brand-600">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Preencha os dados</h3>
            <p className="text-gray-600">
              Informe o valor do imóvel, entrada, renda e outras condições do financiamento.
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg hover:shadow-brand-500/20">
            <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-brand-600">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Compare os resultados</h3>
            <p className="text-gray-600">
              Veja a comparação detalhada entre SAC, PRICE e consórcio em cards visuais.
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg hover:shadow-brand-500/20">
            <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-brand-600">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Receba a recomendação</h3>
            <p className="text-gray-600">
              Nosso sistema analisa 5 critérios e indica a melhor opção para o seu perfil.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Financiamento vs Consórcio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg hover:shadow-brand-500/20">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Financiamento</h3>
              <ul className="space-y-3 text-gray-600">
                <li>Acesso imediato ao imóvel</li>
                <li>Parcelas com juros compostos</li>
                <li>SAC: parcelas decrescentes</li>
                <li>PRICE: parcelas fixas</li>
                <li>Custo total geralmente maior</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg hover:shadow-brand-500/20">
              <h3 className="text-xl font-semibold text-teal-600 mb-4">Consórcio</h3>
              <ul className="space-y-3 text-gray-600">
                <li>Sem juros, apenas taxa administrativa</li>
                <li>Contemplação por sorteio ou lance</li>
                <li>Parcelas geralmente menores</li>
                <li>Não garante acesso imediato</li>
                <li>Custo total geralmente menor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
