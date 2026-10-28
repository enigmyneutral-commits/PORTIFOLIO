import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  const { language } = useLanguage();

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#101315] border border-[#293033] rounded-xl shadow-2xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737D77] hover:text-[#F5F7F4] p-1.5 rounded-md hover:bg-[#15191B] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' ? (
          <div className="space-y-5 text-xs text-[#A4ADA8]">
            <div className="flex items-center gap-2 text-[#55D68B]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-lg font-bold text-[#F5F7F4] font-mono">
                {language === 'pt-BR' ? 'Aviso de Privacidade' : 'Privacy Notice'}
              </h3>
            </div>

            <p className="leading-relaxed">
              {language === 'pt-BR'
                ? 'A Enigmy Neutral respeita rigorosamente a privacidade e o sigilo de informações técnicas e comerciais compartilhadas por nossos clientes e parceiros.'
                : 'Enigmy Neutral strictly respects the confidentiality and privacy of technical and commercial specifications shared by our clients and prospective partners.'}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#F5F7F4] uppercase tracking-wider">
                1. Data Collection & Handling
              </h4>
              <p className="leading-relaxed">
                Contact information, work emails, and project descriptions submitted through this site are processed exclusively for scope evaluation and direct correspondence between Marcos Dresbach and the inquirer. We do not sell, rent, or distribute contact records to advertising networks or third-party vendors.
              </p>

              <h4 className="text-xs font-mono font-bold text-[#F5F7F4] uppercase tracking-wider">
                2. Telemetry & Repository Privacy
              </h4>
              <p className="leading-relaxed">
                Source code, credentials, and telemetry streams associated with private repositories (<span className="text-[#F5F7F4] font-mono">NINCODE-Telemetry</span>, <span className="text-[#F5F7F4] font-mono">enigmy-neutral</span>) are never disclosed without prior technical review and mutual Non-Disclosure Agreement (NDA).
              </p>

              <h4 className="text-xs font-mono font-bold text-[#F5F7F4] uppercase tracking-wider">
                3. Direct Inquiries & Data Rights
              </h4>
              <p className="leading-relaxed">
                To request modification or deletion of any submitted project inquiry, contact <span className="text-[#B7F36B] font-mono">enigmyneutral@gmail.com</span> directly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-xs text-[#A4ADA8]">
            <div className="flex items-center gap-2 text-[#B7F36B]">
              <FileText className="w-5 h-5" />
              <h3 className="text-lg font-bold text-[#F5F7F4] font-mono">
                {language === 'pt-BR' ? 'Diretrizes de Atuação & Governança' : 'Service Principles & Governance'}
              </h3>
            </div>

            <p className="leading-relaxed">
              {language === 'pt-BR'
                ? 'Diretrizes fundamentais que regem a prestação de serviços de engenharia e a apresentação pública de nossos sistemas.'
                : 'Foundational principles governing the delivery of software engineering services and the transparent public representation of our systems.'}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#F5F7F4] uppercase tracking-wider">
                1. Architectural Integrity & Truth
              </h4>
              <p className="leading-relaxed">
                Enigmy Neutral presents capabilities based strictly on verified code and architecture. We do not manufacture synthetic case studies, fake client logos, or false claims of multi-national physical headquarters without legal registration.
              </p>

              <h4 className="text-xs font-mono font-bold text-[#F5F7F4] uppercase tracking-wider">
                2. Engagement Agreements
              </h4>
              <p className="leading-relaxed">
                All consulting, prototyping, and engineering work is governed by individual written agreements detailing scope, deliverables, acceptance criteria, and intellectual property assignments. Turnaround timelines and pricing are determined solely upon technical review.
              </p>

              <h4 className="text-xs font-mono font-bold text-[#F5F7F4] uppercase tracking-wider">
                3. Jurisdiction & Representation
              </h4>
              <p className="leading-relaxed">
                Enigmy Neutral operates as an independent technical practice led by Marcos Dresbach. Commercial inquiries are managed via official channels (<span className="text-[#B7F36B] font-mono">enigmyneutral@gmail.com</span> and verified WhatsApp Business +55 51 98144-6019).
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-[#293033] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#15191B] hover:bg-[#202528] border border-[#293033] text-xs font-mono text-[#F5F7F4] rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
