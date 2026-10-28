import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MessageCircle, Github, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
  onOpenPrinciples: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrivacy, onOpenPrinciples }) => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#101315] border-t border-[#293033] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Leadership */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/enigme_f15dd37a.png"
                alt="Enigmy Neutral"
                referrerPolicy="no-referrer"
                className="w-7 h-7 object-contain"
              />
              <span className="font-bold text-base tracking-tight text-[#F5F7F4]">
                ENIGMY NEUTRAL
              </span>
            </div>
            
            <p className="text-xs text-[#A4ADA8] leading-relaxed">
              {t.footer.tagline}
            </p>

            <div className="p-3 bg-[#15191B] border border-[#293033] rounded-md text-xs text-[#737D77]">
              <span className="text-[#F5F7F4] font-medium block mb-1">
                Marcos Dresbach
              </span>
              <span>
                {language === 'pt-BR' 
                  ? 'Engenharia independente com atuação internacional. Referência geográfica na América do Sul.'
                  : 'Independent software engineering with international operations. Geographic base in South America.'}
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5F7F4]">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-[#A4ADA8]">
              <li>
                <button
                  onClick={() => onNavigate('engineering')}
                  className="hover:text-[#B7F36B] transition-colors cursor-pointer"
                >
                  {t.nav.engineering}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#B7F36B] transition-colors cursor-pointer"
                >
                  {t.nav.products}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-[#B7F36B] transition-colors cursor-pointer"
                >
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('technology')}
                  className="hover:text-[#B7F36B] transition-colors cursor-pointer"
                >
                  {t.nav.technology}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#B7F36B] transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#B7F36B] transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Verified GitHub Profiles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5F7F4]">
              GitHub Profiles
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://github.com/enigmyneutral-commits"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-[#15191B] border border-[#293033] hover:border-[#B7F36B]/50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-[#B7F36B]" />
                  <span className="font-mono text-[#F5F7F4] group-hover:text-[#B7F36B] transition-colors">
                    enigmyneutral-commits
                  </span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-[#737D77] group-hover:text-[#F5F7F4]" />
              </a>

              <a
                href="https://github.com/flow-social-network"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-[#15191B] border border-[#293033] hover:border-[#B7F36B]/50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-[#A4ADA8]" />
                  <span className="font-mono text-[#F5F7F4] group-hover:text-[#B7F36B] transition-colors">
                    flow-social-network
                  </span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-[#737D77] group-hover:text-[#F5F7F4]" />
              </a>

              <a
                href="https://github.com/viniamaral2026-cpu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-[#15191B] border border-[#293033] hover:border-[#B7F36B]/50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-[#737D77]" />
                  <span className="font-mono text-[#F5F7F4] group-hover:text-[#B7F36B] transition-colors">
                    viniamaral2026-cpu
                  </span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-[#737D77] group-hover:text-[#F5F7F4]" />
              </a>
            </div>
          </div>

          {/* Direct Communication Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5F7F4]">
              {t.contact.direct.title}
            </h4>
            
            <div className="space-y-2 text-xs">
              <a
                href="mailto:enigmyneutral@gmail.com"
                className="flex items-center gap-2.5 p-2 rounded bg-[#15191B] border border-[#293033] hover:border-[#B7F36B]/50 text-[#F5F7F4] transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 text-[#B7F36B]" />
                <span className="font-mono truncate">enigmyneutral@gmail.com</span>
              </a>

              <a
                href="https://wa.me/5551981446019?text=Hello,%20I%20found%20Enigmy%20Neutral%20through%20the%20website%20and%20would%20like%20to%20discuss%20a%20software%20engineering%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded bg-[#15191B] border border-[#293033] hover:border-[#55D68B]/50 text-[#F5F7F4] transition-colors group"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#55D68B]" />
                <div className="flex flex-col">
                  <span className="font-mono">+55 51 98144-6019</span>
                  <span className="text-[10px] text-[#737D77]">WhatsApp Business</span>
                </div>
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#737D77]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B7F36B]" />
              <span>{t.footer.systemStatus}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#293033] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737D77]">
          <div>
            © {currentYear} Enigmy Neutral · {t.footer.rightsReserved}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#F5F7F4] transition-colors cursor-pointer"
            >
              {t.footer.privacyPolicy}
            </button>
            <button
              onClick={onOpenPrinciples}
              className="hover:text-[#F5F7F4] transition-colors cursor-pointer"
            >
              {t.footer.termsOfService}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
