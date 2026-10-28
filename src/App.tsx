import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { ProvisionalDomainBanner } from './components/ProvisionalDomainBanner';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EngineeringPage } from './pages/EngineeringPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AgentStudioPage } from './pages/AgentStudioPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivateAccessModal } from './components/PrivateAccessModal';
import { ProductModal } from './components/ProductModal';
import { InquiryModal } from './components/InquiryModal';
import { PolicyModal } from './components/PolicyModal';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { RepositoryItem, ProductItem } from './types';
import { AgentAuditReport } from './types/agent';
import { REPOSITORIES } from './data/repositories';

function AppContent() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('project/')) {
      return hash.replace('project/', '');
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash.startsWith('project/')) {
      return 'project-detail';
    }
    if (hash === 'agent-studio' || hash === 'agent-audit') {
      return 'agent-studio';
    }
    const validViews = ['home', 'engineering', 'products', 'projects', 'technology', 'about', 'contact', 'agent-studio'];
    return validViews.includes(hash) ? hash : 'home';
  });

  const [selectedProjectForAccess, setSelectedProjectForAccess] = useState<RepositoryItem | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | null>(null);
  
  // Agent state
  const [isAgentChatOpen, setIsAgentChatOpen] = useState(false);
  const [studioReport, setStudioReport] = useState<AgentAuditReport | null>(null);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      const hash = rawHash.toLowerCase();

      if (hash.startsWith('project/')) {
        const id = rawHash.replace(/^project\//i, '');
        setActiveProjectId(id);
        setCurrentView('project-detail');
        return;
      }

      if (hash === 'agent-studio' || hash === 'agent-audit') {
        setCurrentView('agent-studio');
        return;
      }

      const validViews = ['home', 'engineering', 'products', 'projects', 'technology', 'about', 'contact', 'agent-studio'];
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

  const handleSelectProject = (project: RepositoryItem) => {
    setActiveProjectId(project.id);
    setCurrentView('project-detail');
    window.location.hash = `project/${project.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStudio = (report?: AgentAuditReport) => {
    if (report) {
      setStudioReport(report);
    }
    setCurrentView('agent-studio');
    window.location.hash = 'agent-studio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestAccessFromProduct = (product: ProductItem) => {
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

  // Resolve currently active project for subpage
  const currentProject = REPOSITORIES.find(
    (r) => r.id === activeProjectId || r.name.toLowerCase() === activeProjectId?.toLowerCase()
  ) || REPOSITORIES[0];

  return (
    <div className="min-h-screen bg-[#080A0B] text-[#F5F7F4] flex flex-col font-sans selection:bg-[#B7F36B] selection:text-[#080A0B]">
      
      {/* Provisional Domain Global Notice */}
      <ProvisionalDomainBanner />

      {/* Top Bar Header */}
      <Header
        currentView={currentView === 'project-detail' ? 'projects' : currentView === 'agent-studio' ? 'engineering' : currentView}
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
            onSelectProject={handleSelectProject}
          />
        )}

        {currentView === 'engineering' && (
          <EngineeringPage
            onOpenInquiry={() => {
              setInquiryModalOpen(true);
            }}
            onOpenAgentStudio={() => handleOpenStudio()}
            onOpenAgentChat={() => setIsAgentChatOpen(true)}
          />
        )}

        {currentView === 'agent-studio' && (
          <AgentStudioPage
            initialReport={studioReport}
            onBack={() => handleNavigate('engineering')}
            onOpenInquiry={() => setInquiryModalOpen(true)}
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
            onSelectProject={handleSelectProject}
          />
        )}

        {currentView === 'project-detail' && (
          <ProjectDetailPage
            project={currentProject}
            onBack={() => handleNavigate('projects')}
            onRequestAccess={(project) => setSelectedProjectForAccess(project)}
            onSelectProject={handleSelectProject}
            allProjects={REPOSITORIES}
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

      {/* Floating Agent Chat Drawer (balãozinho no canto com a logo do Enigme Neutral Agente) */}
      <AgentChatDrawer
        onOpenStudio={handleOpenStudio}
        isOpenExternal={isAgentChatOpen}
        onCloseExternal={() => setIsAgentChatOpen(false)}
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
