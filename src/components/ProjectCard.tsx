import React, { useState } from 'react';
import { RepositoryItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Terminal, 
  Cpu, 
  Network, 
  Layers, 
  Database, 
  Cloud, 
  Smartphone, 
  ExternalLink, 
  Lock, 
  Check, 
  Copy,
  BookOpen
} from 'lucide-react';

interface ProjectCardProps {
  project: RepositoryItem;
  onRequestAccess: (project: RepositoryItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onRequestAccess }) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Domain icon resolver
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Machine Learning':
        return <Cpu className="w-4 h-4 text-[#B7F36B]" />;
      case 'Developer Tools':
        return <Terminal className="w-4 h-4 text-[#55D68B]" />;
      case 'Infrastructure':
        return <Network className="w-4 h-4 text-[#8FCB4F]" />;
      case 'Backend & APIs':
        return <Database className="w-4 h-4 text-[#B7F36B]" />;
      case 'Mobile':
        return <Smartphone className="w-4 h-4 text-[#F2C66D]" />;
      case 'Research & Prototypes':
        return <BookOpen className="w-4 h-4 text-[#A4ADA8]" />;
      case 'Web Applications':
      default:
        return <Layers className="w-4 h-4 text-[#B7F36B]" />;
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const description = language === 'pt-BR' ? project.descriptionPt : project.descriptionEn;

  return (
    <article className="group bg-[#15191B] border border-[#293033] hover:border-[#3c464a] rounded-lg p-5 flex flex-col justify-between transition-all duration-200">
      
      <div className="space-y-3">
        {/* Top Header: Category & Visibility */}
        <div className="flex items-center justify-between text-xs text-[#737D77]">
          <div className="flex items-center gap-2">
            {getCategoryIcon(project.category)}
            <span>{project.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {project.visibility === 'public' ? (
              <span className="font-mono text-[11px] text-[#55D68B] bg-[#55D68B]/10 px-2 py-0.5 rounded border border-[#55D68B]/20">
                Public Repo
              </span>
            ) : (
              <span className="font-mono text-[11px] text-[#A4ADA8] bg-[#101315] px-2 py-0.5 rounded border border-[#293033] flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-[#737D77]" />
                Private
              </span>
            )}
          </div>
        </div>

        {/* Project Title */}
        <div>
          <h3 className="text-base font-bold text-[#F5F7F4] font-mono tracking-tight group-hover:text-[#B7F36B] transition-colors flex items-center justify-between">
            <span className="truncate">{project.name}</span>
            <button
              onClick={handleCopy}
              className="text-[#737D77] hover:text-[#F5F7F4] p-1 transition-colors cursor-pointer"
              title="Copy repository URL"
              aria-label="Copy repository URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#55D68B]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </h3>
          <div className="text-[11px] font-mono text-[#737D77] mt-0.5">
            {project.owner} · {project.status}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#A4ADA8] leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Confirmed Technologies (Anti-slop zero pill discipline: clean typographic list) */}
        <div className="pt-2 text-[11px] font-mono text-[#737D77] flex flex-wrap gap-x-2 gap-y-1 items-center">
          {project.confirmedTech.map((tech, idx) => (
            <React.Fragment key={tech}>
              <span className="text-[#A4ADA8]">{tech}</span>
              {idx < project.confirmedTech.length - 1 && <span className="text-[#293033]">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-[#293033] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#737D77]">
          {project.lastAudited}
        </span>

        {project.visibility === 'public' ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#B7F36B] hover:text-[#8FCB4F] transition-colors cursor-pointer"
          >
            <span>{t.projects.openRepo}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <button
            onClick={() => onRequestAccess(project)}
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#A4ADA8] hover:text-[#F5F7F4] transition-colors cursor-pointer"
          >
            <span>{t.projects.requestPrivate}</span>
            <Lock className="w-3 h-3 text-[#737D77]" />
          </button>
        )}
      </div>

    </article>
  );
};
