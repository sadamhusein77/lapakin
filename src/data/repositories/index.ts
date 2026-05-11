// Data Layer - Repository Implementations
// Concrete implementations of domain repository contracts

import type { IUserRepository, IProjectRepository, ISkillRepository, IExperienceRepository, IContactRepository, IStreetVendorRepository } from '../../domain/repositories';
import type { User, Project, Skill, Experience, ContactFormData, ContactResponse, SkillCategory, StreetVendor, VendorCategory } from '../../domain/entities';
import { mockUser, mockProjects, mockSkills, mockExperiences, mockStreetVendors } from '../datasources/local';

// Simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UserRepository implements IUserRepository {
  async getProfile(): Promise<User> {
    await delay(100);
    return mockUser;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    await delay(100);
    return { ...mockUser, ...data };
  }
}

export class ProjectRepository implements IProjectRepository {
  async getAllProjects(): Promise<Project[]> {
    await delay(100);
    return mockProjects;
  }

  async getProjectById(id: string): Promise<Project | null> {
    await delay(100);
    return mockProjects.find(p => p.id === id) || null;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    await delay(100);
    return mockProjects.filter(p => p.featured);
  }
}

export class SkillRepository implements ISkillRepository {
  async getAllSkills(): Promise<Skill[]> {
    await delay(100);
    return mockSkills;
  }

  async getSkillsByCategory(category: SkillCategory): Promise<Skill[]> {
    await delay(100);
    return mockSkills.filter(s => s.category === category);
  }
}

export class ExperienceRepository implements IExperienceRepository {
  async getAllExperiences(): Promise<Experience[]> {
    await delay(100);
    return mockExperiences;
  }

  async getCurrentRole(): Promise<Experience | null> {
    await delay(100);
    return mockExperiences.find(e => e.isCurrentRole) || null;
  }
}

export class ContactRepository implements IContactRepository {
  async sendMessage(data: ContactFormData): Promise<ContactResponse> {
    await delay(1500); // Simulate API call
    console.log('Contact form submitted:', data);
    return { success: true, message: 'Message sent successfully!' };
  }
}

export class StreetVendorRepository implements IStreetVendorRepository {
  async getAllVendors(): Promise<StreetVendor[]> {
    await delay(100);
    return mockStreetVendors;
  }

  async getVendorById(id: string): Promise<StreetVendor | null> {
    await delay(100);
    return mockStreetVendors.find(v => v.id === id) || null;
  }

  async getVendorsByCategory(category: VendorCategory): Promise<StreetVendor[]> {
    await delay(100);
    return mockStreetVendors.filter(v => v.category === category);
  }
}
