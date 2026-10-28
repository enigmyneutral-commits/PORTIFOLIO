/**
 * Enigmy Neutral - Domain Types & Interfaces
 */

export type Language = 'en' | 'pt-BR';

export type ProjectVisibility = 'public' | 'private';

export type ProjectStatus =
  | 'Research'
  | 'Concept'
  | 'Prototype'
  | 'In Development'
  | 'Private Beta'
  | 'Public Beta'
  | 'Available';

export type ProjectCategory =
  | 'AI & Machine Learning'
  | 'Developer Tools'
  | 'Web Applications'
  | 'Backend & APIs'
  | 'Infrastructure'
  | 'Mobile'
  | 'Research & Prototypes';

export type TechnologyProficiency =
  | 'Used in Projects'
  | 'Familiar Technologies'
  | 'Researching';

export type GitHubProfileSource = 'enigmyneutral-commits' | 'flow-social-network' | 'viniamaral2026-cpu';

export interface RepositoryItem {
  id: string;
  name: string;
  owner: string;
  profileSource: GitHubProfileSource;
  url: string;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  category: ProjectCategory;
  descriptionEn: string;
  descriptionPt: string;
  longDescriptionEn?: string;
  longDescriptionPt?: string;
  architectureEn?: string;
  architecturePt?: string;
  modules?: string[];
  confirmedTech: string[];
  isFeatured?: boolean;
  notes?: string;
  lastAudited: string;
}

export interface ProductItem {
  id: string;
  name: string;
  taglineEn: string;
  taglinePt: string;
  descriptionEn: string;
  descriptionPt: string;
  problemEn: string;
  problemPt: string;
  targetAudienceEn: string;
  targetAudiencePt: string;
  status: ProjectStatus;
  confirmedTech: string[];
  repositoryUrl?: string;
  isPrivate: boolean;
  iconName: string;
}

export interface EngineeringService {
  id: string;
  titleEn: string;
  titlePt: string;
  taglineEn: string;
  taglinePt: string;
  descriptionEn: string;
  descriptionPt: string;
  typicalScopeEn: string[];
  typicalScopePt: string[];
  deliverablesEn: string[];
  deliverablesPt: string[];
  requiredInputsEn: string[];
  requiredInputsPt: string[];
  icon: string;
}

export interface TechnologyItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Databases' | 'Infrastructure & DevOps' | 'AI & Integrations';
  status: TechnologyProficiency;
  evidence: string;
}

export interface InquiryFormData {
  fullName: string;
  workEmail: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  projectDescription: string;
  preferredContact: 'email' | 'whatsapp' | 'call';
  requiresNda: boolean;
  honeypot?: string;
}
