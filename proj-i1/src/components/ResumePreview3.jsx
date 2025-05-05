import React, { useState } from 'react';
import { Smartphone, Mail, Linkedin, MapPin } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  contact: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#666',
  },
  contactItem: {
    marginRight: 15,
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: 5,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  item: {
    marginBottom: 5,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemPeriod: {
    fontSize: 10,
    color: '#666',
    marginLeft: 10,
  },
  itemDescription: {
    fontSize: 10,
    marginTop: 5,
    marginLeft: 10,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    fontSize: 10,
    marginRight: 15,
    marginBottom: 5,
  },
  bulletList: {
    marginLeft: 20,
    marginTop: 5,
  },
  bulletText: {
    fontSize: 10,
    marginBottom: 3,
  },
});

// PDF Document Component
const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{resumeData.personalInfo.name || 'SEEMA CHAUDHRY'}</Text>
        <Text style={styles.title}>{resumeData.personalInfo.title || 'Graphic Designer'}</Text>
        <View style={styles.contact}>
          <Text style={styles.contactItem}>📞 {resumeData.personalInfo.phone || '+123-456-7890'}</Text>
          <Text style={styles.contactItem}>📍 {resumeData.personalInfo.address || '123 Anywhere St., Any City'}</Text>
          <Text style={styles.contactItem}>🌐 {resumeData.personalInfo.website || 'www.reallygreatsite.com'}</Text>
          <Text style={styles.contactItem}>📧 {resumeData.personalInfo.email || 'hello@reallygreatsite.com'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.itemDescription}>{resumeData.about || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {resumeData.education.map((edu, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{edu.school || 'RIMBERIO UNIVERSITY'}</Text>
            <Text style={styles.itemPeriod}>{edu.period.replace('-', ' – ') || '2019-2023'}</Text>
            <Text style={styles.itemDescription}>{edu.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skill</Text>
        <View style={styles.skills}>
          {resumeData.skills
            .filter((skill) => skill)
            .map((skill, index) => (
              <Text key={index} style={styles.skill}>
                • {skill}
              </Text>
            ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Experience</Text>
        {resumeData.isExperienced && resumeData.experience.map((exp, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{exp.company || 'Aldenaire & Partners - Graphic Designer'}</Text>
            <Text style={styles.itemPeriod}>{exp.period.replace('-', ' – ') || '2024-NOW'}</Text>
            <View style={styles.bulletList}>
              {exp.description.map((desc, i) => (
                <Text key={i} style={styles.bulletText}>
                  • {desc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const ResumePreview3 = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: { name: '', title: '', phone: '', address: '', website: '', email: '' },
    about: '',
    education: [{ school: '', period: '', description: '' }],
    skills: [''],
    projects: [{ title: '', period: '', description: [''] }],
    certifications: [{ title: '', period: '', description: '' }],
    isExperienced: null,
    hasInternships: null,
    experience: [{ company: '', period: '', description: [''] }],
    internships: [{ company: '', period: '', description: [''] }],
  });

  const [step, setStep] = useState(1);

  const handleChange = (section, index, field, value, descIndex = null) => {
    setResumeData((prev) => {
      if (section === 'personalInfo') {
        return { ...prev, personalInfo: { ...prev.personalInfo, [field]: value } };
      }
      if (section === 'about') {
        return { ...prev, about: value };
      }
      if (section === 'skills') {
        const newSkills = [...prev.skills];
        newSkills[index] = value;
        return { ...prev, skills: newSkills };
      }
      if (section === 'experience' || section === 'internships' || section === 'projects') {
        if (field === 'description') {
          const newSection = [...prev[section]];
          newSection[index] = { ...newSection[index], description: [...newSection[index].description] };
          newSection[index].description[descIndex] = value;
          return { ...prev, [section]: newSection };
        }
        const sectionData = [...prev[section]];
        sectionData[index] = { ...sectionData[index], [field]: value };
        return { ...prev, [section]: sectionData };
      }
      if (section === 'certifications') {
        const sectionData = [...prev[section]];
        sectionData[index] = { ...sectionData[index], [field]: value };
        return { ...prev, [section]: sectionData };
      }
      const sectionData = [...prev[section]];
      sectionData[index] = { ...sectionData[index], [field]: value };
      return { ...prev, [section]: sectionData };
    });
  };

  const addItem = (section) => {
    setResumeData((prev) => ({
      ...prev,
      [section]:
        section === 'education'
          ? [...prev.education, { school: '', period: '', description: '' }]
          : section === 'experience'
          ? [...prev.experience, { company: '', period: '', description: [''] }]
          : section === 'internships'
          ? [...prev.internships, { company: '', period: '', description: [''] }]
          : section === 'projects'
          ? [...prev.projects, { title: '', period: '', description: [''] }]
          : section === 'certifications'
          ? [...prev.certifications, { title: '', period: '', description: '' }]
          : [...prev.skills, ''],
    }));
  };

  const removeItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const addDescription = (section, index) => {
    setResumeData((prev) => {
      const newSection = [...prev[section]];
      newSection[index] = { ...newSection[index], description: [...newSection[index].description, ''] };
      return { ...prev, [section]: newSection };
    });
  };

  const removeDescription = (section, index, descIndex) => {
    setResumeData((prev) => {
      const newSection = [...prev[section]];
      newSection[index].description = newSection[index].description.filter((_, i) => i !== descIndex);
      return { ...prev, [section]: newSection };
    });
  };

  const chooseExperience = (isExperienced) => {
    setResumeData((prev) => ({ ...prev, isExperienced, hasInternships: isExperienced ? null : null }));
    setStep(isExperienced ? 5 : 5);
  };

  const handleInternshipChoice = (choice) => {
    setResumeData((prev) => ({
      ...prev,
      hasInternships: choice === 'Internships',
      internships: choice === 'Nothing' ? [] : prev.internships,
    }));
    setStep(6);
  };

  const nextStep = () => {
    if (step === 1 && Object.values(resumeData.personalInfo).every((val) => val.trim() !== '')) setStep(2);
    else if (step === 2 && resumeData.about.trim() !== '') setStep(3);
    else if (step === 3 && resumeData.education.every((edu) => Object.values(edu).every((val) => val.trim() !== ''))) setStep(4);
    else if (step === 4 && resumeData.skills.every((skill) => skill.trim() !== '')) setStep(5);
    else if (step === 5 && resumeData.isExperienced === null) return;
    else if (step === 5 && resumeData.isExperienced === false && resumeData.hasInternships === null) return;
    else if (step === 5 && resumeData.isExperienced && resumeData.experience.every((exp) => exp.company.trim() !== '' && exp.period.trim() !== '' && exp.description.every((desc) => desc.trim() !== ''))) setStep(6);
    else if (step === 6 && resumeData.isExperienced === false && resumeData.hasInternships && resumeData.internships.every((intern) => intern.company.trim() !== '' && intern.period.trim() !== '' && intern.description.every((desc) => desc.trim() !== ''))) setStep(7);
    else if (step === 6 && resumeData.isExperienced === false && resumeData.hasInternships === false) setStep(7);
    else if (step === 6 && resumeData.isExperienced === true) setStep(7);
    else if (step === 7 && resumeData.projects.every((proj) => proj.title.trim() !== '' && proj.period.trim() !== '' && proj.description.every((desc) => desc.trim() !== ''))) setStep(8);
    else if (step === 8 && resumeData.certifications.every((cert) => cert.title.trim() !== '' && cert.period.trim() !== '' && cert.description.trim() !== '')) setStep(9);
    else alert('Please complete all required fields before proceeding.');
  };

  const prevStep = () => {
    if (step > 1) {
      if (step === 9) setStep(8);
      else if (step === 8) setStep(7);
      else if (step === 7) setStep(resumeData.isExperienced ? 5 : 6);
      else if (step === 6) setStep(5);
      else if (step === 5) setStep(4);
      else if (step === 4) setStep(3);
      else if (step === 3) setStep(2);
      else if (step === 2) setStep(1);
    }
  };

  return (
    <div className="resume-editor flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="form-side w-full md:w-1/2 p-6 bg-white shadow-md overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Resume</h2>

        {step === 1 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h3>
            <input
              type="text"
              value={resumeData.personalInfo.name}
              onChange={(e) => handleChange('personalInfo', null, 'name', e.target.value)}
              placeholder="Full Name"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              value={resumeData.personalInfo.title}
              onChange={(e) => handleChange('personalInfo', null, 'title', e.target.value)}
              placeholder="Job Title"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              value={resumeData.personalInfo.phone}
              onChange={(e) => handleChange('personalInfo', null, 'phone', e.target.value)}
              placeholder="Phone"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              value={resumeData.personalInfo.address}
              onChange={(e) => handleChange('personalInfo', null, 'address', e.target.value)}
              placeholder="Address"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              value={resumeData.personalInfo.website}
              onChange={(e) => handleChange('personalInfo', null, 'website', e.target.value)}
              placeholder="Website/LinkedIn"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => handleChange('personalInfo', null, 'email', e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <div className="button-group flex justify-end">
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">About Me</h3>
            <textarea
              value={resumeData.about}
              onChange={(e) => handleChange('about', null, 'about', e.target.value)}
              placeholder="Write about yourself..."
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-32 resize-y"
            />
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="item-with-remove mb-4 p-4 bg-gray-50 rounded-md">
                <div className="item-content">
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleChange('education', index, 'school', e.target.value)}
                    placeholder="School Name"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => handleChange('education', index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2019-2023)"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <textarea
                    value={edu.description}
                    onChange={(e) => handleChange('education', index, 'description', e.target.value)}
                    placeholder="Description"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-y"
                  />
                </div>
                {resumeData.education.length > 1 && (
                  <button
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => removeItem('education', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem('education')}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Add Education
            </button>
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Skills</h3>
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="item-with-remove flex items-center mb-4">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleChange('skills', index, 'skill', e.target.value)}
                  placeholder="Skill"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {resumeData.skills.length > 1 && (
                  <button
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => removeItem('skills', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem('skills')}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Add Skill
            </button>
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced === null && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Are you a Fresher or Experienced?</h3>
            <div className="experience-toggle flex space-x-4">
              <button
                onClick={() => chooseExperience(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Experienced
              </button>
              <button
                onClick={() => chooseExperience(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Fresher
              </button>
            </div>
            <div className="button-group flex justify-start">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced === false && resumeData.hasInternships === null && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Any Internships or Nothing?</h3>
            <div className="experience-toggle flex space-x-4">
              <button
                onClick={() => handleInternshipChoice('Internships')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Internships
              </button>
              <button
                onClick={() => handleInternshipChoice('Nothing')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Nothing
              </button>
            </div>
            <div className="button-group flex justify-start">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced === true && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Work Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="item-with-remove mb-4 p-4 bg-gray-50 rounded-md">
                <div className="item-content">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                    placeholder="Company & Position"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => handleChange('experience', index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2024-NOW)"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {exp.description.map((desc, descIndex) => (
                    <div key={descIndex} className="mb-2">
                      <textarea
                        value={desc}
                        onChange={(e) => handleChange('experience', index, 'description', e.target.value, descIndex)}
                        placeholder="Description"
                        required
                        className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-y"
                      />
                      {exp.description.length > 1 && (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          onClick={() => removeDescription('experience', index, descIndex)}
                        >
                          Remove Description
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addDescription('experience', index)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Add Description
                  </button>
                </div>
                {resumeData.experience.length > 1 && (
                  <button
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => removeItem('experience', index)}
                  >
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem('experience')}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Add Experience
            </button>
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 6 && resumeData.isExperienced === false && resumeData.hasInternships && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Internships</h3>
            {resumeData.internships.map((intern, index) => (
              <div key={index} className="item-with-remove mb-4 p-4 bg-gray-50 rounded-md">
                <div className="item-content">
                  <input
                    type="text"
                    value={intern.company}
                    onChange={(e) => handleChange('internships', index, 'company', e.target.value)}
                    placeholder="Company & Role"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    value={intern.period}
                    onChange={(e) => handleChange('internships', index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2024)"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {intern.description.map((desc, descIndex) => (
                    <div key={descIndex} className="mb-2">
                      <textarea
                        value={desc}
                        onChange={(e) => handleChange('internships', index, 'description', e.target.value, descIndex)}
                        placeholder="Description"
                        required
                        className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-y"
                      />
                      {intern.description.length > 1 && (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          onClick={() => removeDescription('internships', index, descIndex)}
                        >
                          Remove Description
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addDescription('internships', index)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Add Description
                  </button>
                </div>
                {resumeData.internships.length > 1 && (
                  <button
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => removeItem('internships', index)}
                  >
                    Remove Internship
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem('internships')}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Add Internship
            </button>
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Projects</h3>
            {resumeData.projects.map((proj, index) => (
              <div key={index} className="item-with-remove mb-4 p-4 bg-gray-50 rounded-md">
                <div className="item-content">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                    placeholder="Project Title"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    value={proj.period}
                    onChange={(e) => handleChange('projects', index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2024)"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {proj.description.map((desc, descIndex) => (
                    <div key={descIndex} className="mb-2">
                      <textarea
                        value={desc}
                        onChange={(e) => handleChange('projects', index, 'description', e.target.value, descIndex)}
                        placeholder="Description"
                        required
                        className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-y"
                      />
                      {proj.description.length > 1 && (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          onClick={() => removeDescription('projects', index, descIndex)}
                        >
                          Remove Description
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addDescription('projects', index)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Add Description
                  </button>
                </div>
                {resumeData.projects.length > 1 && (
                  <button
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => removeItem('projects', index)}
                  >
                    Remove Project
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem('projects')}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Add Project
            </button>
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Certifications</h3>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="item-with-remove mb-4 p-4 bg-gray-50 rounded-md">
                <div className="item-content">
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => handleChange('certifications', index, 'title', e.target.value)}
                    placeholder="Certification Title"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    value={cert.period}
                    onChange={(e) => handleChange('certifications', index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2024)"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <textarea
                    value={cert.description}
                    onChange={(e) => handleChange('certifications', index, 'description', e.target.value)}
                    placeholder="Description"
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-y"
                  />
                </div>
                {resumeData.certifications.length > 1 && (
                  <button
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => removeItem('certifications', index)}
                  >
                    Remove Certification
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addItem('certifications')}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Add Certification
            </button>
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Finish</h3>
            <p className="text-gray-600">Your resume is ready! Review it on the right.</p>
            <div className="button-group flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Previous
              </button>
              <PDFDownloadLink
                document={<ResumePDF resumeData={resumeData} />}
                fileName={`${resumeData.personalInfo.name || 'resume'}.pdf`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </div>

      <div className="preview-side w-full md:w-1/2 p-6 bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-wide mb-1">
              {resumeData.personalInfo.name || 'SEEMA CHAUDHRY'}
            </h1>
            <h2 className="text-xl text-gray-600 mb-6">{resumeData.personalInfo.title || 'Graphic Designer'}</h2>
            <div className="flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <Smartphone className="mr-2 text-blue-600 w-5 h-5" />
                <span className="text-gray-700">{resumeData.personalInfo.phone || '+123-456-7890'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-blue-600 w-5 h-5" />
                <span className="text-gray-700">{resumeData.personalInfo.address || '123 Anywhere St., Any City'}</span>
              </div>
              <div className="flex items-center">
                <Linkedin className="mr-2 text-blue-600 w-5 h-5" />
                <span className="text-gray-700">{resumeData.personalInfo.website || 'www.reallygreatsite.com'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 text-blue-600 w-5 h-5" />
                <span className="text-gray-700">{resumeData.personalInfo.email || 'hello@reallygreatsite.com'}</span>
              </div>
            </div>
          </header>

          <section className="mb-8">
            <div className="bg-gray-100 py-2 px-4 mb-2 rounded-t-md">
              <h3 className="text-lg font-bold text-gray-800">ABOUT ME</h3>
            </div>
            <div className="border-b-2 border-blue-500 mb-4"></div>
            <p className="text-justify text-gray-700 leading-relaxed">
              {resumeData.about || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
            </p>
          </section>

          <section className="mb-8">
            <div className="bg-gray-100 py-2 px-4 mb-2 rounded-t-md">
              <h3 className="text-lg font-bold text-gray-800">EDUCATION</h3>
            </div>
            <div className="border-b-2 border-blue-500 mb-4"></div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-800">{edu.school || 'RIMBERIO UNIVERSITY'}</h4>
                  <p className="text-gray-700">{edu.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="text-gray-600">{edu.period.replace('-', ' – ') || '2019-2023'}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="mb-8">
            <div className="bg-gray-100 py-2 px-4 mb-2 rounded-t-md">
              <h3 className="text-lg font-bold text-gray-800">SKILLS</h3>
            </div>
            <div className="border-b-2 border-blue-500 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resumeData.skills
                .filter((skill) => skill)
                .reduce((acc, skill, idx) => {
                  const colIndex = Math.floor(idx / 2);
                  acc[colIndex] = acc[colIndex] || [];
                  acc[colIndex].push(skill);
                  return acc;
                }, [])
                .map((column, colIdx) => (
                  <ul key={colIdx} className="list-disc pl-5 text-gray-700">
                    {column.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-gray-100 py-2 px-4 mb-2 rounded-t-md">
              <h3 className="text-lg font-bold text-gray-800">PROJECTS</h3>
            </div>
            <div className="border-b-2 border-blue-500 mb-4"></div>
            {resumeData.projects.map((proj, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <h4 className="font-bold text-gray-800">{proj.title || 'Project Title'}</h4>
                  <p className="text-gray-600">{proj.period.replace('-', ' – ') || '2024'}</p>
                </div>
                <p className="mb-2 text-justify text-gray-700 leading-relaxed">
                  {proj.description[0] || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
                </p>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  {proj.description.slice(1).map((desc, i) => (
                    <li key={i}>{desc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mb-8">
            <div className="bg-gray-100 py-2 px-4 mb-2 rounded-t-md">
              <h3 className="text-lg font-bold text-gray-800">CERTIFICATIONS</h3>
            </div>
            <div className="border-b-2 border-blue-500 mb-4"></div>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-800">{cert.title || 'Certification Title'}</h4>
                  <p className="text-gray-700">{cert.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="text-gray-600">{cert.period.replace('-', ' – ') || '2024'}</p>
                </div>
              </div>
            ))}
          </section>

          {(resumeData.isExperienced || (resumeData.isExperienced === false && resumeData.hasInternships)) && (
            <section>
              <div className="bg-gray-100 py-2 px-4 mb-2 rounded-t-md">
                <h3 className="text-lg font-bold text-gray-800">{resumeData.isExperienced ? 'WORK EXPERIENCE' : 'INTERNSHIPS'}</h3>
              </div>
              <div className="border-b-2 border-blue-500 mb-4"></div>
              {(resumeData.isExperienced ? resumeData.experience : resumeData.internships).map((item, index) => (
                <div key={index} className="mb-6">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{item.company || 'Aldenaire & Partners - Graphic Designer'}</h4>
                    <p className="text-gray-600">{item.period.replace('-', ' – ') || '2024-NOW'}</p>
                  </div>
                  <p className="mb-2 text-justify text-gray-700 leading-relaxed">
                    {item.description[0] || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
                  </p>
                  <ul className="list-disc pl-5 mb-4 text-gray-700">
                    {item.description.slice(1).map((desc, i) => (
                      <li key={i}>{desc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview3;