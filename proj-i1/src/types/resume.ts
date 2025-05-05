export interface ContactInfo {
  fullName: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  location?: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  achievements?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Activity {
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Language {
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface ResumeData {
  contactInfo: ContactInfo;
  objective?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  activities?: Activity[];
  languages?: Language[];
  profileImage?: string;
} 