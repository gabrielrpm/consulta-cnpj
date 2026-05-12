import Link from 'next/link';
import { FileText, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline hover:opacity-70 transition-opacity">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">ConsultaCNPJ</span>
          </Link>
        </div>
      </header>

      <section className="min-h-[80vh] flex items-center justify-center px-6 py-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4">
            CNPJ não encontrado
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
            O CNPJ consultado não foi encontrado na base de dados da Receita Federal.
            Verifique se o número está correto e tente novamente.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white no-underline rounded-xl font-semibold text-lg transition-all hover:bg-gray-800 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <Home size={20} />
            Voltar para a página inicial
          </Link>
        </div>
      </section>
    </div>
  );
}
