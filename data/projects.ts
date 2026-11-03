import portfolio from './portfolio.json';

export type ProjectCategory = string;
export type VideoSource = string;

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  source: VideoSource;
  videoUrl: string;
  previewVideoUrl?: string;
  thumbnailUrl?: string;
  description: string;
  year: string;
  client?: string;
  featuredInHero?: boolean;
}

export interface ShowreelConfig {
  headline: string;
  subtitle: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ToolkitItem {
  name: string;
  category: string;
  enabled: boolean;
  level?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
}

export interface SiteConfig {
  ownerName: string;
  brandName: string;
  titleRole: string;
  tagline: string;
  heroHeadline: string;
  heroSupportingText: string;
  heroDescription: string;
  availabilityStatus: string;
  contactEmail: string;
  contactPhone?: string;
  about: {
    heading: string;
    bio: string;
    philosophy: string;
    interests: string[];
    portraitImage?: string;
  };
  socialLinks: SocialLink[];
}

export interface PortfolioSectionCopy {
  workTitle: string;
  workSubtitle: string;
  workEmptyTitle: string;
  workEmptyDescription: string;
  aboutLabel: string;
  expertiseLabel: string;
  expertiseTitle: string;
  experienceTitle: string;
  educationTitle: string;
  achievementsTitle: string;
  toolkitTitle: string;
  servicesTitle: string;
  servicesSubtitle: string;
  contactTitle: string;
  contactDescription: string;
}

export interface ResumeExpertise {
  title: string;
  skills: string[];
}

export interface ResumeExperience {
  company: string;
  role: string;
  dates: string;
  highlights: string[];
}

export interface ResumeEducation {
  qualification: string;
  institution: string;
  dates: string;
}

export const SITE_CONFIG: SiteConfig = portfolio.site;
export const SECTION_COPY: PortfolioSectionCopy = portfolio.sectionCopy;
export const CATEGORIES: ProjectCategory[] = portfolio.categories;
export const PROJECTS: Project[] = portfolio.projects;
export const SHOWREEL_CONFIG: ShowreelConfig = portfolio.showreel;
export const SERVICES: ServiceItem[] = portfolio.services;
export const CREATIVE_PROCESS: ProcessStep[] = portfolio.creativeProcess;
export const TOOLKIT: ToolkitItem[] = portfolio.toolkit;
export const RESUME = portfolio.resume;
