import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
    marginBottom: 8,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  contact: {
    fontSize: 10,
    color: '#444',
    marginHorizontal: 5,
  },
  separator: {
    fontSize: 10,
    color: '#444',
    marginHorizontal: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#555',
  },
  description: {
    fontSize: 10,
    marginTop: 5,
  },
  listItem: {
    fontSize: 10,
    marginLeft: 15,
    marginBottom: 2,
    flexDirection: 'row',
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
});

// PDF Document Component
const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {resumeData.header.firstName} {resumeData.header.surname}
        </Text>
        <View style={styles.contactContainer}>
          <Text style={styles.contact}>{resumeData.header.city}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.contact}>{resumeData.header.email}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.contact}>{resumeData.header.phone}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.contact}>{resumeData.header.linkedin}</Text>
        </View>
      </View>

      {/* Experience or Internships */}
      {(resumeData.isExperienced || resumeData.hasInternships) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{resumeData.isExperienced ? 'Experience' : 'Internships'}</Text>
          {(resumeData.isExperienced ? resumeData.experience : resumeData.internships).map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{resumeData.isExperienced ? item.jobTitle : item.jobRole}</Text>
              <Text style={styles.itemSubtitle}>{item.company}</Text>
              <Text style={styles.itemSubtitle}>{item.dateLocation}</Text>
              {item.description.map((desc, subIndex) => (
                <View key={subIndex} style={styles.listItem}>
                  <Text style={styles.bullet}>{"\u2022"}</Text>
                  <Text>{desc}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {resumeData.certifications.map((cert, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{cert.name}</Text>
            <Text style={styles.itemSubtitle}>{cert.details}</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>{"\u2022"}</Text>
              <Text>{cert.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {resumeData.education.map((edu, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{edu.degree}</Text>
            <Text style={styles.itemSubtitle}>{edu.details}</Text>
          </View>
        ))}
      </View>

      {/* Involvement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Involvement</Text>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>Member</Text>
          <Text style={styles.itemSubtitle}>Community College • DMSI - Diverse Male Student Initiative • October 2011 - April 2014</Text>
          {[
            'Mentored incoming freshmen and welcomed over 50 students annually.',
            'Promoted campus workshops and initiated contact with guest speakers.',
            'Assisted in creating a female version of DMSI to reach women on campus.',
            'Partnered with campus faculty, staff, and students to discuss opportunities for community involvement.',
          ].map((desc, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>{"\u2022"}</Text>
              <Text>{desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.description}>
          <Text style={{ fontWeight: 'bold' }}>Industry Knowledge: </Text>
          {resumeData.skills.industryKnowledge}
        </Text>
        <Text style={styles.description}>
          <Text style={{ fontWeight: 'bold' }}>Technical Skills: </Text>
          {resumeData.skills.technicalSkills}
        </Text>
      </View>
    </Page>
  </Document>
);

const ResumePreview4 = () => {
  const [resumeData, setResumeData] = useState({
    header: {
      firstName: 'Charles',
      surname: 'Bloomberg',
      city: 'New York City, United States',
      email: 'charlesbloomberg@wisc.edu',
      phone: '(621) 799-5548',
      linkedin: 'in/bloomberg',
    },
    experience: [
      {
        jobTitle: 'Social Media Evaluator (Contract)',
        company: 'Company A',
        dateLocation: 'June 2020 - Present, New York, NY',
        description: [
          'Utilized web applications to support the measurement of data relevance.',
          'Used a company-provided grading matrix to review and rate social media posts.',
          'Moderated social media platforms Facebook and Instagram to evaluate social media content for quality and assurance.',
          'Stayed current in the latest news to maintain a rating accuracy above 95%.',
        ],
      },
      {
        jobTitle: 'IOS Tier 1-2 Technical Advisor',
        company: 'Company B',
        dateLocation: 'June 2019 - June 2020, New York, NY',
        description: [
          'Provided support to resolve customer issues in a timely and effective matter via inbound chat. Maintained above 96% CSAT.',
          'Communicated ways to improve employees\' ability to track documents, and research cases.',
          'Organized additional products and services when appropriate, selling Apple Care Plus Agreements.',
          'Managed multiple inbound chats during high volume times.',
          'Suggested a new way to retain customers through modern communication, retaining 5% more customers.',
        ],
      },
      {
        jobTitle: 'Customer Service Associate',
        company: 'Company C',
        dateLocation: 'June 2018 - June 2019, New York, NY',
        description: [
          'Answered questions for product and service-related inquiries.',
          'Resolved customer issues to retain existing customers, increase customer satisfaction, and increase new customers.',
          'Recommended new sales styles for the store which resulted in a 25% increase in sales.',
          'Processed customer purchases, handled transactions, and bagged items for customers.',
        ],
      },
      {
        jobTitle: 'Host/Cast Member',
        company: 'Company D',
        dateLocation: 'June 2017 - June 2018, New York, NY',
        description: [
          'Assisted customers with general questions and inquiries.',
          'Greeted customers with positivity and gained rapport with frequent visitors.',
          'Interacted closely with the manager to ensure satisfactory business procedures.',
          'Maintained cleanliness in the restaurant to remain under recommended standards.',
          'Performed songs and dances with customers as the mascot ensuring 100% smiles daily.',
        ],
      },
    ],
    internships: [],
    certifications: [
      {
        name: 'The Arts and Science of Relationships: Understanding Human Needs',
        details: 'University of Toronto • May 2020',
        description: 'Course designed to understand the psychology behind relationship building.',
      },
    ],
    education: [
      {
        degree: 'Associates in Business Administration',
        details: 'Community College • June 2014',
      },
    ],
    skills: {
      industryKnowledge: 'Critical Thinking, Problem Solving, Management, Relationship Building',
      technicalSkills: 'Microsoft Office, Slack, Digital Marketing, Computer Knowledge',
    },
    isExperienced: true,
    hasInternships: null,
  });

  const [step, setStep] = useState(1);

  const handleChange = (section, index, field, value, subIndex) => {
    setResumeData((prev) => {
      if (section === 'header') {
        return { ...prev, header: { ...prev.header, [field]: value } };
      } else if (section === 'experience' || section === 'internships') {
        const newArray = [...prev[section]];
        if (field === 'description') {
          const newDescription = [...newArray[index].description];
          newDescription[subIndex] = value;
          newArray[index] = { ...newArray[index], description: newDescription };
        } else {
          newArray[index] = { ...newArray[index], [field]: value };
        }
        return { ...prev, [section]: newArray };
      } else if (section === 'certifications') {
        const newCertifications = [...prev.certifications];
        newCertifications[index] = { ...newCertifications[index], [field]: value };
        return { ...prev, certifications: newCertifications };
      } else if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        return { ...prev, education: newEducation };
      } else if (section === 'skills') {
        return { ...prev, skills: { ...prev.skills, [field]: value } };
      }
      return prev;
    });
  };

  const addItem = (section) => {
    setResumeData((prev) => ({
      ...prev,
      [section]:
        section === 'experience'
          ? [...prev.experience, { jobTitle: '', company: '', dateLocation: '', description: [''] }]
          : section === 'internships'
          ? [...prev.internships, { jobRole: '', company: '', dateLocation: '', description: [''] }]
          : section === 'certifications'
          ? [...prev.certifications, { name: '', details: '', description: '' }]
          : [...prev.education, { degree: '', details: '' }],
    }));
  };

  const addDescriptionItem = (section, index) => {
    setResumeData((prev) => {
      const newArray = [...prev[section]];
      newArray[index].description.push('');
      return { ...prev, [section]: newArray };
    });
  };

  const removeItem = (section, index, subIndex) => {
    setResumeData((prev) => {
      if ((section === 'experience' || section === 'internships') && subIndex !== undefined) {
        const newArray = [...prev[section]];
        newArray[index].description.splice(subIndex, 1);
        return { ...prev, [section]: newArray };
      }
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const chooseExperience = (isExperienced) => {
    setResumeData((prev) => ({ ...prev, isExperienced, hasInternships: null }));
    setStep(5);
  };

  const handleInternshipChoice = (choice) => {
    setResumeData((prev) => ({
      ...prev,
      hasInternships: choice === 'Internships',
      internships: choice === 'Nothing' ? [] : prev.internships,
    }));
    setStep(choice === 'Internships' ? 6 : 7);
  };

  const nextStep = () => {
    if (step === 1 && Object.values(resumeData.header).every((val) => val.trim() !== '')) setStep(2);
    else if (
      step === 2 &&
      resumeData.certifications.every((cert) => cert.name.trim() !== '' && cert.details.trim() !== '' && cert.description.trim() !== '')
    )
      setStep(3);
    else if (step === 3 && resumeData.education.every((edu) => edu.degree.trim() !== '' && edu.details.trim() !== '')) setStep(4);
    else if (step === 4 && resumeData.isExperienced === null) return; // Wait for choice
    else if (step === 5 && resumeData.isExperienced === false && resumeData.hasInternships === null) return; // Wait for internship choice
    else if (
      step === 5 &&
      resumeData.isExperienced &&
      resumeData.experience.every(
        (exp) => exp.jobTitle.trim() !== '' && exp.company.trim() !== '' && exp.dateLocation.trim() !== '' && exp.description.every((desc) => desc.trim() !== '')
      )
    )
      setStep(6);
    else if (
      step === 6 &&
      resumeData.isExperienced === false &&
      resumeData.hasInternships &&
      resumeData.internships.every(
        (intern) =>
          intern.jobRole.trim() !== '' && intern.company.trim() !== '' && intern.dateLocation.trim() !== '' && intern.description.every((desc) => desc.trim() !== '')
      )
    )
      setStep(7);
    else if (step === 6 && resumeData.isExperienced === true && Object.values(resumeData.skills).every((val) => val.trim() !== '')) setStep(7);
    else if (step === 7 && Object.values(resumeData.skills).every((val) => val.trim() !== '')) setStep(8);
    else alert('Please complete all required fields before proceeding.');
  };

  const prevStep = () => {
    if (step > 1) {
      if (step === 8) setStep(7); // Finish to Skills
      else if (step === 7 && resumeData.isExperienced === true) setStep(6); // Skills to Work Experience
      else if (step === 7 && resumeData.isExperienced === false && resumeData.hasInternships) setStep(6); // Skills to Internships
      else if (step === 7 && resumeData.isExperienced === false && resumeData.hasInternships === false) {
        setResumeData((prev) => ({ ...prev, hasInternships: null })); // Reset for choice
        setStep(5); // Skills to Internship question
      } else if (step === 6 && resumeData.isExperienced === false && resumeData.hasInternships) {
        setResumeData((prev) => ({ ...prev, hasInternships: null })); // Reset for choice
        setStep(5); // Internships to Internship question
      } else if (step === 6 && resumeData.isExperienced === true) setStep(5); // Skills to Work Experience
      else if (step === 5) setStep(4); // Work Experience or Internship question to Experience choice
      else if (step === 4) setStep(3); // Experience choice to Education
      else if (step === 3) setStep(2); // Education to Certifications
      else if (step === 2) setStep(1); // Certifications to Personal Info
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Form Side */}
      <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg mb-6 md:mb-0 md:mr-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Resume</h2>

        {step === 1 && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={resumeData.header.firstName}
                onChange={(e) => handleChange('header', 0, 'firstName', e.target.value)}
                placeholder="First Name"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={resumeData.header.surname}
                onChange={(e) => handleChange('header', 0, 'surname', e.target.value)}
                placeholder="Surname"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={resumeData.header.city}
                onChange={(e) => handleChange('header', 0, 'city', e.target.value)}
                placeholder="City"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={resumeData.header.email}
                onChange={(e) => handleChange('header', 0, 'email', e.target.value)}
                placeholder="Email"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={resumeData.header.phone}
                onChange={(e) => handleChange('header', 0, 'phone', e.target.value)}
                placeholder="Phone Number"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={resumeData.header.linkedin}
                onChange={(e) => handleChange('header', 0, 'linkedin', e.target.value)}
                placeholder="LinkedIn"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6">
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Certifications</h3>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleChange('certifications', index, 'name', e.target.value)}
                    placeholder="Certification Name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={cert.details}
                    onChange={(e) => handleChange('certifications', index, 'details', e.target.value)}
                    placeholder="Details (e.g., University of Toronto • May 2020)"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={cert.description}
                    onChange={(e) => handleChange('certifications', index, 'description', e.target.value)}
                    placeholder="Description"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  />
                  {resumeData.certifications.length > 1 && (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => removeItem('certifications', index)}
                    >
                      Remove Certification
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('certifications')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Certification
            </button>
            <div className="flex space-x-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleChange('education', index, 'degree', e.target.value)}
                    placeholder="Degree"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={edu.details}
                    onChange={(e) => handleChange('education', index, 'details', e.target.value)}
                    placeholder="Details (e.g., Community College • June 2014)"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {resumeData.education.length > 1 && (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
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
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
            >
              Add Education
            </button>
            <div className="flex space-x-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Are you a Fresher or Experienced?</h3>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => chooseExperience(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Experienced
              </button>
              <button
                onClick={() => chooseExperience(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Fresher
              </button>
            </div>
            <div className="mt-6">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced === false && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Any Internships or Nothing?</h3>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => handleInternshipChoice('Internships')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Internships
              </button>
              <button
                onClick={() => handleInternshipChoice('Nothing')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Nothing
              </button>
            </div>
            <div className="mt-6">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
            </div>
          </div>
        )}

        {step === 5 && resumeData.isExperienced === true && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleChange('experience', index, 'jobTitle', e.target.value)}
                    placeholder="Job Title"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                    placeholder="Company"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={exp.dateLocation}
                    onChange={(e) => handleChange('experience', index, 'dateLocation', e.target.value)}
                    placeholder="Date and Location (e.g., June 2020 - Present, New York, NY)"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {exp.description.map((desc, subIndex) => (
                    <div key={subIndex} className="space-y-2">
                      <textarea
                        value={desc}
                        onChange={(e) => handleChange('experience', index, 'description', e.target.value, subIndex)}
                        placeholder={`Description ${subIndex + 1}`}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      />
                      {exp.description.length > 1 && (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => removeItem('experience', index, subIndex)}
                        >
                          Remove Description
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addDescriptionItem('experience', index)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Description
                  </button>
                  {resumeData.experience.length > 1 && (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2"
                      onClick={() => removeItem('experience', index)}
                    >
                      Remove Experience
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
            <div className="flex space-x-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 6 && resumeData.isExperienced === false && resumeData.hasInternships && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Internships</h3>
            {resumeData.internships.map((intern, index) => (
              <div key={index} className="mb-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={intern.jobRole}
                    onChange={(e) => handleChange('internships', index, 'jobRole', e.target.value)}
                    placeholder="Job Role"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={intern.company}
                    onChange={(e) => handleChange('internships', index, 'company', e.target.value)}
                    placeholder="Company"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={intern.dateLocation}
                    onChange={(e) => handleChange('internships', index, 'dateLocation', e.target.value)}
                    placeholder="Date and Location (e.g., June 2020 - Aug 2020, New York, NY)"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {intern.description.map((desc, subIndex) => (
                    <div key={subIndex} className="space-y-2">
                      <textarea
                        value={desc}
                        onChange={(e) => handleChange('internships', index, 'description', e.target.value, subIndex)}
                        placeholder={`Description ${subIndex + 1}`}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      />
                      {intern.description.length > 1 && (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => removeItem('internships', index, subIndex)}
                        >
                          Remove Description
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addDescriptionItem('internships', index)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Description
                  </button>
                  {resumeData.internships.length > 1 && (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2"
                      onClick={() => removeItem('internships', index)}
                    >
                      Remove Internship
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
            <div className="flex space-x-4">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {((step === 6 && resumeData.isExperienced === true) || (step === 7 && resumeData.isExperienced === false)) && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Skills</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-600">Industry Knowledge</h4>
                <input
                  type="text"
                  value={resumeData.skills.industryKnowledge}
                  onChange={(e) => handleChange('skills', 0, 'industryKnowledge', e.target.value)}
                  placeholder="Industry Knowledge (comma-separated)"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Technical Skills</h4>
                <input
                  type="text"
                  value={resumeData.skills.technicalSkills}
                  onChange={(e) => handleChange('skills', 0, 'technicalSkills', e.target.value)}
                  placeholder="Technical Skills (comma-separated)"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
              <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Finish
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="form-section">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Finish</h3>
            <p className="text-gray-600 mb-4">Your resume is ready! Review it on the right.</p>
            <div className="mb-4">
              <PDFDownloadLink
                document={<ResumePDF resumeData={resumeData} />}
                fileName={`${resumeData.header.firstName}_${resumeData.header.surname}_Resume.pdf`}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-block"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download Resume as PDF')}
              </PDFDownloadLink>
            </div>
            <div className="mt-6">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Previous
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Side */}
      <div className="w-full md:w-1/2 p-8 bg-white shadow-lg rounded-lg">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              {resumeData.header.firstName} {resumeData.header.surname}
            </h1>
            <div className="flex justify-center items-center gap-4 text-gray-600 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-gray-500">{resumeData.header.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">{resumeData.header.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">{resumeData.header.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">{resumeData.header.linkedin}</span>
              </div>
            </div>
          </header>

          {/* Experience or Internships Section */}
          {(resumeData.isExperienced || resumeData.hasInternships) && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-1 mb-4">
                {resumeData.isExperienced ? 'EXPERIENCE' : 'INTERNSHIPS'}
              </h2>
              {(resumeData.isExperienced ? resumeData.experience : resumeData.internships).map((item, index) => (
                <div key={index} className="mb-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold">{resumeData.isExperienced ? item.jobTitle : item.jobRole}</h3>
                    <span className="text-right text-gray-600">{item.dateLocation}</span>
                  </div>
                  <div className="text-gray-700 mb-1">{item.company}</div>
                  <ul className="list-none ml-0 text-gray-700">
                    {item.description.map((desc, subIndex) => (
                      <li key={subIndex} className="mb-1">
                        • {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Certifications Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-1 mb-4">CERTIFICATIONS</h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-5">
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <div className="text-gray-700 mb-1">{cert.details}</div>
                <p className="text-gray-700">• {cert.description}</p>
              </div>
            ))}
          </section>

          {/* Education Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-1 mb-4">EDUCATION</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-5">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <div className="text-gray-700 mb-1">{edu.details}</div>
              </div>
            ))}
          </section>

          {/* Involvement Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-1 mb-4">INVOLVEMENT</h2>
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Member</h3>
              <div className="text-gray-700 mb-1">Community College • DMSI - Diverse Male Student Initiative • October 2011 - April 2014</div>
              <ul className="list-none ml-0 text-gray-700">
                <li className="mb-1">• Mentored incoming freshmen and welcomed over 50 students annually.</li>
                <li className="mb-1">• Promoted campus workshops and initiated contact with guest speakers.</li>
                <li className="mb-1">• Assisted in creating a female version of DMSI to reach women on campus.</li>
                <li className="mb-1">• Partnered with campus faculty, staff, and students to discuss opportunities for community involvement.</li>
              </ul>
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 uppercase border-b-2 border-gray-300 pb-1 mb-4">SKILLS</h2>
            <div className="mb-3">
              <p className="text-gray-700">
                <span className="font-semibold">Industry Knowledge:</span> {resumeData.skills.industryKnowledge}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Technical Skills:</span> {resumeData.skills.technicalSkills}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview4;