import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InquiryFormData } from '../types';
import { X, CheckCircle2, Send, MessageCircle, Mail, ShieldAlert } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    workEmail: '',
    company: '',
    projectType: 'Software Development',
    budgetRange: '$5,000 – $15,000 USD',
    timeline: '1 – 3 Months',
    projectDescription: '',
    preferredContact: 'email',
    requiresNda: false,
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot spam check
    if (formData.honeypot) {
      setStatus('error');
      setErrorMessage('Spam detection triggered.');
      return;
    }

    if (!formData.fullName.trim() || !formData.workEmail.trim() || !formData.projectDescription.trim()) {
      setStatus('error');
      setErrorMessage(language === 'pt-BR' ? 'Preencha todos os campos obrigatórios.' : 'Please fill all required fields.');
      return;
    }

    if (!formData.workEmail.includes('@') || !formData.workEmail.includes('.')) {
      setStatus('error');
      setErrorMessage(language === 'pt-BR' ? 'Insira um e-mail válido.' : 'Please enter a valid work email address.');
      return;
    }

    setStatus('submitting');

    // Simulate reliable dispatch with local storage persistence and mailto / WhatsApp generation
    setTimeout(() => {
      try {
        const inquiries = JSON.parse(localStorage.getItem('enigmy_inquiries') || '[]');
        inquiries.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('enigmy_inquiries', JSON.stringify(inquiries));
      } catch {
        // storage ignored
      }
      setStatus('success');
    }, 700);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Marcos, I submitted an inquiry for Enigmy Neutral.\nName: ${formData.fullName}\nCompany: ${formData.company || 'N/A'}\nProject: ${formData.projectType}\nBudget: ${formData.budgetRange}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#101315] border border-[#293033] rounded-xl shadow-2xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737D77] hover:text-[#F5F7F4] p-1.5 rounded-md hover:bg-[#15191B] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#B7F36B] font-semibold block mb-1">
            {t.contact.kicker}
          </span>
          <h3 id="inquiry-title" className="text-xl font-bold text-[#F5F7F4] tracking-tight">
            {t.nav.discussProject}
          </h3>
          <p className="text-xs text-[#A4ADA8] mt-1 leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {status === 'success' ? (
          <div className="p-6 bg-[#15191B] border border-[#55D68B]/30 rounded-lg text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#55D68B] mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#F5F7F4]">
                {t.contact.form.successTitle}
              </h4>
              <p className="text-xs text-[#A4ADA8] leading-relaxed max-w-md mx-auto">
                {t.contact.form.successBody}
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/5551981446019?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#55D68B]/10 hover:bg-[#55D68B]/20 border border-[#55D68B]/30 text-xs font-mono text-[#55D68B] rounded transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{t.contact.form.whatsappOption}</span>
              </a>

              <a
                href={`mailto:enigmyneutral@gmail.com?subject=Project%20Inquiry:%20${encodeURIComponent(formData.projectType)}&body=Name:%20${encodeURIComponent(formData.fullName)}%0ACompany:%20${encodeURIComponent(formData.company)}%0AEmail:%20${encodeURIComponent(formData.workEmail)}%0ABudget:%20${encodeURIComponent(formData.budgetRange)}%0ATimeline:%20${encodeURIComponent(formData.timeline)}%0ADescription:%20${encodeURIComponent(formData.projectDescription)}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#15191B] hover:bg-[#202528] border border-[#293033] text-xs font-mono text-[#F5F7F4] rounded transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#B7F36B]" />
                <span>{t.contact.form.emailOption}</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 bg-[#293033] hover:bg-[#3c464a] text-xs font-medium text-[#F5F7F4] rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Honeypot for spam bots */}
            <input
              type="text"
              name="website_url"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {errorMessage && (
              <div className="p-2.5 bg-[#FF7777]/10 border border-[#FF7777]/30 text-[#FF7777] rounded text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A4ADA8] mb-1 font-mono">
                  {t.contact.form.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Jordan Miller"
                  className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B]"
                />
              </div>

              <div>
                <label className="block text-[#A4ADA8] mb-1 font-mono">
                  {t.contact.form.emailLabel} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  placeholder="jordan@company.com"
                  className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A4ADA8] mb-1 font-mono">
                  {t.contact.form.companyLabel}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Corp, Studio, or Founder"
                  className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B]"
                />
              </div>

              <div>
                <label className="block text-[#A4ADA8] mb-1 font-mono">
                  {t.contact.form.projectTypeLabel} *
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] focus:outline-none focus:border-[#B7F36B]"
                >
                  <option value="Software Development">Software Development (Full-Stack / Web)</option>
                  <option value="AI Engineering">AI Engineering & Model Integrations</option>
                  <option value="Developer Tools">Developer Tools & CLI Automation</option>
                  <option value="API & Backend">API & Backend Architecture</option>
                  <option value="Infrastructure">Infrastructure & Cloud Deployment</option>
                  <option value="Technical PoC">Technical Prototyping & Feasibility PoC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A4ADA8] mb-1 font-mono">
                  {t.contact.form.budgetLabel}
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] focus:outline-none focus:border-[#B7F36B]"
                >
                  <option value="Under $5,000 USD">&lt; $5,000 USD (Discovery / PoC)</option>
                  <option value="$5,000 – $15,000 USD">$5,000 – $15,000 USD (Focused Sprint)</option>
                  <option value="$15,000 – $35,000 USD">$15,000 – $35,000 USD (Full System)</option>
                  <option value="$35,000+ USD">$35,000+ USD (Long-term Architecture)</option>
                  <option value="To Be Determined">To Be Evaluated / Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A4ADA8] mb-1 font-mono">
                  {t.contact.form.timelineLabel}
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] focus:outline-none focus:border-[#B7F36B]"
                >
                  <option value="Urgent (< 1 month)">Urgent (&lt; 1 month)</option>
                  <option value="1 – 3 Months">1 – 3 Months</option>
                  <option value="3 – 6 Months">3 – 6 Months</option>
                  <option value="Flexible">Flexible / Ongoing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#A4ADA8] mb-1 font-mono">
                {t.contact.form.descLabel} *
              </label>
              <textarea
                rows={3}
                required
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                placeholder={t.contact.form.descPlaceholder}
                className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B] resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="nda-checkbox"
                checked={formData.requiresNda}
                onChange={(e) => setFormData({ ...formData, requiresNda: e.target.checked })}
                className="rounded border-[#293033] bg-[#15191B] text-[#B7F36B] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="nda-checkbox" className="text-[11px] text-[#A4ADA8] cursor-pointer">
                {t.contact.form.ndaCheckbox}
              </label>
            </div>

            <p className="text-[11px] text-[#737D77] leading-relaxed">
              {t.contact.form.privacyNotice}
            </p>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#293033]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#A4ADA8] hover:text-[#F5F7F4] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B7F36B] hover:bg-[#8FCB4F] disabled:opacity-50 text-[#080A0B] font-semibold font-mono rounded transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{status === 'submitting' ? t.contact.form.submitting : t.contact.form.submitButton}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
