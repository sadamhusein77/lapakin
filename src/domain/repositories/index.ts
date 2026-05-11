// Domain Layer - Repository Interfaces (Contracts)
// Define contracts that data layer must implement

import type { User, Project, Skill, Experience, ContactFormData, ContactResponse, VendorCategory, StreetVendor } from '../entities';
import type { SkillCategory } from '../entities';

export interface IUserRepository {
  getProfile(): Promise<User>;
  updateProfile(data: Partial<User>): Promise<User>;
}

export interface IProjectRepository {
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  getFeaturedProjects(): Promise<Project[]>;
}

export interface ISkillRepository {
  getAllSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: SkillCategory): Promise<Skill[]>;
}

export interface IExperienceRepository {
  getAllExperiences(): Promise<Experience[]>;
  getCurrentRole(): Promise<Experience | null>;
}

export interface IContactRepository {
  sendMessage(data: ContactFormData): Promise<ContactResponse>;
}

export interface IStreetVendorRepository {
  getAllVendors(): Promise<StreetVendor[]>;
  getVendorById(id: string): Promise<StreetVendor | null>;
  getVendorsByCategory(category: VendorCategory): Promise<StreetVendor[]>;
}
