import React from 'react';
import { ProductItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, ExternalLink, Lock, CheckCircle, Terminal, Cpu, Network, Server, ShoppingBag } from 'lucide-react';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onRequestAccess: (product: ProductItem) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onRequestAccess }) => {
  const { language, t } = useLanguage();

  if (!product) return null;

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-[#B7F36B]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#55D68B]" />;
      case 'Network':
        return <Network className="w-6 h-6 text-[#8FCB4F]" />;
      case 'Server':
        return <Server className="w-6 h-6 text-[#B7F36B]" />;
      case 'ShoppingBag':
      default:
        return <ShoppingBag className="w-6 h-6 text-[#F2C66D]" />;
    }
  };

  const description = language === 'pt-BR' ? product.descriptionPt : product.descriptionEn;
  const problem = language === 'pt-BR' ? product.problemPt : product.problemEn;
  const audience = language === 'pt-BR' ? product.targetAudiencePt : product.targetAudienceEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#101315] border border-[#293033] rounded-xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737D77] hover:text-[#F5F7F4] p-1.5 rounded-md hover:bg-[#15191B] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-[#15191B] border border-[#293033] rounded-lg shrink-0">
            {getProductIcon(product.iconName)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-[#55D68B] bg-[#55D68B]/10 px-2 py-0.5 rounded border border-[#55D68B]/20">
                {product.status}
              </span>
              {product.isPrivate ? (
                <span className="text-xs font-mono text-[#737D77] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Private Codebase
                </span>
              ) : (
                <span className="text-xs font-mono text-[#55D68B] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Public Repository
                </span>
              )}
            </div>

            <h3 id="product-modal-title" className="text-xl font-bold text-[#F5F7F4] font-mono tracking-tight">
              {product.name}
            </h3>
            
            <p className="text-xs font-mono text-[#A4ADA8]">
              {language === 'pt-BR' ? product.taglinePt : product.taglineEn}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6 text-xs text-[#A4ADA8]">
          
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5F7F4] mb-1.5">
              Overview
            </h4>
            <p className="leading-relaxed bg-[#15191B] p-3.5 rounded border border-[#293033] text-[#F5F7F4]">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#15191B] border border-[#293033] rounded">
              <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#B7F36B] mb-1">
                {t.modals.productDetails.problemSolved}
              </h4>
              <p className="leading-relaxed">
                {problem}
              </p>
            </div>

            <div className="p-3.5 bg-[#15191B] border border-[#293033] rounded">
              <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#55D68B] mb-1">
                {t.modals.productDetails.intendedUsers}
              </h4>
              <p className="leading-relaxed">
                {audience}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5F7F4] mb-2">
              {t.modals.productDetails.stack}
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.confirmedTech.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2.5 py-1 bg-[#15191B] border border-[#293033] text-[#F5F7F4] rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="mt-8 pt-4 border-t border-[#293033] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-mono text-[#A4ADA8] hover:text-[#F5F7F4] transition-colors cursor-pointer"
          >
            {t.modals.productDetails.close}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {product.repositoryUrl && !product.isPrivate && (
              <a
                href={product.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#15191B] hover:bg-[#202528] border border-[#293033] text-xs font-mono text-[#F5F7F4] rounded transition-colors"
              >
                <span>{t.products.viewRepository}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => {
                onClose();
                onRequestAccess(product);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-semibold font-mono text-xs rounded transition-colors cursor-pointer"
            >
              <span>{t.modals.productDetails.requestAccess}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
