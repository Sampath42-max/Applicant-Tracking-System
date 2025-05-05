import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';

const companies = [
  { id: 1, name: 'CISCO' },
  { id: 2, name: 'Tech Mahindra' },
  { id: 3, name: 'Service Now' },
  { id: 4, name: 'Spring Role' },
  { id: 5, name: 'Capgemini' },
  { id: 6, name: 'TCL' },
  { id: 7, name: 'Microsoft' },
  { id: 8, name: 'Wignify' },
  { id: 9, name: 'Accenture' },
  { id: 10, name: 'Cognizant' },
  { id: 11, name: 'Oracle' },
  { id: 12, name: 'Wipro' },
];

const ResumeChecker = () => {
  const [file, setFile] = useState(null);
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState('');
  const [analyzeWithCompany, setAnalyzeWithCompany] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Handle errors from LoadingPage
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      // Clear location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/msword')) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds 5MB limit.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF or Word document.');
      setFile(null);
    }
  };

  const handleCompanyChange = (event) => {
    setCompanyId(event.target.value);
  };

  const handleUpload = (withCompany) => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (withCompany && !companyId) {
      setError('Please select a company.');
      return;
    }

    navigate('/loading', {
      state: {
        file,
        companyId: withCompany ? companyId : null,
        withCompany,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-white text-center">Resume Checkmate</h1>
      <p className="text-lg text-gray-300 text-center mt-4">
        Upload your resume for an AI-powered analysis to boost your job prospects.
      </p>
      <div className="mt-8 flex flex-col items-center gap-6">
        <div
          className="w-full max-w-2xl p-8 border-2 border-dashed border-blue-500 bg-white rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:border-yellow-500 hover:shadow-xl transition-all"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <UploadIcon className="text-blue-600 text-5xl mb-4 hover:text-yellow-500 transition-colors" />
          <p className="text-gray-600 text-center">Drop your resume here or click to browse (PDF/Word, max 5MB).</p>
          <input
            type="file"
            id="fileInput"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <label className="flex items-center text-white text-lg cursor-pointer">
            <input
              type="checkbox"
              checked={analyzeWithCompany}
              onChange={() => setAnalyzeWithCompany(!analyzeWithCompany)}
              className="mr-2 accent-yellow-500"
            />
            Analyze with Company
          </label>
          {analyzeWithCompany && (
            <div className="flex items-center gap-4">
              <label htmlFor="company" className="text-white text-lg">
                Select Company:
              </label>
              <select
                id="company"
                value={companyId}
                onChange={handleCompanyChange}
                className="p-2 rounded-lg border border-blue-500 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              >
                <option value="">-- Select a Company --</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      {file && <p className="text-center mt-4 text-yellow-500">Selected: {file.name}</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-full font-semibold uppercase tracking-wide hover:from-blue-700 hover:to-yellow-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => handleUpload(false)}
          disabled={!file}
        >
          Analyze Without Company
        </button>
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-full font-semibold uppercase tracking-wide hover:from-blue-700 hover:to-yellow-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => handleUpload(true)}
          disabled={!file || (analyzeWithCompany && !companyId)}
        >
          Analyze With Company
        </button>
      </div>
    </div>
  );
};

export default ResumeChecker;