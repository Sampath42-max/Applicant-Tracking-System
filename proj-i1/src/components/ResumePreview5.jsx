import React, { useState } from 'react';
import { Phone, Mail, Linkedin } from 'lucide-react';
import { Document, Page, View, Text, StyleSheet, PDFDownloadLink, Svg, Path } from '@react-pdf/renderer';

// PDF-specific styles (unchanged)
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12, color: '#333' },
  header: { textAlign: 'center', marginBottom: 20 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#1a202c' },
  jobTitle: { fontSize: 16, color: '#4a5568', marginTop: 4 },
  divider: { borderBottomWidth: 1, borderColor: '#d2d6dc', marginVertical: 12 },
  contactContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 40, 
    marginBottom: 12, 
    paddingHorizontal: 10 
  },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  contactText: { fontSize: 10, color: '#4a5568' },
  icon: { width: 14, height: 14 },
  mainContainer: { flexDirection: 'row', gap: 32 },
  leftColumn: { width: '33%', flexDirection: 'column', gap: 24 },
  rightColumn: { width: '67%', flexDirection: 'column', gap: 24 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', borderBottomWidth: 2, borderColor: '#d2d6dc', paddingBottom: 4, marginBottom: 8 },
  text: { fontSize: 10, color: '#4a5568', lineHeight: 1.5 },
  listItem: { marginBottom: 4 },
  experienceItem: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  experienceLeft: { width: '30%' },
  experienceRight: { width: '70%' },
  bold: { fontWeight: 'bold' },
});

// PDF Component with Adjusted LinkedIn Icon
const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.name}>
          {resumeData.header.firstName || 'AARYA'} {resumeData.header.surname || 'AGARWAL'}
        </Text>
        <Text style={pdfStyles.jobTitle}>{resumeData.header.jobTitle || 'Chief Executive Officer (CEO)'}</Text>
      </View>

      <View style={pdfStyles.divider} />

      {/* Contact Information with Adjusted LinkedIn Icon */}
      <View style={pdfStyles.contactContainer}>
        <View style={pdfStyles.contactItem}>
          <Svg style={pdfStyles.icon} viewBox="0 0 24 24">
            <Path
              d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z"
              fill="#4a5568"
            />
          </Svg>
          <Text style={pdfStyles.contactText}>{resumeData.header.phone || '+123-456-7890'}</Text>
        </View>
        <View style={pdfStyles.contactItem}>
          <Svg style={pdfStyles.icon} viewBox="0 0 24 24">
            <Path
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              fill="#4a5568"
            />
          </Svg>
          <Text style={pdfStyles.contactText}>{resumeData.header.email || 'hello@reallygreatsite.com'}</Text>
        </View>
        <View style={pdfStyles.contactItem}>
          <Svg style={pdfStyles.icon} viewBox="0 0 24 24">
            <Path
              d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
              fill="#4a5568"
            />
          </Svg>
          <Text style={pdfStyles.contactText}>{resumeData.header.website || 'linkedin.com/in/aarya-agarwal'}</Text>
        </View>
      </View>

      <View style={pdfStyles.divider} />

      {/* Main Content (unchanged) */}
      <View style={pdfStyles.mainContainer}>
        <View style={pdfStyles.leftColumn}>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>SUMMARY</Text>
            <Text style={pdfStyles.text}>
              {resumeData.summary || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
            </Text>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>SKILL</Text>
            {resumeData.skills.map((skill, index) =>
              skill ? (
                <Text key={index} style={[pdfStyles.text, pdfStyles.listItem]}>
                  {skill}
                </Text>
              ) : null
            ) || <Text style={pdfStyles.text}>Leadership</Text>}
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>LANGUAGE</Text>
            {resumeData.languages.map((language, index) =>
              language ? (
                <Text key={index} style={[pdfStyles.text, pdfStyles.listItem]}>
                  {language}
                </Text>
              ) : null
            ) || <Text style={pdfStyles.text}>English</Text>}
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>REFERENCES</Text>
            {resumeData.references.map((ref, index) => (
              <View key={index} style={pdfStyles.listItem}>
                <Text style={[pdfStyles.text, pdfStyles.bold]}>{ref.name || 'Aarya Agarwal'}</Text>
                <Text style={pdfStyles.text}>{ref.phone || '+123-456-7890'}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={pdfStyles.rightColumn}>
          {resumeData.isExperienced === true && resumeData.experience.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>EXPERIENCE</Text>
              {resumeData.experience.map((exp, index) => (
                <View key={index} style={pdfStyles.experienceItem}>
                  <View style={pdfStyles.experienceLeft}>
                    <Text style={[pdfStyles.text, pdfStyles.bold]}>{exp.date || '2020 – 2023'}</Text>
                    <Text style={pdfStyles.text}>{exp.company || 'Arowwal Industries'}</Text>
                  </View>
                  <View style={pdfStyles.experienceRight}>
                    <Text style={[pdfStyles.text, pdfStyles.bold]}>{exp.position || 'CEO / Founder'}</Text>
                    <Text style={pdfStyles.text}>{exp.description || 'Lorem ipsum dolor sit amet...'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          {resumeData.isExperienced === false && resumeData.hasInternships && resumeData.internships.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>INTERNSHIPS</Text>
              {resumeData.internships.map((intern, index) => (
                <View key={index} style={pdfStyles.experienceItem}>
                  <View style={pdfStyles.experienceLeft}>
                    <Text style={[pdfStyles.text, pdfStyles.bold]}>{intern.years || '2020 – 2021'}</Text>
                    <Text style={pdfStyles.text}>{intern.company || 'Tech Corp'}</Text>
                  </View>
                  <View style={pdfStyles.experienceRight}>
                    <Text style={[pdfStyles.text, pdfStyles.bold]}>{intern.jobRole || 'Software Intern'}</Text>
                    <Text style={pdfStyles.text}>{intern.position || 'Developed web applications'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>EDUCATION</Text>
            {resumeData.education.map((edu, index) => (
              <View key={index} style={pdfStyles.experienceItem}>
                <View style={pdfStyles.experienceLeft}>
                  <Text style={[pdfStyles.text, pdfStyles.bold]}>{edu.date || '2020 - 2023'}</Text>
                  <Text style={pdfStyles.text}>{edu.school || 'Wardiere University'}</Text>
                </View>
                <View style={pdfStyles.experienceRight}>
                  <Text style={[pdfStyles.text, pdfStyles.bold]}>{edu.degree || 'Master of Business Management'}</Text>
                  <Text style={pdfStyles.text}>{edu.description || 'Lorem ipsum dolor sit amet...'}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>PROJECTS</Text>
            {resumeData.projects.map((project, index) => (
              <View key={index} style={pdfStyles.experienceItem}>
                <View style={pdfStyles.experienceLeft}>
                  <Text style={[pdfStyles.text, pdfStyles.bold]}>{project.date || '2023'}</Text>
                </View>
                <View style={pdfStyles.experienceRight}>
                  <Text style={[pdfStyles.text, pdfStyles.bold]}>{project.title || 'Portfolio Website'}</Text>
                  <Text style={pdfStyles.text}>{project.description || 'Developed a responsive portfolio...'}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>AWARDS</Text>
            {resumeData.awards.map((award, index) => (
              <View key={index} style={pdfStyles.listItem}>
                <Text style={[pdfStyles.text, pdfStyles.bold]}>{award.title || 'The Best CEO of the Year'}</Text>
                <Text style={pdfStyles.text}>{award.description || 'Lorem ipsum dolor sit amet...'}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Rest of the component (unchanged)
const ResumePreview5 = () => {
  const [resumeData, setResumeData] = useState({
    header: { firstName: '', surname: '', jobTitle: '', phone: '', email: '', website: '' },
    summary: '',
    skills: [''],
    languages: [''],
    references: [{ name: '', phone: '' }],
    isExperienced: null,
    hasInternships: null,
    experience: [{ date: '', position: '', company: '', description: '' }],
    internships: [{ jobRole: '', company: '', position: '', years: '' }],
    education: [{ date: '', degree: '', school: '', description: '' }],
    projects: [{ title: '', description: '', date: '' }],
    awards: [{ title: '', description: '' }],
  });

  const [step, setStep] = useState(1);

  const handleChange = (section, index, field, value) => {
    setResumeData((prev) => {
      if (section === 'header') {
        return { ...prev, header: { ...prev.header, [field]: value } };
      } else if (section === 'summary') {
        return { ...prev, summary: value };
      } else if (section === 'skills') {
        const newSkills = [...prev.skills];
        newSkills[index] = value;
        return { ...prev, skills: newSkills };
      } else if (section === 'languages') {
        const newLanguages = [...prev.languages];
        newLanguages[index] = value;
        return { ...prev, languages: newLanguages };
      } else if (section === 'references') {
        const newReferences = [...prev.references];
        newReferences[index] = { ...newReferences[index], [field]: value };
        return { ...prev, references: newReferences };
      } else if (section === 'experience') {
        const newExperience = [...prev.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        return { ...prev, experience: newExperience };
      } else if (section === 'internships') {
        const newInternships = [...prev.internships];
        newInternships[index] = { ...newInternships[index], [field]: value };
        return { ...prev, internships: newInternships };
      } else if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        return { ...prev, education: newEducation };
      } else if (section === 'projects') {
        const newProjects = [...prev.projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        return { ...prev, projects: newProjects };
      } else if (section === 'awards') {
        const newAwards = [...prev.awards];
        newAwards[index] = { ...newAwards[index], [field]: value };
        return { ...prev, awards: newAwards };
      }
      return prev;
    });
  };

  const addItem = (section) => {
    setResumeData((prev) => ({
      ...prev,
      [section]:
        section === 'skills'
          ? [...prev.skills, '']
          : section === 'languages'
          ? [...prev.languages, '']
          : section === 'references'
          ? [...prev.references, { name: '', phone: '' }]
          : section === 'experience'
          ? [...prev.experience, { date: '', position: '', company: '', description: '' }]
          : section === 'internships'
          ? [...prev.internships, { jobRole: '', company: '', position: '', years: '' }]
          : section === 'education'
          ? [...prev.education, { date: '', degree: '', school: '', description: '' }]
          : section === 'projects'
          ? [...prev.projects, { title: '', description: '', date: '' }]
          : [...prev.awards, { title: '', description: '' }],
    }));
  };

  const removeItem = (section, index) => {
    setResumeData((prev) => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const setExperienceLevel = (isExperienced) => {
    setResumeData((prev) => ({ ...prev, isExperienced, hasInternships: isExperienced ? null : null }));
    setStep(7);
  };

  const handleInternshipChoice = (choice) => {
    setResumeData((prev) => ({
      ...prev,
      hasInternships: choice === 'Internships',
      internships: choice === 'Nothing' ? [] : prev.internships,
    }));
    if (choice === 'Nothing') setStep(9);
    else setStep(8);
  };

  const nextStep = () => {
    if (step === 1 && Object.values(resumeData.header).every((val) => val.trim() !== '')) setStep(2);
    else if (step === 2 && resumeData.summary.trim() !== '') setStep(3);
    else if (step === 3 && resumeData.skills.every((skill) => skill.trim() !== '')) setStep(4);
    else if (step === 4 && resumeData.languages.every((lang) => lang.trim() !== '')) setStep(5);
    else if (step === 5 && resumeData.references.every((ref) => ref.name.trim() !== '' && ref.phone.trim() !== '')) setStep(6);
    else if (step === 6 && resumeData.isExperienced === null) return;
    else if (step === 7 && resumeData.isExperienced === false && resumeData.hasInternships === null) return;
    else if (step === 7 && resumeData.isExperienced && resumeData.experience.every((exp) => Object.values(exp).every((val) => val.trim() !== ''))) setStep(9);
    else if (step === 8 && resumeData.isExperienced === false && resumeData.hasInternships && resumeData.internships.every((intern) => Object.values(intern).every((val) => val.trim() !== ''))) setStep(9);
    else if (step === 9 && resumeData.education.every((edu) => Object.values(edu).every((val) => val.trim() !== ''))) setStep(10);
    else if (step === 10 && resumeData.projects.every((project) => Object.values(project).every((val) => val.trim() !== ''))) setStep(11);
    else if (step === 11 && resumeData.awards.every((award) => Object.values(award).every((val) => val.trim() !== ''))) setStep(12);
    else alert('Please complete all required fields before proceeding.');
  };

  const prevStep = () => {
    if (step > 1) {
      if (step === 12) setStep(11);
      else if (step === 11) setStep(10);
      else if (step === 10) setStep(9);
      else if (step === 9) {
        if (resumeData.isExperienced) setStep(7);
        else if (resumeData.hasInternships) setStep(8);
        else if (resumeData.hasInternships === false) setStep(7);
      } else if (step === 8 && resumeData.isExperienced === false) setStep(7);
      else if (step === 7) setStep(6);
      else if (step === 6) setStep(5);
      else if (step === 5) setStep(4);
      else if (step === 4) setStep(3);
      else if (step === 3) setStep(2);
      else if (step === 2) setStep(1);
    }
  };

  return (
    <div className="resume-editor flex h-screen">
      <div className="form-side w-1/2 p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Resume</h2>

        {step === 12 && (
          <div className="mb-6">
            <PDFDownloadLink
              document={<ResumePDF resumeData={resumeData} />}
              fileName={`${resumeData.header.firstName || 'resume'}_${resumeData.header.surname || ''}_resume.pdf`}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 inline-block"
            >
              {({ loading }) => (loading ? 'Generating PDF...' : 'Download Resume as PDF')}
            </PDFDownloadLink>
          </div>
        )}

        {step === 1 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <input
              type="text"
              value={resumeData.header.firstName}
              onChange={(e) => handleChange('header', 0, 'firstName', e.target.value)}
              placeholder="First Name"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={resumeData.header.surname}
              onChange={(e) => handleChange('header', 0, 'surname', e.target.value)}
              placeholder="Surname"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={resumeData.header.jobTitle}
              onChange={(e) => handleChange('header', 0, 'jobTitle', e.target.value)}
              placeholder="Job Title"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={resumeData.header.phone}
              onChange={(e) => handleChange('header', 0, 'phone', e.target.value)}
              placeholder="Phone Number"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={resumeData.header.email}
              onChange={(e) => handleChange('header', 0, 'email', e.target.value)}
              placeholder="Email"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={resumeData.header.website}
              onChange={(e) => handleChange('header', 0, 'website', e.target.value)}
              placeholder="LinkedIn Profile"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="button-group flex justify-end mt-4">
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <textarea
              value={resumeData.summary}
              onChange={(e) => handleChange('summary', 0, 'summary', e.target.value)}
              placeholder="Write your summary..."
              className="w-full p-2 h-32 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              required
            />
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="skill-item mb-3">
                <div className="item-with-remove flex items-center">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleChange('skills', index, 'skills', e.target.value)}
                    placeholder={`Skill ${index + 1}`}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    required
                  />
                  {resumeData.skills.length > 1 && (
                    <button
                      onClick={() => removeItem('skills', index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('skills')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Skill
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Languages</h3>
            {resumeData.languages.map((language, index) => (
              <div key={index} className="language-item mb-3">
                <div className="item-with-remove flex items-center">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => handleChange('languages', index, 'languages', e.target.value)}
                    placeholder={`Language ${index + 1}`}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    required
                  />
                  {resumeData.languages.length > 1 && (
                    <button
                      onClick={() => removeItem('languages', index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('languages')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Language
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">References</h3>
            {resumeData.references.map((ref, index) => (
              <div key={index} className="reference-item mb-3">
                <div className="item-with-remove">
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => handleChange('references', index, 'name', e.target.value)}
                    placeholder="Reference Name"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={ref.phone}
                    onChange={(e) => handleChange('references', index, 'phone', e.target.value)}
                    placeholder="Reference Phone"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {resumeData.references.length > 1 && (
                    <button
                      onClick={() => removeItem('references', index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('references')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Reference
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Are you a Fresher or Experienced?</h3>
            <div className="experience-choice flex space-x-4 mb-4">
              <button
                onClick={() => setExperienceLevel(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Experienced
              </button>
              <button
                onClick={() => setExperienceLevel(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Fresher
              </button>
            </div>
            <div className="button-group flex justify-start mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
            </div>
          </div>
        )}

        {step === 7 && resumeData.isExperienced === false && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Any Internships or Nothing?</h3>
            <div className="internship-choice flex space-x-4 mb-4">
              <button
                onClick={() => handleInternshipChoice('Internships')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Internships
              </button>
              <button
                onClick={() => handleInternshipChoice('Nothing')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Nothing
              </button>
            </div>
            <div className="button-group flex justify-start mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
            </div>
          </div>
        )}

        {step === 7 && resumeData.isExperienced === true && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Work Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item mb-4">
                <div className="item-with-remove">
                  <input
                    type="text"
                    value={exp.date}
                    onChange={(e) => handleChange('experience', index, 'date', e.target.value)}
                    placeholder="Date (e.g., 2020 – 2023)"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleChange('experience', index, 'position', e.target.value)}
                    placeholder="Position"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                    placeholder="Company"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleChange('experience', index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 h-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    required
                  />
                  {resumeData.experience.length > 1 && (
                    <button
                      onClick={() => removeItem('experience', index)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('experience')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Experience
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 8 && resumeData.isExperienced === false && resumeData.hasInternships && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Internships</h3>
            {resumeData.internships.map((intern, index) => (
              <div key={index} className="internship-item mb-4">
                <div className="item-with-remove">
                  <input
                    type="text"
                    value={intern.jobRole}
                    onChange={(e) => handleChange('internships', index, 'jobRole', e.target.value)}
                    placeholder="Job Role/Course"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={intern.company}
                    onChange={(e) => handleChange('internships', index, 'company', e.target.value)}
                    placeholder="Company Name"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={intern.position}
                    onChange={(e) => handleChange('internships', index, 'position', e.target.value)}
                    placeholder="Position/Description"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={intern.years}
                    onChange={(e) => handleChange('internships', index, 'years', e.target.value)}
                    placeholder="Start Year - End Year"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {resumeData.internships.length > 1 && (
                    <button
                      onClick={() => removeItem('internships', index)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('internships')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Internship
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item mb-4">
                <div className="item-with-remove">
                  <input
                    type="text"
                    value={edu.date}
                    onChange={(e) => handleChange('education', index, 'date', e.target.value)}
                    placeholder="Date (e.g., 2020 - 2023)"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleChange('education', index, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleChange('education', index, 'school', e.target.value)}
                    placeholder="School"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    value={edu.description}
                    onChange={(e) => handleChange('education', index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 h-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    required
                  />
                  {resumeData.education.length > 1 && (
                    <button
                      onClick={() => removeItem('education', index)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('education')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Education
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 10 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Projects</h3>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="project-item mb-4">
                <div className="item-with-remove">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                    placeholder="Project Title"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    value={project.date}
                    onChange={(e) => handleChange('projects', index, 'date', e.target.value)}
                    placeholder="Date (e.g., 2023)"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => handleChange('projects', index, 'description', e.target.value)}
                    placeholder="Project Description"
                    className="w-full p-2 h-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    required
                  />
                  {resumeData.projects.length > 1 && (
                    <button
                      onClick={() => removeItem('projects', index)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('projects')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Project
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
            </div>
          </div>
        )}

        {step === 11 && (
          <div className="form-section mb-6">
            <h3 className="text-lg font-semibold mb-3">Awards</h3>
            {resumeData.awards.map((award, index) => (
              <div key={index} className="award-item mb-4">
                <div className="item-with-remove">
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => handleChange('awards', index, 'title', e.target.value)}
                    placeholder="Award Title"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    value={award.description}
                    onChange={(e) => handleChange('awards', index, 'description', e.target.value)}
                    placeholder="Award Description"
                    className="w-full p-2 h-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    required
                  />
                  {resumeData.awards.length > 1 && (
                    <button
                      onClick={() => removeItem('awards', index)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('awards')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Award
            </button>
            <div className="button-group flex justify-between mt-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Finish</button>
            </div>
          </div>
        )}
      </div>

      <div className="preview-side w-1/2 p-5 overflow-y-auto bg-gray-100">
        <div className="max-w-5xl mx-auto p-8 bg-white shadow-md">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold tracking-wider text-gray-900 mb-2">
              {resumeData.header.firstName || 'AARYA'} {resumeData.header.surname || 'AGARWAL'}
            </h1>
            <p className="text-xl text-gray-700">{resumeData.header.jobTitle || 'Chief Executive Officer (CEO)'}</p>
          </header>

          <div className="border-t border-gray-300 my-4"></div>

          <div className="flex justify-center items-center space-x-12 mb-4 px-4">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-gray-700" />
              <span>{resumeData.header.phone || '+123-456-7890'}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-gray-700" />
              <span>{resumeData.header.email || 'hello@reallygreatsite.com'}</span>
            </div>
            <div className="flex items-center">
              <Linkedin className="w-5 h-5 mr-3 text-gray-700" />
              <span>{resumeData.header.website || 'linkedin.com/in/aarya-agarwal'}</span>
            </div>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">SUMMARY</h2>
                <p className="text-sm text-gray-700">
                  {resumeData.summary || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">SKILL</h2>
                <ul className="text-sm text-gray-700 space-y-2">
                  {resumeData.skills.map((skill, index) => skill && <li key={index}>{skill}</li>) || <li>Leadership</li>}
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">LANGUAGE</h2>
                <ul className="text-sm text-gray-700 space-y-2">
                  {resumeData.languages.map((language, index) => language && <li key={index}>{language}</li>) || <li>English</li>}
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">REFERENCES</h2>
                <div className="space-y-3 text-sm">
                  {resumeData.references.map((ref, index) => (
                    <div key={index}>
                      <p className="font-semibold">{ref.name || 'Aarya Agarwal'}</p>
                      <p>{ref.phone || '+123-456-7890'}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="md:col-span-2 space-y-8">
              {resumeData.isExperienced === true && resumeData.experience.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">EXPERIENCE</h2>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="font-semibold">{exp.date || '2020 – 2023'}</p>
                          <p>{exp.company || 'Arowwal Industries'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-semibold">{exp.position || 'CEO / Founder'}</p>
                          <p className="text-sm text-gray-700">
                            {exp.description || 'Lorem ipsum dolor sit amet...'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {resumeData.isExperienced === false && resumeData.hasInternships && resumeData.internships.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">INTERNSHIPS</h2>
                  <div className="space-y-6">
                    {resumeData.internships.map((intern, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="font-semibold">{intern.years || '2020 – 2021'}</p>
                          <p>{intern.company || 'Tech Corp'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-semibold">{intern.jobRole || 'Software Intern'}</p>
                          <p className="text-sm text-gray-700">
                            {intern.position || 'Developed web applications'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">EDUCATION</h2>
                <div className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="font-semibold">{edu.date || '2020 - 2023'}</p>
                        <p>{edu.school || 'Wardiere University'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold">{edu.degree || 'Master of Business Management'}</p>
                        <p className="text-sm text-gray-700">
                          {edu.description || 'Lorem ipsum dolor sit amet...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">PROJECTS</h2>
                <div className="space-y-6">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="font-semibold">{project.date || '2023'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold">{project.title || 'Portfolio Website'}</p>
                        <p className="text-sm text-gray-700">
                          {project.description || 'Developed a responsive portfolio...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-4">AWARDS</h2>
                <div>
                  {resumeData.awards.map((award, index) => (
                    <div key={index}>
                      <p className="font-semibold">{award.title || 'The Best CEO of the Year'}</p>
                      <p className="text-sm text-gray-700">
                        {award.description || 'Lorem ipsum dolor sit amet...'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview5;