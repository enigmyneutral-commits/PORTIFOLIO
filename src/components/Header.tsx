import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenInquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenInquiry }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'engineering', label: t.nav.engineering },
    { id: 'products', label: t.nav.products },
    { id: 'projects', label: t.nav.projects },
    { id: 'technology', label: t.nav.technology },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.location.hash = id;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080A0B]/90 backdrop-blur-md border-b border-[#293033]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single Brand Wordmark with Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7F36B] rounded-sm py-1"
          aria-label="Enigmy Neutral Home"
        >
          <img
            src="/assets/aistudio/enigme_f15dd37a.png"
            alt="Enigmy Neutral"
            referrerPolicy="no-referrer"
            className="w-9 h-9 object-contain brightness-110 filter contrast-125"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#F5F7F4] group-hover:text-white transition-colors whitespace-nowrap">
              ENIGMY NEUTRAL
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#737D77] uppercase -mt-0.5">
              SOFTWARE ENGINEERING
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#A4ADA8]" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B7F36B] ${
                  isActive
                    ? 'text-[#F5F7F4] font-semibold border-b-2 border-[#B7F36B]'
                    : 'hover:text-[#F5F7F4]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Toggle & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Language Selector */}
          <div className="flex items-center bg-[#101315] border border-[#293033] rounded-md p-0.5 text-xs font-mono">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
                  : 'text-[#A4ADA8] hover:text-[#F5F7F4]'
              }`}
              title="English (US)"
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('pt-BR')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                language === 'pt-BR'
                  ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
                  : 'text-[#A4ADA8] hover:text-[#F5F7F4]'
              }`}
              title="Português (Brasil)"
              aria-label="Mudar para Português"
            >
              PT
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenInquiry}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-medium text-[#080A0B] bg-[#B7F36B] hover:bg-[#8FCB4F] active:bg-[#7db344] rounded-md transition-colors whitespace-nowrap shrink-0 font-mono font-semibold cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7F36B]"
          >
            <span>{t.nav.discussProject}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#A4ADA8] hover:text-[#F5F7F4] hover:bg-[#15191B] rounded-md border border-[#293033] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7F36B]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101315] border-b border-[#293033] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 text-left text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
                      : 'text-[#A4ADA8] hover:text-[#F5F7F4] hover:bg-[#15191B]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B7F36B]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#293033]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-[#080A0B] bg-[#B7F36B] hover:bg-[#8FCB4F] rounded-md transition-colors cursor-pointer"
            >
              <span>{t.nav.discussProject}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
