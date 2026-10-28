import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PRODUCTS } from '../data/products';
import { ProductItem } from '../types';
import { 
  Terminal, 
  Cpu, 
  Network, 
  Server, 
  ShoppingBag, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';

interface ProductsPageProps {
  onOpenProduct: (product: ProductItem) => void;
  onRequestAccess: (product: ProductItem) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenProduct, onRequestAccess }) => {
  const { language, t } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-[#B7F36B]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#55D68B]" />;
      case 'Network':
        return <Network className="w-5 h-5 text-[#8FCB4F]" />;
      case 'Server':
        return <Server className="w-5 h-5 text-[#B7F36B]" />;
      case 'ShoppingBag':
      default:
        return <ShoppingBag className="w-5 h-5 text-[#F2C66D]" />;
    }
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'public') return !p.isPrivate;
    if (filterStatus === 'private') return p.isPrivate;
    return p.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
          {t.products.kicker}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F4]">
          {t.products.title}
        </h1>
        <p className="text-sm sm:text-base text-[#A4ADA8] leading-relaxed">
          {t.products.subtitle}
        </p>

        <div className="p-3 bg-[#101315] border border-[#293033] rounded-md text-xs text-[#737D77] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#55D68B] shrink-0" />
          <span>
            {language === 'pt-BR'
              ? 'Todos os estados refletem a maturidade real do código. Não utilizamos "Production Ready" em sistemas em fase de desenvolvimento.'
              : 'Status labels reflect empirical maturity in repositories. We strictly avoid claiming "Production Ready" on systems currently under development.'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-[#101315] border border-[#293033] rounded-lg text-xs font-mono">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
              : 'text-[#A4ADA8] hover:text-[#F5F7F4]'
          }`}
        >
          All Products ({PRODUCTS.length})
        </button>
        <button
          onClick={() => setFilterStatus('public')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            filterStatus === 'public'
              ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
              : 'text-[#A4ADA8] hover:text-[#F5F7F4]'
          }`}
        >
          Public Repositories
        </button>
        <button
          onClick={() => setFilterStatus('private')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            filterStatus === 'private'
              ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
              : 'text-[#A4ADA8] hover:text-[#F5F7F4]'
          }`}
        >
          Private Ecosystem
        </button>
      </div>

      {/* Products Showcase Cards */}
      <div className="space-y-8">
        {filteredProducts.map((prod) => {
          const description = language === 'pt-BR' ? prod.descriptionPt : prod.descriptionEn;
          const problem = language === 'pt-BR' ? prod.problemPt : prod.problemEn;
          const audience = language === 'pt-BR' ? prod.targetAudiencePt : prod.targetAudienceEn;

          return (
            <div
              key={prod.id}
              className="bg-[#101315] border border-[#293033] hover:border-[#3c464a] rounded-xl p-6 sm:p-8 transition-colors space-y-6"
            >
              {/* Product Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#293033]">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-[#15191B] border border-[#293033] rounded-lg">
                    {getProductIcon(prod.iconName)}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F4] font-mono tracking-tight">
                      {prod.name}
                    </h2>
                    <p className="text-xs font-mono text-[#A4ADA8] mt-0.5">
                      {language === 'pt-BR' ? prod.taglinePt : prod.taglineEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="font-mono text-xs text-[#55D68B] bg-[#55D68B]/10 px-2.5 py-1 rounded border border-[#55D68B]/20 font-medium">
                    {prod.status}
                  </span>
                  {prod.isPrivate ? (
                    <span className="text-xs font-mono text-[#737D77] bg-[#15191B] px-2.5 py-1 rounded border border-[#293033] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#737D77]" /> Private
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-[#55D68B] bg-[#15191B] px-2.5 py-1 rounded border border-[#293033] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#55D68B]" /> Public
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#F5F7F4] leading-relaxed">
                {description}
              </p>

              {/* Problem & Audience Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#15191B] border border-[#293033] rounded-lg space-y-1">
                  <h3 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#B7F36B]">
                    {t.products.problemTitle}
                  </h3>
                  <p className="text-xs text-[#A4ADA8] leading-relaxed">
                    {problem}
                  </p>
                </div>

                <div className="p-4 bg-[#15191B] border border-[#293033] rounded-lg space-y-1">
                  <h3 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#55D68B]">
                    {t.products.audienceTitle}
                  </h3>
                  <p className="text-xs text-[#A4ADA8] leading-relaxed">
                    {audience}
                  </p>
                </div>
              </div>

              {/* Confirmed Technologies */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#737D77] block mb-2">
                  {t.products.techTitle}
                </span>
                <div className="flex flex-wrap gap-2">
                  {prod.confirmedTech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-1 bg-[#15191B] border border-[#293033] text-[#F5F7F4] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-[#293033] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onOpenProduct(prod)}
                  className="text-xs font-mono text-[#A4ADA8] hover:text-[#F5F7F4] underline cursor-pointer"
                >
                  View Full Specifications & Diagram
                </button>

                <div className="flex items-center gap-3">
                  {prod.repositoryUrl && !prod.isPrivate && (
                    <a
                      href={prod.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#15191B] hover:bg-[#202528] border border-[#293033] text-xs font-mono text-[#F5F7F4] rounded transition-colors"
                    >
                      <span>{t.products.viewRepository}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => onRequestAccess(prod)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-semibold font-mono text-xs rounded transition-colors cursor-pointer"
                  >
                    <span>{t.products.requestWalkthrough}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
