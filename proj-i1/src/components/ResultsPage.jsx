import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, analysisType } = location.state || {};

  useEffect(() => {
    if (!analysis || !analysisType) {
      navigate('/resume-checker', { state: { error: 'No analysis data available.' } });
    }
  }, [analysis, analysisType, navigate]);

  const handleDownloadReport = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    let yOffset = 20;

    doc.setFontSize(20);
    doc.text('Resume Analysis Report', 20, yOffset);
    yOffset += 10;

    if (analysisType === 'withoutCompany') {
      const { normalScore = 0, normalScoreDetails = {} } = analysis;
      const { keywordMatchingScore = 0, structureFormattingScore = 0, experienceSkillsScore = 0, grammarReadabilityScore = 0 } = normalScoreDetails;

      doc.setFontSize(16);
      doc.text(`General ATS Score: ${normalScore}%`, 20, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      doc.text(`Content: ${experienceSkillsScore}%`, 20, yOffset);
      yOffset += 5;
      doc.text(`Formatting: ${structureFormattingScore}%`, 20, yOffset);
      yOffset += 5;
      doc.text(`Impact: ${grammarReadabilityScore}%`, 20, yOffset);
      yOffset += 5;
      doc.text(`Keywords: ${keywordMatchingScore}%`, 20, yOffset);
      yOffset += 10;
    } else if (analysisType === 'withCompany') {
      const { combinedAtsScore = 0, companyName = 'Unknown', companyScore = 0, companyScoreDetails = {} } = analysis;
      const { industryMatchScore = 0, companyReputationScore = 0, jobRoleMatchScore = 0, tenureScore = 0 } = companyScoreDetails;

      doc.setFontSize(16);
      doc.text(`Combined ATS Score: ${combinedAtsScore}%`, 20, yOffset);
      yOffset += 10;
      doc.text(`Company-Specific Score for ${companyName}: ${companyScore}%`, 20, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      doc.text(`Industry Match: ${industryMatchScore}%`, 20, yOffset);
      yOffset += 5;
      doc.text(`Reputation: ${companyReputationScore}%`, 20, yOffset);
      yOffset += 5;
      doc.text(`Role Match: ${jobRoleMatchScore}%`, 20, yOffset);
      yOffset += 5;
      doc.text(`Tenure: ${tenureScore}%`, 20, yOffset);
      yOffset += 10;
    }

    const suggestions = generateSuggestions();
    if (suggestions.length > 0) {
      doc.setFontSize(16);
      doc.text('Improvement Suggestions', 20, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      suggestions.forEach((suggestion, index) => {
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(`${index + 1}. ${suggestion.title} (${suggestion.priority})`, 20, yOffset);
        yOffset += 5;
        doc.text(suggestion.description, 20, yOffset, { maxWidth: 170 });
        yOffset += 10;
      });
    }

    doc.save('resume-analysis-report.pdf');
  };

  const generateSuggestions = () => {
    if (!analysis) return [];

    const suggestions = [];
    if (analysisType === 'withoutCompany') {
      const { normalScoreDetails = {} } = analysis;
      const { keywordMatchingScore = 0, structureFormattingScore = 0, experienceSkillsScore = 0, grammarReadabilityScore = 0, sectionsFound = [] } = normalScoreDetails;

      if (experienceSkillsScore < 80) {
        suggestions.push({
          title: 'Quantify Achievements',
          priority: 'High Priority',
          description: 'Add specific metrics to showcase your impact, e.g., "Increased sales by 30%."',
        });
      }
      if (!sectionsFound.includes('skills')) {
        suggestions.push({
          title: 'Add Skills Section',
          priority: 'Medium Priority',
          description: 'Include a dedicated skills section with relevant technical and soft skills.',
        });
      }
      if (structureFormattingScore < 80) {
        suggestions.push({
          title: 'Improve Formatting',
          priority: 'Low Priority',
          description: 'Ensure consistent fonts, spacing, and bullet styles throughout.',
        });
      }
      if (keywordMatchingScore < 80) {
        suggestions.push({
          title: 'Optimize Keywords',
          priority: 'High Priority',
          description: 'Incorporate more job-specific keywords to boost ATS compatibility.',
        });
      }
    } else if (analysisType === 'withCompany') {
      const { companyName = 'Unknown', companyScoreDetails = {} } = analysis;
      const { jobRoleMatchScore = 0, tenureScore = 0 } = companyScoreDetails;

      if (jobRoleMatchScore < 70) {
        suggestions.push({
          title: 'Tailor Job Roles',
          priority: 'High Priority',
          description: `Align past roles with the target position at ${companyName}.`,
        });
      }
      if (tenureScore < 60) {
        suggestions.push({
          title: 'Showcase Stability',
          priority: 'Medium Priority',
          description: 'Highlight longer job tenures to demonstrate commitment.',
        });
      }
    }
    return suggestions;
  };

  if (!analysis || !analysisType) return null;

  const suggestions = generateSuggestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-white text-center">Resume Analysis Results</h1>
      <p className="text-lg text-gray-300 text-center mt-4">
        Review your resume’s performance and download the detailed report.
      </p>
      {analysisType === 'withoutCompany' && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 text-center">General Resume Analysis</h2>
          <p className="text-center text-gray-600 mt-2">Your resume’s performance against industry standards.</p>
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-semibold text-blue-800">
              General ATS Score: {analysis.normalScore || 0}%
            </h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.normalScoreDetails?.experienceSkillsScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Content</p>
                <p className="text-xs text-gray-400">Quality of your experience and skills.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.normalScoreDetails?.structureFormattingScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Formatting</p>
                <p className="text-xs text-gray-400">Layout and visual structure.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.normalScoreDetails?.grammarReadabilityScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Impact</p>
                <p className="text-xs text-gray-400">Clarity and effectiveness.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.normalScoreDetails?.keywordMatchingScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Keywords</p>
                <p className="text-xs text-gray-400">ATS keyword optimization.</p>
              </div>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-blue-800 text-center">Improvement Suggestions</h3>
              <div className="mt-4 space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 text-yellow-500">💡</span>
                      <div>
                        <h4 className="text-lg font-semibold text-blue-800">{suggestion.title}</h4>
                        <p className="text-sm text-red-600">{suggestion.priority}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleDownloadReport}
            >
              Download Report
            </button>
            <button
              className="px-6 py-2 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
              onClick={() => navigate('/resume-checker')}
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
      {analysisType === 'withCompany' && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 text-center">Company-Specific Analysis</h2>
          <p className="text-center text-gray-600 mt-2">Optimized for {analysis.companyName || 'Unknown'}.</p>
          <div className="mt-6 text-center">
            <span className="text-4xl font-bold text-yellow-500">{analysis.combinedAtsScore || 0}%</span>
            <p className="text-sm text-gray-600 mt-1">Combined ATS Score</p>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-semibold text-blue-800">
              Score for {analysis.companyName || 'Unknown'}: {analysis.companyScore || 0}%
            </h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.companyScoreDetails?.industryMatchScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Industry Match</p>
                <p className="text-xs text-gray-400">Alignment with industry.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.companyScoreDetails?.companyReputationScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Reputation</p>
                <p className="text-xs text-gray-400">Company tier evaluation.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.companyScoreDetails?.jobRoleMatchScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Role Match</p>
                <p className="text-xs text-gray-400">Fit for target role.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-blue-800">{analysis.companyScoreDetails?.tenureScore || 0}%</h4>
                <p className="text-sm text-gray-600 mt-1">Tenure</p>
                <p className="text-xs text-gray-400">Stability assessment.</p>
              </div>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-blue-800 text-center">Improvement Suggestions</h3>
              <div className="mt-4 space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 text-yellow-500">💡</span>
                      <div>
                        <h4 className="text-lg font-semibold text-blue-800">{suggestion.title}</h4>
                        <p className="text-sm text-red-600">{suggestion.priority}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleDownloadReport}
            >
              Download Report
            </button>
            <button
              className="px-6 py-2 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
              onClick={() => navigate('/resume-checker')}
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;