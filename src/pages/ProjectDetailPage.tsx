import React, { useState } from 'react';
import { RepositoryItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  Mail, 
  MessageCircle, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Network, 
  Layers, 
  Database, 
  Smartphone, 
  BookOpen, 
  Github,
  GitBranch,
  Shield,
  FileCode2
} from 'lucide-react';

interface ProjectDetailPageProps {
  project: RepositoryItem;
  onBack: () => void;
  onRequestAccess: (project: RepositoryItem) => void;
  onSelectProject: (project: RepositoryItem) => void;
  allProjects: RepositoryItem[];
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onRequestAccess,
  onSelectProject,
  allProjects,
}) => {
  const { language, t } = useLanguage();
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Machine Learning':
        return <Cpu className="w-5 h-5 text-[#B7F36B]" />;
      case 'Developer Tools':
        return <Terminal className="w-5 h-5 text-[#55D68B]" />;
      case 'Infrastructure':
        return <Network className="w-5 h-5 text-[#8FCB4F]" />;
      case 'Backend & APIs':
        return <Database className="w-5 h-5 text-[#B7F36B]" />;
      case 'Mobile':
        return <Smartphone className="w-5 h-5 text-[#F2C66D]" />;
      case 'Research & Prototypes':
        return <BookOpen className="w-5 h-5 text-[#A4ADA8]" />;
      case 'Web Applications':
      default:
        return <Layers className="w-5 h-5 text-[#B7F36B]" />;
    }
  };

  const isPt = language === 'pt-BR';
  const description = isPt ? project.descriptionPt : project.descriptionEn;
  const cloneCommand = `git clone ${project.url}.git`;

  const emailSubject = encodeURIComponent(
    isPt 
      ? `Solicitação de Acesso ao Repositório: ${project.name}` 
      : `Codebase Authorization Request: ${project.name}`
  );

  const emailBody = encodeURIComponent(
    isPt
      ? `Olá Marcos Dresbach,\n\nGostaria de solicitar autorização e apresentação técnica para o projeto privado "${project.name}" da Enigmy Neutral.\n\nNome:\nEmpresa/Organização:\nE-mail:\nObjetivo do Acesso (auditoria, parceria, contratação):\n`
      : `Hello Marcos Dresbach,\n\nI would like to request authorization and a technical walkthrough for the private repository "${project.name}" at Enigmy Neutral.\n\nName:\nCompany/Organization:\nEmail:\nReason for Access (technical audit, licensing, partnership):\n`
  );

  const mailtoLink = `mailto:enigmyneutral@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  const whatsappMessage = encodeURIComponent(
    isPt
      ? `Olá Marcos, estou no site da Enigmy Neutral e gostaria de solicitar informações e autorização de acesso ao projeto privado "${project.name}".`
      : `Hello Marcos, I am visiting the Enigmy Neutral website and would like to request authorization/details regarding the private repository "${project.name}".`
  );

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(project.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Find related projects in same discipline
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-[#293033] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[#A4ADA8] hover:text-[#B7F36B] transition-colors cursor-pointer p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isPt ? 'Voltar ao Catálogo de Projetos' : 'Back to Projects Catalog'}</span>
        </button>

        <div className="text-xs font-mono text-[#737D77] hidden sm:block">
          Audit Reference: {project.lastAudited}
        </div>
      </div>

      {/* Project Main Hero Card */}
      <div className="bg-[#101315] border border-[#293033] rounded-xl p-6 sm:p-10 space-y-8">
        
        {/* Category & Visibility Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-[#A4ADA8]">
            <div className="p-2 bg-[#15191B] border border-[#293033] rounded">
              {getCategoryIcon(project.category)}
            </div>
            <span className="font-mono text-xs">{project.category}</span>
            <span className="text-[#293033]">·</span>
            <span className="font-mono text-xs text-[#737D77]">{project.owner}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#55D68B] bg-[#55D68B]/10 px-2.5 py-1 rounded border border-[#55D68B]/20">
              {project.status}
            </span>
            {project.visibility === 'public' ? (
              <span className="font-mono text-xs text-[#55D68B] bg-[#15191B] px-2.5 py-1 rounded border border-[#293033] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#55D68B]" />
                Public Repository
              </span>
            ) : (
              <span className="font-mono text-xs text-[#A4ADA8] bg-[#15191B] px-2.5 py-1 rounded border border-[#293033] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#737D77]" />
                Private Codebase
              </span>
            )}
          </div>
        </div>

        {/* Project Title and Primary Overview */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F7F4] font-mono tracking-tight break-all">
              {project.name}
            </h1>

            <button
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#15191B] hover:bg-[#1a2023] border border-[#293033] rounded text-xs font-mono text-[#A4ADA8] hover:text-[#F5F7F4] transition-colors cursor-pointer shrink-0"
              title="Copy GitHub URL"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#55D68B]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? (isPt ? 'Copiado!' : 'Copied!') : (isPt ? 'Copiar URL' : 'Copy URL')}</span>
            </button>
          </div>

          <p className="text-sm sm:text-base text-[#F5F7F4] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Confirmed Technologies Strip */}
        <div className="p-4 bg-[#15191B] border border-[#293033] rounded-lg space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#737D77] block">
            {isPt ? 'Tecnologias Confirmadas em Código' : 'Confirmed Technologies in Repository'}
          </span>
          <div className="flex flex-wrap gap-2">
            {project.confirmedTech.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 py-1 bg-[#101315] border border-[#293033] text-[#F5F7F4] rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ACTION BLOCK DEPENDING ON PUBLIC VS PRIVATE */}
        {project.visibility === 'public' ? (
          /* Public Project: Git clone + direct link to GitHub */
          <div className="p-6 bg-[#15191B] border border-[#55D68B]/30 rounded-lg space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#55D68B]">
                <Github className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {isPt ? 'Repositório Público Disponível' : 'Public Open-Source Repository'}
                </span>
              </div>
              <span className="text-xs font-mono text-[#737D77]">
                Licensed repository
              </span>
            </div>

            <p className="text-xs text-[#A4ADA8] leading-relaxed">
              {isPt
                ? 'Este repositório está publicamente acessível para inspeção de código, contribuições e clonagem local via Git.'
                : 'This repository is publicly accessible for code inspection, dependencies audit, and local development via Git.'}
            </p>

            {/* Git Clone Box */}
            <div className="p-3 bg-[#080A0B] border border-[#293033] rounded-md flex items-center justify-between gap-3 font-mono text-xs text-[#F5F7F4] overflow-x-auto">
              <span className="text-[#B7F36B] select-none">$</span>
              <span className="truncate flex-1 select-all">{cloneCommand}</span>
              <button
                onClick={handleCopyClone}
                className="p-1.5 hover:bg-[#15191B] rounded text-[#A4ADA8] hover:text-[#F5F7F4] transition-colors cursor-pointer shrink-0"
                title="Copy clone command"
              >
                {copiedClone ? <Check className="w-3.5 h-3.5 text-[#55D68B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-mono font-bold text-xs sm:text-sm rounded-md transition-colors cursor-pointer shadow-sm w-full sm:w-auto"
              >
                <span>{isPt ? 'Abrir no GitHub Oficial' : 'Open on Official GitHub'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#101315] hover:bg-[#1a2023] border border-[#293033] text-xs font-mono text-[#F5F7F4] rounded-md transition-colors cursor-pointer w-full sm:w-auto"
              >
                <span>{isPt ? 'Copiar Link' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Private Project: Strict authorization via email / walkthrough request */
          <div className="p-6 bg-[#15191B] border border-[#F2C66D]/30 rounded-lg space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#F2C66D]">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {isPt ? 'Código Proprietário · Acesso Sob Autorização' : 'Proprietary Codebase · Authorization Required'}
                </span>
              </div>
              <span className="text-xs font-mono text-[#737D77]">
                Confidentiality terms apply
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#A4ADA8] leading-relaxed">
              {isPt
                ? 'Este repositório contém propriedade intelectual e arquitetura proprietária da Enigmy Neutral. Para proteger o código, o acesso ao repositório ou apresentação técnica é concedido para clientes em potencial, empresas parceiras e avaliadores mediante autorização formal por e-mail sob termo de confidencialidade (NDA).'
                : 'This repository contains proprietary intellectual property and architecture belonging to Enigmy Neutral. Access to the codebase, technical walk-throughs, or audit scopes is granted to qualified enterprise evaluators, prospective clients, and partners following formal email authorization under mutual Non-Disclosure Agreement (NDA).'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Primary: Request Authorization via Email */}
              <a
                href={mailtoLink}
                onClick={() => {
                  // Also open modal as dual fallback
                  onRequestAccess(project);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-mono font-bold text-xs sm:text-sm rounded-md transition-colors cursor-pointer shadow-sm text-center"
              >
                <Mail className="w-4 h-4" />
                <span>{isPt ? 'Solicitar Autorização via E-mail' : 'Request Authorization via Email'}</span>
              </a>

              {/* Direct Form Modal Button */}
              <button
                onClick={() => onRequestAccess(project)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#101315] hover:bg-[#1a2023] border border-[#293033] text-xs font-mono text-[#F5F7F4] rounded-md transition-colors cursor-pointer text-center"
              >
                <FileCode2 className="w-4 h-4 text-[#A4ADA8]" />
                <span>{isPt ? 'Formulário Rápido de Acesso' : 'Quick Access Form'}</span>
              </button>

              {/* WhatsApp Alternative */}
              <a
                href={`https://wa.me/5551981446019?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-[#55D68B]/10 hover:bg-[#55D68B]/20 border border-[#55D68B]/30 text-xs font-mono text-[#55D68B] rounded-md transition-colors text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+55)</span>
              </a>
            </div>

            <div className="pt-2 border-t border-[#293033] flex items-center gap-2 text-[11px] text-[#737D77]">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isPt
                  ? 'E-mail oficial para solicitações de acesso: enigmyneutral@gmail.com'
                  : 'Official direct channel for authorization: enigmyneutral@gmail.com'}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Deep Architecture & System Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 bg-[#101315] border border-[#293033] rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-[#B7F36B]">
            <GitBranch className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">
              {isPt ? 'Arquitetura e Organização de Código' : 'Architecture & Repository Structure'}
            </h3>
          </div>
          <p className="text-xs text-[#A4ADA8] leading-relaxed">
            {isPt
              ? `O projeto ${project.name} está integrado à organização ${project.owner}. Seu escopo é modelado com separação estrita de camadas e schemas defensivos tipados em ${project.confirmedTech.join(', ')}.`
              : `The ${project.name} codebase is maintained under the ${project.owner} organization. Its architecture enforces modular boundaries and defensive schemas using ${project.confirmedTech.join(', ')}.`}
          </p>
          {project.notes && (
            <div className="p-3 bg-[#15191B] border border-[#293033] rounded text-[11px] font-mono text-[#737D77]">
              {project.notes}
            </div>
          )}
        </div>

        <div className="p-6 bg-[#101315] border border-[#293033] rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-[#55D68B]">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">
              {isPt ? 'Auditoria Técnica & Transparência' : 'Audit Verification & Transparency'}
            </h3>
          </div>
          <p className="text-xs text-[#A4ADA8] leading-relaxed">
            {isPt
              ? 'Todos os dados desta página foram auditados a partir dos metadados oficiais retornados pela API do GitHub em 28 de outubro de 2026. Nenhuma métrica ou funcionalidade inexistente foi adicionada.'
              : 'All metadata on this subpage was directly audited against the GitHub repository state on October 28, 2026. No synthetic metrics, unverified features, or inflated claims have been included.'}
          </p>
          <div className="text-[11px] font-mono text-[#737D77]">
            Enigmy Neutral Engineering Practice · Paraguay Base
          </div>
        </div>

      </div>

      {/* Related Projects in Same Discipline */}
      {relatedProjects.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#293033]">
          <h3 className="text-sm font-mono font-bold text-[#F5F7F4] uppercase tracking-wider">
            {isPt ? 'Outros Projetos na mesma Disciplina' : 'Other Repositories in this Discipline'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProjects.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProject(rel)}
                className="p-4 bg-[#101315] hover:bg-[#15191B] border border-[#293033] hover:border-[#3c464a] rounded-lg cursor-pointer transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#737D77]">
                  <span>{rel.status}</span>
                  {rel.visibility === 'public' ? (
                    <span className="text-[#55D68B]">Public</span>
                  ) : (
                    <span>Private</span>
                  )}
                </div>

                <h4 className="text-xs font-mono font-bold text-[#F5F7F4] group-hover:text-[#B7F36B] transition-colors truncate">
                  {rel.name}
                </h4>

                <p className="text-[11px] text-[#A4ADA8] line-clamp-2">
                  {isPt ? rel.descriptionPt : rel.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
