import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Eye, Layers3, Sparkles, Wand2 } from 'lucide-react';
import './Build.css';
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

function Build() {
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
    { id: 10, name: 'Creative Sidebar', category: 'creative' },
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const filteredTemplates = templates;

  const categories = [];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBackToTemplates = () => {
    setSelectedTemplateId(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

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
  const SelectedResumePreview = resumePreviews[selectedTemplateId];

  if (!templates || templates.length === 0) {
    return <div className="text-center text-gray-600">No templates available</div>;
  }

  return (
    <div className={`build-page min-h-screen font-poppins ${
      selectedTemplateId ? 'is-editing px-0 py-0' : 'px-4 py-10 sm:px-6 lg:px-10'
    }`}>
      {!selectedTemplateId ? (
        // Template Selection Interface
        <>
          <section className="build-hero mx-auto mb-10 grid max-w-7xl items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="build-hero-copy">
              <div className="build-kicker">
                <Sparkles size={16} />
                Design-grade resume studio
              </div>
              <h1>
                Choose the canvas. Build the career artifact.
              </h1>
              <p>
                Pick a recruiter-ready template and edit it in a focused workspace with polished fields,
                live preview, and export controls tuned for serious resume work.
              </p>
              <div className="build-hero-actions" aria-label="Template categories">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
                    className={`build-filter ${filter === category.id ? 'is-active' : ''}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div className="build-trust-row">
                <span><Check size={16} /> ATS-ready layouts</span>
                <span><Wand2 size={16} /> AI assisted sections</span>
                <span><Eye size={16} /> Live preview</span>
              </div>
            </div>
            <div className="resume-3d-stage" aria-hidden="true">
              <div className="resume-3d-stack">
                <div className="resume-sheet sheet-back">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="resume-sheet sheet-mid">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="resume-sheet sheet-front">
                  <div className="sheet-avatar" />
                  <span />
                  <span />
                  <span />
                  <div className="sheet-grid">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
              <div className="studio-ring ring-one" />
              <div className="studio-ring ring-two" />
            </div>
          </section>

          <div className="template-toolbar mx-auto mb-7 max-w-7xl">
            <div>
              <span className="template-count">{filteredTemplates.length}</span>
              <span className="template-count-label">templates shown</span>
            </div>
            <div className="toolbar-note">
              <Layers3 size={16} />
              Hover a template to inspect depth, then select to open the editor.
            </div>
          </div>

          <section className="template-grid max-w-7xl mx-auto" aria-label="Resume templates">
            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className="template-card"
              >
                <div className="template-preview-shell">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="template-image"
                    onError={(event) => { event.target.src = fallbackImage; }}
                    loading="lazy"
                  />
                </div>
                <div className="template-meta">
                  <div>
                    <p>{template.category.replace('-', ' ')}</p>
                    <h3>{template.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect(template.id)}
                    className="select-template-btn"
                    aria-label={`Select ${template.name}`}
                  >
                    <span>Select</span>
                    <ArrowLeft size={16} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        // Input Sections and Live Preview
        <div className="template-editor-stage">
          <div className="studio-topbar">
          <button
            onClick={handleBackToTemplates}
              className="studio-back-btn"
          >
              <ArrowLeft size={18} />
              Back to Templates
          </button>
            <div className="studio-status">
              <span>Template {selectedTemplateId}</span>
              <strong>Editing workspace</strong>
            </div>
          </div>
          {SelectedResumePreview ? (
            <div className="resume-studio-shell">
              <SelectedResumePreview />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Build;
