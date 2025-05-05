import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext.jsx';
import ResumePreview1 from '../components/ResumePreview1.jsx';
import ResumePreview2 from '../components/ResumePreview2.jsx';
import ResumePreview3 from '../components/ResumePreview3.jsx';
import ResumePreview4 from '../components/ResumePreview4.jsx';
import ResumePreview5 from '../components/ResumePreview5.jsx';
import ResumePreview6 from '../components/ResumePreview6.jsx';
import ResumePreview7 from '../components/ResumePreview7.jsx';
import ResumePreview8 from '../components/ResumePreview8.js';
import ResumePreview9 from '../components/ResumePreview9.jsx';
import ResumePreview10 from '../components/ResumePreview10.jsx';

// Template image imports
import template1 from '../assets/template1.png';
import template2 from '../assets/template2.png';
import template3 from '../assets/template3.png';
import template4 from '../assets/template4.png';
import template5 from '../assets/template5.png';
import template6 from '../assets/template6.png';
import template7 from '../assets/template7.png';
import template8 from '../assets/template8.png';
import template9 from '../assets/template9.png';
import template10 from '../assets/template10.png';

const Build = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const fallbackImage = 'https://via.placeholder.com/300x400?text=Template+Image+Not+Found';

  const initialTemplates = [
    { id: 1, name: 'Professional Blue', category: 'full-stack' },
    { id: 2, name: 'Modern Minimalist', category: 'ai' },
    { id: 3, name: 'Creative Colorful', category: 'ui-ux' },
    { id: 4, name: 'Executive Dark', category: 'full-stack' },
    { id: 5, name: 'Clean White', category: 'full-stack' },
    { id: 6, name: 'Bold Red', category: 'ai' },
    { id: 7, name: 'Academic Style', category: 'full-stack' },
    { id: 8, name: 'Creative Portfolio', category: 'ui-ux' },
    { id: 9, name: 'Modern Geometric', category: 'ai' },
    { id: 10, name: 'Elegant Vintage', category: 'full-stack' },
  ];

  const [filter, setFilter] = useState('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templates] = useState(() => {
    const images = [
      template1,
      template2,
      template3,
      template4,
      template5,
      template6,
      template7,
      template8,
      template9,
      template10,
    ];
    return initialTemplates.map((template, index) => ({
      ...template,
      image: images[index] || fallbackImage,
    }));
  });

  // Verify authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const filteredTemplates = templates.filter(
    (template) => filter === 'all' || template.category === filter
  );

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'full-stack', name: 'Full Stack' },
    { id: 'ai', name: 'AI' },
    { id: 'ui-ux', name: 'UI/UX Design' },
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplateId(null);
  };

  // Map template IDs to ResumePreview components
  const resumePreviews = {
    1: ResumePreview1,
    2: ResumePreview2,
    3: ResumePreview3,
    4: ResumePreview4,
    5: ResumePreview5,
    6: ResumePreview6,
    7: ResumePreview7,
    8: ResumePreview8,
    9: ResumePreview9,
    10: ResumePreview10,
  };

  if (!templates || templates.length === 0) {
    return <div className="text-center text-gray-600">No templates available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-16 px-4 sm:px-6 lg:px-10 font-poppins">
      {!selectedTemplateId ? (
        // Template Selection Interface
        <>
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent animate-fadeInDown">
              Choose a Resume Template
            </h1>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 ${
                    filter === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="p-6 text-center">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.target.src = fallbackImage)}
                    loading="lazy"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">{template.name}</h3>
                  <button
                    onClick={() => handleTemplateSelect(template.id)}
                    className="bg-gradient-to-r from-green-500 to-green-400 text-white px-6 py-3 rounded-full font-semibold text-sm hover:from-green-600 hover:to-green-500 hover:-translate-y-1 shadow-md hover:shadow-lg transition-all"
                    aria-label={`Select ${template.name}`}
                  >
                    Select Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Input Sections and Live Preview
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBackToTemplates}
            className="mb-6 px-6 py-3 bg-gradient-to-r from-slate-900 to-gray-400 text-gray-200 rounded-full font-semibold hover:from-gray-600 hover:to-gray-500 transition-all"
          >
            Back to Templates
          </button>
          {selectedTemplateId && resumePreviews[selectedTemplateId] ? (
            React.createElement(resumePreviews[selectedTemplateId], {})
          ) : (
            <div className="text-center text-gray-600">Invalid template selected</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Build;