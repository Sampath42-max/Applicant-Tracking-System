// src/config/api.js
// API Configuration for Resume Checker

// Backend URL - change this based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Resume Analysis
  RESUME_CHECK: `${API_BASE_URL}/api/resume/check`,

  // Jobs
  JOBS_INDIA: `${API_BASE_URL}/api/jobs/india`,
  
  // Health Check
  HEALTH: `${API_BASE_URL}/api/health`,
  
  // Logout
  LOGOUT: `${API_BASE_URL}/api/logout`,
  LOGIN: `${API_BASE_URL}/api/login`,
  SIGNUP: `${API_BASE_URL}/api/signup`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  SAVED_JOBS: `${API_BASE_URL}/api/jobs/saved`,
  
  // Root
  ROOT: `${API_BASE_URL}/`
};

// API Helper Functions
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      credentials: 'include', // Important for sessions/cookies
      headers: {
        ...options.headers,
        // Don't set Content-Type for FormData - browser sets it automatically
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.upstreamMessage || errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Check if backend is healthy
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default API_BASE_URL;
