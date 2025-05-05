import React, { useState, useRef } from 'react';

// Validation functions
const validateRequired = (value) => value.trim() !== '';
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+?(\d.*){3,}$/.test(phone);

const validateStep = (step, resumeData) => {
  const newErrors = {};

  if (step === 1) {
    if (!validateRequired(resumeData.name)) newErrors.name = 'Name is required';
    if (!validateRequired(resumeData.role)) newErrors.role = 'Role title is required';
  } else if (step === 2) {
    if (!validateRequired(resumeData.summary)) newErrors.summary = 'Summary is required';
  } else if (step === 3) {
    if (!validateRequired(resumeData.contact.location)) newErrors.location = 'Location is required';
    if (!validatePhone(resumeData.contact.phone)) newErrors.phone = 'Valid phone number is required';
    if (!validateEmail(resumeData.contact.email)) newErrors.email = 'Valid email is required';
    if (!validateRequired(resumeData.contact.linkedin)) newErrors.linkedin = 'LinkedIn URL is required';
  } else if (step === 4) {
    if (resumeData.skills.length === 0) newErrors.skills = 'At least one skill is required';
  } else if (step === 5) {
    if (resumeData.hobbies.length === 0) newErrors.hobbies = 'At least one hobby is required';
  } else if (step === 6) {
    resumeData.experience.forEach((exp, index) => {
      if (!validateRequired(exp.title)) newErrors[`experience-${index}-title`] = 'Job title is required';
      if (!validateRequired(exp.company)) newErrors[`experience-${index}-company`] = 'Company is required';
      if (!validateRequired(exp.location)) newErrors[`experience-${index}-location`] = 'Location is required';
      if (!validateRequired(exp.years)) newErrors[`experience-${index}-years`] = 'Years are required';
      if (!validateRequired(exp.description)) newErrors[`experience-${index}-description`] = 'Description is required';
    });
  } else if (step === 7) {
    resumeData.education.forEach((edu, index) => {
      if (!validateRequired(edu.degree)) newErrors[`education-${index}-degree`] = 'Degree is required';
      if (!validateRequired(edu.year)) newErrors[`education-${index}-year`] = 'Year is required';
      if (!validateRequired(edu.institution)) newErrors[`education-${index}-institution`] = 'Institution is required';
    });
  } else if (step === 8) {
    if (!resumeData.profileImage) newErrors.profileImage = 'Profile image is required';
  }

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

const ResumePreview10 = () => {
  const [resumeData, setResumeData] = useState({
    name: 'Julia Scott',
    role: 'Fashion Designer',
    summary: 'A passionate and skilled fashion designer with a focus on sustainable practices and trend forecasting. Equipped with extensive experience in garment construction and digital fashion tools. Committed to delivering innovative, eco-friendly designs. Strong team collaborator, adept at balancing creativity with technical execution.',
    contact: {
      location: 'Bristol, United Kingdom',
      phone: '+44 20 7946 5678',
      email: 'julia.scott@email.com',
      linkedin: 'linkedin.com/in/juliascott',
    },
    skills: ['Fashion Illustration', 'Garment Construction', 'Digital Design (Adobe Illustrator, Photoshop)', 'Trend Research', 'Sustainable Practices', 'Fabric Sourcing'],
    hobbies: ['Fashion Illustrations', 'Fashion Events', 'Travel Inspiration', 'Photography', 'Textile Art'],
    experience: [
      { id: 1, title: 'Junior Fashion Designer', company: 'Studio Luxe', location: 'Bristol, UK', years: '2021 – Now', description: 'Designed women’s wear collections, created technical sketches, and oversaw sample production. Researched trends and sourced sustainable fabrics.' },
      { id: 2, title: 'Assistant Fashion Designer', company: 'Bella Couture', location: 'Bristol, UK', years: '2018 – 2021', description: 'Assisted with sketching, fabric sourcing, design fittings, mood boards, and client presentations, ensuring brand alignment.' },
      { id: 3, title: 'Fashion Designer Intern', company: 'Harper & Co.', location: 'London, UK', years: '2017 – 2018', description: 'Supported senior designers with design and admin tasks while gaining hands-on industry experience.' },
    ],
    education: [
      { id: 1, degree: 'BA (Hons) Fashion Design', year: '2018', institution: 'University of West England, Bristol' },
      { id: 2, degree: 'Diploma in Textile Design', year: '2016', institution: 'London College of Fashion' },
    ],
    profileImage: '/profile.jpg',
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [completedSections, setCompletedSections] = useState([]);
  const [progress, setProgress] = useState(12.5); // 8 steps total
  const resumeRef = useRef();

  const handleInputChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleListChange = (field, newList) => {
    setResumeData((prev) => ({ ...prev, [field]: newList }));
  };

  const handleExperienceChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), title: '', company: '', location: '', years: '', description: '' },
      ],
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), degree: '', year: '', institution: '' },
      ],
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    const { errors: newErrors, isValid } = validateStep(step, resumeData);
    setErrors(newErrors);

    if (isValid) {
      if (step < 8) {
        setStep(step + 1);
        if (!completedSections.includes(step)) {
          setCompletedSections([...completedSections, step]);
        }
        setProgress(((step + 1) / 8) * 100);
      }
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(((step - 1) / 8) * 100);
    }
  };

  const isSectionComplete = (section) => completedSections.includes(section);

  return (
    <div className="flex gap-10 p-10 max-w-7xl mx-auto font-sans bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Form Side */}
      <div className="flex-1 min-w-[550px]">
        <h2 className="text-3xl text-gray-800 mb-8 text-center uppercase tracking-wide">
          Edit Resume
        </h2>
        <div className="w-full h-2 bg-gray-300 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-700 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {step === 1 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Personal Information
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(1) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={resumeData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full p-4 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors.name ? 'border-l-4 border-red-500' : validateRequired(resumeData.name) ? 'border-l-4 border-green-500' : ''}`}
              />
              {errors.name && <div className="text-red-500 text-xs -mt-3 mb-3">{errors.name}</div>}
              <input
                type="text"
                placeholder="Role Title"
                value={resumeData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full p-4 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors.role ? 'border-l-4 border-red-500' : validateRequired(resumeData.role) ? 'border-l-4 border-green-500' : ''}`}
              />
              {errors.role && <div className="text-red-500 text-xs -mt-3 mb-3">{errors.role}</div>}
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Summary
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(2) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              <textarea
                placeholder="Summary"
                value={resumeData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className={`w-full p-4 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 resize-y ${errors.summary ? 'border-l-4 border-red-500' : validateRequired(resumeData.summary) ? 'border-l-4 border-green-500' : ''}`}
                rows="4"
              />
              {errors.summary && <div className="text-red-500 text-xs -mt-3 mb-3">{errors.summary}</div>}
            </div>
            <div className="flex justify-between gap-5 mt-5">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Contact
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(3) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              {Object.keys(resumeData.contact).map((key) => (
                <div key={key}>
                  <input
                    type="text"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={resumeData.contact[key]}
                    onChange={(e) => handleContactChange(key, e.target.value)}
                    className={`w-full p-4 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[key] ? 'border-l-4 border-red-500' : validateRequired(resumeData.contact[key]) && (key !== 'email' || validateEmail(resumeData.contact[key])) && (key !== 'phone' || validatePhone(resumeData.contact[key])) ? 'border-l-4 border-green-500' : ''}`}
                  />
                  {errors[key] && <div className="text-red-500 text-xs -mt-3 mb-3">{errors[key]}</div>}
                </div>
              ))}
            </div>
            <div className="flex justify-between gap-5 mt-5">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Skills
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(4) ? 'opacity-100' : 'opacity-0'}`}></div>
            <ListEditor
              list={resumeData.skills}
              onChange={(newList) => handleListChange('skills', newList)}
            />
            {errors.skills && <div className="text-red-500 text-xs mt-2">{errors.skills}</div>}
            <div className="flex justify-between gap-5 mt-5">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Hobbies
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(5) ? 'opacity-100' : 'opacity-0'}`}></div>
            <ListEditor
              list={resumeData.hobbies}
              onChange={(newList) => handleListChange('hobbies', newList)}
            />
            {errors.hobbies && <div className="text-red-500 text-xs mt-2">{errors.hobbies}</div>}
            <div className="flex justify-between gap-5 mt-5">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Experience
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(6) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border p-4 mt-2 rounded">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[`experience-${exp.id}-title`] ? 'border-l-4 border-red-500' : validateRequired(exp.title) ? 'border-l-4 border-green-500' : ''}`}
                />
                {errors[`experience-${exp.id}-title`] && <div className="text-red-500 text-xs mt-1">{errors[`experience-${exp.id}-title`]}</div>}
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[`experience-${exp.id}-company`] ? 'border-l-4 border-red-500' : validateRequired(exp.company) ? 'border-l-4 border-green-500' : ''}`}
                />
                {errors[`experience-${exp.id}-company`] && <div className="text-red-500 text-xs mt-1">{errors[`experience-${exp.id}-company`]}</div>}
                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[`experience-${exp.id}-location`] ? 'border-l-4 border-red-500' : validateRequired(exp.location) ? 'border-l-4 border-green-500' : ''}`}
                />
                {errors[`experience-${exp.id}-location`] && <div className="text-red-500 text-xs mt-1">{errors[`experience-${exp.id}-location`]}</div>}
                <input
                  type="text"
                  placeholder="Years"
                  value={exp.years}
                  onChange={(e) => handleExperienceChange(exp.id, 'years', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[`experience-${exp.id}-years`] ? 'border-l-4 border-red-500' : validateRequired(exp.years) ? 'border-l-4 border-green-500' : ''}`}
                />
                {errors[`experience-${exp.id}-years`] && <div className="text-red-500 text-xs mt-1">{errors[`experience-${exp.id}-years`]}</div>}
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 resize-y ${errors[`experience-${exp.id}-description`] ? 'border-l-4 border-red-500' : validateRequired(exp.description) ? 'border-l-4 border-green-500' : ''}`}
                  rows="3"
                />
                {errors[`experience-${exp.id}-description`] && <div className="text-red-500 text-xs mt-1">{errors[`experience-${exp.id}-description`]}</div>}
              </div>
            ))}
            <button
              onClick={addExperience}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-all duration-300"
            >
              Add Experience
            </button>
            <div className="flex justify-between gap-5 mt-5">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Education
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(7) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="border p-4 mt-2 rounded">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[`education-${edu.id}-degree`] ? 'border-l-4 border-red-500' : validateRequired(edu.degree) ? 'border-l-4 border-green-500' : ''}`}
                />
                {errors[`education-${edu.id}-degree`] && <div className="text-red-500 text-xs mt-1">{errors[`education-${edu.id}-degree`]}</div>}
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[`education-${edu.id}-year`] ? 'border-l-4 border-red-500' : validateRequired(edu.year) ? 'border-l-4 border-green-500' : ''}`}
                />
                {errors[`education-${edu.id}-year`] && <div className="text-red-500 text-xs mt-1">{errors[`education-${edu.id}-year`]}</div>}
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                  className={`w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400 ${errors[`education-${edu.id}-institution`] ? 'border-l-4 border-red-500' : validateRequired(edu.institution) ? 'border-l-4 border-green-500' : ''}`}
                />
                {errors[`education-${edu.id}-institution`] && <div className="text-red-500 text-xs mt-1">{errors[`education-${edu.id}-institution`]}</div>}
              </div>
            ))}
            <button
              onClick={addEducation}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-all duration-300"
            >
              Add Education
            </button>
            <div className="flex justify-between gap-5 mt-5">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl relative">
            <h3 className="text-2xl text-gray-800 mb-6 uppercase text-center tracking-wider">
              Profile Image
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(8) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={`w-full p-4 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 ${errors.profileImage ? 'border-l-4 border-red-500' : resumeData.profileImage ? 'border-l-4 border-green-500' : ''}`}
              />
              {errors.profileImage && <div className="text-red-500 text-xs mt-1">{errors.profileImage}</div>}
            </div>
            <div className="flex justify-between gap-5 mt-5">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 border-none rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Side */}
      <div className="flex-1 min-w-[550px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Resume Preview</h2>
        <ResumePreview resumeData={resumeData} ref={resumeRef} />
      </div>
    </div>
  );
};

const ListEditor = ({ list, onChange }) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...list, newItem]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full p-2 border-none rounded-lg text-sm text-gray-700 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 placeholder:italic placeholder:text-gray-400"
          placeholder="Add new item"
        />
        <button
          onClick={addItem}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-all duration-300"
        >
          Add
        </button>
      </div>
      <ul className="mt-2">
        {list.map((item, index) => (
          <li key={index} className="flex justify-between items-center py-1">
            {item}
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ResumePreview = React.forwardRef(({ resumeData }, ref) => {
  return (
    <div ref={ref} className="max-w-4xl mx-auto bg-white shadow-lg flex font-sans">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-900 text-white p-6 space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={resumeData.profileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold">{resumeData.name}</h1>
          <h2 className="text-lg text-orange-300">{resumeData.role}</h2>
        </div>

        <div className="bg-orange-500 p-2 rounded-t">
          <h3 className="text-white font-semibold">📞 CONTACT</h3>
        </div>
        <div>
          <p><strong>Location:</strong> {resumeData.contact.location}</p>
          <p><strong>Phone:</strong> {resumeData.contact.phone}</p>
          <p><strong>Email:</strong> {resumeData.contact.email}</p>
          <p><strong>LinkedIn:</strong> {resumeData.contact.linkedin}</p>
        </div>

        <div className="bg-orange-500 p-2 rounded-t mt-4">
          <h3 className="text-white font-semibold">🛠 SKILLS</h3>
        </div>
        <div>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {resumeData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-500 p-2 rounded-t mt-4">
          <h3 className="text-white font-semibold">🎨 HOBBIES</h3>
        </div>
        <div>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {resumeData.hobbies.map((hobby, index) => (
              <li key={index}>{hobby}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8 space-y-6">
        {/* Summary */}
        <div className="bg-orange-100 p-4 rounded-lg">
          <div className="bg-orange-500 px-3 py-1 rounded-t">
            <h3 className="text-white font-bold text-lg jaka">📝 SUMMARY</h3>
          </div>
          <p className="text-sm text-gray-800 mt-2">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className="bg-orange-100 p-4 rounded-lg">
          <div className="bg-orange-500 px-3 py-1 rounded-t">
            <h3 className="text-white font-bold text-lg">💼 EXPERIENCE</h3>
          </div>
          <div className="space-y-4 text-sm mt-2">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <p className="font-semibold">{exp.years} | {exp.title}</p>
                <p className="italic text-gray-600">{exp.company}, {exp.location}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-orange-100 p-4 rounded-lg">
          <div className="bg-orange-500 px-3 py-1 rounded-t">
            <h3 className="text-white font-bold text-lg">🎓 EDUCATION</h3>
          </div>
          <div className="space-y-2 text-sm mt-2">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <p className="font-semibold">{edu.year} | {edu.degree}</p>
                <p className="italic text-gray-600">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResumePreview10;
