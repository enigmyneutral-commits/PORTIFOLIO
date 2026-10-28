import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { REPOSITORIES, REPOSITORY_STATS } from '../data/repositories';
import { PRODUCTS } from '../data/products';
import { ProjectCard } from '../components/ProjectCard';
import { RepositoryItem, ProductItem } from '../types';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Network, 
  Layers, 
  Database, 
  Cloud, 
  Compass, 
  Workflow, 
  ShieldCheck, 
  Github, 
  ExternalLink,
  Code2,
  Lock
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string) => void;
  onOpenInquiry: () => void;
  onRequestAccess: (project: RepositoryItem) => void;
  onOpenProduct: (product: ProductItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenInquiry,
  onRequestAccess,
  onOpenProduct,
}) => {
  const { language, t } = useLanguage();

  const featuredProjects = REPOSITORIES.filter((r) => r.isFeatured).slice(0, 6);

  const domainCards = [
    {
      title: 'AI Engineering',
      desc: language === 'pt-BR' ? 'Integração de modelos, pipelines RAG e automação de agentes.' : 'Model integrations, RAG pipelines, and deterministic agent workflows.',
      icon: <Cpu className="w-5 h-5 text-[#B7F36B]" />,
      tech: 'Python · LLM APIs · MCP',
    },
    {
      title: 'Full-Stack Development',
      desc: language === 'pt-BR' ? 'Aplicações web modernas, portais administrativos e dashboards.' : 'Modern web applications, administrative portals, and dashboards.',
      icon: <Layers className="w-5 h-5 text-[#55D68B]" />,
      tech: 'React · Next.js · TypeScript',
    },
    {
      title: 'Developer Tools',
      desc: language === 'pt-BR' ? 'Ferramentas CLI, bibliotecas internas e arquitetura de plugins.' : 'CLI utilities, internal libraries, and plugin architectures.',
      icon: <Terminal className="w-5 h-5 text-[#8FCB4F]" />,
      tech: 'Node.js · Go · Shell',
    },
    {
      title: 'API Engineering',
      desc: language === 'pt-BR' ? 'APIs REST/RPC, autenticação, persistência e schemas defensivos.' : 'REST/RPC APIs, authentication boundaries, and defensive schemas.',
      icon: <Database className="w-5 h-5 text-[#B7F36B]" />,
      tech: 'Node.js · Express · Go',
    },
    {
      title: 'Database Architecture',
      desc: language === 'pt-BR' ? 'Modelagem relacional, migrações versionadas e consultas otimizadas.' : 'Relational schema design, versioned migrations, and optimized queries.',
      icon: <Database className="w-5 h-5 text-[#55D68B]" />,
      tech: 'PostgreSQL · SQLite · Supabase',
    },
    {
      title: 'Digital Infrastructure',
      desc: language === 'pt-BR' ? 'Conteinerização Docker, servidores Linux e esteiras CI/CD.' : 'Docker containerization, hardened Linux servers, and CI/CD pipelines.',
      icon: <Cloud className="w-5 h-5 text-[#8FCB4F]" />,
      tech: 'Docker · Linux · GitHub Actions',
    },
    {
      title: 'Automation',
      desc: language === 'pt-BR' ? 'Esteiras de processamento de dados e rotinas de manutenção.' : 'Background data processing pipelines and operational task routines.',
      icon: <Workflow className="w-5 h-5 text-[#B7F36B]" />,
      tech: 'AsyncIO · Cron · Webhooks',
    },
    {
      title: 'Technical Prototyping',
      desc: language === 'pt-BR' ? 'Validação de viabilidade e arquitetura para mitigação de riscos.' : 'Architecture de-risking and empirical feasibility spikes.',
      icon: <Compass className="w-5 h-5 text-[#F2C66D]" />,
      tech: 'PoC Spikes · Benchmarks',
    },
  ];

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle decorative grid background (anti-slop, clean hairline) */}
        <div 
          className="absolute inset-0 -z-10 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#293033 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl space-y-8">
          
          {/* Visual Signature */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#B7F36B] uppercase font-semibold">
              <span className="w-2 h-0.5 bg-[#B7F36B]" />
              <span>ENIGMY NEUTRAL</span>
            </div>
            <div className="text-[11px] sm:text-xs font-mono tracking-wider text-[#737D77]">
              {t.hero.signature}
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7F4] leading-[1.12]">
            {t.hero.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-[#A4ADA8] leading-relaxed max-w-3xl">
            {t.hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenInquiry}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#B7F36B] hover:bg-[#8FCB4F] active:bg-[#7db344] text-[#080A0B] font-mono font-bold text-sm rounded-md transition-colors cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7F36B]"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#15191B] hover:bg-[#1a2023] border border-[#293033] hover:border-[#3c464a] text-[#F5F7F4] font-mono text-sm rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#293033]"
            >
              <span>{t.hero.secondaryCta}</span>
              <Code2 className="w-4 h-4 text-[#A4ADA8]" />
            </button>
          </div>

          {/* Transparency Footnote */}
          <div className="pt-4 border-t border-[#293033]/60 flex items-center gap-3 text-xs text-[#737D77]">
            <ShieldCheck className="w-4 h-4 text-[#55D68B] shrink-0" />
            <p className="leading-normal">
              {t.hero.transparencyNote}
            </p>
          </div>

        </div>

        {/* Hero KPI Strip (Full width row below split, strictly aligned) */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#293033]">
          <div className="p-4 bg-[#101315] border border-[#293033] rounded-lg">
            <div className="text-2xl font-bold font-mono text-[#F5F7F4] tabular-nums">
              {REPOSITORY_STATS.totalAudited}
            </div>
            <div className="text-xs text-[#737D77] mt-1 font-mono">
              {t.hero.auditedStats.reposTracked}
            </div>
          </div>

          <div className="p-4 bg-[#101315] border border-[#293033] rounded-lg">
            <div className="text-2xl font-bold font-mono text-[#B7F36B] tabular-nums">
              3
            </div>
            <div className="text-xs text-[#737D77] mt-1 font-mono">
              {t.hero.auditedStats.activeProfiles}
            </div>
          </div>

          <div className="p-4 bg-[#101315] border border-[#293033] rounded-lg">
            <div className="text-2xl font-bold font-mono text-[#55D68B] tabular-nums">
              8
            </div>
            <div className="text-xs text-[#737D77] mt-1 font-mono">
              {t.hero.auditedStats.disciplines}
            </div>
          </div>

          <div className="p-4 bg-[#101315] border border-[#293033] rounded-lg">
            <div className="text-2xl font-bold font-mono text-[#F5F7F4]">
              US / Global
            </div>
            <div className="text-xs text-[#737D77] mt-1 font-mono">
              {language === 'pt-BR' ? 'Mercado Prioritário' : 'Target Engagement Market'}
            </div>
          </div>
        </div>

      </section>

      {/* 2. OBJECTIVE COMPANY PRESENTATION & FIRST PRINCIPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101315] border border-[#293033] rounded-xl p-8 sm:p-12 space-y-10">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
              01. Principles & Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7F4]">
              {t.overview.title}
            </h2>
            <p className="text-sm text-[#A4ADA8] leading-relaxed">
              {t.overview.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.overview.principles.map((p, idx) => (
              <div 
                key={idx}
                className="p-6 bg-[#15191B] border border-[#293033] rounded-lg space-y-2.5"
              >
                <div className="text-xs font-mono text-[#B7F36B] font-semibold">
                  0{idx + 1}.
                </div>
                <h3 className="text-base font-semibold text-[#F5F7F4]">
                  {p.title}
                </h3>
                <p className="text-xs text-[#A4ADA8] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#55D68B] font-semibold">
              02. Product Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7F4]">
              {t.products.title}
            </h2>
            <p className="text-xs text-[#A4ADA8] max-w-xl">
              {t.products.subtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7F36B] hover:text-[#8FCB4F] transition-colors cursor-pointer"
          >
            <span>View All 5 Product Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              onClick={() => onOpenProduct(prod)}
              className="group p-6 bg-[#15191B] border border-[#293033] hover:border-[#B7F36B]/50 rounded-lg cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#55D68B] bg-[#55D68B]/10 px-2 py-0.5 rounded border border-[#55D68B]/20">
                    {prod.status}
                  </span>
                  {prod.isPrivate ? (
                    <span className="text-[#737D77] flex items-center gap-1 text-[11px] font-mono">
                      <Lock className="w-3 h-3" /> Private
                    </span>
                  ) : (
                    <span className="text-[#55D68B] flex items-center gap-1 text-[11px] font-mono">
                      Public
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-mono text-[#F5F7F4] group-hover:text-[#B7F36B] transition-colors">
                  {prod.name}
                </h3>

                <p className="text-xs text-[#A4ADA8] leading-relaxed line-clamp-3">
                  {language === 'pt-BR' ? prod.descriptionPt : prod.descriptionEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#293033] flex items-center justify-between text-xs font-mono text-[#737D77] group-hover:text-[#F5F7F4]">
                <span>Inspect Technical Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B7F36B]" />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 4. TECHNICAL HIGHLIGHTS & CODEBASES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
              03. Audited Repositories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7F4]">
              {t.featuredProjects.title}
            </h2>
            <p className="text-xs text-[#A4ADA8] max-w-xl">
              {t.featuredProjects.subtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7F36B] hover:text-[#8FCB4F] transition-colors cursor-pointer"
          >
            <span>{t.featuredProjects.viewAllProjects}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onRequestAccess={onRequestAccess}
            />
          ))}
        </div>

      </section>

      {/* 5. ENGINEERING DISCIPLINES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8FCB4F] font-semibold">
            04. Core Disciplines
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7F4]">
            {t.engineering.title}
          </h2>
          <p className="text-xs text-[#A4ADA8] max-w-xl">
            {t.engineering.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {domainCards.map((domain, index) => (
            <div
              key={index}
              onClick={() => onNavigate('engineering')}
              className="p-5 bg-[#15191B] border border-[#293033] hover:border-[#3c464a] rounded-lg transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-2 bg-[#101315] border border-[#293033] rounded w-fit">
                  {domain.icon}
                </div>
                <h3 className="text-sm font-bold text-[#F5F7F4] group-hover:text-[#B7F36B] transition-colors">
                  {domain.title}
                </h3>
                <p className="text-xs text-[#A4ADA8] leading-relaxed">
                  {domain.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#293033] text-[10px] font-mono text-[#737D77]">
                {domain.tech}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 6. GITHUB PROFILES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101315] border border-[#293033] rounded-xl p-8 sm:p-10 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
                05. GitHub Footprint
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F4]">
                {t.about.githubProfilesTitle}
              </h2>
              <p className="text-xs text-[#A4ADA8] max-w-2xl">
                {t.about.githubProfilesDesc}
              </p>
            </div>

            <div className="shrink-0 text-xs font-mono text-[#737D77]">
              <span>Audit verified on 2026-10-28</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <a
              href="https://github.com/enigmyneutral-commits"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#15191B] border border-[#293033] hover:border-[#B7F36B]/60 rounded-lg group transition-colors block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-[#B7F36B]">
                  enigmyneutral-commits
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#737D77] group-hover:text-[#B7F36B]" />
              </div>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {language === 'pt-BR' 
                  ? 'Organização oficial de produtos e engenharia da Enigmy Neutral (12 repositórios auditados).'
                  : 'Official Enigmy Neutral organization holding core ecosystem and products (12 audited repos).'}
              </p>
              <div className="mt-3 text-[11px] font-mono text-[#737D77]">
                1 Public · 11 Private
              </div>
            </a>

            <a
              href="https://github.com/flow-social-network"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#15191B] border border-[#293033] hover:border-[#55D68B]/60 rounded-lg group transition-colors block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-[#55D68B]">
                  flow-social-network
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#737D77] group-hover:text-[#55D68B]" />
              </div>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {language === 'pt-BR'
                  ? 'Ecossistema FLOW com protótipos de rede, dashboards, segurança e IA (100 repositórios).'
                  : 'FLOW ecosystem covering protocol prototypes, dashboards, security, and AI experiments (100 repos).'}
              </p>
              <div className="mt-3 text-[11px] font-mono text-[#737D77]">
                47 Public · 53 Private
              </div>
            </a>

            <a
              href="https://github.com/viniamaral2026-cpu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#15191B] border border-[#293033] hover:border-[#F2C66D]/60 rounded-lg group transition-colors block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-[#F2C66D]">
                  viniamaral2026-cpu
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#737D77] group-hover:text-[#F2C66D]" />
              </div>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {language === 'pt-BR'
                  ? 'Perfil de desenvolvedor pessoal. Transparência completa: 0 repositórios ativos retornados na auditoria atual.'
                  : 'Personal developer account. Total transparency: 0 active repos returned via current API integration.'}
              </p>
              <div className="mt-3 text-[11px] font-mono text-[#737D77]">
                Pending direct verification
              </div>
            </a>

          </div>

        </div>
      </section>

      {/* 7. PRE-FOOTER CONVERSION BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-[#101315] to-[#15191B] border border-[#293033] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
              Ready to collaborate?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7F4]">
              {language === 'pt-BR' 
                ? 'Avalie seu projeto com um arquiteto de software.'
                : 'Evaluate your software scope with lead engineering.'}
            </h2>
            <p className="text-xs text-[#A4ADA8] leading-relaxed">
              {language === 'pt-BR'
                ? 'Analisamos viabilidade técnica, arquitetura recomendada e prazos antes de qualquer proposta.'
                : 'We assess technical feasibility, recommended architecture, and realistic timeframes before any commitments.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenInquiry}
              className="px-6 py-3 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-semibold font-mono text-sm rounded-md transition-colors cursor-pointer"
            >
              {t.nav.discussProject}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-[#15191B] hover:bg-[#202528] border border-[#293033] text-[#F5F7F4] font-mono text-sm rounded-md transition-colors cursor-pointer"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
