import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { REPOSITORIES, REPOSITORY_STATS } from '../data/repositories';
import { ProjectCard } from '../components/ProjectCard';
import { RepositoryItem } from '../types';
import { 
  Search, 
  Filter, 
  Github, 
  Lock, 
  Globe, 
  Layers, 
  Cpu, 
  Terminal, 
  Database, 
  Cloud, 
  Smartphone, 
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface ProjectsPageProps {
  onRequestAccess: (project: RepositoryItem) => void;
  onSelectProject: (project: RepositoryItem) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onRequestAccess, onSelectProject }) => {
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('All');
  const [selectedProfile, setSelectedProfile] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'showcase' | 'full-inventory'>('showcase');

  const categories = [
    'All',
    'AI & Machine Learning',
    'Developer Tools',
    'Web Applications',
    'Backend & APIs',
    'Infrastructure',
    'Mobile',
  ];

  const filteredRepositories = useMemo(() => {
    return REPOSITORIES.filter((repo) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = repo.name.toLowerCase().includes(query);
      const descMatch = (language === 'pt-BR' ? repo.descriptionPt : repo.descriptionEn).toLowerCase().includes(query);
      const techMatch = repo.confirmedTech.some((t) => t.toLowerCase().includes(query));
      const ownerMatch = repo.owner.toLowerCase().includes(query);

      const matchesSearch = !query || nameMatch || descMatch || techMatch || ownerMatch;

      // Category matching
      const matchesCategory = selectedCategory === 'All' || repo.category === selectedCategory;

      // Visibility matching
      const matchesVisibility = selectedVisibility === 'All' || repo.visibility === selectedVisibility;

      // Profile matching
      const matchesProfile = selectedProfile === 'All' || repo.profileSource === selectedProfile;

      return matchesSearch && matchesCategory && matchesVisibility && matchesProfile;
    });
  }, [searchQuery, selectedCategory, selectedVisibility, selectedProfile, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
          {t.projects.kicker}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F4]">
          {t.projects.title}
        </h1>
        <p className="text-sm sm:text-base text-[#A4ADA8] leading-relaxed">
          {t.projects.subtitle}
        </p>

        {/* Audit Stats Banner */}
        <div className="p-4 bg-[#101315] border border-[#293033] rounded-lg text-xs space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#F5F7F4] font-mono">
            <span className="text-[#B7F36B] font-semibold">{REPOSITORY_STATS.totalAudited} Repositories Audited</span>
            <span className="text-[#737D77]">·</span>
            <span>Enigmy Neutral: 12 (1 Public / 11 Private)</span>
            <span className="text-[#737D77]">·</span>
            <span>FLOW: 100 (47 Public / 53 Private)</span>
          </div>
          <p className="text-[#737D77] leading-relaxed">
            {t.projects.statsBanner.notice}
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#101315] border border-[#293033] rounded-xl p-5 space-y-5">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#737D77] absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.projects.searchPlaceholder}
            className="w-full bg-[#15191B] border border-[#293033] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B] font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#737D77] hover:text-[#F5F7F4] px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters (Segmented interactive buttons as allowed in skill) */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#737D77] block mb-2">
            Discipline Filter
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#15191B] text-[#B7F36B] font-semibold border border-[#293033]'
                      : 'text-[#A4ADA8] hover:text-[#F5F7F4] hover:bg-[#15191B]/60'
                  }`}
                >
                  {cat === 'All' ? t.projects.filterAll : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visibility & Profile Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#293033]">
          
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#737D77] block mb-1.5">
              {t.projects.visibilityFilter}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setSelectedVisibility('All')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedVisibility === 'All'
                    ? 'bg-[#15191B] text-[#F5F7F4] border border-[#293033]'
                    : 'text-[#737D77] hover:text-[#A4ADA8]'
                }`}
              >
                {t.projects.allVisibilities}
              </button>
              <button
                onClick={() => setSelectedVisibility('public')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedVisibility === 'public'
                    ? 'bg-[#55D68B]/10 text-[#55D68B] border border-[#55D68B]/30'
                    : 'text-[#737D77] hover:text-[#A4ADA8]'
                }`}
              >
                {t.projects.publicOnly}
              </button>
              <button
                onClick={() => setSelectedVisibility('private')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedVisibility === 'private'
                    ? 'bg-[#15191B] text-[#F5F7F4] border border-[#293033]'
                    : 'text-[#737D77] hover:text-[#A4ADA8]'
                }`}
              >
                {t.projects.privateOnly}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#737D77] block mb-1.5">
              {t.projects.profileFilter}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setSelectedProfile('All')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedProfile === 'All'
                    ? 'bg-[#15191B] text-[#F5F7F4] border border-[#293033]'
                    : 'text-[#737D77] hover:text-[#A4ADA8]'
                }`}
              >
                {t.projects.allProfiles}
              </button>
              <button
                onClick={() => setSelectedProfile('enigmyneutral-commits')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedProfile === 'enigmyneutral-commits'
                    ? 'bg-[#B7F36B]/10 text-[#B7F36B] border border-[#B7F36B]/30 font-semibold'
                    : 'text-[#737D77] hover:text-[#A4ADA8]'
                }`}
              >
                Enigmy Neutral
              </button>
              <button
                onClick={() => setSelectedProfile('flow-social-network')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedProfile === 'flow-social-network'
                    ? 'bg-[#15191B] text-[#F5F7F4] border border-[#293033]'
                    : 'text-[#737D77] hover:text-[#A4ADA8]'
                }`}
              >
                FLOW Network
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[#737D77] px-1">
        <span>
          Showing {filteredRepositories.length} repositories matching criteria
        </span>
        {(searchQuery || selectedCategory !== 'All' || selectedVisibility !== 'All' || selectedProfile !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedVisibility('All');
              setSelectedProfile('All');
            }}
            className="text-[#B7F36B] hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredRepositories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepositories.map((repo) => (
            <ProjectCard
              key={repo.id}
              project={repo}
              onRequestAccess={onRequestAccess}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#101315] border border-[#293033] rounded-xl space-y-4">
          <Layers className="w-8 h-8 text-[#737D77] mx-auto" />
          <p className="text-sm text-[#A4ADA8]">
            {t.projects.emptyResults}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedVisibility('All');
              setSelectedProfile('All');
            }}
            className="px-4 py-2 bg-[#15191B] border border-[#293033] hover:border-[#3c464a] text-xs font-mono text-[#F5F7F4] rounded transition-colors cursor-pointer"
          >
            Clear Active Filters
          </button>
        </div>
      )}

      {/* Full Audit Inventory Documentation Note */}
      <div className="p-6 bg-[#101315] border border-[#293033] rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-[#F5F7F4] font-mono">
          Audit Methodology & Transparency
        </h3>
        <p className="text-xs text-[#A4ADA8] leading-relaxed">
          The catalog above includes repositories audited via direct GitHub integration on October 28, 2026. Private repositories are maintained under strict confidentiality; no source code or environment variables are published client-side. The personal developer profile (<span className="text-[#F5F7F4] font-mono">viniamaral2026-cpu</span>) returned 0 public repos on current listing and is subject to continued synchronization.
        </p>
      </div>

    </div>
  );
};
