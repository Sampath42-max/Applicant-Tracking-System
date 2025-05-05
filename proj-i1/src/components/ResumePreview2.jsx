import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

// Validation functions
const validateRequired = (value) => value.trim() !== '';
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+?(\d.*){3,}$/.test(phone);

const validateStep = (step, resumeData) => {
  const newErrors = {};

  if (step === 1) {
    if (!validateRequired(resumeData.header.firstName)) newErrors.firstName = 'First name is required';
    if (!validateRequired(resumeData.header.surname)) newErrors.surname = 'Surname is required';
    if (!validateEmail(resumeData.header.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(resumeData.header.phone)) newErrors.phone = 'Valid phone number is required';
  } else if (step === 2) {
    if (!validateRequired(resumeData.about)) newErrors.about = 'About section is required';
  } else if (step === 3) {
    resumeData.education.forEach((edu, index) => {
      if (!validateRequired(edu.school)) newErrors[`education-${index}-school`] = 'School is required';
      if (!validateRequired(edu.course)) newErrors[`education-${index}-course`] = 'Course is required';
      if (!validateRequired(edu.years)) newErrors[`education-${index}-years`] = 'Years are required';
    });
  } else if (step === 5 && resumeData.isExperienced) {
    resumeData.experience.forEach((exp, index) => {
      if (!validateRequired(exp.jobTitle)) newErrors[`experience-${index}-jobTitle`] = 'Job title is required';
      if (!validateRequired(exp.company)) newErrors[`experience-${index}-company`] = 'Company is required';
      if (!validateRequired(exp.description)) newErrors[`experience-${index}-description`] = 'Position/Description is required';
      if (!validateRequired(exp.years)) newErrors[`experience-${index}-years`] = 'Start Year - End Year is required';
    });
  } else if (step === 6) {
    resumeData.projects.forEach((project, index) => {
      if (!validateRequired(project.title)) newErrors[`projects-${index}-title`] = 'Project title is required';
      if (!validateRequired(project.description)) newErrors[`projects-${index}-description`] = 'Description is required';
      if (!validateRequired(project.duration)) newErrors[`projects-${index}-duration`] = 'Duration is required';
    });
  } else if (step === 7 && resumeData.hasInternships) {
    resumeData.internships.forEach((intern, index) => {
      if (!validateRequired(intern.jobRole)) newErrors[`internships-${index}-jobRole`] = 'Job Role/Course is required';
      if (!validateRequired(intern.company)) newErrors[`internships-${index}-company`] = 'Company Name is required';
      if (!validateRequired(intern.description)) newErrors[`internships-${index}-description`] = 'Position/Description is required';
      if (!validateRequired(intern.years)) newErrors[`internships-${index}-years`] = 'Start Year - End Year is required';
    });
  } else if (step === 8) {
    resumeData.skills.forEach((skill, index) => {
      if (!validateRequired(skill)) newErrors[`skills-${index}`] = 'Skill is required';
    });
    resumeData.references.forEach((ref, index) => {
      if (!validateRequired(ref.name)) newErrors[`references-${index}-name`] = 'Name is required';
      if (!validateRequired(ref.title)) newErrors[`references-${index}-title`] = 'Title is required';
      if (!validateRequired(ref.phone)) newErrors[`references-${index}-phone`] = 'Phone is required';
      if (!validateRequired(ref.social)) newErrors[`references-${index}-social`] = 'Social is required';
    });
  }

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

const Resume = ({ resumeData }) => {
  return (
    <div
      className="mx-auto border border-gray-300 my-4 bg-white text-sm"
      id="resume-content"
      style={{
        width: '210mm',
        height: '297mm',
        padding: '20mm',
        boxSizing: 'border-box',
      }}
    >
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-wide">
          {resumeData.header.firstName} {resumeData.header.surname}
        </h1>
        <p className="text-lg mt-1 tracking-widest text-gray-600">
          {resumeData.header.jobTitle}
        </p>
      </header>

      <div className="flex justify-center items-center space-x-4 py-2 border-t border-b border-gray-300 mb-6 text-xs">
        <div className="flex items-center">
          <Phone className="h-3 w-3 mr-1" />
          <span>{resumeData.header.phone}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{resumeData.header.city}</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-3 w-3 mr-1" />
          <span>{resumeData.header.email}</span>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-gray-300 pb-1">ABOUT ME</h2>
        <p className="text-gray-700 text-xs">
          {resumeData.about || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-gray-300 pb-1">EDUCATION</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2 text-xs">
            <div>
              <p className="font-bold">{edu.years}</p>
              <p>{edu.school}</p>
            </div>
            <div className="col-span-2">
              <p className="font-bold">{edu.course}</p>
              <p className="text-gray-700">
                {edu.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              </p>
            </div>
          </div>
        ))}
      </section>

      {resumeData.isExperienced && resumeData.experience.some(exp => Object.values(exp).some(validateRequired)) && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-gray-300 pb-1">WORK EXPERIENCE</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2 text-xs">
              <div>
                <p className="font-bold">{exp.years}</p>
                <p>{exp.company}</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold">{exp.jobTitle}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {resumeData.projects.some(project => Object.values(project).some(validateRequired)) && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-gray-300 pb-1">PROJECTS</h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2 text-xs">
              <div>
                <p className="font-bold">{project.duration}</p>
                <p>{project.title}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-700">{project.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {resumeData.hasInternships && resumeData.internships.some(intern => Object.values(intern).some(validateRequired)) && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-gray-300 pb-1">INTERNSHIPS</h2>
          {resumeData.internships.map((intern, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2 text-xs">
              <div>
                <p className="font-bold">{intern.years}</p>
                <p>{intern.company}</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold">{intern.jobRole}</p>
                <p className="text-gray-700">{intern.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-gray-300 pb-1">SKILLS</h2>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {resumeData.skills
            .filter((skill) => skill.trim() !== '')
            .map((skill, index) => (
              <span key={index} className="bg-gray-200 p-1 rounded text-xs">
                {skill}
              </span>
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-gray-300 pb-1">REFERENCES</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {resumeData.references.map((ref, index) => (
            <div key={index}>
              <p className="font-bold text-sm">{ref.name}</p>
              <p>{ref.title}</p>
              <div className="mt-1">
                <p>
                  <span className="font-semibold">Phone:</span> {ref.phone}
                </p>
                <p>
                  <span className="font-semibold">Social:</span> {ref.social}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ResumePreview2 = () => {
  const [errors, setErrors] = useState({});
  const [completedSections, setCompletedSections] = useState([]);
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState({
    header: { firstName: '', surname: '', phone: '', city: '', email: '', jobTitle: '' },
    about: '',
    education: [{ school: '', years: '', course: '', description: '' }],
    isExperienced: null,
    hasInternships: null,
    experience: [{ jobTitle: '', company: '', description: '', years: '' }],
    projects: [{ title: '', description: '', duration: '' }],
    internships: [{ jobRole: '', company: '', description: '', years: '' }],
    skills: [''],
    references: [{ name: '', title: '', phone: '', social: '' }],
  });

  const [newSkill, setNewSkill] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (section, index, field, value) => {
    setResumeData((prev) => {
      if (section === 'education' || section === 'experience' || section === 'internships' || section === 'references' || section === 'projects') {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      } else if (section === 'about') {
        return { ...prev, about: value };
      }
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  };

  const addItem = (section) => {
    const lastItem = resumeData[section][resumeData[section].length - 1];
    const hasData = Object.values(lastItem).some((value) => validateRequired(value));
    if (!hasData) {
      alert('Please fill at least one field in the current item before adding a new one.');
      return;
    }

    setResumeData((prev) => ({
      ...prev,
      [section]:
        section === 'education'
          ? [...prev.education, { school: '', years: '', course: '', description: '' }]
          : section === 'experience'
          ? [...prev.experience, { jobTitle: '', company: '', description: '', years: '' }]
          : section === 'internships'
          ? [...prev.internships, { jobRole: '', company: '', description: '', years: '' }]
          : section === 'projects'
          ? [...prev.projects, { title: '', description: '', duration: '' }]
          : [...prev.references, { name: '', title: '', phone: '', social: '' }],
    }));
  };

  const removeItem = (section, index) => {
    setResumeData((prev) => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray.length > 0 ? newArray : [{}] };
    });
  };

  const addSkill = () => {
    if (newSkill.trim() === '') {
      alert('Please enter a skill.');
      return;
    }
    if (resumeData.skills.includes(newSkill.trim())) {
      alert('This skill already exists.');
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills.filter((s) => s.trim() !== ''), newSkill.trim()],
    }));
    setNewSkill('');
  };

  const removeSkill = (index) => {
    setResumeData((prev) => {
      const newSkills = [...prev.skills];
      newSkills.splice(index, 1);
      return { ...prev, skills: newSkills.length > 0 ? newSkills : [''] };
    });
  };

  const chooseExperienceStatus = (isExperienced) => {
    setResumeData((prev) => ({ ...prev, isExperienced }));
    setStep(isExperienced ? 5 : 7); // Experienced -> Work Experience, Fresher -> Internship prompt
    setProgress(isExperienced ? (5 / 8) * 100 : (7 / 8) * 100);
  };

  const chooseInternshipStatus = (hasInternships) => {
    setResumeData((prev) => ({ ...prev, hasInternships }));
    setStep(hasInternships ? 7 : 6); // Yes -> Internships, No -> Projects
    setProgress(hasInternships ? (7 / 8) * 100 : (6 / 8) * 100);
  };

  const nextStep = () => {
    const { errors: newErrors, isValid } = validateStep(step, resumeData);
    setErrors(newErrors);

    if (isValid || isSectionEmpty(step, resumeData)) {
      if (step === 1) {
        setStep(2);
        setProgress((2 / 8) * 100);
      } else if (step === 2) {
        setStep(3);
        setProgress((3 / 8) * 100);
      } else if (step === 3) {
        setStep(4);
        setProgress((4 / 8) * 100);
      } else if (step === 5 && resumeData.isExperienced) {
        setStep(6);
        setProgress((6 / 8) * 100);
      } else if (step === 6) {
        setStep(8);
        setProgress((8 / 8) * 100);
      } else if (step === 7 && resumeData.hasInternships) {
        setStep(6);
        setProgress((6 / 8) * 100);
      } else if (step === 8) {
        console.log('Resume completed:', resumeData);
      }

      if (step < 8 && !completedSections.includes(step)) {
        setCompletedSections([...completedSections, step]);
      }
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      let newStep = step - 1;
      if (step === 5 && resumeData.isExperienced) {
        newStep = 4; // Back to Fresher/Experienced from Work Experience
      } else if (step === 6 && resumeData.isExperienced) {
        newStep = 5; // Back to Work Experience from Projects
      } else if (step === 6 && !resumeData.isExperienced) {
        newStep = resumeData.hasInternships ? 7 : 7; // Back to Internships or Internship prompt
      } else if (step === 7 && resumeData.hasInternships === null) {
        newStep = 4; // Back to Fresher/Experienced from Internship prompt
      } else if (step === 7 && resumeData.hasInternships) {
        newStep = 4; // Back to Fresher/Experienced from Internships
      } else if (step === 8) {
        newStep = resumeData.isExperienced ? 6 : resumeData.hasInternships ? 6 : 6; // Back to Projects
      }
      setStep(newStep);
      setProgress((newStep / 8) * 100);
    }
  };

  const isSectionEmpty = (step, data) => {
    switch (step) {
      case 5:
        return !data.isExperienced || !data.experience.some(exp => Object.values(exp).some(validateRequired));
      case 6:
        return !data.projects.some(project => Object.values(project).some(validateRequired));
      case 7:
        return !data.hasInternships || !data.internships.some(intern => Object.values(intern).some(validateRequired));
      default:
        return false;
    }
  };

  const isSectionComplete = (section) => completedSections.includes(section);

  useEffect(() => {
    console.log('Step:', step, 'Resume Data:', resumeData);
  }, [step, resumeData]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      addSkill();
    }
  };

  // Common input style
  const inputStyle = `w-full p-4 rounded-lg text-sm text-gray-700 bg-white border border-gray-200 
    focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent 
    transition-all duration-300 placeholder:italic placeholder:text-gray-400 
    hover:bg-gray-50 hover:border-[#4a90e2]`;

  // Common button style
  const buttonStyle = `px-6 py-3 rounded-lg text-sm text-white shadow-md 
    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`;

  return (
    <div className="flex gap-10 p-10 max-w-7xl mx-auto font-sans bg-gradient-to-br from-[#f0f4f8] to-[#e6ecef] min-h-screen">
      {/* Form Side */}
      <div className="flex-1 min-w-[550px]">
        <h2 className="text-3xl text-[#1A3559] mb-8 text-center uppercase tracking-wide">Edit Resume</h2>
        <div className="w-full h-2 bg-[#e0e6ed] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1A3559] to-[#4a90e2] transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {step === 1 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Personal Information</h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(1) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={resumeData.header.firstName}
                onChange={(e) => handleChange('header', 0, 'firstName', e.target.value)}
                placeholder="First Name"
                className={`${inputStyle} ${errors.firstName ? 'border-red-500' : validateRequired(resumeData.header.firstName) ? 'border-green-500' : ''}`}
              />
              {errors.firstName && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors.firstName}</div>}

              <input
                type="text"
                value={resumeData.header.surname}
                onChange={(e) => handleChange('header', 0, 'surname', e.target.value)}
                placeholder="Surname"
                className={`${inputStyle} ${errors.surname ? 'border-red-500' : validateRequired(resumeData.header.surname) ? 'border-green-500' : ''}`}
              />
              {errors.surname && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors.surname}</div>}

              <input
                type="text"
                value={resumeData.header.jobTitle}
                onChange={(e) => handleChange('header', 0, 'jobTitle', e.target.value)}
                placeholder="Job Title"
                className={inputStyle}
              />

              <input
                type="text"
                value={resumeData.header.phone}
                onChange={(e) => handleChange('header', 0, 'phone', e.target.value)}
                placeholder="Phone Number"
                className={`${inputStyle} ${errors.phone ? 'border-red-500' : validatePhone(resumeData.header.phone) ? 'border-green-500' : ''}`}
              />
              {errors.phone && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors.phone}</div>}

              <input
                type="text"
                value={resumeData.header.city}
                onChange={(e) => handleChange('header', 0, 'city', e.target.value)}
                placeholder="Address"
                className={inputStyle}
              />

              <input
                type="text"
                value={resumeData.header.email}
                onChange={(e) => handleChange('header', 0, 'email', e.target.value)}
                placeholder="Email"
                className={`${inputStyle} ${errors.email ? 'border-red-500' : validateEmail(resumeData.header.email) ? 'border-green-500' : ''}`}
              />
              {errors.email && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors.email}</div>}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">About Me</h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(2) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              <textarea
                value={resumeData.about}
                onChange={(e) => handleChange('about', 0, 'about', e.target.value)}
                placeholder="Write about yourself..."
                className={`${inputStyle} h-32 resize-y ${errors.about ? 'border-red-500' : validateRequired(resumeData.about) ? 'border-green-500' : ''}`}
              />
              {errors.about && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors.about}</div>}
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Education</h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(3) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleChange('education', index, 'school', e.target.value)}
                    placeholder="School/University"
                    className={`${inputStyle} ${errors[`education-${index}-school`] ? 'border-red-500' : validateRequired(edu.school) ? 'border-green-500' : ''}`}
                  />
                  {errors[`education-${index}-school`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`education-${index}-school`]}</div>}

                  <input
                    type="text"
                    value={edu.course}
                    onChange={(e) => handleChange('education', index, 'course', e.target.value)}
                    placeholder="Course"
                    className={`${inputStyle} ${errors[`education-${index}-course`] ? 'border-red-500' : validateRequired(edu.course) ? 'border-green-500' : ''}`}
                  />
                  {errors[`education-${index}-course`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`education-${index}-course`]}</div>}

                  <input
                    type="text"
                    value={edu.years}
                    onChange={(e) => handleChange('education', index, 'years', e.target.value)}
                    placeholder="Years"
                    className={`${inputStyle} ${errors[`education-${index}-years`] ? 'border-red-500' : validateRequired(edu.years) ? 'border-green-500' : ''}`}
                  />
                  {errors[`education-${index}-years`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`education-${index}-years`]}</div>}

                  <input
                    type="text"
                    value={edu.description}
                    onChange={(e) => handleChange('education', index, 'description', e.target.value)}
                    placeholder="Description"
                    className={inputStyle}
                  />

                  {resumeData.education.length > 1 && (
                    <button
                      onClick={() => removeItem('education', index)}
                      className={`${buttonStyle} bg-gradient-to-r from-[#e74c3c] to-[#ff6b6b] hover:from-[#c0392b] hover:to-[#e55050] w-24 mx-auto mt-2`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('education')}
              className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd] block mx-auto my-4`}
            >
              Add Education
            </button>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Are you a Fresher or Experienced?</h3>
            <div className="flex gap-5 justify-center mb-6">
              <button
                onClick={() => chooseExperienceStatus(true)}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Experienced
              </button>
              <button
                onClick={() => chooseExperienceStatus(false)}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Fresher
              </button>
            </div>
            <div className="flex justify-start gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Work Experience</h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(5) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleChange('experience', index, 'jobTitle', e.target.value)}
                    placeholder="Job Title"
                    className={`${inputStyle} ${errors[`experience-${index}-jobTitle`] ? 'border-red-500' : validateRequired(exp.jobTitle) ? 'border-green-500' : ''}`}
                  />
                  {errors[`experience-${index}-jobTitle`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`experience-${index}-jobTitle`]}</div>}

                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                    placeholder="Company"
                    className={`${inputStyle} ${errors[`experience-${index}-company`] ? 'border-red-500' : validateRequired(exp.company) ? 'border-green-500' : ''}`}
                  />
                  {errors[`experience-${index}-company`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`experience-${index}-company`]}</div>}

                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) => handleChange('experience', index, 'description', e.target.value)}
                    placeholder="Position/Description"
                    className={`${inputStyle} ${errors[`experience-${index}-description`] ? 'border-red-500' : validateRequired(exp.description) ? 'border-green-500' : ''}`}
                  />
                  {errors[`experience-${index}-description`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`experience-${index}-description`]}</div>}

                  <input
                    type="text"
                    value={exp.years}
                    onChange={(e) => handleChange('experience', index, 'years', e.target.value)}
                    placeholder="Start Year - End Year"
                    className={`${inputStyle} ${errors[`experience-${index}-years`] ? 'border-red-500' : validateRequired(exp.years) ? 'border-green-500' : ''}`}
                  />
                  {errors[`experience-${index}-years`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`experience-${index}-years`]}</div>}

                  {resumeData.experience.length > 1 && (
                    <button
                      onClick={() => removeItem('experience', index)}
                      className={`${buttonStyle} bg-gradient-to-r from-[#e74c3c] to-[#ff6b6b] hover:from-[#c0392b] hover:to-[#e55050] w-24 mx-auto mt-2`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('experience')}
              className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd] block mx-auto my-4`}
            >
              Add Experience
            </button>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Projects</h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(6) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                    placeholder="Project Title"
                    className={`${inputStyle} ${errors[`projects-${index}-title`] ? 'border-red-500' : validateRequired(project.title) ? 'border-green-500' : ''}`}
                  />
                  {errors[`projects-${index}-title`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`projects-${index}-title`]}</div>}

                  <input
                    type="text"
                    value={project.description}
                    onChange={(e) => handleChange('projects', index, 'description', e.target.value)}
                    placeholder="Description"
                    className={`${inputStyle} ${errors[`projects-${index}-description`] ? 'border-red-500' : validateRequired(project.description) ? 'border-green-500' : ''}`}
                  />
                  {errors[`projects-${index}-description`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`projects-${index}-description`]}</div>}

                  <input
                    type="text"
                    value={project.duration}
                    onChange={(e) => handleChange('projects', index, 'duration', e.target.value)}
                    placeholder="Duration (e.g., Jan 2023 - Mar 2023)"
                    className={`${inputStyle} ${errors[`projects-${index}-duration`] ? 'border-red-500' : validateRequired(project.duration) ? 'border-green-500' : ''}`}
                  />
                  {errors[`projects-${index}-duration`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`projects-${index}-duration`]}</div>}

                  {resumeData.projects.length > 1 && (
                    <button
                      onClick={() => removeItem('projects', index)}
                      className={`${buttonStyle} bg-gradient-to-r from-[#e74c3c] to-[#ff6b6b] hover:from-[#c0392b] hover:to-[#e55050] w-24 mx-auto mt-2`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('projects')}
              className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd] block mx-auto my-4`}
            >
              Add Project
            </button>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 7 && resumeData.hasInternships === null && !resumeData.isExperienced && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Do you have any Internships?</h3>
            <div className="flex gap-5 justify-center mb-6">
              <button
                onClick={() => chooseInternshipStatus(true)}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Yes
              </button>
              <button
                onClick={() => chooseInternshipStatus(false)}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                No
              </button>
            </div>
            <div className="flex justify-start gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
            </div>
          </div>
        )}

        {step === 7 && resumeData.hasInternships && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Internships</h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(7) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.internships.map((intern, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={intern.jobRole}
                    onChange={(e) => handleChange('internships', index, 'jobRole', e.target.value)}
                    placeholder="Job Role/Course"
                    className={`${inputStyle} ${errors[`internships-${index}-jobRole`] ? 'border-red-500' : validateRequired(intern.jobRole) ? 'border-green-500' : ''}`}
                  />
                  {errors[`internships-${index}-jobRole`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`internships-${index}-jobRole`]}</div>}

                  <input
                    type="text"
                    value={intern.company}
                    onChange={(e) => handleChange('internships', index, 'company', e.target.value)}
                    placeholder="Company Name"
                    className={`${inputStyle} ${errors[`internships-${index}-company`] ? 'border-red-500' : validateRequired(intern.company) ? 'border-green-500' : ''}`}
                  />
                  {errors[`internships-${index}-company`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`internships-${index}-company`]}</div>}

                  <input
                    type="text"
                    value={intern.description}
                    onChange={(e) => handleChange('internships', index, 'description', e.target.value)}
                    placeholder="Position/Description"
                    className={`${inputStyle} ${errors[`internships-${index}-description`] ? 'border-red-500' : validateRequired(intern.description) ? 'border-green-500' : ''}`}
                  />
                  {errors[`internships-${index}-description`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`internships-${index}-description`]}</div>}

                  <input
                    type="text"
                    value={intern.years}
                    onChange={(e) => handleChange('internships', index, 'years', e.target.value)}
                    placeholder="Start Year - End Year"
                    className={`${inputStyle} ${errors[`internships-${index}-years`] ? 'border-red-500' : validateRequired(intern.years) ? 'border-green-500' : ''}`}
                  />
                  {errors[`internships-${index}-years`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`internships-${index}-years`]}</div>}

                  {resumeData.internships.length > 1 && (
                    <button
                      onClick={() => removeItem('internships', index)}
                      className={`${buttonStyle} bg-gradient-to-r from-[#e74c3c] to-[#ff6b6b] hover:from-[#c0392b] hover:to-[#e55050] w-24 mx-auto mt-2`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('internships')}
              className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd] block mx-auto my-4`}
            >
              Add Internship
            </button>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="mb-8 p-8 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">Skills & References</h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(8) ? 'opacity-100' : 'opacity-0'}`}></div>
            {/* Skills */}
            <div className="mb-8">
              <h4 className="text-xl text-[#1A3559] mb-4 uppercase text-center tracking-wide">Skills</h4>
              <div className="mb-4">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-200 p-2 rounded text-sm">{skill}</span>
                    {resumeData.skills.length > 1 && (
                      <button
                        onClick={() => removeSkill(index)}
                        className={`${buttonStyle} bg-gradient-to-r from-[#e74c3c] to-[#ff6b6b] hover:from-[#c0392b] hover:to-[#e55050] px-3 py-1`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new skill"
                  className={inputStyle}
                />
                <button
                  onClick={addSkill}
                  className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
                >
                  Add
                </button>
              </div>
              {errors.skills && errors.skills.map((error, index) => <div key={index} className="text-red-500 text-xs -mt-2 animate-shake">{error}</div>)}
            </div>
            {/* References */}
            <div>
              <h4 className="text-xl text-[#1A3559] mb-4 uppercase text-center tracking-wide">References</h4>
              {resumeData.references.map((ref, index) => (
                <div key={index} className="mb-6">
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => handleChange('references', index, 'name', e.target.value)}
                      placeholder="Name"
                      className={`${inputStyle} ${errors[`references-${index}-name`] ? 'border-red-500' : validateRequired(ref.name) ? 'border-green-500' : ''}`}
                    />
                    {errors[`references-${index}-name`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`references-${index}-name`]}</div>}

                    <input
                      type="text"
                      value={ref.title}
                      onChange={(e) => handleChange('references', index, 'title', e.target.value)}
                      placeholder="Title"
                      className={`${inputStyle} ${errors[`references-${index}-title`] ? 'border-red-500' : validateRequired(ref.title) ? 'border-green-500' : ''}`}
                    />
                    {errors[`references-${index}-title`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`references-${index}-title`]}</div>}

                    <input
                      type="text"
                      value={ref.phone}
                      onChange={(e) => handleChange('references', index, 'phone', e.target.value)}
                      placeholder="Phone"
                      className={`${inputStyle} ${errors[`references-${index}-phone`] ? 'border-red-500' : validateRequired(ref.phone) ? 'border-green-500' : ''}`}
                    />
                    {errors[`references-${index}-phone`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`references-${index}-phone`]}</div>}

                    <input
                      type="text"
                      value={ref.social}
                      onChange={(e) => handleChange('references', index, 'social', e.target.value)}
                      placeholder="Social"
                      className={`${inputStyle} ${errors[`references-${index}-social`] ? 'border-red-500' : validateRequired(ref.social) ? 'border-green-500' : ''}`}
                    />
                    {errors[`references-${index}-social`] && <div className="text-red-500 text-xs -mt-2 animate-shake">{errors[`references-${index}-social`]}</div>}

                    {resumeData.references.length > 1 && (
                      <button
                        onClick={() => removeItem('references', index)}
                        className={`${buttonStyle} bg-gradient-to-r from-[#e74c3c] to-[#ff6b6b] hover:from-[#c0392b] hover:to-[#e55050] w-24 mx-auto mt-2`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem('references')}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd] block mx-auto my-4`}
              >
                Add Reference
              </button>
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:from-[#4b5563] hover:to-[#7c8791]`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:from-[#13263F] hover:to-[#357abd]`}
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Side */}
      <div className="flex-1 min-w-[300px]">
        <Resume resumeData={resumeData} />
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ResumePreview2;  