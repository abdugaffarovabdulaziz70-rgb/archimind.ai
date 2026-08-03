export type ProjectType =
  | 'villa'
  | 'luxury_home'
  | 'apartment'
  | 'interior'
  | 'office'
  | 'hotel'
  | 'resort'
  | 'mosque'
  | 'restaurant'
  | 'cafe'
  | 'hospital'
  | 'school'
  | 'commercial'
  | 'landscape'
  | 'urban_planning';

export type GenerationStatus = 'pending' | 'enhancing' | 'generating' | 'completed' | 'failed';

export interface Generation {
  id: string;
  user_id: string | null;
  original_prompt: string;
  enhanced_prompt: string;
  image_url: string;
  project_type: ProjectType;
  status: GenerationStatus;
  is_favorite: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  project_type: ProjectType;
  icon: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
