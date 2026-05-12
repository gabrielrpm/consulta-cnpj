import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Building2, MapPin, Briefcase, Users, FileText } from 'lucide-react';

interface CNPJData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_inicio_atividade: string;
  cnae_fiscal_descricao: string;
  porte: string;
  capital_social: number;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  cnae_fiscal: number;
  cnaes_secundarios?: Array<{
    codigo: number;
    descricao: string;
  }>;
  qsa?: Array<{
    nome_socio: string;
    qualificacao_socio: string;
    data_entrada_sociedade?: string;
  }>;
}

async function fetchCNPJ(numero: string | undefined): Promise<CNPJData | null> {
  console.log('[fetchCNPJ] numero:', numero);
  if (!numero) return null;
  const sanitized = numero.replace(/\D/g, '');

  if (sanitized.length !== 14) {
    return null;
  }

  try {
    const url = `https://brasilapi.com.br/api/cnpj/v1/${sanitized}`;
    console.log('[fetchCNPJ] url:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ConsultaCNPJ/1.0)',
        'Accept': 'application/json'
      },
      next: { revalidate: 86400 }
    });
    console.log('[fetchCNPJ] response status:', response.status);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[fetchCNPJ] error:', error);
    return null;
  }
}

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ numero: string }> }): Promise<Metadata> {
  const { numero } = await params;
  const data = await fetchCNPJ(numero);

  if (!data) {
    return {
      title: 'CNPJ não encontrado | ConsultaCNPJ',
      description: 'O CNPJ consultado não foi encontrado na base de dados da Receita Federal.',
    };
  }

  const cnpjFormatado = data.cnpj;
  const situacao = String(data.situacao_cadastral).toUpperCase().includes('ATIVA') ? 'ATIVA' : 'INAPTA';

  return {
    title: `${data.razao_social} | ConsultaCNPJ`,
    description: `Consulte dados completos de ${data.razao_social}, CNPJ ${cnpjFormatado}, ${data.municipio}/${data.uf}. Situação: ${situacao}.`,
    alternates: {
      canonical: `/cnpj/${numero}`
    },
    openGraph: {
      title: `${data.razao_social} — CNPJ ${cnpjFormatado}`,
      description: `${data.razao_social} • ${data.municipio}/${data.uf} • Situação: ${situacao}`,
      type: 'website',
    }
  };
}

function getSituacaoBadge(situacao: string | number) {
  const s = String(situacao).toUpperCase();
  if (s.includes('ATIVA') || s === '2') {
    return <span className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">ATIVA</span>;
  }
  if (s.includes('INAPTA') || s.includes('BAIXADA')) {
    return <span className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold bg-red-500 text-white shadow-lg shadow-red-500/30">INAPTA</span>;
  }
  return <span className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold bg-gray-500 text-white shadow-lg shadow-gray-500/30">{situacao}</span>;
}

export default async function CNPJPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const data = await fetchCNPJ(numero);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 transition-all">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 no-underline hover:opacity-70 transition-opacity">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center transition-transform hover:rotate-[-5deg] hover:scale-105">
              <FileText size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">ConsultaCNPJ</span>
          </a>
          <nav className="hidden md:flex items-center gap-10">
            <a href="/#sobre" className="text-gray-900 no-underline font-medium text-[0.95rem] relative hover:text-blue-500 transition-colors after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full">Sobre</a>
            <a href="/#como-usar" className="text-gray-900 no-underline font-medium text-[0.95rem] relative hover:text-blue-500 transition-colors after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full">Como usar</a>
            <a href="/#api" className="text-gray-900 no-underline font-medium text-[0.95rem] relative hover:text-blue-500 transition-colors after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full">API</a>
          </nav>
        </div>
      </header>

      <section className="py-16 px-6 bg-gray-50 animate-[fadeIn_0.6s_ease-in-out]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12 animate-[fadeInUp_0.5s_ease-in-out]">
            <span className="text-lg text-gray-700 font-semibold">Situação Cadastral:</span>
            {getSituacaoBadge(data.situacao_cadastral)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-9 shadow-md border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl animate-[fadeInUp_0.5s_ease-in-out_0.05s_both]">
              <div className="flex items-center gap-4 mb-8 pb-5 border-b-2 border-gray-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <Building2 size={24} color="#ffffff" strokeWidth={2} />
                </div>
                <h3 className="text-[1.35rem] font-bold text-gray-900 tracking-tight">Dados Gerais</h3>
              </div>
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">CNPJ</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.cnpj}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Razão Social</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.razao_social}</p>
                </div>
                {data.nome_fantasia && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Nome Fantasia</span>
                    <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.nome_fantasia}</p>
                  </div>
                )}
                {data.porte && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Porte</span>
                    <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.porte}</p>
                  </div>
                )}
                {data.capital_social && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Capital Social</span>
                    <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.capital_social)}
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Data de Abertura</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">
                    {new Date(data.data_inicio_atividade).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-9 shadow-md border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl animate-[fadeInUp_0.5s_ease-in-out_0.1s_both]">
              <div className="flex items-center gap-4 mb-8 pb-5 border-b-2 border-gray-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} color="#ffffff" strokeWidth={2} />
                </div>
                <h3 className="text-[1.35rem] font-bold text-gray-900 tracking-tight">Endereço</h3>
              </div>
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Logradouro</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">
                    {data.logradouro}, {data.numero}
                  </p>
                </div>
                {data.complemento && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Complemento</span>
                    <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.complemento}</p>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Bairro</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.bairro}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Município / UF</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.municipio} - {data.uf}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">CEP</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">{data.cep}</p>
                </div>
                <div className="mt-6 rounded-xl overflow-hidden h-[250px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.municipio}, ${data.uf}, ${data.cep}`)}&output=embed`}
                    width="100%"
                    height="250"
                    style={{ borderRadius: '12px', border: 'none' }}
                    loading="lazy"
                    title="Localização no mapa"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.municipio}, ${data.uf}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-500 no-underline font-semibold text-[0.95rem] hover:opacity-70 transition-opacity"
                >
                  Ver no Google Maps →
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-9 shadow-md border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl animate-[fadeInUp_0.5s_ease-in-out_0.15s_both]">
              <div className="flex items-center gap-4 mb-8 pb-5 border-b-2 border-gray-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={24} color="#ffffff" strokeWidth={2} />
                </div>
                <h3 className="text-[1.35rem] font-bold text-gray-900 tracking-tight">Atividade</h3>
              </div>
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">CNAE Fiscal</span>
                  <p className="text-[1.05rem] font-semibold text-gray-900 leading-relaxed">
                    {data.cnae_fiscal} - {data.cnae_fiscal_descricao}
                  </p>
                </div>
                {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Atividades Secundárias</span>
                    <div className="flex flex-col gap-3">
                      {data.cnaes_secundarios.slice(0, 3).map((cnae, idx) => (
                        <p key={idx} className="text-sm text-gray-600 leading-relaxed">
                          {cnae.codigo} - {cnae.descricao}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {data.qsa && data.qsa.length > 0 && (
              <div className="bg-white rounded-2xl p-9 shadow-md border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl animate-[fadeInUp_0.5s_ease-in-out_0.2s_both]">
                <div className="flex items-center gap-4 mb-8 pb-5 border-b-2 border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0">
                    <Users size={24} color="#ffffff" strokeWidth={2} />
                  </div>
                  <h3 className="text-[1.35rem] font-bold text-gray-900 tracking-tight">Quadro de Sócios</h3>
                </div>
                <div className="flex flex-col gap-6">
                  {data.qsa.map((socio, index) => (
                    <div key={index} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <p className="text-lg font-bold text-gray-900 mb-1.5">{socio.nome_socio}</p>
                      <p className="text-[0.95rem] text-gray-600 mb-1">{socio.qualificacao_socio}</p>
                      {socio.data_entrada_sociedade && (
                        <p className="text-xs text-gray-400">
                          Entrada: {new Date(socio.data_entrada_sociedade).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-3 font-medium">
            Consulta CNPJ gratuita com dados oficiais da Receita Federal
          </p>
          <p className="text-sm text-gray-500">
            Fonte: <a href="https://brasilapi.com.br" target="_blank" rel="noopener noreferrer" className="text-gray-900 no-underline font-semibold hover:opacity-70 transition-opacity">BrasilAPI</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
