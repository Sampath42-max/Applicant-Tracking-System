import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Svg, Path } from '@react-pdf/renderer';

// Validation functions
const validateRequired = (value) => value.trim() !== '';
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+?(\d.*){3,}$/.test(phone);
const validateLinkedIn = (linkedin) => linkedin.trim() === '' || /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedin);

const validateStep = (step, resumeData) => {
  const newErrors = {};

  if (step === 1) {
    if (!validateRequired(resumeData.header.firstName)) newErrors.firstName = 'First name is required';
    if (!validateRequired(resumeData.header.surname)) newErrors.surname = 'Surname is required';
    if (!validateEmail(resumeData.header.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(resumeData.header.phone)) newErrors.phone = 'Valid phone number is required';
    if (!validateLinkedIn(resumeData.header.linkedin)) newErrors.linkedin = 'Valid LinkedIn URL is optional';
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
      if (!validateRequired(exp.employer)) newErrors[`experience-${index}-employer`] = 'Employer is required';
      if (!validateRequired(exp.position)) newErrors[`experience-${index}-position`] = 'Position is required';
      if (!validateRequired(exp.years)) newErrors[`experience-${index}-years`] = 'Years are required';
    });
  } else if (step === 6 && resumeData.isExperienced === false && resumeData.hasInternships) {
    resumeData.internships.forEach((intern, index) => {
      if (!validateRequired(intern.jobRole)) newErrors[`internship-${index}-jobRole`] = 'Job role is required';
      if (!validateRequired(intern.company)) newErrors[`internship-${index}-company`] = 'Company is required';
      if (!validateRequired(intern.position)) newErrors[`internship-${index}-position`] = 'Position is required';
      if (!validateRequired(intern.years)) newErrors[`internship-${index}-years`] = 'Years are required';
    });
  } else if (step === 7) {
    Object.entries(resumeData.skills).forEach(([category, skills]) => {
      skills.forEach((skill, index) => {
        if (!validateRequired(skill)) newErrors[`skills-${category}-${index}`] = `${category} skill is required`;
      });
    });
  } else if (step === 8) {
    resumeData.projects.forEach((project, index) => {
      if (!validateRequired(project.title)) newErrors[`project-${index}-title`] = 'Project title is required';
      if (!validateRequired(project.description)) newErrors[`project-${index}-description`] = 'Project description is required';
    });
  }

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A3559',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 16,
    color: '#1A3559',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#1A3559',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#1A3559',
    color: 'white',
    padding: 5,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    color: 'black',
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#1A3559',
    fontWeight: 'bold',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillCategory: {
    width: '50%',
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A3559',
    marginBottom: 5,
  },
});

// Icon Components
const PhoneIcon = () => (
  <Svg height="14" width="14" viewBox="0 0 24 24" fill="none" stroke="#1A3559" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const HomeIcon = () => (
  <Svg height="14" width="14" viewBox="0 0 24 24" fill="none" stroke="#1A3559" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

const LinkedInIcon = () => (
  <Svg height="14" width="14" viewBox="0 0 24 24" fill="none" stroke="#1A3559" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <Path d="M2 9h4v12H2z" />
    <Path d="M9 2c-5 1-4 7-4 11v3.5c0 .5.3 1 .8 1h2.4c.5 0 .8-.5.8-1V13h1c3.5 0 3-2 3-3V9h1c1-1 1-2 1-2-1-2-2-2-2-2H9z" />
  </Svg>
);

const EmailIcon = () => (
  <Svg height="14" width="14" viewBox="0 0 24 24" fill="none" stroke="#1A3559" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6l-10 7L2 6" />
  </Svg>
);

// PDF Document Component
const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {resumeData.header.firstName} {resumeData.header.surname}
        </Text>
        <Text style={styles.jobTitle}>{resumeData.header.jobTitle}</Text>
        <View style={styles.contact}>
          <View style={styles.contactItem}>
            <PhoneIcon />
            <Text>{resumeData.header.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <HomeIcon />
            <Text>{resumeData.header.city}</Text>
          </View>
          {resumeData.header.linkedin && (
            <View style={styles.contactItem}>
              <LinkedInIcon />
              <Text>{resumeData.header.linkedin}</Text>
            </View>
          )}
          <View style={styles.contactItem}>
            <EmailIcon />
            <Text>{resumeData.header.email}</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.text}>{resumeData.about}</Text>
      </View>
      {(resumeData.isExperienced || (resumeData.isExperienced === false && resumeData.hasInternships)) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {resumeData.isExperienced ? 'Work Experience' : 'Internships'}
          </Text>
          {resumeData.isExperienced
            ? resumeData.experience.map((exp, index) => (
                <View key={index} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text>
                      {exp.jobTitle} - {exp.employer}
                    </Text>
                    <Text>{exp.years}</Text>
                  </View>
                  <Text style={styles.text}>{exp.position}</Text>
                </View>
              ))
            : resumeData.internships.map((intern, index) => (
                <View key={index} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text>
                      {intern.jobRole} - {intern.company}
                    </Text>
                    <Text>{intern.years}</Text>
                  </View>
                  <Text style={styles.text}>{intern.position}</Text>
                </View>
              ))}
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {resumeData.education.map((edu, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text>{edu.school}</Text>
              <Text>{edu.years}</Text>
            </View>
            <Text style={styles.text}>{edu.course}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsGrid}>
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            <View key={category} style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              {skills
                .filter((skill) => skill.trim() !== '')
                .map((skill, index) => (
                  <Text key={index} style={styles.text}>
                    • {skill}
                  </Text>
                ))}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {resumeData.projects.map((project, index) => (
          <View key={index} style={styles.item}>
            <Text style={{ ...styles.text, fontWeight: 'bold' }}>
              {project.title}
            </Text>
            <Text style={styles.text}>{project.description}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Button Component
const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyles = 'px-6 py-3 rounded-lg text-sm text-white shadow-lg transition-all duration-300';
  const variants = {
    primary: 'bg-gradient-to-r from-[#1A3559] to-[#4a90e2] hover:bg-gradient-to-r hover:from-[#13263F] hover:to-[#357abd] hover:-translate-y-1 hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-[#6b7280] to-[#9ca3af] hover:bg-gradient-to-r hover:from-[#4b5563] hover:to-[#7c8791] hover:-translate-y-1 hover:shadow-xl',
    danger: 'bg-gradient-to-r from-[#e74c3c] to-[#ff6b6b] hover:bg-gradient-to-r hover:from-[#c0392b] hover:to-[#e55050] hover:-translate-y-1 hover:shadow-xl',
    success: 'bg-gradient-to-r from-[#2ecc71] to-[#27ae60] hover:bg-gradient-to-r hover:from-[#27ae60] hover:to-[#219653] hover:-translate-y-1 hover:shadow-xl',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const ResumePreview1 = () => {
  const [errors, setErrors] = useState({});
  const [completedSections, setCompletedSections] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showDownload, setShowDownload] = useState(false);
  const [resumeData, setResumeData] = useState({
    header: { firstName: '', surname: '', phone: '', city: '', email: '', jobTitle: '', linkedin: '' },
    about: '',
    education: [{ school: '', years: '', course: '' }],
    isExperienced: null,
    hasInternships: null,
    experience: [{ jobTitle: '', employer: '', position: '', years: '' }],
    internships: [{ jobRole: '', company: '', position: '', years: '' }],
    skills: { programming: [''], tools: [''], platforms: [''], softSkills: [''] },
    projects: [{ title: '', description: '' }],
  });

  const [step, setStep] = useState(1);
  const resumeRef = useRef();

  const areAllStepsValid = () => {
    const stepsToValidate = [1, 2, 3, 7, 8];
    if (resumeData.isExperienced) {
      stepsToValidate.push(5);
    } else if (resumeData.hasInternships) {
      stepsToValidate.push(6);
    }
    return stepsToValidate.every((s) => validateStep(s, resumeData).isValid);
  };

  const handleChange = (section, index, field, value) => {
    setResumeData((prev) => {
      if (section === 'education' || section === 'experience' || section === 'internships' || section === 'projects') {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      } else if (section === 'skills') {
        const newSkills = { ...prev.skills };
        newSkills[field] = [...newSkills[field]];
        newSkills[field][index] = value;
        return { ...prev, [section]: newSkills };
      } else if (section === 'about') {
        return { ...prev, about: value };
      }
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  };

  const addItem = (section) => {
    setResumeData((prev) => ({
      ...prev,
      [section]:
        section === 'education'
          ? [...prev.education, { school: '', years: '', course: '' }]
          : section === 'experience'
          ? [...prev.experience, { jobTitle: '', employer: '', position: '', years: '' }]
          : section === 'internships'
          ? [...prev.internships, { jobRole: '', company: '', position: '', years: '' }]
          : [...prev.projects, { title: '', description: '' }],
    }));
  };

  const removeItem = (section, index) => {
    setResumeData((prev) => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const addSkill = (category) => {
    setResumeData((prev) => {
      const newSkills = { ...prev.skills };
      newSkills[category] = [...newSkills[category], ''];
      return { ...prev, skills: newSkills };
    });
  };

  const removeSkill = (category, index) => {
    setResumeData((prev) => {
      const newSkills = { ...prev.skills };
      newSkills[category] = [...newSkills[category]];
      newSkills[category].splice(index, 1);
      return { ...prev, skills: newSkills };
    });
  };

  const chooseExperience = (isExperienced) => {
    setResumeData((prev) => ({
      ...prev,
      isExperienced,
      hasInternships: null,
      internships: [{ jobRole: '', company: '', position: '', years: '' }],
    }));
    setErrors({});
    setStep(5);
    setProgress(isExperienced ? (5 / 8) * 100 : (5 / 7) * 100);
  };

  const handleInternshipChoice = (choice) => {
    setResumeData((prev) => ({
      ...prev,
      hasInternships: choice === 'Internships',
      internships: choice === 'Nothing' ? [] : prev.internships,
    }));
    setErrors({});
    if (choice === 'Nothing') {
      setStep(7);
      setProgress((6 / 7) * 100);
    } else {
      setStep(6);
      setProgress((6 / 8) * 100);
    }
  };

  const nextStep = () => {
    if (step === 4 && resumeData.isExperienced === null) {
      alert('Please choose Fresher or Experienced.');
      return;
    }
    if (step === 5 && resumeData.isExperienced === false && resumeData.hasInternships === null) {
      alert('Please choose Internships or Nothing.');
      return;
    }

    const { errors: newErrors, isValid } = validateStep(step, resumeData);
    setErrors(newErrors);

    if (isValid) {
      if (step === 8) {
        setShowDownload(true);
        setProgress(100);
        setCompletedSections([...completedSections, step]);
        setErrors({});
      } else {
        let nextStep = step + 1;
        if (step === 5 && resumeData.isExperienced) {
          nextStep = 7; // Skip step 6 for Experienced
        }
        setStep(nextStep);
        if (!completedSections.includes(step)) {
          setCompletedSections([...completedSections, step]);
        }
        const totalSteps = resumeData.isExperienced || resumeData.hasInternships ? 8 : 7;
        setProgress((nextStep / totalSteps) * 100);
        setErrors({});
      }
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      let newStep = step - 1;
      if (step === 7) {
        if (resumeData.isExperienced === false && resumeData.hasInternships === false) {
          newStep = 5; // Nothing path
        } else if (resumeData.isExperienced === false && resumeData.hasInternships === true) {
          newStep = 6; // Internships path
        } else if (resumeData.isExperienced === true) {
          newStep = 5; // Experienced path
        }
      } else if (step === 6) {
        newStep = 5; // Always back to Internship/Nothing choice
      }
      setStep(newStep);
      setShowDownload(false);
      const totalSteps = resumeData.isExperienced || resumeData.hasInternships ? 8 : 7;
      setProgress((newStep / totalSteps) * 100);
      setErrors({});
    }
  };

  const isSectionComplete = (section) => completedSections.includes(section);

  useEffect(() => {
    if (step === 6 && (resumeData.isExperienced || !resumeData.hasInternships)) {
      setStep(5);
      setProgress((5 / (resumeData.isExperienced ? 8 : 7)) * 100);
    }
  }, [step, resumeData.isExperienced, resumeData.hasInternships]);

  return (
    <div className="flex gap-10 p-10 max-w-7xl mx-auto font-sans bg-gradient-to-br from-[#3c6d9d] to-[#1f8ac0] min-h-screen">
      <div className="flex-1 min-w-[550px]">
        <h2 className="text-3xl text-[#1A3559] mb-8 text-center uppercase tracking-wide">
          Edit Resume
        </h2>
        <div className="w-full h-2 bg-[#2672ca92] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1A3559] to-[#4a90e2] transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {step === 1 && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Personal Information
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(1) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={resumeData.header.firstName}
                onChange={(e) => handleChange('header', 0, 'firstName', e.target.value)}
                placeholder="First Name"
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors.firstName ? 'border-l-4 border-red-500' : validateRequired(resumeData.header.firstName) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
              />
              {errors.firstName && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors.firstName}</div>}
              <input
                type="text"
                value={resumeData.header.surname}
                onChange={(e) => handleChange('header', 0, 'surname', e.target.value)}
                placeholder="Surname"
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors.surname ? 'border-l-4 border-red-500' : validateRequired(resumeData.header.surname) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
              />
              {errors.surname && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors.surname}</div>}
              <input
                type="text"
                value={resumeData.header.jobTitle}
                onChange={(e) => handleChange('header', 0, 'jobTitle', e.target.value)}
                placeholder="Job Title"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 border-l-4 border-transparent hover:bg-gray-50 hover:shadow-md"
              />
              <input
                type="text"
                value={resumeData.header.phone}
                onChange={(e) => handleChange('header', 0, 'phone', e.target.value)}
                placeholder="Phone Number"
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors.phone ? 'border-l-4 border-red-500' : validatePhone(resumeData.header.phone) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
              />
              {errors.phone && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors.phone}</div>}
              <input
                type="text"
                value={resumeData.header.city}
                onChange={(e) => handleChange('header', 0, 'city', e.target.value)}
                placeholder="Address"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 border-l-4 border-transparent hover:bg-gray-50 hover:shadow-md"
              />
              <input
                type="text"
                value={resumeData.header.email}
                onChange={(e) => handleChange('header', 0, 'email', e.target.value)}
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors.email ? 'border-l-4 border-red-500' : validateEmail(resumeData.header.email) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
              />
              {errors.email && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors.email}</div>}
              <input
                type="text"
                value={resumeData.header.linkedin}
                onChange={(e) => handleChange('header', 0, 'linkedin', e.target.value)}
                placeholder="LinkedIn URL (Optional)"
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors.linkedin ? 'border-l-4 border-red-500' : validateLinkedIn(resumeData.header.linkedin) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md italic`}
              />
              {errors.linkedin && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors.linkedin}</div>}
            </div>
            <div className="flex justify-end mt-5 animate-slideIn">
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              About Me
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(2) ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className="flex flex-col gap-4">
              <textarea
                value={resumeData.about}
                onChange={(e) => handleChange('about', 0, 'about', e.target.value)}
                placeholder="Write about yourself..."
                className={`w-full px-4 py-3 h-32 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 resize-y ${errors.about ? 'border-l-4 border-red-500' : validateRequired(resumeData.about) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
              />
              {errors.about && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors.about}</div>}
            </div>
            <div className="flex justify-between gap-5 mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Education
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(3) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleChange('education', index, 'school', e.target.value)}
                    placeholder="School/University"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`education-${index}-school`] ? 'border-l-4 border-red-500' : validateRequired(edu.school) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`education-${index}-school`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`education-${index}-school`]}</div>}
                  <input
                    type="text"
                    value={edu.course}
                    onChange={(e) => handleChange('education', index, 'course', e.target.value)}
                    placeholder="Course"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`education-${index}-course`] ? 'border-l-4 border-red-500' : validateRequired(edu.course) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`education-${index}-course`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`education-${index}-course`]}</div>}
                  <input
                    type="text"
                    value={edu.years}
                    onChange={(e) => handleChange('education', index, 'years', e.target.value)}
                    placeholder="Years"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`education-${index}-years`] ? 'border-l-4 border-red-500' : validateRequired(edu.years) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`education-${index}-years`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`education-${index}-years`]}</div>}
                  {resumeData.education.length > 1 && (
                    <div className="flex justify-center mt-2 animate-slideIn">
                      <Button variant="danger" onClick={() => removeItem('education', index)} className="w-24">
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-center my-4 animate-slideIn">
              <Button onClick={() => addItem('education')}>Add Education</Button>
            </div>
            <div className="flex justify-between gap-5 mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Are you a Fresher or Experienced?
            </h3>
            <div className="flex gap-5 justify-center mb-6 animate-slideIn">
              <Button onClick={() => chooseExperience(true)}>Experienced</Button>
              <Button onClick={() => chooseExperience(false)}>Fresher</Button>
            </div>
            <div className="flex justify-start mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced === false && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Any Internships or Nothing?
            </h3>
            <div className="flex gap-5 justify-center mb-6 animate-slideIn">
              <Button onClick={() => handleInternshipChoice('Internships')}>
                Internships
              </Button>
              <Button onClick={() => handleInternshipChoice('Nothing')}>
                Nothing
              </Button>
            </div>
            <div className="flex justify-start mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced === true && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Work Experience
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(5) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleChange('experience', index, 'jobTitle', e.target.value)}
                    placeholder="Job Title"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`experience-${index}-jobTitle`] ? 'border-l-4 border-red-500' : validateRequired(exp.jobTitle) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`experience-${index}-jobTitle`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`experience-${index}-jobTitle`]}</div>}
                  <input
                    type="text"
                    value={exp.employer}
                    onChange={(e) => handleChange('experience', index, 'employer', e.target.value)}
                    placeholder="Company"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`experience-${index}-employer`] ? 'border-l-4 border-red-500' : validateRequired(exp.employer) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`experience-${index}-employer`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`experience-${index}-employer`]}</div>}
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleChange('experience', index, 'position', e.target.value)}
                    placeholder="Position/Description"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`experience-${index}-position`] ? 'border-l-4 border-red-500' : validateRequired(exp.position) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`experience-${index}-position`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`experience-${index}-position`]}</div>}
                  <input
                    type="text"
                    value={exp.years}
                    onChange={(e) => handleChange('experience', index, 'years', e.target.value)}
                    placeholder="Start Year - End Year"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`experience-${index}-years`] ? 'border-l-4 border-red-500' : validateRequired(exp.years) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`experience-${index}-years`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`experience-${index}-years`]}</div>}
                  {resumeData.experience.length > 1 && (
                    <div className="flex justify-center mt-2 animate-slideIn">
                      <Button variant="danger" onClick={() => removeItem('experience', index)} className="w-24">
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-center my-4 animate-slideIn">
              <Button onClick={() => addItem('experience')}>Add Experience</Button>
            </div>
            <div className="flex justify-between gap-5 mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === 6 && resumeData.isExperienced === false && resumeData.hasInternships && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Internships
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(6) ? 'opacity-100' : 'opacity-0'}`}></div>
            {resumeData.internships.map((intern, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={intern.jobRole}
                    onChange={(e) => handleChange('internships', index, 'jobRole', e.target.value)}
                    placeholder="Job Role/Course"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`internship-${index}-jobRole`] ? 'border-l-4 border-red-500' : validateRequired(intern.jobRole) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`internship-${index}-jobRole`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`internship-${index}-jobRole`]}</div>}
                  <input
                    type="text"
                    value={intern.company}
                    onChange={(e) => handleChange('internships', index, 'company', e.target.value)}
                    placeholder="Company Name"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`internship-${index}-company`] ? 'border-l-4 border-red-500' : validateRequired(intern.company) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`internship-${index}-company`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`internship-${index}-company`]}</div>}
                  <input
                    type="text"
                    value={intern.position}
                    onChange={(e) => handleChange('internships', index, 'position', e.target.value)}
                    placeholder="Position/Description"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`internship-${index}-position`] ? 'border-l-4 border-red-500' : validateRequired(intern.position) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`internship-${index}-position`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`internship-${index}-position`]}</div>}
                  <input
                    type="text"
                    value={intern.years}
                    onChange={(e) => handleChange('internships', index, 'years', e.target.value)}
                    placeholder="Start Year - End Year"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`internship-${index}-years`] ? 'border-l-4 border-red-500' : validateRequired(intern.years) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                  />
                  {errors[`internship-${index}-years`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`internship-${index}-years`]}</div>}
                  {resumeData.internships.length > 1 && (
                    <div className="flex justify-center mt-2 animate-slideIn">
                      <Button variant="danger" onClick={() => removeItem('internships', index)} className="w-24">
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-center my-4 animate-slideIn">
              <Button onClick={() => addItem('internships')}>Add Internship</Button>
            </div>
            <div className="flex justify-between gap-5 mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Skills
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(7) ? 'opacity-100' : 'opacity-0'}`}></div>
            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <div key={category} className="mb-6">
                <h4 className="text-lg text-[#1A3559] mb-4 uppercase text-center tracking-wide">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                {skills.map((skill, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleChange('skills', index, category, e.target.value)}
                        placeholder={`Skill ${index + 1}`}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`skills-${category}-${index}`] ? 'border-l-4 border-red-500' : validateRequired(skill) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                      />
                      {errors[`skills-${category}-${index}`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`skills-${category}-${index}`]}</div>}
                      {skills.length > 1 && (
                        <div className="flex justify-center mt-2 animate-slideIn">
                          <Button variant="danger" onClick={() => removeSkill(category, index)} className="w-24">
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center my-4 animate-slideIn">
                  <Button onClick={() => addSkill(category)}>Add Skill</Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between gap-5 mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="mb-8 p-16 rounded-xl bg-white shadow-2xl animate-slideIn relative">
            <h3 className="text-2xl text-[#1A3559] mb-6 uppercase text-center tracking-wider">
              Projects
            </h3>
            <div className={`absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full transition-opacity duration-300 ${isSectionComplete(8) ? 'opacity-100' : 'opacity-0'}`}></div>
            {showDownload ? (
              <div className="text-center">
                <h4 className="text-lg text-[#1A3559] mb-4">Your resume is ready!</h4>
                <div className="flex justify-center animate-slideIn">
                  <PDFDownloadLink
                    document={<ResumePDF resumeData={resumeData} />}
                    fileName="resume.pdf"
                    className="inline-block"
                  >
                    {({ loading }) => (
                      <Button variant="success" className="w-48">
                        {loading ? 'Generating PDF...' : 'Download Resume'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
            ) : (
              <>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                        placeholder="Project Title"
                        className={`w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 ${errors[`project-${index}-title`] ? 'border-l-4 border-red-500' : validateRequired(project.title) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                      />
                      {errors[`project-${index}-title`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`project-${index}-title`]}</div>}
                      <textarea
                        value={project.description}
                        onChange={(e) => handleChange('projects', index, 'description', e.target.value)}
                        placeholder="Project Description"
                        className={`w-full px-4 py-3 h-32 rounded-lg bg-gray-100 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 resize-y ${errors[`project-${index}-description`] ? 'border-l-4 border-red-500' : validateRequired(project.description) ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 hover:shadow-md`}
                      />
                      {errors[`project-${index}-description`] && <div className="text-red-500 text-xs -mt-2 mb-2 animate-shake">{errors[`project-${index}-description`]}</div>}
                      {resumeData.projects.length > 1 && (
                        <div className="flex justify-center mt-2 animate-slideIn">
                          <Button variant="danger" onClick={() => removeItem('projects', index)} className="w-24">
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center my-4 animate-slideIn">
                  <Button onClick={() => addItem('projects')}>Add Project</Button>
                </div>
              </>
            )}
            <div className="flex justify-between gap-5 mt-5 animate-slideIn">
              <Button variant="secondary" onClick={prevStep}>Previous</Button>
              {!showDownload && (
                <Button onClick={nextStep}>Finish</Button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-[550px]">
        {areAllStepsValid() && (
          <div className="flex justify-center mb-4 animate-slideIn">
            <PDFDownloadLink
              document={<ResumePDF resumeData={resumeData} />}
              fileName="resume.pdf"
              className="inline-block"
            >
              {({ loading }) => (
                <Button variant="success" className="w-48">
                  {loading ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        )}
        <div
          className="w-[595px] min-h-[842px] p-6 border-2 border-[#1A3559] bg-white shadow-2xl box-border m-3 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)] transition-all duration-300"
          ref={resumeRef}
        >
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-[#1A3559] uppercase mb-2">
              {resumeData.header.firstName} {resumeData.header.surname}
            </h1>
            <p className="text-xl font-semibold text-[#1A3559]">
              {resumeData.header.jobTitle}
            </p>
            <div className="mt-2 text-[#1A3559] text-xs flex justify-center flex-wrap gap-4">
              <span>
                <i className="fas fa-phone text-base mr-2 align-middle"></i>
                {resumeData.header.phone}
              </span>
              <span>
                <i className="fas fa-home text-base mr-2 align-middle"></i>
                {resumeData.header.city}
              </span>
              {resumeData.header.linkedin && (
                <span>
                  <i className="fab fa-linkedin text-base mr-2 align-middle"></i>
                  {resumeData.header.linkedin}
                </span>
              )}
              <span>
                <i className="fas fa-envelope text-base mr-2 align-middle"></i>
                {resumeData.header.email}
              </span>
            </div>
          </header>
          <section className="mb-6">
            <h2 className="text-xl font-bold text-white bg-[#1A3559] p-2 text-center uppercase mb-2">
              ABOUT ME
            </h2>
            <p className="text-xs text-black leading-relaxed">
              {resumeData.about}
            </p>
          </section>
          {(resumeData.isExperienced || (resumeData.isExperienced === false && resumeData.hasInternships)) && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-white bg-[#1A3559] p-2 text-center uppercase mb-2">
                {resumeData.isExperienced ? 'WORK EXPERIENCE' : 'INTERNSHIPS'}
              </h2>
              {resumeData.isExperienced
                ? resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between text-xs text-[#1A3559]">
                        <span className="font-bold">
                          {exp.jobTitle} - {exp.employer}
                        </span>
                        <span>{exp.years}</span>
                      </div>
                      <p className="text-xs text-black mb-1">
                        {exp.position}
                      </p>
                    </div>
                  ))
                : resumeData.internships.map((intern, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between text-xs text-[#1A3559]">
                        <span className="font-bold">
                          {intern.jobRole} - {intern.company}
                        </span>
                        <span>{intern.years}</span>
                      </div>
                      <p className="text-xs text-black mb-1">
                        {intern.position}
                      </p>
                    </div>
                  ))}
            </section>
          )}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-white bg-[#1A3559] p-2 text-center uppercase mb-2">
              EDUCATION
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between text-xs text-[#1A3559]">
                  <span className="font-bold">
                    {edu.school}
                  </span>
                  <span>{edu.years}</span>
                </div>
                <p className="text-xs text-black">
                  {edu.course}
                </p>
              </div>
            ))}
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-bold text-white bg-[#1A3559] p-2 text-center uppercase mb-2">
              SKILLS
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs text-black">
              {Object.entries(resumeData.skills).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="font-semibold text-[#1A3559] mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <ul className="list-disc list-inside">
                    {skills.filter(skill => skill.trim() !== '').map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white bg-[#1A3559] p-2 text-center uppercase mb-2">
              PROJECTS
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xs font-bold text-[#1A3559]">{project.title}</h3>
                <p className="text-xs text-black">{project.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default ResumePreview1;
