import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Github, 
  ExternalLink, 
  ShieldCheck, 
  MapPin, 
  Code, 
  Terminal, 
  Briefcase,
  CheckCircle2,
  Mail,
  MessageCircle
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
          {t.about.kicker}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F4]">
          {t.about.title}
        </h1>
      </div>

      {/* Founder Monogram & Lead Statement */}
      <div className="bg-[#101315] border border-[#293033] rounded-xl p-8 sm:p-12 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-[#293033]">
          {/* MD Monogram (Per strict prompt instruction: use initials MD instead of AI-generated portraits) */}
          <div className="w-20 h-20 rounded-xl bg-[#15191B] border border-[#293033] flex items-center justify-center font-mono font-extrabold text-2xl text-[#B7F36B] tracking-wider shrink-0 shadow-inner">
            MD
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#F5F7F4] font-mono tracking-tight">
              Marcos Dresbach
            </h2>
            <div className="text-xs font-mono text-[#B7F36B]">
              {t.about.leadershipRole}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#737D77] font-mono pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#55D68B]" />
              <span>South America · International Operations</span>
            </div>
          </div>
        </div>

        {/* Base Narrative Text (Exact required wording) */}
        <div className="space-y-4 max-w-4xl text-sm sm:text-base text-[#F5F7F4] leading-relaxed">
          <p className="bg-[#15191B] p-6 rounded-lg border border-[#293033] text-[#F5F7F4] font-medium leading-relaxed">
            "{t.about.leadText}"
          </p>
        </div>

      </div>

      {/* Transparency & Geographic Truth Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="p-8 bg-[#101315] border border-[#293033] rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-[#55D68B]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7F4] font-mono">
              {t.about.transparencyTitle}
            </h3>
          </div>
          
          <p className="text-xs sm:text-sm text-[#A4ADA8] leading-relaxed">
            {t.about.transparencyBody1}
          </p>

          <p className="text-xs sm:text-sm text-[#A4ADA8] leading-relaxed">
            {t.about.transparencyBody2}
          </p>

          <div className="p-3 bg-[#15191B] border border-[#F2C66D]/30 rounded-md text-xs font-mono text-[#F5F7F4] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2C66D] shrink-0" />
            <span>
              <strong>{language === 'pt-BR' ? 'Domínio Provisório:' : 'Provisional Domain:'}</strong> dmgrecords.com.br — {language === 'pt-BR' ? 'Staging temporário ativo durante o provisionamento da infraestrutura global da Enigmy Neutral.' : 'Active temporary staging environment during Enigmy Neutral global infrastructure deployment.'}
            </span>
          </div>
        </div>

        <div className="p-8 bg-[#101315] border border-[#293033] rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-[#B7F36B]">
            <Briefcase className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5F7F4] font-mono">
              Commercial & Engineering Standards
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#A4ADA8]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#B7F36B] shrink-0 mt-0.5" />
              <span>
                <strong>USD Standard for Global Engagements:</strong> International contracting is structured primarily in US Dollars for predictability and clarity across US and European partnerships.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#55D68B] shrink-0 mt-0.5" />
              <span>
                <strong>BRL Invoicing upon Agreement:</strong> For Brazilian engagements, contracting and local billing options are evaluated prior to formal engagement.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#8FCB4F] shrink-0 mt-0.5" />
              <span>
                <strong>Direct Architect Communication:</strong> Clients communicate directly with Marcos Dresbach without account manager translation layers.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Verified GitHub Profiles Section */}
      <div className="bg-[#101315] border border-[#293033] rounded-xl p-8 sm:p-10 space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#F5F7F4] font-mono">
            {t.about.githubProfilesTitle}
          </h3>
          <p className="text-xs text-[#A4ADA8]">
            {t.about.githubProfilesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 bg-[#15191B] border border-[#293033] rounded-lg space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#B7F36B]">
                  enigmyneutral-commits
                </span>
                <Github className="w-4 h-4 text-[#737D77]" />
              </div>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {language === 'pt-BR'
                  ? 'Organização oficial de código da Enigmy Neutral. Contém a arquitetura central, agentes e produtos proprietários.'
                  : 'Official Enigmy Neutral organization. Houses core architectural repositories, agents, and primary products.'}
              </p>
            </div>
            <a
              href="https://github.com/enigmyneutral-commits"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7F36B] hover:underline pt-2"
            >
              <span>Explore Organization</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-5 bg-[#15191B] border border-[#293033] rounded-lg space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#55D68B]">
                  flow-social-network
                </span>
                <Github className="w-4 h-4 text-[#737D77]" />
              </div>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {language === 'pt-BR'
                  ? 'Organização FLOW com 100 repositórios catalogados cobrindo experimentação, infraestrutura e dashboards operacionais.'
                  : 'FLOW developer organization housing 100 cataloged repositories covering experimental systems and operations.'}
              </p>
            </div>
            <a
              href="https://github.com/flow-social-network"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#55D68B] hover:underline pt-2"
            >
              <span>Explore FLOW Network</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-5 bg-[#15191B] border border-[#293033] rounded-lg space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F2C66D]">
                  viniamaral2026-cpu
                </span>
                <Github className="w-4 h-4 text-[#737D77]" />
              </div>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {language === 'pt-BR'
                  ? 'Conta de desenvolvedor pessoal. Transparência técnica: 0 repositórios retornados na auditoria de 28/10/2026.'
                  : 'Personal developer profile. Complete technical transparency: 0 repositories returned during current integration audit.'}
              </p>
            </div>
            <a
              href="https://github.com/viniamaral2026-cpu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F2C66D] hover:underline pt-2"
            >
              <span>View Developer Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};
