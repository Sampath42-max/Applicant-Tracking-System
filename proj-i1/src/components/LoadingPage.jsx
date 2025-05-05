import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoadingPage = () => {
  const [checklistProgress, setChecklistProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { file, companyId, withCompany } = location.state || {};

  useEffect(() => {
    console.log('LoadingPage: Received state:', { file: !!file, companyId, withCompany });

    if (!file) {
      console.error('LoadingPage: No file provided');
      navigate('/resume-checker', { state: { error: 'No file provided for analysis.' } });
      return;
    }

    // Simulate checklist progress
    const interval = setInterval(() => {
      setChecklistProgress((prev) => {
        if (prev >= 5) {
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // Perform API call
    const performAnalysis = async () => {
      const formData = new FormData();
      formData.append('resume', file);
      if (withCompany && companyId) {
        formData.append('companyId', companyId);
      }

      try {
        const endpoint = withCompany
          ? 'http://localhost:5001/api/resume/check-with-company'
          : 'http://localhost:5001/api/resume/check';
        console.log('LoadingPage: Calling API:', endpoint);
        const response = await axios.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        console.log('LoadingPage: API response:', response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('Empty response from API');
        }
        navigate('/results', {
          state: {
            analysis: response.data,
            analysisType: withCompany ? 'withCompany' : 'withoutCompany',
          },
        });
      } catch (error) {
        console.error('LoadingPage: Error uploading resume:', error);
        const errorMessage = error.response
          ? `API error: ${error.response.status} - ${error.response.data.error || error.message}`
          : 'Failed to analyze resume. Please check server connection.';
        navigate('/resume-checker', { state: { error: errorMessage } });
      }
    };

    performAnalysis();

    return () => clearInterval(interval);
  }, [file, companyId, withCompany, navigate]);

  const checklistItems = [
    'Grammar Check',
    'ATS Keywords',
    'Experience Analysis',
    'Formatting',
    'Overall Score',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-900 to-gray-900">
      <h3 className="text-3xl font-bold text-white mb-8">Analyzing Your Resume</h3>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-8">
        {/* Laptop with Scanning Animation */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          <div className="relative w-80 h-56 bg-gray-800 rounded-lg shadow-2xl transform perspective-1000 rotate-y-6 animate-pulse-glow">
            <div className="absolute inset-4 bg-white rounded-md overflow-hidden">
              <div className="w-full h-full bg-gray-100 p-4 relative">
                <div className="w-full h-full border border-gray-300 bg-white shadow-inner flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Resume.pdf</span>
                </div>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div className="w-full h-2 bg-blue-400 opacity-50 animate-scan-line"></div>
                </div>
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-magnify-move">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700 rounded-b-lg"></div>
          </div>
        </div>
        {/* Checklist */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${checklistProgress > index ? 'bg-green-500 animate-checkmark-appear' : 'bg-gray-600'}`}>
                  {checklistProgress > index && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span className="text-lg text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .animate-scan-line {
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-magnify-move {
          animation: magnify 3s ease-in-out infinite;
        }
        @keyframes magnify {
          0% { transform: translate(0, 0); }
          50% { transform: translate(50px, 50px); }
          100% { transform: translate(0, 0); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          100% { box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); }
        }
        .animate-checkmark-appear {
          animation: checkmark 0.5s ease-in-out;
        }
        @keyframes checkmark {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;