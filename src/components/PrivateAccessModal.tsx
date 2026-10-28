import React, { useState } from 'react';
import { RepositoryItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, CheckCircle2, Send, Shield } from 'lucide-react';

interface PrivateAccessModalProps {
  project: RepositoryItem | null;
  onClose: () => void;
}

export const PrivateAccessModal: React.FC<PrivateAccessModalProps> = ({ project, onClose }) => {
  const { language, t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !reason.trim()) {
      setError(language === 'pt-BR' ? 'Preencha todos os campos obrigatórios.' : 'Please fill all required fields.');
      return;
    }

    if (!workEmail.includes('@') || !workEmail.includes('.')) {
      setError(language === 'pt-BR' ? 'Insira um e-mail válido.' : 'Please enter a valid work email.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#101315] border border-[#293033] rounded-xl shadow-2xl p-6 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737D77] hover:text-[#F5F7F4] p-1.5 rounded-md hover:bg-[#15191B] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#B7F36B] mb-2">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">
            {project.visibility === 'private' ? 'Private Codebase Request' : 'Technical Access'}
          </span>
        </div>

        <h3 id="access-modal-title" className="text-lg font-bold text-[#F5F7F4] font-mono tracking-tight">
          {project.name}
        </h3>
        
        <p className="text-xs text-[#A4ADA8] mt-1 mb-5 leading-relaxed">
          {t.modals.privateAccess.subtitle}
        </p>

        {submitted ? (
          <div className="p-6 bg-[#15191B] border border-[#55D68B]/30 rounded-lg text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-[#55D68B] mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[#F5F7F4]">
                {language === 'pt-BR' ? 'Solicitação Registrada' : 'Request Successfully Logged'}
              </h4>
              <p className="text-xs text-[#A4ADA8] leading-relaxed">
                {t.modals.privateAccess.success}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`mailto:enigmyneutral@gmail.com?subject=Codebase%20Access%20Request:%20${encodeURIComponent(project.name)}&body=Name:%20${encodeURIComponent(fullName)}%0ACompany:%20${encodeURIComponent(organization)}%0AEmail:%20${encodeURIComponent(workEmail)}%0AReason:%20${encodeURIComponent(reason)}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#B7F36B] underline font-mono"
              >
                <span>{language === 'pt-BR' ? 'Enviar cópia manual por e-mail' : 'Send direct confirmation email'}</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-[#293033] hover:bg-[#3c464a] text-xs font-medium text-[#F5F7F4] rounded-md transition-colors cursor-pointer"
            >
              {t.modals.privateAccess.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 bg-[#FF7777]/10 border border-[#FF7777]/30 text-[#FF7777] rounded text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[#A4ADA8] mb-1 font-mono">
                {t.modals.privateAccess.name} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B]"
              />
            </div>

            <div>
              <label className="block text-[#A4ADA8] mb-1 font-mono">
                {t.modals.privateAccess.email} *
              </label>
              <input
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B]"
              />
            </div>

            <div>
              <label className="block text-[#A4ADA8] mb-1 font-mono">
                {t.modals.privateAccess.organization}
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Company, fund, or research group"
                className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B]"
              />
            </div>

            <div>
              <label className="block text-[#A4ADA8] mb-1 font-mono">
                {t.modals.privateAccess.reason} *
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Technical audit, commercial licensing, project evaluation..."
                className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B] resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#737D77] pt-1">
              <Shield className="w-3.5 h-3.5 text-[#B7F36B] shrink-0" />
              <span>
                {language === 'pt-BR' 
                  ? 'Acesso concedido após validação técnica sob termo de confidencialidade.'
                  : 'Access provided following engineering verification under mutual NDA.'}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#A4ADA8] hover:text-[#F5F7F4] transition-colors cursor-pointer"
              >
                {t.modals.privateAccess.close}
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-semibold font-mono rounded transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{t.modals.privateAccess.submit}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
