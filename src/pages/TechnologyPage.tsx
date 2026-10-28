import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TECHNOLOGIES } from '../data/technologies';
import { TechnologyProficiency } from '../types';
import { 
  Code2, 
  Database, 
  Cloud, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  BookOpen, 
  Search, 
  ShieldCheck 
} from 'lucide-react';

export const TechnologyPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeProficiency, setActiveProficiency] = useState<string>('All');

  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Databases',
    'Infrastructure & DevOps',
    'AI & Integrations',
  ];

  const filteredTech = TECHNOLOGIES.filter((tech) => {
    const matchesCat = activeCategory === 'All' || tech.category === activeCategory;
    const matchesProf = activeProficiency === 'All' || tech.status === activeProficiency;
    return matchesCat && matchesProf;
  });

  const getStatusBadge = (status: TechnologyProficiency) => {
    switch (status) {
      case 'Used in Projects':
        return (
          <span className="font-mono text-[10px] text-[#55D68B] bg-[#55D68B]/10 px-2 py-0.5 rounded border border-[#55D68B]/20 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            {t.technology.usedInProjects}
          </span>
        );
      case 'Familiar Technologies':
        return (
          <span className="font-mono text-[10px] text-[#B7F36B] bg-[#B7F36B]/10 px-2 py-0.5 rounded border border-[#B7F36B]/20">
            {t.technology.familiar}
          </span>
        );
      case 'Researching':
      default:
        return (
          <span className="font-mono text-[10px] text-[#F2C66D] bg-[#F2C66D]/10 px-2 py-0.5 rounded border border-[#F2C66D]/20 flex items-center gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            {t.technology.researching}
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend':
        return <Code2 className="w-4 h-4 text-[#B7F36B]" />;
      case 'Backend':
        return <Terminal className="w-4 h-4 text-[#55D68B]" />;
      case 'Databases':
        return <Database className="w-4 h-4 text-[#8FCB4F]" />;
      case 'Infrastructure & DevOps':
        return <Cloud className="w-4 h-4 text-[#B7F36B]" />;
      case 'AI & Integrations':
      default:
        return <Cpu className="w-4 h-4 text-[#55D68B]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
          {t.technology.kicker}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F4]">
          {t.technology.title}
        </h1>
        <p className="text-sm sm:text-base text-[#A4ADA8] leading-relaxed">
          {t.technology.subtitle}
        </p>

        <div className="p-3 bg-[#101315] border border-[#293033] rounded-md text-xs text-[#737D77] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#55D68B] shrink-0" />
          <span>
            {language === 'pt-BR'
              ? 'Não exibimos ferramentas como domínio avançado sem evidências em código. Diferenciamos o que é usado em produção do que está em avaliação.'
              : 'We do not claim advanced mastery of a technology without verified repository evidence. We strictly distinguish active production usage from evaluation phases.'}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#101315] border border-[#293033] rounded-xl p-5 space-y-4">
        
        {/* Category Tabs */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#737D77] block mb-2">
            Domain Categories
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
                    : 'text-[#A4ADA8] hover:text-[#F5F7F4] hover:bg-[#15191B]/50'
                }`}
              >
                {cat === 'All' ? t.technology.filterAll : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Proficiency Status Filter */}
        <div className="pt-3 border-t border-[#293033]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#737D77] block mb-2">
            Audit Classification
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveProficiency('All')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeProficiency === 'All'
                  ? 'bg-[#15191B] text-[#F5F7F4] border border-[#293033]'
                  : 'text-[#737D77] hover:text-[#A4ADA8]'
              }`}
            >
              All Statuses ({TECHNOLOGIES.length})
            </button>
            <button
              onClick={() => setActiveProficiency('Used in Projects')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeProficiency === 'Used in Projects'
                  ? 'bg-[#55D68B]/10 text-[#55D68B] border border-[#55D68B]/30'
                  : 'text-[#737D77] hover:text-[#A4ADA8]'
              }`}
            >
              {t.technology.usedInProjects}
            </button>
            <button
              onClick={() => setActiveProficiency('Familiar Technologies')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeProficiency === 'Familiar Technologies'
                  ? 'bg-[#B7F36B]/10 text-[#B7F36B] border border-[#B7F36B]/30'
                  : 'text-[#737D77] hover:text-[#A4ADA8]'
              }`}
            >
              {t.technology.familiar}
            </button>
            <button
              onClick={() => setActiveProficiency('Researching')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeProficiency === 'Researching'
                  ? 'bg-[#F2C66D]/10 text-[#F2C66D] border border-[#F2C66D]/30'
                  : 'text-[#737D77] hover:text-[#A4ADA8]'
              }`}
            >
              {t.technology.researching}
            </button>
          </div>
        </div>

      </div>

      {/* Technologies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTech.map((tech) => (
          <div
            key={tech.name}
            className="p-5 bg-[#15191B] border border-[#293033] hover:border-[#3c464a] rounded-lg transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#737D77]">
                  {getCategoryIcon(tech.category)}
                  <span>{tech.category}</span>
                </div>
                {getStatusBadge(tech.status)}
              </div>

              <h3 className="text-base font-bold text-[#F5F7F4] font-mono tracking-tight">
                {tech.name}
              </h3>
            </div>

            <div className="pt-3 border-t border-[#293033] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737D77] block">
                {t.technology.evidenceLabel}
              </span>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {tech.evidence}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
