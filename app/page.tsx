'use client';

import { useState, useRef, FormEvent } from 'react';
import { Search, Building2, MapPin, Briefcase, Users, Loader2, ArrowRight, FileText, Calendar, DollarSign } from 'lucide-react';

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

export default function Home() {
  const [cnpj, setCnpj] = useState('');
  const [data, setData] = useState<CNPJData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLElement>(null);

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setData(null);
    setLoading(true);

    try {
      const sanitized = cnpj.replace(/[^\d]/g, '');

      if (sanitized.length !== 14) {
        setError('CNPJ inválido. Deve conter 14 dígitos.');
        return;
      }

      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${sanitized}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('CNPJ não encontrado.');
        } else {
          setError('Erro ao consultar CNPJ.');
        }
        return;
      }

      const result = await response.json();
      setData(result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Erro ao consultar CNPJ. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getSituacaoBadge = (situacao: string | number) => {
    const s = String(situacao).toUpperCase();
    if (s.includes('ATIVA') || s === '2') {
      return <span className="badge-ativa">ATIVA</span>;
    }
    if (s.includes('INAPTA') || s.includes('BAIXADA')) {
      return <span className="badge-inativa">INAPTA</span>;
    }
    return <span className="badge-neutral">{situacao}</span>;
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          background: #ffffff;
          color: #0a0a0a;
        }

        .grain-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.045;
          z-index: 100;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.25rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .logo:hover {
          opacity: 0.7;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: #3b82f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .logo:hover .logo-icon {
          transform: rotate(-5deg) scale(1.05);
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0a0a0a;
        }

        .nav {
          display: none;
          gap: 2.5rem;
        }

        @media (min-width: 768px) {
          .nav {
            display: flex;
          }
        }

        .nav a {
          color: #0a0a0a;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
          transition: color 0.2s;
        }

        .nav a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav a:hover {
          color: #3b82f6;
        }

        .nav a:hover::after {
          width: 100%;
        }

        .hero {
          position: relative;
          min-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #ffffff 0%, #EFF6FF 100%);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='dots' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%233b82f6' opacity='0.08'/%3E%3Ccircle cx='40' cy='25' r='1.5' fill='%233b82f6' opacity='0.08'/%3E%3Ccircle cx='25' cy='45' r='1.5' fill='%233b82f6' opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23dots)'/%3E%3C/svg%3E");
        }

        .circles-decoration {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0.15;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 1100px;
          width: 100%;
          text-align: center;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 5.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: #404040;
          margin-bottom: 3.5rem;
          font-weight: 400;
          line-height: 1.5;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }

        .search-form {
          max-width: 720px;
          margin: 0 auto;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }

        .search-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .search-container {
            flex-direction: row;
            gap: 0;
          }
        }

        .search-input {
          flex: 1;
          padding: 1.5rem 1.75rem;
          font-size: 1.1rem;
          border: 2px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          background: #ffffff;
          color: #0a0a0a;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        @media (min-width: 768px) {
          .search-input {
            border-radius: 14px 0 0 14px;
            border-right: none;
          }
        }

        .search-input::placeholder {
          color: #999;
          font-weight: 400;
        }

        .search-input:focus {
          border-color: rgba(0, 0, 0, 0.15);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .search-button {
          padding: 1.5rem 2.5rem;
          background: #0a0a0a;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        @media (min-width: 768px) {
          .search-button {
            border-radius: 0 14px 14px 0;
            min-width: 180px;
          }
        }

        .search-button:hover:not(:disabled) {
          background: #1a1a1a;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
        }

        .search-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          max-width: 720px;
          margin: 1.5rem auto 0;
          padding: 1.25rem 1.75rem;
          background: #fef2f2;
          border-left: 4px solid #dc2626;
          border-radius: 12px;
          color: #991b1b;
          font-weight: 500;
          animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .results-section {
          padding: 4rem 1.5rem 6rem;
          background: #fafafa;
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .results-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .status-badge-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .status-label {
          font-size: 1.1rem;
          color: #404040;
          font-weight: 600;
        }

        .badge-ativa,
        .badge-inativa,
        .badge-neutral {
          display: inline-flex;
          align-items: center;
          padding: 0.65rem 1.5rem;
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .badge-ativa {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .badge-inativa {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .badge-neutral {
          background: #6b7280;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 2.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .card:nth-child(1) { animation-delay: 0.05s; }
        .card:nth-child(2) { animation-delay: 0.1s; }
        .card:nth-child(3) { animation-delay: 0.15s; }
        .card:nth-child(4) { animation-delay: 0.2s; }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 2px solid rgba(0, 0, 0, 0.05);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
        .icon-green { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
        .icon-amber { background: linear-gradient(135deg, #f59e0b, #d97706); }

        .card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.01em;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .data-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .data-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #737373;
        }

        .data-value {
          font-size: 1.05rem;
          font-weight: 600;
          color: #0a0a0a;
          line-height: 1.5;
        }

        .socios-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .socio-item {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .socio-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .socio-nome {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a0a0a;
          margin-bottom: 0.4rem;
        }

        .socio-qualificacao {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 0.3rem;
        }

        .socio-data {
          font-size: 0.8rem;
          color: #999;
        }

        .cnaes-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cnae-item {
          font-size: 0.9rem;
          color: #525252;
          line-height: 1.6;
        }

        .footer {
          padding: 3rem 1.5rem;
          background: #ffffff;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .footer-inner {
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-text {
          color: #525252;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .footer-link {
          font-size: 0.9rem;
          color: #737373;
        }

        .footer-link a {
          color: #0a0a0a;
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .footer-link a:hover {
          opacity: 0.7;
        }

        .map-container {
          margin-top: 1.5rem;
          border-radius: 12px;
          overflow: hidden;
          height: 250px;
        }

        .map-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .map-fallback {
          display: inline-block;
          margin-top: 1rem;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: opacity 0.2s;
        }

        .map-fallback:hover {
          opacity: 0.7;
        }
      `}</style>

      <div className="grain-overlay" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <div className="logo-icon">
              <FileText size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span className="logo-text">ConsultaCNPJ</span>
          </a>
          <nav className="nav">
            <a href="#sobre">Sobre</a>
            <a href="#como-usar">Como usar</a>
            <a href="#api">API</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />

        <svg className="circles-decoration" width="600" height="180" viewBox="0 0 600 180">
          <circle cx="100" cy="90" r="75" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.12" />
          <circle cx="165" cy="90" r="75" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.12" />
          <circle cx="230" cy="90" r="75" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.12" />
          <circle cx="295" cy="90" r="75" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.12" />
          <circle cx="360" cy="90" r="75" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.12" />
          <circle cx="425" cy="90" r="75" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.12" />
        </svg>

        <div className="hero-content">
          <h1 className="hero-title">
            Consulte qualquer CNPJ
            <br />
            Instantaneamente.
          </h1>
          <p className="hero-subtitle">
            Dados completos da Receita Federal. Grátis e sem cadastro.
          </p>

          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                placeholder="Digite o CNPJ ou razão social..."
                className="search-input"
                maxLength={18}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="search-button"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Consultando
                  </>
                ) : (
                  <>
                    Consultar
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {data && (
        <section ref={resultRef} className="results-section">
          <div className="results-container">
            <div className="status-badge-container">
              <span className="status-label">Situação Cadastral:</span>
              {getSituacaoBadge(data.situacao_cadastral)}
            </div>

            <div className="cards-grid">
              {/* Dados Gerais */}
              <div className="card">
                <div className="card-header">
                  <div className="card-icon icon-blue">
                    <Building2 size={24} color="#ffffff" strokeWidth={2} />
                  </div>
                  <h3 className="card-title">Dados Gerais</h3>
                </div>
                <div className="card-content">
                  <div className="data-item">
                    <span className="data-label">CNPJ</span>
                    <p className="data-value">{data.cnpj}</p>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Razão Social</span>
                    <p className="data-value">{data.razao_social}</p>
                  </div>
                  {data.nome_fantasia && (
                    <div className="data-item">
                      <span className="data-label">Nome Fantasia</span>
                      <p className="data-value">{data.nome_fantasia}</p>
                    </div>
                  )}
                  {data.porte && (
                    <div className="data-item">
                      <span className="data-label">Porte</span>
                      <p className="data-value">{data.porte}</p>
                    </div>
                  )}
                  {data.capital_social && (
                    <div className="data-item">
                      <span className="data-label">Capital Social</span>
                      <p className="data-value">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.capital_social)}
                      </p>
                    </div>
                  )}
                  <div className="data-item">
                    <span className="data-label">Data de Abertura</span>
                    <p className="data-value">
                      {new Date(data.data_inicio_atividade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="card">
                <div className="card-header">
                  <div className="card-icon icon-green">
                    <MapPin size={24} color="#ffffff" strokeWidth={2} />
                  </div>
                  <h3 className="card-title">Endereço</h3>
                </div>
                <div className="card-content">
                  <div className="data-item">
                    <span className="data-label">Logradouro</span>
                    <p className="data-value">
                      {data.logradouro}, {data.numero}
                    </p>
                  </div>
                  {data.complemento && (
                    <div className="data-item">
                      <span className="data-label">Complemento</span>
                      <p className="data-value">{data.complemento}</p>
                    </div>
                  )}
                  <div className="data-item">
                    <span className="data-label">Bairro</span>
                    <p className="data-value">{data.bairro}</p>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Município / UF</span>
                    <p className="data-value">{data.municipio} - {data.uf}</p>
                  </div>
                  <div className="data-item">
                    <span className="data-label">CEP</span>
                    <p className="data-value">{data.cep}</p>
                  </div>
                  <div className="map-container">
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
                    className="map-fallback"
                  >
                    Ver no Google Maps →
                  </a>
                </div>
              </div>

              {/* Atividade */}
              <div className="card">
                <div className="card-header">
                  <div className="card-icon icon-purple">
                    <Briefcase size={24} color="#ffffff" strokeWidth={2} />
                  </div>
                  <h3 className="card-title">Atividade</h3>
                </div>
                <div className="card-content">
                  <div className="data-item">
                    <span className="data-label">CNAE Fiscal</span>
                    <p className="data-value">
                      {data.cnae_fiscal} - {data.cnae_fiscal_descricao}
                    </p>
                  </div>
                  {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
                    <div className="data-item">
                      <span className="data-label">Atividades Secundárias</span>
                      <div className="cnaes-list">
                        {data.cnaes_secundarios.slice(0, 3).map((cnae, idx) => (
                          <p key={idx} className="cnae-item">
                            {cnae.codigo} - {cnae.descricao}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sócios */}
              {data.qsa && data.qsa.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon icon-amber">
                      <Users size={24} color="#ffffff" strokeWidth={2} />
                    </div>
                    <h3 className="card-title">Quadro de Sócios</h3>
                  </div>
                  <div className="card-content">
                    <div className="socios-list">
                      {data.qsa.map((socio, index) => (
                        <div key={index} className="socio-item">
                          <p className="socio-nome">{socio.nome_socio}</p>
                          <p className="socio-qualificacao">{socio.qualificacao_socio}</p>
                          {socio.data_entrada_sociedade && (
                            <p className="socio-data">
                              Entrada: {new Date(socio.data_entrada_sociedade).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-text">
            Consulta CNPJ gratuita com dados oficiais da Receita Federal
          </p>
          <p className="footer-link">
            Fonte: <a href="https://brasilapi.com.br" target="_blank" rel="noopener noreferrer">BrasilAPI</a>
          </p>
        </div>
      </footer>
    </>
  );
}
