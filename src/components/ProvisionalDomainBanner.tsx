import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, AlertCircle, X, ShieldCheck } from 'lucide-react';

export const ProvisionalDomainBanner: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt-BR';
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside 
      aria-label={isPt ? "Aviso de domínio provisório" : "Provisional domain notice"}
      className="w-full bg-[#101315] border-b border-[#293033] text-xs py-2 px-4 text-[#A4ADA8] relative z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F2C66D]/10 text-[#F2C66D] border border-[#F2C66D]/30 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2C66D] animate-ping" />
            {isPt ? 'Domínio Provisório' : 'Provisional Domain'}
          </span>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#F5F7F4] font-bold">dmgrecords.com.br</span>
            <span className="text-[#737D77] hidden sm:inline">·</span>
            <span className="text-[#A4ADA8] text-[11px] hidden sm:inline">
              {isPt 
                ? 'Ambiente de staging temporário da Enigmy Neutral durante o provisionamento da infraestrutura internacional.'
                : 'Temporary staging environment for Enigmy Neutral during international infrastructure rollout.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="text-[#737D77] hidden md:inline">
            Official: <strong className="text-[#F5F7F4] font-normal">enigmyneutral@gmail.com</strong>
          </span>

          <button
            onClick={() => setDismissed(true)}
            className="text-[#737D77] hover:text-[#F5F7F4] p-1 transition-colors cursor-pointer"
            aria-label="Dismiss banner"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
