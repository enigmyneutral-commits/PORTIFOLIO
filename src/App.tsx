import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EngineeringPage } from './pages/EngineeringPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivateAccessModal } from './components/PrivateAccessModal';
import { ProductModal } from './components/ProductModal';
import { InquiryModal } from './components/InquiryModal';
import { PolicyModal } from './components/PolicyModal';
import { RepositoryItem, ProductItem } from './types';
import { REPOSITORIES } from './data/repositories';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validViews = ['home', 'engineering', 'products', 'projects', 'technology', 'about', 'contact'];
    return validViews.includes(hash) ? hash : 'home';
  });

  const [selectedProjectForAccess, setSelectedProjectForAccess] = useState<RepositoryItem | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | null>(null);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validViews = ['home', 'engineering', 'products', 'projects', 'technology', 'about', 'contact'];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestAccessFromProduct = (product: ProductItem) => {
    // Find matching repository if available or construct repository item representation
    const matchingRepo = REPOSITORIES.find((r) => r.name.toLowerCase().includes(product.id.toLowerCase())) || {
      id: product.id,
      name: product.name,
      owner: 'enigmyneutral-commits',
      profileSource: 'enigmyneutral-commits' as const,
      url: product.repositoryUrl || 'https://github.com/enigmyneutral-commits',
      visibility: product.isPrivate ? ('private' as const) : ('public' as const),
      status: product.status,
      category: 'Developer Tools' as const,
      descriptionEn: product.descriptionEn,
      descriptionPt: product.descriptionPt,
      confirmedTech: product.confirmedTech,
      lastAudited: '2026-10-28',
    };
    setSelectedProjectForAccess(matchingRepo);
  };

  return (
    <div className="min-h-screen bg-[#080A0B] text-[#F5F7F4] flex flex-col font-sans selection:bg-[#B7F36B] selection:text-[#080A0B]">
      
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenInquiry={() => setInquiryModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenInquiry={() => setInquiryModalOpen(true)}
            onRequestAccess={(project) => setSelectedProjectForAccess(project)}
            onOpenProduct={(product) => setSelectedProductForModal(product)}
          />
        )}

        {currentView === 'engineering' && (
          <EngineeringPage
            onOpenInquiry={(serviceName) => {
              setInquiryModalOpen(true);
            }}
          />
        )}

        {currentView === 'products' && (
          <ProductsPage
            onOpenProduct={(product) => setSelectedProductForModal(product)}
            onRequestAccess={handleRequestAccessFromProduct}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsPage
            onRequestAccess={(project) => setSelectedProjectForAccess(project)}
          />
        )}

        {currentView === 'technology' && (
          <TechnologyPage />
        )}

        {currentView === 'about' && (
          <AboutPage />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacy={() => setPolicyModalType('privacy')}
        onOpenPrinciples={() => setPolicyModalType('terms')}
      />

      {/* Modals & Dialogs */}
      <PrivateAccessModal
        project={selectedProjectForAccess}
        onClose={() => setSelectedProjectForAccess(null)}
      />

      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onRequestAccess={handleRequestAccessFromProduct}
      />

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

      <PolicyModal
        type={policyModalType}
        onClose={() => setPolicyModalType(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
