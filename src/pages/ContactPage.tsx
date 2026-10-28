import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InquiryFormData } from '../types';
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowUpRight,
  Lock,
  Globe
} from 'lucide-react';

export const ContactPage: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      setStatus('error');
      setErrorMessage('Spam honeypot triggered.');
      return;
    }

    if (!formData.fullName.trim() || !formData.workEmail.trim() || !formData.projectDescription.trim()) {
      setStatus('error');
      setErrorMessage(language === 'pt-BR' ? 'Preencha todos os campos obrigatórios (*).' : 'Please complete all required fields (*).');
      return;
    }

    if (!formData.workEmail.includes('@') || !formData.workEmail.includes('.')) {
      setStatus('error');
      setErrorMessage(language === 'pt-BR' ? 'Forneça um e-mail de trabalho válido.' : 'Please provide a valid work email address.');
      return;
    }

    setStatus('submitting');

    setTimeout(() => {
      try {
        const inquiries = JSON.parse(localStorage.getItem('enigmy_inquiries') || '[]');
        inquiries.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('enigmy_inquiries', JSON.stringify(inquiries));
      } catch {
        // storage ignored
      }
      setStatus('success');
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I found Enigmy Neutral through the website and would like to discuss a software engineering project.\nName: ${formData.fullName}\nEmail: ${formData.workEmail}\nType: ${formData.projectType}\nBudget: ${formData.budgetRange}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
          {t.contact.kicker}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F4]">
          {t.contact.title}
        </h1>
        <p className="text-sm sm:text-base text-[#A4ADA8] leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Direct Communication Channels (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#101315] border border-[#293033] rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-[#F5F7F4] font-mono tracking-tight">
              {t.contact.direct.title}
            </h2>

            {/* Email Channel */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#737D77] uppercase tracking-wider block">
                {t.contact.direct.emailTitle}
              </span>
              <a
                href="mailto:enigmyneutral@gmail.com"
                className="flex items-center justify-between p-3.5 bg-[#15191B] border border-[#293033] hover:border-[#B7F36B]/50 rounded-lg group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#B7F36B]" />
                  <span className="text-xs font-mono text-[#F5F7F4] group-hover:text-[#B7F36B] transition-colors">
                    enigmyneutral@gmail.com
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#737D77] group-hover:text-[#F5F7F4]" />
              </a>
            </div>

            {/* WhatsApp Business Channel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#737D77] uppercase tracking-wider">
                  {t.contact.direct.whatsappTitle}
                </span>
                <span className="text-[10px] font-mono text-[#55D68B] bg-[#55D68B]/10 px-1.5 py-0.5 rounded border border-[#55D68B]/20">
                  Business Channel
                </span>
              </div>

              <div className="p-4 bg-[#15191B] border border-[#293033] rounded-lg space-y-3">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#55D68B]" />
                  <span className="text-sm font-mono font-bold text-[#F5F7F4]">
                    +55 51 98144-6019
                  </span>
                </div>
                <p className="text-xs text-[#A4ADA8] leading-relaxed">
                  {t.contact.direct.whatsappNote}
                </p>

                <a
                  href="https://wa.me/5551981446019?text=Hello,%20I%20found%20Enigmy%20Neutral%20through%20the%20website%20and%20would%20like%20to%20discuss%20a%20software%20engineering%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#55D68B]/15 hover:bg-[#55D68B]/25 border border-[#55D68B]/30 text-xs font-mono text-[#55D68B] font-semibold rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.contact.direct.whatsappCta}</span>
                </a>
              </div>
            </div>

            {/* Operational Transparency Details */}
            <div className="pt-4 border-t border-[#293033] space-y-3 text-xs text-[#A4ADA8]">
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#B7F36B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F5F7F4] block font-mono">
                    {t.contact.direct.geoTitle}
                  </span>
                  <span>{t.contact.direct.geoValue}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#55D68B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F5F7F4] block font-mono">
                    {t.contact.direct.responseTimeTitle}
                  </span>
                  <span>{t.contact.direct.responseTimeValue}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Project Inquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-[#101315] border border-[#293033] rounded-xl p-6 sm:p-8 space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#F5F7F4] font-mono tracking-tight">
                Project Inquiry & Scope Questionnaire
              </h2>
              <p className="text-xs text-[#A4ADA8]">
                Provide your project specifications below for direct architectural review.
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-8 bg-[#15191B] border border-[#55D68B]/30 rounded-lg text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#55D68B] mx-auto" />
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#F5F7F4]">
                    {t.contact.form.successTitle}
                  </h3>
                  <p className="text-xs text-[#A4ADA8] leading-relaxed max-w-md mx-auto">
                    {t.contact.form.successBody}
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/5551981446019?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#55D68B]/15 hover:bg-[#55D68B]/25 border border-[#55D68B]/30 text-xs font-mono text-[#55D68B] rounded transition-colors"
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
                  onClick={() => {
                    setStatus('idle');
                    setFormData({
                      fullName: '',
                      workEmail: '',
                      company: '',
                      projectType: 'Software Development',
                      budgetRange: '$5,000 – $15,000 USD',
                      timeline: '1 – 3 Months',
                      projectDescription: '',
                      preferredContact: 'email',
                      requiresNda: false,
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-[#293033] hover:bg-[#3c464a] text-xs font-medium text-[#F5F7F4] rounded-md transition-colors cursor-pointer"
                >
                  {t.contact.form.resetButton}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Honeypot for spam bots */}
                <input
                  type="text"
                  name="user_verification_token"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMessage && (
                  <div className="p-3 bg-[#FF7777]/10 border border-[#FF7777]/30 text-[#FF7777] rounded text-xs flex items-center gap-2">
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
                      placeholder="e.g. Alex Morgan"
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
                      placeholder="alex@company.com"
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
                      placeholder="Company, Startup, or Autonomous"
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
                      <option value="Software Development">Software Development (Web App / Platform)</option>
                      <option value="AI Engineering">AI Engineering & Agent Systems</option>
                      <option value="Developer Tools">Developer Tools & Scaffolding</option>
                      <option value="API & Backend">API & Backend Architecture</option>
                      <option value="Infrastructure">Infrastructure & Cloud Deployment</option>
                      <option value="Technical PoC">Technical Prototyping & Feasibility</option>
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
                      <option value="$15,000 – $35,000 USD">$15,000 – $35,000 USD (Core Product Tier)</option>
                      <option value="$35,000+ USD">$35,000+ USD (Comprehensive System)</option>
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
                      <option value="Flexible">Flexible / Ongoing Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A4ADA8] mb-1 font-mono">
                    {t.contact.form.descLabel} *
                  </label>
                  <textarea
                    rows={4}
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
                    id="page-nda-checkbox"
                    checked={formData.requiresNda}
                    onChange={(e) => setFormData({ ...formData, requiresNda: e.target.checked })}
                    className="rounded border-[#293033] bg-[#15191B] text-[#B7F36B] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="page-nda-checkbox" className="text-[11px] text-[#A4ADA8] cursor-pointer">
                    {t.contact.form.ndaCheckbox}
                  </label>
                </div>

                <p className="text-[11px] text-[#737D77] leading-relaxed">
                  {t.contact.form.privacyNotice}
                </p>

                <div className="pt-3 border-t border-[#293033]">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#B7F36B] hover:bg-[#8FCB4F] disabled:opacity-50 text-[#080A0B] font-semibold font-mono text-sm rounded-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'submitting' ? t.contact.form.submitting : t.contact.form.submitButton}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
