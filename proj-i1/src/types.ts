// Score detail interfaces
export interface NormalScoreDetails {
    keywordScore: number;
    structureScore: number;
    readabilityScore: number;
    skillsScore: number;
    lengthScore: number;
    matchedKeywords: string[];
    sectionsFound: string[];
  }
  
  export interface CompanyScoreDetails {
    keywordScore: number;
    skillsScore: number;
    experienceScore: number;
    eligibilityScore: number;
    matchedKeywords: string[];
    matchedSkills: string[];
  }
  
  export interface ResultData {
    normalScore: number;
    normalScoreDetails: NormalScoreDetails;
    companyScore?: number;
    companyName?: string;
    companyScoreDetails?: CompanyScoreDetails;
  }