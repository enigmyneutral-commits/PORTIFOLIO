import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ENGINEERING_SERVICES } from '../data/engineering';
import { EngineeringService } from '../types';
import { 
  Layers, 
  Cpu, 
  Terminal, 
  Database, 
  Cloud, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  FileCode2,
  ShieldAlert
} from 'lucide-react';

interface EngineeringPageProps {
  onOpenInquiry: (serviceName?: string) => void;
}

export const EngineeringPage: React.FC<EngineeringPageProps> = ({ onOpenInquiry }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(ENGINEERING_SERVICES[0].id);

  const getServiceIcon = (icon: string) => {
    switch (icon) {
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#B7F36B]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#55D68B]" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-[#8FCB4F]" />;
      case 'Database':
        return <Database className="w-5 h-5 text-[#B7F36B]" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-[#55D68B]" />;
      case 'Compass':
      default:
        return <Compass className="w-5 h-5 text-[#F2C66D]" />;
    }
  };

  const currentService = ENGINEERING_SERVICES.find((s) => s.id === activeTab) || ENGINEERING_SERVICES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
          {t.engineering.kicker}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F4]">
          {t.engineering.title}
        </h1>
        <p className="text-sm sm:text-base text-[#A4ADA8] leading-relaxed">
          {t.engineering.subtitle}
        </p>

        <div className="p-3 bg-[#101315] border border-[#293033] rounded-md text-xs text-[#737D77] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#F2C66D] shrink-0" />
          <span>
            {language === 'pt-BR'
              ? 'Não prometemos prazos ou preços fixos antes de avaliar especificações técnicas e complexidade do escopo.'
              : 'We do not promise fixed prices or turnaround timelines before reviewing technical specifications and architectural scope.'}
          </span>
        </div>
      </div>

      {/* Interactive Service Selector Tabs (Allowed interactive controls as per skill) */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#101315] border border-[#293033] rounded-lg">
        {ENGINEERING_SERVICES.map((s) => {
          const isSelected = s.id === activeTab;
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#15191B] text-[#B7F36B] border border-[#293033] shadow-sm'
                  : 'text-[#A4ADA8] hover:text-[#F5F7F4] hover:bg-[#15191B]/50'
              }`}
            >
              {getServiceIcon(s.icon)}
              <span className="whitespace-nowrap">{language === 'pt-BR' ? s.titlePt : s.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* Active Service Detailed Card */}
      <div className="bg-[#101315] border border-[#293033] rounded-xl p-6 sm:p-10 space-y-10">
        
        {/* Title and Tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#293033]">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#15191B] border border-[#293033] rounded-md">
                {getServiceIcon(currentService.icon)}
              </div>
              <h2 className="text-2xl font-bold text-[#F5F7F4] font-mono tracking-tight">
                {language === 'pt-BR' ? currentService.titlePt : currentService.titleEn}
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#A4ADA8]">
              {language === 'pt-BR' ? currentService.taglinePt : currentService.taglineEn}
            </p>
          </div>

          <button
            onClick={() => onOpenInquiry(language === 'pt-BR' ? currentService.titlePt : currentService.titleEn)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-mono font-bold text-xs rounded-md transition-colors cursor-pointer shrink-0"
          >
            <span>{t.engineering.discussScope}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Narrative Description */}
        <div className="p-5 bg-[#15191B] border border-[#293033] rounded-lg">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#B7F36B] mb-2">
            Approach & Methodology
          </h3>
          <p className="text-xs sm:text-sm text-[#F5F7F4] leading-relaxed">
            {language === 'pt-BR' ? currentService.descriptionPt : currentService.descriptionEn}
          </p>
        </div>

        {/* 3 Columns: Scope, Deliverables, Required Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Typical Scope */}
          <div className="p-6 bg-[#15191B] border border-[#293033] rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-[#55D68B]">
              <FileCode2 className="w-4 h-4" />
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider">
                {t.engineering.scope}
              </h4>
            </div>

            <ul className="space-y-3 text-xs text-[#A4ADA8]">
              {(language === 'pt-BR' ? currentService.typicalScopePt : currentService.typicalScopeEn).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#55D68B] font-mono mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concrete Deliverables */}
          <div className="p-6 bg-[#15191B] border border-[#293033] rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-[#B7F36B]">
              <CheckCircle2 className="w-4 h-4" />
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider">
                {t.engineering.deliverables}
              </h4>
            </div>

            <ul className="space-y-3 text-xs text-[#A4ADA8]">
              {(language === 'pt-BR' ? currentService.deliverablesPt : currentService.deliverablesEn).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#B7F36B] font-mono mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Inputs for Quotation */}
          <div className="p-6 bg-[#15191B] border border-[#293033] rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-[#F2C66D]">
              <HelpCircle className="w-4 h-4" />
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider">
                {t.engineering.inputsNeeded}
              </h4>
            </div>

            <ul className="space-y-3 text-xs text-[#A4ADA8]">
              {(language === 'pt-BR' ? currentService.requiredInputsPt : currentService.requiredInputsEn).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#F2C66D] font-mono mt-0.5">?</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* All 6 Services Quick Reference Bento Grid */}
      <div className="space-y-6 pt-6">
        <h3 className="text-lg font-bold text-[#F5F7F4] font-mono">
          All Engineering Disciplines at a Glance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENGINEERING_SERVICES.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`p-5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                activeTab === s.id
                  ? 'bg-[#15191B] border-[#B7F36B]'
                  : 'bg-[#101315] border-[#293033] hover:border-[#3c464a]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#15191B] border border-[#293033] rounded">
                    {getServiceIcon(s.icon)}
                  </div>
                  <span className="text-[11px] font-mono text-[#737D77]">
                    0{ENGINEERING_SERVICES.indexOf(s) + 1}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#F5F7F4] font-mono">
                  {language === 'pt-BR' ? s.titlePt : s.titleEn}
                </h4>

                <p className="text-xs text-[#A4ADA8] leading-relaxed line-clamp-3">
                  {language === 'pt-BR' ? s.descriptionPt : s.descriptionEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#293033] flex items-center justify-between text-xs font-mono text-[#B7F36B]">
                <span>Select Discipline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
