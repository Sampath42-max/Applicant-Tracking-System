import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Svg, Path, Link } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#1F2937', // Tailwind gray-900
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottom: '1pt solid #D1D5DB', // Tailwind gray-300
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  link: {
    color: '#2563EB', // Tailwind blue-600
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #D1D5DB',
    paddingBottom: 4,
    marginBottom: 8,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  educationLeft: {
    flexDirection: 'column',
  },
  educationRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  list: {
    paddingLeft: 20,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    marginRight: 8,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});

// PDF Document Component
const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>
            {resumeData.header.firstName || 'FULL'} {resumeData.header.surname || 'NAME'}
          </Text>
          <View style={styles.contactItem}>
            <Svg style={styles.icon} viewBox="0 0 24 24">
              <Path
                d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z"
                fill="#1F2937"
              />
            </Svg>
            <Text>{resumeData.header.phone || '1723.456-764'}</Text>
          </View>
          <View style={styles.contactItem}>
            <Svg style={styles.icon} viewBox="0 0 24 24">
              <Path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                fill="#1F2937"
              />
            </Svg>
            <Link src={`mailto:${resumeData.header.email || 'email@domain.com'}`} style={styles.link}>
              <Text>{resumeData.header.email || 'email@domain.com'}</Text>
            </Link>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.contactItem}>
            <Svg style={styles.icon} viewBox="0 0 24 24">
              <Path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                fill="#1F2937"
              />
            </Svg>
            <Link src={resumeData.header.github || '#'} style={styles.link}>
              <Text>{resumeData.header.github || 'github.com/username'}</Text>
            </Link>
          </View>
          <View style={styles.contactItem}>
            <Svg style={styles.icon} viewBox="0 0 24 24">
              <Path
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                fill="#1F2937"
              />
            </Svg>
            <Link src={resumeData.header.linkedin || '#'} style={styles.link}>
              <Text>{resumeData.header.linkedin || 'linkedin.com/in/username'}</Text>
            </Link>
          </View>
        </View>
      </View>

      {/* Profile (About Me) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text>{resumeData.header.aboutMe || 'A brief summary of your skills and goals.'}</Text>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {resumeData.education.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <View style={styles.educationLeft}>
              <Text style={styles.bold}>{edu.degree || 'Degree'}</Text>
              <Text>{edu.institution || 'Institution'}</Text>
            </View>
            <View style={styles.educationRight}>
              <Text>Location: {edu.location || 'Location'}</Text>
              <Text>{edu.period || 'Period'}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Skills Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills Summary</Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text>Languages: {resumeData.skills.languages || 'Python, R, SQL'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text>Libraries: {resumeData.skills.frameworks || 'NumPy, Pandas, Scikit-learn, TensorFlow'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text>Tools: {resumeData.skills.tools || 'Excel, Power BI, SQL, MATLAB, SAP ERP'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text>Platforms: {resumeData.skills.platforms || 'PyCharm, Jupyter Notebook'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text>Concepts: {resumeData.skills.softSkills || 'Predictive Modeling, Data Visualization, Regression Analysis'}</Text>
          </View>
        </View>
      </View>

      {/* Work Experience / Internship */}
      {(resumeData.hasWorkExperience || resumeData.hasInternship) && resumeData.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{resumeData.hasWorkExperience ? 'Work Experience' : 'Internship'}</Text>
          {resumeData.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.bold}>{exp.position || 'Position'} ({exp.company || 'Company'})</Text>
                <Text style={styles.italic}>{exp.period || 'Period'}</Text>
              </View>
              <View style={styles.list}>
                {exp.responsibilities.map((resp, subIndex) => (
                  <View key={subIndex} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>{resp || 'Responsibility'}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {resumeData.projects.map((project, index) => (
          <View key={index} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.bold}>{project.title || 'Project Title'}</Text>
              <Text style={styles.italic}>{project.period || 'Period'}</Text>
            </View>
            <View style={styles.list}>
              {project.details.map((detail, subIndex) => (
                <View key={subIndex} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text>{detail || 'Detail'}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        <View style={styles.list}>
          {resumeData.certificates.map((cert, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <View>
                <Text style={styles.bold}>{cert.title || 'Certificate Title'} – {cert.date || 'Date'}</Text>
                <View style={styles.list}>
                  {cert.details.map((detail, subIndex) => (
                    <View key={subIndex} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text>{detail || 'Detail'}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const ResumePreview7 = () => {
  const [resumeData, setResumeData] = useState({
    header: {
      firstName: '',
      surname: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      aboutMe: '',
    },
    education: [{ institution: '', period: '', degree: '', location: '' }],
    skills: { languages: '', frameworks: '', tools: '', platforms: '', softSkills: '' },
    hasWorkExperience: null,
    hasInternship: null,
    experience: [],
    projects: [{ title: '', period: '', details: [''] }],
    certificates: [{ title: '', date: '', details: [''] }],
  });

  const [step, setStep] = useState(1);

  const handleChange = (section, index, field, value, subIndex) => {
    setResumeData((prev) => {
      if (section === 'header') {
        return { ...prev, header: { ...prev.header, [field]: value } };
      } else if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        return { ...prev, education: newEducation };
      } else if (section === 'skills') {
        return { ...prev, skills: { ...prev.skills, [field]: value } };
      } else if (section === 'experience') {
        const newExperience = [...prev.experience];
        if (field === 'responsibilities') {
          newExperience[index].responsibilities[subIndex] = value;
        } else {
          newExperience[index] = { ...newExperience[index], [field]: value };
        }
        return { ...prev, experience: newExperience };
      } else if (section === 'projects') {
        const newProjects = [...prev.projects];
        if (field === 'details') {
          newProjects[index].details[subIndex] = value;
        } else {
          newProjects[index] = { ...newProjects[index], [field]: value };
        }
        return { ...prev, projects: newProjects };
      } else if (section === 'certificates') {
        const newCertificates = [...prev.certificates];
        if (field === 'details') {
          newCertificates[index].details[subIndex] = value;
        } else {
          newCertificates[index] = { ...newCertificates[index], [field]: value };
        }
        return { ...prev, certificates: newCertificates };
      } else if (section === 'hasWorkExperience') {
        return { ...prev, hasWorkExperience: value, hasInternship: null, experience: [] };
      } else if (section === 'hasInternship') {
        return { ...prev, hasInternship: value, experience: [] };
      }
      return prev;
    });
  };

  const addItem = (section, index) => {
    setResumeData((prev) => {
      if (section === 'education') {
        return { ...prev, education: [...prev.education, { institution: '', period: '', degree: '', location: '' }] };
      } else if (section === 'experience') {
        if (index !== undefined) {
          const newExperience = [...prev.experience];
          newExperience[index].responsibilities.push('');
          return { ...prev, experience: newExperience };
        }
        return { ...prev, experience: [...prev.experience, { position: '', company: '', period: '', responsibilities: [''] }] };
      } else if (section === 'projects') {
        if (index !== undefined) {
          const newProjects = [...prev.projects];
          newProjects[index].details.push('');
          return { ...prev, projects: newProjects };
        }
        return { ...prev, projects: [...prev.projects, { title: '', period: '', details: [''] }] };
      } else if (section === 'certificates') {
        if (index !== undefined) {
          const newCertificates = [...prev.certificates];
          newCertificates[index].details.push('');
          return { ...prev, certificates: newCertificates };
        }
        return { ...prev, certificates: [...prev.certificates, { title: '', date: '', details: [''] }] };
      }
      return prev;
    });
  };

  const removeItem = (section, index, subIndex) => {
    setResumeData((prev) => {
      if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation.splice(index, 1);
        return { ...prev, education: newEducation };
      } else if (section === 'experience') {
        if (subIndex !== undefined) {
          const newExperience = [...prev.experience];
          newExperience[index].responsibilities.splice(subIndex, 1);
          return { ...prev, experience: newExperience };
        }
        const newExperience = [...prev.experience];
        newExperience.splice(index, 1);
        return { ...prev, experience: newExperience };
      } else if (section === 'projects') {
        if (subIndex !== undefined) {
          const newProjects = [...prev.projects];
          newProjects[index].details.splice(subIndex, 1);
          return { ...prev, projects: newProjects };
        }
        const newProjects = [...prev.projects];
        newProjects.splice(index, 1);
        return { ...prev, projects: newProjects };
      } else if (section === 'certificates') {
        if (subIndex !== undefined) {
          const newCertificates = [...prev.certificates];
          newCertificates[index].details.splice(subIndex, 1);
          return { ...prev, certificates: newCertificates };
        }
        const newCertificates = [...prev.certificates];
        newCertificates.splice(index, 1);
        return { ...prev, certificates: newCertificates };
      }
      return prev;
    });
  };

  const nextStep = () => {
    let errors = [];

    if (step === 1) {
      const { firstName, surname, email, phone, linkedin, github } = resumeData.header;
      if (!firstName.trim()) errors.push('First Name');
      if (!surname.trim()) errors.push('Surname');
      if (!email.trim()) errors.push('Email');
      if (!phone.trim()) errors.push('Phone Number');
      if (!linkedin.trim()) errors.push('LinkedIn URL');
      if (!github.trim()) errors.push('GitHub URL');
      if (errors.length === 0) {
        setStep(2);
        return;
      }
    } else if (step === 2) {
      if (resumeData.header.aboutMe.trim()) {
        setStep(3);
        return;
      } else {
        errors.push('About Me');
      }
    } else if (step === 3) {
      const valid = resumeData.education.every((edu) => {
        if (!edu.institution.trim()) errors.push(`Education ${edu.institution || 'entry'} Institution`);
        if (!edu.period.trim()) errors.push(`Education ${edu.institution || 'entry'} Period`);
        if (!edu.degree.trim()) errors.push(`Education ${edu.institution || 'entry'} Degree`);
        return edu.institution.trim() && edu.period.trim() && edu.degree.trim();
      });
      if (valid) {
        setStep(4);
        return;
      }
    } else if (step === 4) {
      const { languages, frameworks, tools, platforms, softSkills } = resumeData.skills;
      if (!languages.trim()) errors.push('Languages');
      if (!frameworks.trim()) errors.push('Libraries');
      if (!tools.trim()) errors.push('Tools');
      if (!platforms.trim()) errors.push('Platforms');
      if (!softSkills.trim()) errors.push('Concepts');
      if (errors.length === 0) {
        setStep(5);
        return;
      }
    } else if (step === 5) {
      if (resumeData.hasWorkExperience !== null) {
        if (resumeData.hasWorkExperience) setStep(6);
        else setStep(7);
        return;
      } else {
        errors.push('Work Experience choice');
      }
    } else if (step === 6) {
      if (resumeData.experience.length === 0) {
        setStep(8); // Allow skipping experience
        return;
      }
      const valid = resumeData.experience.every((exp, idx) => {
        if (!exp.position.trim()) errors.push(`Experience ${idx + 1} Position`);
        if (!exp.company.trim()) errors.push(`Experience ${idx + 1} Company`);
        if (!exp.period.trim()) errors.push(`Experience ${idx + 1} Period`);
        const validResponsibilities = exp.responsibilities.filter((resp) => resp.trim()).length > 0;
        if (!validResponsibilities) errors.push(`Experience ${idx + 1} Responsibilities`);
        return exp.position.trim() && exp.company.trim() && exp.period.trim() && validResponsibilities;
      });
      if (valid) {
        setStep(8);
        return;
      }
    } else if (step === 7) {
      if (resumeData.hasInternship !== null) {
        if (resumeData.hasInternship) setStep(6);
        else setStep(8);
        return;
      } else {
        errors.push('Internship choice');
      }
    } else if (step === 8) {
      const valid = resumeData.projects.every((proj, idx) => {
        if (!proj.title.trim()) errors.push(`Project ${idx + 1} Title`);
        if (!proj.period.trim()) errors.push(`Project ${idx + 1} Period`);
        const validDetails = proj.details.filter((detail) => detail.trim()).length > 0;
        if (!validDetails) errors.push(`Project ${idx + 1} Details`);
        return proj.title.trim() && proj.period.trim() && validDetails;
      });
      if (valid) {
        setStep(9);
        return;
      }
    } else if (step === 9) {
      const valid = resumeData.certificates.every((cert, idx) => {
        if (!cert.title.trim()) errors.push(`Certificate ${idx + 1} Title`);
        if (!cert.date.trim()) errors.push(`Certificate ${idx + 1} Date`);
        const validDetails = cert.details.filter((detail) => detail.trim()).length > 0;
        if (!validDetails) errors.push(`Certificate ${idx + 1} Details`);
        return cert.title.trim() && cert.date.trim() && validDetails;
      });
      if (valid) {
        setStep(10);
        return;
      }
    }

    console.log('Validation errors:', errors);
    alert(`Please complete the following required fields: ${errors.join(', ')}`);
  };

  const prevStep = () => {
    if (step > 1) {
      if (step === 6 && !resumeData.hasWorkExperience && resumeData.hasInternship) setStep(7);
      else if (step === 8 && !resumeData.hasWorkExperience && !resumeData.hasInternship) setStep(7);
      else setStep(step - 1);
    }
  };

  // Professional white-based Tailwind CSS classes for inputs and textarea
  const professionalInputClasses = 'w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out hover:border-gray-400 placeholder-gray-400 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed';
  const professionalTextareaClasses = 'w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out hover:border-gray-400 placeholder-gray-400 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y';

  return (
    <div className="resume-editor flex flex-col md:flex-row min-h-screen">
      <div className="form-side w-full md:w-1/2 p-6 bg-white text-gray-900 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Resume</h2>

        {step === 1 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <input
              type="text"
              value={resumeData.header.firstName}
              onChange={(e) => handleChange('header', 0, 'firstName', e.target.value)}
              placeholder="First Name"
              className={professionalInputClasses}
              required
            />
            <input
              type="text"
              value={resumeData.header.surname}
              onChange={(e) => handleChange('header', 0, 'surname', e.target.value)}
              placeholder="Surname"
              className={professionalInputClasses}
              required
            />
            <input
              type="email"
              value={resumeData.header.email}
              onChange={(e) => handleChange('header', 0, 'email', e.target.value)}
              placeholder="Email"
              className={professionalInputClasses}
              required
            />
            <input
              type="tel"
              value={resumeData.header.phone}
              onChange={(e) => handleChange('header', 0, 'phone', e.target.value)}
              placeholder="Phone Number"
              className={professionalInputClasses}
              required
            />
            <input
              type="url"
              value={resumeData.header.linkedin}
              onChange={(e) => handleChange('header', 0, 'linkedin', e.target.value)}
              placeholder="LinkedIn URL"
              className={professionalInputClasses}
              required
            />
            <input
              type="url"
              value={resumeData.header.github}
              onChange={(e) => handleChange('header', 0, 'github', e.target.value)}
              placeholder="GitHub URL"
              className={professionalInputClasses}
              required
            />
            <div className="button-group flex justify-end mt-6">
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">About Me</h3>
            <textarea
              value={resumeData.header.aboutMe}
              onChange={(e) => handleChange('header', 0, 'aboutMe', e.target.value)}
              placeholder="A brief summary of your skills and goals (2-3 sentences)."
              className={professionalTextareaClasses}
              rows={4}
              required
            />
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item mb-6">
                <div className="item-with-remove">
                  <div className="item-content space-y-3">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleChange('education', index, 'institution', e.target.value)}
                      placeholder="Institution"
                      className={professionalInputClasses}
                      required
                    />
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleChange('education', index, 'period', e.target.value)}
                      placeholder="Period (e.g., June 2022 - August 2024)"
                      className={professionalInputClasses}
                      required
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleChange('education', index, 'degree', e.target.value)}
                      placeholder="Degree"
                      className={professionalInputClasses}
                      required
                    />
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => handleChange('education', index, 'location', e.target.value)}
                      placeholder="Location (optional)"
                      className={professionalInputClasses}
                    />
                  </div>
                  {resumeData.education.length > 1 && (
                    <button
                      className="mt-3 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                      onClick={() => removeItem('education', index)}
                    >
                      Remove Education
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('education')}
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 mb-4"
            >
              Add Education
            </button>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">Skills Summary</h3>
            <div className="skill-item mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Languages:</label>
              <input
                type="text"
                value={resumeData.skills.languages}
                onChange={(e) => handleChange('skills', 0, 'languages', e.target.value)}
                placeholder="Languages (e.g., Python, SQL, JAVA)"
                className={professionalInputClasses}
                required
              />
            </div>
            <div className="skill-item mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Libraries:</label>
              <input
                type="text"
                value={resumeData.skills.frameworks}
                onChange={(e) => handleChange('skills', 0, 'frameworks', e.target.value)}
                placeholder="Libraries (e.g., Pandas, Numpy)"
                className={professionalInputClasses}
                required
              />
            </div>
            <div className="skill-item mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Tools:</label>
              <input
                type="text"
                value={resumeData.skills.tools}
                onChange={(e) => handleChange('skills', 0, 'tools', e.target.value)}
                placeholder="Tools (e.g., PowerBI, Excel)"
                className={professionalInputClasses}
                required
              />
            </div>
            <div className="skill-item mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Platforms:</label>
              <input
                type="text"
                value={resumeData.skills.platforms}
                onChange={(e) => handleChange('skills', 0, 'platforms', e.target.value)}
                placeholder="Platforms (e.g., PyCharm, Jupyter Notebook)"
                className={professionalInputClasses}
                required
              />
            </div>
            <div className="skill-item mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Concepts:</label>
              <input
                type="text"
                value={resumeData.skills.softSkills}
                onChange={(e) => handleChange('skills', 0, 'softSkills', e.target.value)}
                placeholder="Concepts (e.g., Data Visualization, Agile)"
                className={professionalInputClasses}
                required
              />
            </div>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">Do you have work experience?</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  handleChange('hasWorkExperience', 0, 'hasWorkExperience', true);
                  setStep(6);
                }}
                className={`px-6 py-2 rounded-md shadow-md ${
                  resumeData.hasWorkExperience === true ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-700 hover:text-white transition-colors duration-200`}
              >
                Yes
              </button>
              <button
                onClick={() => handleChange('hasWorkExperience', 0, 'hasWorkExperience', false)}
                className={`px-6 py-2 rounded-md shadow-md ${
                  resumeData.hasWorkExperience === false ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-700 hover:text-white transition-colors duration-200`}
              >
                No (Fresher)
              </button>
            </div>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">{resumeData.hasWorkExperience ? 'Work Experience' : 'Internship'}</h3>
            {resumeData.experience.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <div key={index} className="experience-item mb-6">
                  <div className="item-with-remove">
                    <div className="item-content space-y-3">
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleChange('experience', index, 'position', e.target.value)}
                        placeholder="Position"
                        className={professionalInputClasses}
                        required
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                        placeholder="Company"
                        className={professionalInputClasses}
                        required
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleChange('experience', index, 'period', e.target.value)}
                        placeholder="Period (e.g., March 2022 – August 2022)"
                        className={professionalInputClasses}
                        required
                      />
                      <h4 className="mt-2 text-gray-700 font-medium">Responsibilities:</h4>
                      {exp.responsibilities.map((responsibility, subIndex) => (
                        <div key={subIndex} className="item-with-remove flex items-center mb-3">
                          <input
                            type="text"
                            value={responsibility}
                            onChange={(e) => handleChange('experience', index, 'responsibilities', e.target.value, subIndex)}
                            placeholder={`Responsibility ${subIndex + 1}`}
                            className={professionalInputClasses}
                            required
                          />
                          {exp.responsibilities.length > 1 && (
                            <button
                              className="ml-3 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                              onClick={() => removeItem('experience', index, subIndex)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addItem('experience', index)}
                        className="bg-green-600 text-white px-4 py-1 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200"
                      >
                        Add Responsibility
                      </button>
                    </div>
                    <button
                      className="mt-3 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                      onClick={() => removeItem('experience', index)}
                    >
                      Remove {resumeData.hasWorkExperience ? 'Work Experience' : 'Internship'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No {resumeData.hasWorkExperience ? 'work experience' : 'internships'} added.</p>
            )}
            <button
              onClick={() => addItem('experience')}
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 mb-4"
            >
              Add {resumeData.hasWorkExperience ? 'Work Experience' : 'Internship'}
            </button>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 7 && !resumeData.hasWorkExperience && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">As a fresher, do you have internship experience?</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleChange('hasInternship', 0, 'hasInternship', true)}
                className={`px-6 py-2 rounded-md shadow-md ${
                  resumeData.hasInternship === true ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-700 hover:text-white transition-colors duration-200`}
              >
                Yes
              </button>
              <button
                onClick={() => handleChange('hasInternship', 0, 'hasInternship', false)}
                className={`px-6 py-2 rounded-md shadow-md ${
                  resumeData.hasInternship === false ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-700 hover:text-white transition-colors duration-200`}
              >
                No
              </button>
            </div>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="project-item mb-6">
                <div className="item-with-remove">
                  <div className="item-content space-y-3">
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                      placeholder="Project Title"
                      className={professionalInputClasses}
                      required
                    />
                    <input
                      type="text"
                      value={project.period}
                      onChange={(e) => handleChange('projects', index, 'period', e.target.value)}
                      placeholder="Period (e.g., December 2023 – February 2024)"
                      className={professionalInputClasses}
                      required
                    />
                    <h4 className="mt-2 text-gray-700 font-medium">Details:</h4>
                    {project.details.map((detail, subIndex) => (
                      <div key={subIndex} className="item-with-remove flex items-center mb-3">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => handleChange('projects', index, 'details', e.target.value, subIndex)}
                          placeholder={`Detail ${subIndex + 1}`}
                          className={professionalInputClasses}
                          required
                        />
                        {project.details.length > 1 && (
                          <button
                            className="ml-3 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                            onClick={() => removeItem('projects', index, subIndex)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem('projects', index)}
                      className="bg-green-600 text-white px-4 py-1 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Add Detail
                    </button>
                  </div>
                  {resumeData.projects.length > 1 && (
                    <button
                      className="mt-3 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                      onClick={() => removeItem('projects', index)}
                    >
                      Remove Project
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('projects')}
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 mb-4"
            >
              Add Project
            </button>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">Certificates</h3>
            {resumeData.certificates.map((cert, index) => (
              <div key={index} className="certificate-item mb-6">
                <div className="item-with-remove">
                  <div className="item-content space-y-3">
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => handleChange('certificates', index, 'title', e.target.value)}
                      placeholder="Certificate Title"
                      className={professionalInputClasses}
                      required
                    />
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => handleChange('certificates', index, 'date', e.target.value)}
                      placeholder="Date (e.g., March 2023)"
                      className={professionalInputClasses}
                      required
                    />
                    <h4 className="mt-2 text-gray-700 font-medium">Details:</h4>
                    {cert.details.map((detail, subIndex) => (
                      <div key={subIndex} className="item-with-remove flex items-center mb-3">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => handleChange('certificates', index, 'details', e.target.value, subIndex)}
                          placeholder={`Detail ${subIndex + 1}`}
                          className={professionalInputClasses}
                          required
                        />
                        {cert.details.length > 1 && (
                          <button
                            className="ml-3 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                            onClick={() => removeItem('certificates', index, subIndex)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem('certificates', index)}
                      className="bg-green-600 text-white px-4 py-1 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Add Detail
                    </button>
                  </div>
                  {resumeData.certificates.length > 1 && (
                    <button
                      className="mt-3 text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                      onClick={() => removeItem('certificates', index)}
                    >
                      Remove Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('certificates')}
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 mb-4"
            >
              Add Certificate
            </button>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Finish
              </button>
            </div>
          </div>
        )}

        {step === 10 && (
          <div className="form-section space-y-4">
            <h3 className="text-xl font-semibold mb-2">Resume Complete!</h3>
            <p className="text-gray-600">Your resume is ready. Review it on the right side and download as PDF.</p>
            <div className="button-group flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
              <PDFDownloadLink
                document={<ResumePDF resumeData={resumeData} />}
                fileName={`${resumeData.header.firstName}_${resumeData.header.surname}_Resume.pdf`}
                className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </div>

      <div className="preview-side w-full md:w-1/2 bg-gray-100 text-gray-900 p-8 font-sans overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          {/* Header */}
          <header className="flex justify-between items-start pb-6 border-b border-gray-300">
            <div>
              <h1 className="text-4xl font-bold">
                {resumeData.header.firstName || 'FULL'} {resumeData.header.surname || 'NAME'}
              </h1>
              <p className="flex items-center mt-2">
                <Phone size={16} className="mr-2" />
                {resumeData.header.phone || '1723.456-764'}
              </p>
              <p className="flex items-center mt-1">
                <Mail size={16} className="mr-2" />
                <a href={`mailto:${resumeData.header.email || 'email@domain.com'}`} className="text-blue-600 underline">
                  {resumeData.header.email || 'email@domain.com'}
                </a>
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end mt-2">
                <Github size={16} className="mr-2" />
                <a href={resumeData.header.github || '#'} className="text-blue-600 underline">
                  {resumeData.header.github || 'github.com/username'}
                </a>
              </p>
              <p className="flex items-center justify-end mt-1">
                <Linkedin size={16} className="mr-2" />
                <a href={resumeData.header.linkedin || '#'} className="text-blue-600 underline">
                  {resumeData.header.linkedin || 'linkedin.com/in/username'}
                </a>
              </p>
            </div>
          </header>

          {/* Profile (About Me) */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold uppercase text-blue-600 mb-2 border-b border-gray-300 pb-1">Profile</h2>
            <p className="text-gray-900">{resumeData.header.aboutMe || 'A brief summary of your skills and goals.'}</p>
          </section>

          {/* Education */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold uppercase text-blue-600 mb-2 border-b border-gray-300 pb-1">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4 flex justify-between">
                <div>
                  <p className="font-bold">{edu.degree || 'Degree'}</p>
                  <p>{edu.institution || 'Institution'}</p>
                </div>
                <div className="text-right">
                  <p>Location: {edu.location || 'Location'}</p>
                  <p>{edu.period || 'Period'}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Skills Summary */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold uppercase text-blue-600 mb-2 border-b border-gray-300 pb-1">Skills Summary</h2>
            <ul className="list-disc pl-5 text-gray-900">
              <li>Languages: {resumeData.skills.languages || 'Python, R, SQL'}</li>
              <li>Libraries: {resumeData.skills.frameworks || 'NumPy, Pandas, Scikit-learn, TensorFlow'}</li>
              <li>Tools: {resumeData.skills.tools || 'Excel, Power BI, SQL, MATLAB, SAP ERP'}</li>
              <li>Platforms: {resumeData.skills.platforms || 'PyCharm, Jupyter Notebook'}</li>
              <li>Concepts: {resumeData.skills.softSkills || 'Predictive Modeling, Data Visualization, Regression Analysis'}</li>
            </ul>
          </section>

          {/* Work Experience / Internship */}
          {(resumeData.hasWorkExperience || resumeData.hasInternship) && resumeData.experience.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold uppercase text-blue-600 mb-2 border-b border-gray-300 pb-1">
                {resumeData.hasWorkExperience ? 'Work Experience' : 'Internship'}
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{exp.position || 'Position'} ({exp.company || 'Company'})</h3>
                    <p className="italic">{exp.period || 'Period'}</p>
                  </div>
                  <ul className="list-disc pl-5 mt-2 text-gray-900">
                    {exp.responsibilities.map((resp, subIndex) => (
                      <li key={subIndex}>{resp || 'Responsibility'}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold uppercase text-blue-600 mb-2 border-b border-gray-300 pb-1">Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{project.title || 'Project Title'}</h3>
                  <p className="italic">{project.period || 'Period'}</p>
                </div>
                <ul className="list-disc pl-5 mt-2 text-gray-900">
                  {project.details.map((detail, subIndex) => (
                    <li key={subIndex}>{detail || 'Detail'}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Certifications */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold uppercase text-blue-600 mb-2 border-b border-gray-300 pb-1">Certifications</h2>
            <ul className="list-disc pl-5 text-gray-900">
              {resumeData.certificates.map((cert, index) => (
                <li key={index} className="mb-2">
                  <p className="font-bold">{cert.title || 'Certificate Title'} – {cert.date || 'Date'}</p>
                  <ul className="list-disc pl-5 mt-1">
                    {cert.details.map((detail, subIndex) => (
                      <li key={subIndex}>{detail || 'Detail'}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview7;