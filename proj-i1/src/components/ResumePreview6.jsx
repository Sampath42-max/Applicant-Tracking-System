import React, { useState } from 'react';
import { Phone, Mail, Linkedin } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  contact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 10,
  },
  icon: {
    width: 14,
    height: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1pt solid #000',
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
});

// PDF Document Component
const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {resumeData.header.profileImage && (
          <Image style={styles.image} src={resumeData.header.profileImage} />
        )}
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {resumeData.header.firstName.toUpperCase()} {resumeData.header.surname.toUpperCase()}
          </Text>
          <Text style={styles.jobTitle}>{resumeData.header.jobTitle}</Text>
          <View style={styles.contact}>
            <View style={styles.contactItem}>
              <Svg style={styles.icon} viewBox="0 0 24 24">
                <Path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z"
                  fill="#000"
                />
              </Svg>
              <Text style={styles.contactText}>{resumeData.header.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Svg style={styles.icon} viewBox="0 0 24 24">
                <Path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="#000"
                />
              </Svg>
              <Text style={styles.contactText}>{resumeData.header.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Svg style={styles.icon} viewBox="0 0 24 24">
                <Path
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                  fill="#000"
                />
              </Svg>
              <Text style={styles.contactText}>{resumeData.header.website}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* About Me */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT ME</Text>
        <Text>{resumeData.aboutMe}</Text>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EDUCATION</Text>
        {resumeData.education.map((edu, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{edu.degree} - {edu.institution}</Text>
            <Text>{edu.period}</Text>
            <Text>{edu.description}</Text>
          </View>
        ))}
      </View>

      {/* Experience/Internship */}
      {(resumeData.internships.length > 0 || resumeData.experience.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {resumeData.internships.length > 0 ? 'INTERNSHIP' : 'EXPERIENCE'}
          </Text>
          {(resumeData.internships.length > 0 ? resumeData.internships : resumeData.experience).map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{item.position} - {item.company}</Text>
              <Text>{item.period}</Text>
              <Text>{item.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SKILLS</Text>
        {resumeData.skills.map((skill, index) => (
          <Text key={index}>- {skill}</Text>
        ))}
      </View>

      {/* References */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>REFERENCES</Text>
        {resumeData.references.map((ref, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{ref.name} - {ref.position}</Text>
            <Text>Phone: {ref.phone}</Text>
            <Text>Social: {ref.social}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const ResumePreview6 = () => {
  const [resumeData, setResumeData] = useState({
    header: { firstName: '', surname: '', jobTitle: '', phone: '', email: '', website: '', profileImage: '' },
    aboutMe: '',
    education: [{ period: '', institution: '', degree: '', description: '' }],
    experience: [{ period: '', company: '', position: '', description: '' }],
    internships: [],
    skills: [''],
    references: [{ name: '', position: '', phone: '', social: '' }],
  });

  const [sectionType, setSectionType] = useState('Work Experience');
  const [step, setStep] = useState(1);
  const [isFresher, setIsFresher] = useState(null);
  const [hasInternships, setHasInternships] = useState(null);

  // Handle input changes
  const handleChange = (section, index, field, value) => {
    setResumeData((prev) => {
      if (section === 'header') {
        return { ...prev, header: { ...prev.header, [field]: value } };
      } else if (section === 'aboutMe') {
        return { ...prev, aboutMe: value };
      } else if (section === 'skills') {
        const newSkills = [...prev.skills];
        newSkills[index] = value;
        return { ...prev, skills: newSkills };
      } else {
        const newSection = [...prev[section]];
        newSection[index] = { ...newSection[index], [field]: value };
        return { ...prev, [section]: newSection };
      }
    });
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeData((prev) => ({
          ...prev,
          header: { ...prev.header, profileImage: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new item to a section
  const addItem = (section) => {
    setResumeData((prev) => ({
      ...prev,
      [section]:
        section === 'skills'
          ? [...prev.skills, '']
          : section === 'education'
          ? [...prev.education, { period: '', institution: '', degree: '', description: '' }]
          : section === 'experience'
          ? [...prev.experience, { period: '', company: '', position: '', description: '' }]
          : section === 'internships'
          ? [...prev.internships, { period: '', company: '', position: '', description: '' }]
          : [...prev.references, { name: '', position: '', phone: '', social: '' }],
    }));
  };

  // Remove item from a section
  const removeItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Check if a string is non-empty
  const isNonEmptyString = (str) => typeof str === 'string' && str.trim() !== '';

  // Navigation to next step
  const nextStep = () => {
    if (step === 1 && Object.values(resumeData.header).every((val) => isNonEmptyString(val) || val === resumeData.header.profileImage)) {
      setStep(2);
    } else if (step === 2 && isNonEmptyString(resumeData.aboutMe)) {
      setStep(3);
    } else if (step === 3 && resumeData.education.every((edu) => Object.values(edu).every(isNonEmptyString))) {
      setStep(4);
    } else if (step === 4 && isFresher !== null) {
      if (isFresher && hasInternships !== null) {
        setStep(5);
      } else if (!isFresher) {
        setStep(5);
      }
    } else if (
      step === 5 &&
      ((sectionType === 'Work Experience' && resumeData.experience.every((exp) => Object.values(exp).every(isNonEmptyString))) ||
        (sectionType === 'Internship' && resumeData.internships.every((intern) => Object.values(intern).every(isNonEmptyString))))
    ) {
      setStep(6);
    } else if (step === 6 && resumeData.skills.every(isNonEmptyString)) {
      setStep(7);
    } else if (step === 7 && resumeData.references.every((ref) => Object.values(ref).every(isNonEmptyString))) {
      setStep(8);
    } else if (step === 8) {
      setStep(9);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  // Navigation to previous step
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle experience type selection
  const handleExperienceType = (type) => {
    setIsFresher(type === 'Fresher');
    setSectionType(type === 'Fresher' ? 'Internship' : 'Work Experience');
    setResumeData((prev) => ({
      ...prev,
      experience: type === 'Fresher' ? [] : prev.experience,
      internships: type === 'Fresher' ? prev.internships : [],
    }));
  };

  // Handle internship choice for freshers
  const handleInternshipChoice = (hasIntern) => {
    setHasInternships(hasIntern);
    setResumeData((prev) => ({
      ...prev,
      internships: hasIntern ? prev.internships : [],
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Form Side (Left) */}
      <div className="md:w-1/2 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg rounded-lg overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 rounded-md shadow-md z-10">
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">Edit Your Resume</h2>
        </div>
        <div className="mt-6">
          {step === 1 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              <input
                type="text"
                value={resumeData.header.firstName}
                onChange={(e) => handleChange('header', 0, 'firstName', e.target.value)}
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={resumeData.header.surname}
                onChange={(e) => handleChange('header', 0, 'surname', e.target.value)}
                placeholder="Surname"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={resumeData.header.jobTitle}
                onChange={(e) => handleChange('header', 0, 'jobTitle', e.target.value)}
                placeholder="Job Title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={resumeData.header.phone}
                onChange={(e) => handleChange('header', 0, 'phone', e.target.value)}
                placeholder="Phone"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={resumeData.header.email}
                onChange={(e) => handleChange('header', 0, 'email', e.target.value)}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={resumeData.header.website}
                onChange={(e) => handleChange('header', 0, 'website', e.target.value)}
                placeholder="LinkedIn Profile"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div>
                <label className="block text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="button-group flex justify-end">
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">About Me</h3>
              <textarea
                value={resumeData.aboutMe}
                onChange={(e) => handleChange('aboutMe', 0, 'aboutMe', e.target.value)}
                placeholder="Describe yourself..."
                className="w-full p-3 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
              <div className="button-group flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Education</h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="space-y-2 border-b border-gray-200 pb-4">
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => handleChange('education', index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2018-2022)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleChange('education', index, 'institution', e.target.value)}
                    placeholder="Institution"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleChange('education', index, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    value={edu.description}
                    onChange={(e) => handleChange('education', index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full p-3 h-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  />
                  {resumeData.education.length > 1 && (
                    <button
                      onClick={() => removeItem('education', index)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addItem('education')}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-600 transition duration-300"
              >
                Add Education
              </button>
              <div className="button-group flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Experience Type</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleExperienceType('Work Experience')}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Work Experience
                </button>
                <button
                  onClick={() => handleExperienceType('Fresher')}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Fresher
                </button>
              </div>
              {isFresher && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-800">Do you have internships?</h4>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleInternshipChoice(true)}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInternshipChoice(false)}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
              <div className="button-group flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                {(isFresher === false || (isFresher && hasInternships !== null)) && (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">{sectionType}</h3>
              {(sectionType === 'Work Experience' ? resumeData.experience : resumeData.internships).map((item, index) => (
                <div key={index} className="space-y-2 border-b border-gray-200 pb-4">
                  <input
                    type="text"
                    value={item.period}
                    onChange={(e) => handleChange(sectionType === 'Work Experience' ? 'experience' : 'internships', index, 'period', e.target.value)}
                    placeholder="Period (e.g., 2020-2022)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => handleChange(sectionType === 'Work Experience' ? 'experience' : 'internships', index, 'company', e.target.value)}
                    placeholder="Company"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={item.position}
                    onChange={(e) => handleChange(sectionType === 'Work Experience' ? 'experience' : 'internships', index, 'position', e.target.value)}
                    placeholder="Position"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => handleChange(sectionType === 'Work Experience' ? 'experience' : 'internships', index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full p-3 h-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  />
                  {(sectionType === 'Work Experience' ? resumeData.experience : resumeData.internships).length > 1 && (
                    <button
                      onClick={() => removeItem(sectionType === 'Work Experience' ? 'experience' : 'internships', index)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addItem(sectionType === 'Work Experience' ? 'experience' : 'internships')}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-600 transition duration-300"
              >
                Add {sectionType}
              </button>
              <div className="button-group flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleChange('skills', index, 'skill', e.target.value)}
                    placeholder="Skill"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {resumeData.skills.length > 1 && (
                    <button
                      onClick={() => removeItem('skills', index)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addItem('skills')}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-600 transition duration-300"
              >
                Add Skill
              </button>
              <div className="button-group flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">References</h3>
              {resumeData.references.map((ref, index) => (
                <div key={index} className="space-y-2 border-b border-gray-200 pb-4">
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => handleChange('references', index, 'name', e.target.value)}
                    placeholder="Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={ref.position}
                    onChange={(e) => handleChange('references', index, 'position', e.target.value)}
                    placeholder="Position"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={ref.phone}
                    onChange={(e) => handleChange('references', index, 'phone', e.target.value)}
                    placeholder="Phone"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={ref.social}
                    onChange={(e) => handleChange('references', index, 'social', e.target.value)}
                    placeholder="Social Profile"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {resumeData.references.length > 1 && (
                    <button
                      onClick={() => removeItem('references', index)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addItem('references')}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-600 transition duration-300"
              >
                Add Reference
              </button>
              <div className="button-group flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Review Your Resume</h3>
              <p className="text-gray-700">Please review your details before finalizing.</p>
              <div className="button-group flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="form-section space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Resume Complete!</h3>
              <p className="text-gray-700">Your resume is ready. Review it on the right side and download as PDF.</p>
              <div className="button-group flex justify-between items-center">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition duration-300"
                >
                  Previous
                </button>
                <PDFDownloadLink
                  document={<ResumePDF resumeData={resumeData} />}
                  fileName={`${resumeData.header.firstName}_${resumeData.header.surname}_Resume.pdf`}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-600 transition duration-300"
                >
                  {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                </PDFDownloadLink>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Side (Right) */}
      <div className="md:w-1/2 p-6 bg-white overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="header flex items-center mb-6">
            {resumeData.header.profileImage && (
              <img
                src={resumeData.header.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full mr-6 object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {resumeData.header.firstName.toUpperCase()} {resumeData.header.surname.toUpperCase()}
              </h1>
              <p className="text-lg text-gray-600">{resumeData.header.jobTitle}</p>
              <div className="flex space-x-6 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  {resumeData.header.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  {resumeData.header.email}
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-5 h-5 mr-2" />
                  {resumeData.header.website}
                </div>
              </div>
            </div>
          </div>

          <div className="section mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">About Me</h2>
            <p className="text-gray-600">{resumeData.aboutMe}</p>
          </div>

          <div className="section mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-gray-800">{edu.degree} - {edu.institution}</h3>
                <p className="text-gray-600">{edu.period}</p>
                <p className="text-gray-600">{edu.description}</p>
              </div>
            ))}
          </div>

          {(resumeData.internships.length > 0 || resumeData.experience.length > 0) && (
            <div className="section mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                {resumeData.internships.length > 0 ? 'Internship' : 'Experience'}
              </h2>
              {(resumeData.internships.length > 0 ? resumeData.internships : resumeData.experience).map((item, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-gray-800">{item.position} - {item.company}</h3>
                  <p className="text-gray-600">{item.period}</p>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="section mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">Skills</h2>
            <ul className="list-disc list-inside text-gray-600">
              {resumeData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3">References</h2>
            {resumeData.references.map((ref, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-gray-800">{ref.name} - {ref.position}</h3>
                <p className="text-gray-600">Phone: {ref.phone}</p>
                <p className="text-gray-600">Social: {ref.social}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview6;