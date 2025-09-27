// Common utility types for the application
// Type-safe alternatives to generic Record types

// Validation error types with better type safety
export interface ValidationErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  passwordConfirmation?: string[];
  company_name?: string[];
  job_title?: string[];
  department?: string[];
  phone?: string[];
  mobile?: string[];
  website?: string[];
  address?: string[];
  notes?: string[];
}

// Form errors for components - single string per field for display
export type FormErrors = {
  [K in keyof ValidationErrors]?: string;
}

// HTTP headers type for API requests
export interface HttpHeaders extends Record<string, string> {
  'Content-Type'?: string;
  'X-CSRF-Token'?: string;
  'Accept'?: string;
  'Authorization'?: string;
}

// Search parameters for business cards with proper typing
export interface SearchParameters {
  query?: string;
  company_name?: string;
  department?: string;
  job_title?: string;
  page?: number;
  per_page?: number;
}

// Session data for authentication
export interface SessionData {
  email: string;
  password: string;
  remember_me?: boolean;
}

// Application configuration types
export interface AppConfig {
  csrfToken?: string;
  apiBaseUrl?: string;
  environment?: 'development' | 'test' | 'production';
}

// Removed: ApiResponse is now centralized in api.ts

// Filter state for business card filtering
export interface FilterState {
  name: string;
  companyName: string;
  department: string;
  jobTitle: string;
}

// Modal state management
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}