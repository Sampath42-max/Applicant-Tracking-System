import React, { useState, useEffect } from 'react';
import ResumePreview1 from './components/ResumePreview1';
import ResumePreview2 from './components/ResumePreview2';
import ResumePreview3 from './components/ResumePreview3';
import ResumePreview4 from './components/ResumePreview4';
import ResumePreview5 from './components/ResumePreview5';
import ResumePreview6 from './components/ResumePreview6';
import ResumePreview7 from './components/ResumePreview7';
import ResumePreview8 from './components/ResumePreview8';
import ResumePreview9 from './components/ResumePreview9';
import ResumeInputSection from './components/ResumeInputSection';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const handleInputChange = (newData) => {
    setResumeData(newData);
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 1:
        return <ResumePreview1 resumeData={resumeData} />;
      case 2:
        return <ResumePreview2 resumeData={resumeData} />;
      case 3:
        return <ResumePreview3 resumeData={resumeData} />;
      case 4:
        return <ResumePreview4 resumeData={resumeData} />;
      case 5:
        return <ResumePreview5 resumeData={resumeData} />;
      case 6:
        return <ResumePreview6 resumeData={resumeData} />;
      case 7:
        return <ResumePreview7 resumeData={resumeData} />;
      case 8:
        return <ResumePreview8 resumeData={resumeData} />;
      case 9:
        return <ResumePreview9 resumeData={resumeData} />;
      default:
        return <ResumePreview1 resumeData={resumeData} />;
    }
  };

  return (
    <div className="resume-builder-container">
      <div className="template-selector">
        <h2>Select Template</h2>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(Number(e.target.value))}
        >
          <option value={1}>Template 1</option>
          <option value={2}>Template 2</option>
          <option value={3}>Template 3</option>
          <option value={4}>Template 4</option>
          <option value={5}>Template 5</option>
          <option value={6}>Template 6</option>
          <option value={7}>Template 7</option>
          <option value={8}>Template 8</option>
          <option value={9}>Template 9</option>
        </select>
      </div>
      
      <div className="resume-builder-content">
        <div className="input-section">
          <ResumeInputSection onInputChange={handleInputChange} />
        </div>
        <div className="preview-section">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;