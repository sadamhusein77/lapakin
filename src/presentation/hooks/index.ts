// Presentation Layer - Custom Hooks
// Connect presentation to domain layer use cases

import { useState, useEffect, useCallback } from 'react';
import type { User, Project, Skill, Experience, ContactFormData } from '../../domain/entities';
import type { SkillCategory } from '../../domain/entities';
import {
  GetUserProfileUseCase,
  GetAllProjectsUseCase,
  GetFeaturedProjectsUseCase,
  GetAllSkillsUseCase,
  GetSkillsByCategoryUseCase,
  GetAllExperiencesUseCase,
  SendContactMessageUseCase,
} from '../../domain/usecases';
import {
  UserRepository,
  ProjectRepository,
  SkillRepository,
  ExperienceRepository,
  ContactRepository,
} from '../../data/repositories';

// Initialize repositories
const userRepo = new UserRepository();
const projectRepo = new ProjectRepository();
const skillRepo = new SkillRepository();
const experienceRepo = new ExperienceRepository();
const contactRepo = new ContactRepository();

// Initialize use cases
const getUserProfileUseCase = new GetUserProfileUseCase(userRepo);
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepo);
const getFeaturedProjectsUseCase = new GetFeaturedProjectsUseCase(projectRepo);
const getAllSkillsUseCase = new GetAllSkillsUseCase(skillRepo);
const getSkillsByCategoryUseCase = new GetSkillsByCategoryUseCase(skillRepo);
const getAllExperiencesUseCase = new GetAllExperiencesUseCase(experienceRepo);
const sendContactMessageUseCase = new SendContactMessageUseCase(contactRepo);

// User Hook
export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getUserProfileUseCase.execute();
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, refetch: fetchUser };
}

// Projects Hooks
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllProjectsUseCase.execute();
      setProjects(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
}

export function useFeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await getFeaturedProjectsUseCase.execute();
      setProjects(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return { projects, isLoading };
}

// Skills Hooks
export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    const data = await getAllSkillsUseCase.execute();
    setSkills(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, isLoading, refetch: fetchSkills };
}

export function useSkillsByCategory(category: SkillCategory) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await getSkillsByCategoryUseCase.execute(category);
      setSkills(data);
      setIsLoading(false);
    };
    fetch();
  }, [category]);

  return { skills, isLoading };
}

// Experience Hook
export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    const data = await getAllExperiencesUseCase.execute();
    setExperiences(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, isLoading, refetch: fetchExperiences };
}

// Contact Hook
export function useContact() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);

  const sendMessage = useCallback(async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      const result = await sendContactMessageUseCase.execute(data);
      setResponse(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendMessage, isLoading, response };
}

// Theme Hook
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme and save to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}

// Scroll Position Hook
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}
