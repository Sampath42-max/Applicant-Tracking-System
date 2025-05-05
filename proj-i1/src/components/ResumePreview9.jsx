import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

// PDF Styles and ResumePDF9 (unchanged)
const styles9 = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica', color: '#1C2526' },
  header: { flexDirection: 'row', alignItems: 'center', borderBottom: '1pt solid #D3D3D3', paddingBottom: 10, marginBottom: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 20, borderWidth: 2, borderColor: '#005B99' },
  headerText: { flexDirection: 'column' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#005B99', marginBottom: 5 },
  contact: { fontSize: 10, marginBottom: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#005B99', marginBottom: 10, textTransform: 'uppercase' },
  experienceItem: { marginBottom: 10 },
  experienceTitle: { fontSize: 12, fontWeight: 'bold', flexDirection: 'row', justifyContent: 'space-between' },
  list: { paddingLeft: 15 },
  listItem: { flexDirection: 'row', marginBottom: 5 },
  bullet: { marginRight: 10 },
  text: { fontSize: 10 },
});

const ResumePDF9 = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles9.page}>
      <View style={styles9.header}>
        {resumeData.header.profileImage ? (
          <Image src={resumeData.header.profileImage} style={styles9.profileImage} />
        ) : (
          <View style={styles9.profileImage} />
        )}
        <View style={styles9.headerText}>
          <Text style={styles9.name}>{resumeData.header.name || 'BENJAMIN SHAH'}</Text>
          <Text style={styles9.contact}>Address: {resumeData.header.address || '123 Anywhere St., Any City'}</Text>
          <Text style={styles9.contact}>Phone: {resumeData.header.phone || '123-456-7890'}</Text>
          <Text style={styles9.contact}>
            Email: <Link src={`mailto:${resumeData.header.email || 'hello@reallygreatsite.com'}`}>{resumeData.header.email || 'hello@reallygreatsite.com'}</Link>
          </Text>
          <Text style={styles9.contact}>
            Website: <Link src={resumeData.header.website || 'http://www.reallygreatsite.com'}>{resumeData.header.website || 'www.reallygreatsite.com'}</Link>
          </Text>
        </View>
      </View>
      <View style={styles9.section}>
        <Text style={styles9.sectionTitle}>Summary</Text>
        <Text style={styles9.text}>{resumeData.summary || 'Results-oriented Mechanical and Mechatronics Engineer seeking a challenging position...'}</Text>
      </View>
      {(resumeData.isExperienced || resumeData.hasInternships) && resumeData.experience.length > 0 && (
        <View style={styles9.section}>
          <Text style={styles9.sectionTitle}>{resumeData.isExperienced ? 'Work Experience' : 'Internships'}</Text>
          {resumeData.experience.map((exp, index) => (
            <View key={index} style={styles9.experienceItem}>
              <View style={styles9.experienceTitle}>
                <Text>{exp.position || 'Position'}, {exp.company || 'Company'}</Text>
                <Text>{exp.period || 'Period'}</Text>
              </View>
              <View style={styles9.list}>
                {exp.responsibilities.map((resp, subIndex) => (
                  <View key={subIndex} style={styles9.listItem}>
                    <Text style={styles9.bullet}>•</Text>
                    <Text style={styles9.text}>{resp || 'Responsibility'}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={styles9.section}>
        <Text style={styles9.sectionTitle}>Projects</Text>
        {resumeData.projects.map((proj, index) => (
          <View key={index} style={styles9.experienceItem}>
            <View style={styles9.experienceTitle}>
              <Text>{proj.title || 'Project Title'}</Text>
              <Text>{proj.period || 'Period'}</Text>
            </View>
            <Text style={styles9.text}>{proj.description || 'Project Description'}</Text>
          </View>
        ))}
      </View>
      <View style={styles9.section}>
        <Text style={styles9.sectionTitle}>Education</Text>
        {resumeData.education.map((edu, index) => (
          <View key={index} style={styles9.experienceItem}>
            <View style={styles9.experienceTitle}>
              <Text>{edu.degree || 'Degree'}</Text>
              <Text>{edu.period || 'Period'}</Text>
            </View>
            <Text style={styles9.text}>{edu.institution || 'Institution'}</Text>
          </View>
        ))}
      </View>
      <View style={styles9.section}>
        <Text style={styles9.sectionTitle}>Additional Information</Text>
        <View style={styles9.list}>
          <View style={styles9.listItem}>
            <Text style={styles9.bullet}>•</Text>
            <Text style={styles9.text}>
              Technical Skills: {resumeData.additionalInfo.technicalSkills || 'Mechatronics System Integration, Automotive Engineering Technology...'}
            </Text>
          </View>
          <View style={styles9.listItem}>
            <Text style={styles9.bullet}>•</Text>
            <Text style={styles9.text}>
              Languages: {resumeData.additionalInfo.languages || 'English, Malay, Japan'}
            </Text>
          </View>
          <View style={styles9.listItem}>
            <Text style={styles9.bullet}>•</Text>
            <Text style={styles9.text}>
              Certifications: {resumeData.additionalInfo.certifications || 'Professional Engineer (PE) License, Project Management Professional (PMP)'}
            </Text>
          </View>
          <View style={styles9.listItem}>
            <Text style={styles9.bullet}>•</Text>
            <Text style={styles9.text}>
              Awards/Activities: {resumeData.additionalInfo.awards || 'Actively participated in the "Innovation for Tomorrow" community outreach program...'}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// ResumePreview9
const ResumePreview9 = () => {
  const [resumeData, setResumeData] = useState({
    header: { name: '', address: '', phone: '', email: '', website: '', profileImage: '' },
    summary: '',
    isExperienced: null,
    hasInternships: null,
    experience: [{ company: '', position: '', period: '', responsibilities: [''] }],
    projects: [{ title: '', description: '', period: '' }],
    education: [{ institution: '', degree: '', period: '' }],
    additionalInfo: { technicalSkills: '', languages: '', certifications: '', awards: '' },
  });
  const [step, setStep] = useState(1);

  const handleChange = (section, index, field, value, subIndex) => {
    setResumeData((prev) => {
      if (section === 'header') {
        if (field === 'profileImage') {
          const file = value;
          const imageUrl = file ? URL.createObjectURL(file) : prev.header.profileImage;
          return { ...prev, header: { ...prev.header, profileImage: imageUrl, profileFile: file } };
        }
        return { ...prev, header: { ...prev.header, [field]: value } };
      } else if (section === 'summary') {
        return { ...prev, summary: value };
      } else if (section === 'isExperienced') {
        return { ...prev, isExperienced: value, hasInternships: null };
      } else if (section === 'hasInternships') {
        return { ...prev, hasInternships: value };
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
        newProjects[index] = { ...newProjects[index], [field]: value };
        return { ...prev, projects: newProjects };
      } else if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        return { ...prev, education: newEducation };
      } else if (section === 'additionalInfo') {
        return { ...prev, additionalInfo: { ...prev.additionalInfo, [field]: value } };
      }
      return prev;
    });
  };

  const addItem = (section, index) => {
    setResumeData((prev) => {
      if (section === 'experience') {
        if (index !== undefined && (prev.isExperienced || prev.hasInternships)) {
          const newExperience = [...prev.experience];
          newExperience[index] = {
            ...newExperience[index],
            responsibilities: [...(newExperience[index].responsibilities || []), '']
          };
          return { ...prev, experience: newExperience };
        }
        return {
          ...prev,
          experience: [...prev.experience, { company: '', position: '', period: '', responsibilities: [''] }],
        };
      } else if (section === 'projects') {
        return {
          ...prev,
          projects: [...prev.projects, { title: '', description: '', period: '' }],
        };
      } else if (section === 'education') {
        return {
          ...prev,
          education: [...prev.education, { institution: '', degree: '', period: '' }],
        };
      }
      return prev;
    });
  };

  const removeItem = (section, index, subIndex) => {
    setResumeData((prev) => {
      if (section === 'experience') {
        if (subIndex !== undefined && (prev.isExperienced || prev.hasInternships)) {
          const newExperience = [...prev.experience];
          newExperience[index] = {
            ...newExperience[index],
            responsibilities: [
              ...(newExperience[index].responsibilities || []).slice(0, subIndex),
              ...(newExperience[index].responsibilities || []).slice(subIndex + 1)
            ]
          };
          return { ...prev, experience: newExperience };
        }
        const newExperience = [...prev.experience];
        newExperience.splice(index, 1);
        return { ...prev, experience: newExperience };
      } else if (section === 'projects') {
        const newProjects = [...prev.projects];
        newProjects.splice(index, 1);
        return { ...prev, projects: newProjects };
      } else if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation.splice(index, 1);
        return { ...prev, education: newEducation };
      }
      return prev;
    });
  };

  const nextStep = () => {
    let errors = [];

    if (step === 1) {
      const { name, address, phone, email, website, profileImage } = resumeData.header;
      if (!name?.trim()) errors.push('Full Name');
      if (!address?.trim()) errors.push('Address');
      if (!phone?.trim()) errors.push('Phone');
      if (!email?.trim()) errors.push('Email');
      if (!website?.trim()) errors.push('Website');
      if (!profileImage) errors.push('Profile Image');
      if (errors.length === 0) { setStep(2); return; }
    } else if (step === 2) {
      if (resumeData.summary?.trim()) { setStep(3); return; }
      else { errors.push('Summary'); }
    } else if (step === 3) {
      if (resumeData.isExperienced !== null) { setStep(4); return; }
      else { errors.push('Experience choice'); }
    } else if (step === 4) {
      console.log('Step 4 State:', resumeData.experience); // Debug log
      if (resumeData.isExperienced === false && resumeData.hasInternships === null) {
        errors.push('Internship choice');
      } else if (resumeData.isExperienced) {
        if (resumeData.experience.length === 0) {
          errors.push('At least one experience entry is required');
        } else {
          const valid = resumeData.experience.every((exp, idx) => {
            if (!exp.company?.trim()) errors.push(`Experience ${idx + 1} Company`);
            if (!exp.position?.trim()) errors.push(`Experience ${idx + 1} Position`);
            if (!exp.period?.trim()) errors.push(`Experience ${idx + 1} Period`);
            const validResponsibilities = Array.isArray(exp.responsibilities) && exp.responsibilities.every((resp) => resp?.trim() !== '');
            if (!validResponsibilities) errors.push(`Experience ${idx + 1} Responsibilities`);
            return exp.company?.trim() && exp.position?.trim() && exp.period?.trim() && validResponsibilities;
          });
          if (valid) { setStep(6); return; }
        }
      } else {
        setStep(5); return;
      }
    } else if (step === 5) {
      if (resumeData.isExperienced === false && resumeData.hasInternships) {
        if (resumeData.experience.length === 0) {
          errors.push('At least one internship entry is required');
        } else {
          const valid = resumeData.experience.every((exp, idx) => {
            if (!exp.company?.trim()) errors.push(`Internship ${idx + 1} Company`);
            if (!exp.position?.trim()) errors.push(`Internship ${idx + 1} Position`);
            if (!exp.period?.trim()) errors.push(`Internship ${idx + 1} Period`);
            const validResponsibilities = Array.isArray(exp.responsibilities) && exp.responsibilities.every((resp) => resp?.trim() !== '');
            if (!validResponsibilities) errors.push(`Internship ${idx + 1} Responsibilities`);
            return exp.company?.trim() && exp.position?.trim() && exp.period?.trim() && validResponsibilities;
          });
          if (valid) { setStep(6); return; }
        }
      } else {
        setStep(6); return;
      }
    } else if (step === 6) {
      const valid = resumeData.education.every((edu, idx) => {
        if (!edu.institution?.trim()) errors.push(`Education ${idx + 1} Institution`);
        if (!edu.degree?.trim()) errors.push(`Education ${idx + 1} Degree`);
        if (!edu.period?.trim()) errors.push(`Education ${idx + 1} Period`);
        return edu.institution?.trim() && edu.degree?.trim() && edu.period?.trim();
      });
      if (valid) { setStep(7); return; }
    } else if (step === 7) {
      const valid = resumeData.projects.every((proj, idx) => {
        if (!proj.title?.trim()) errors.push(`Project ${idx + 1} Title`);
        if (!proj.description?.trim()) errors.push(`Project ${idx + 1} Description`);
        if (!proj.period?.trim()) errors.push(`Project ${idx + 1} Period`);
        return proj.title?.trim() && proj.description?.trim() && proj.period?.trim();
      });
      if (valid) { setStep(8); return; }
    } else if (step === 8) {
      const { technicalSkills, languages, certifications, awards } = resumeData.additionalInfo;
      if (!technicalSkills?.trim()) errors.push('Technical Skills');
      if (!languages?.trim()) errors.push('Languages');
      if (!certifications?.trim()) errors.push('Certifications');
      if (!awards?.trim()) errors.push('Awards/Activities');
      if (errors.length === 0) { setStep(9); return; }
    }

    alert(`Please complete the following required fields: ${errors.join(', ')}`);
  };

  const prevStep = () => {
    if (step > 1) {
      if (step === 9) setStep(8);
      else if (step === 8) setStep(7);
      else if (step === 7) setStep(6);
      else if (step === 6 && resumeData.isExperienced === true) setStep(4);
      else if (step === 6 && resumeData.isExperienced === false && resumeData.hasInternships) setStep(5);
      else if (step === 6 && resumeData.isExperienced === false && resumeData.hasInternships === false) {
        setResumeData((prev) => ({ ...prev, hasInternships: null }));
        setStep(4);
      } else if (step === 5 && resumeData.isExperienced === false && resumeData.hasInternships) {
        setResumeData((prev) => ({ ...prev, hasInternships: null }));
        setStep(4);
      } else if (step === 4) setStep(3);
      else if (step === 3) setStep(2);
      else if (step === 2) setStep(1);
    }
  };

  const chooseExperience = (isExperienced) => {
    setResumeData((prev) => ({
      ...prev,
      isExperienced,
      hasInternships: null,
      experience: [{ company: '', position: '', period: '', responsibilities: [''] }],
    }));
    setStep(4);
  };

  const handleInternshipChoice = (choice) => {
    setResumeData((prev) => {
      if (choice === 'Nothing' && prev.experience.some(exp => exp.company || exp.position || exp.period || exp.responsibilities.some(resp => resp))) {
        if (!window.confirm('Selecting "Nothing" will clear existing experience data. Continue?')) {
          return prev;
        }
      }
      return {
        ...prev,
        hasInternships: choice === 'Internships',
        experience: choice === 'Nothing' ? [] : prev.experience,
      };
    });
    setStep(choice === 'Internships' ? 5 : 6);
  };

  return (
    <div className="resume-editor flex flex-col md:flex-row">
      <div className="form-side w-full md:w-1/2 p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Edit Resume</h2>
        {step === 1 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <input
              type="text"
              value={resumeData.header.name}
              onChange={(e) => handleChange('header', 0, 'name', e.target.value)}
              placeholder="Full Name"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={resumeData.header.address}
              onChange={(e) => handleChange('header', 0, 'address', e.target.value)}
              placeholder="Address"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={resumeData.header.phone}
              onChange={(e) => handleChange('header', 0, 'phone', e.target.value)}
              placeholder="Phone"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={resumeData.header.email}
              onChange={(e) => handleChange('header', 0, 'email', e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={resumeData.header.website}
              onChange={(e) => handleChange('header', 0, 'website', e.target.value)}
              placeholder="Website"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block mb-1 font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange('header', 0, 'profileImage', e.target.files[0])}
              className="w-full p-2 mb-3 border rounded-md bg-white"
            />
            {resumeData.header.profileImage && (
              <img
                src={resumeData.header.profileImage}
                alt="Profile Preview"
                className="w-28 h-28 object-cover mt-2 rounded-md"
              />
            )}
            <div className="button-group mt-4">
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <textarea
              value={resumeData.summary}
              onChange={(e) => handleChange('summary', 0, 'summary', e.target.value)}
              placeholder="Write a brief professional summary..."
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-y"
            />
            <div className="button-group mt-4 flex space-x-2">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Are you Experienced or a Fresher?</h3>
            <div className="toggle-experience flex space-x-2 mb-4">
              <button
                onClick={() => chooseExperience(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Work Experience
              </button>
              <button
                onClick={() => chooseExperience(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Fresher
              </button>
            </div>
            <div className="button-group">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
            </div>
          </div>
        )}
        {step === 4 && resumeData.isExperienced === false && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Any Internships or Nothing?</h3>
            <div className="toggle-experience flex space-x-2 mb-4">
              <button
                onClick={() => handleInternshipChoice('Internships')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Internships
              </button>
              <button
                onClick={() => handleInternshipChoice('Nothing')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Nothing
              </button>
            </div>
            <div className="button-group">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
            </div>
          </div>
        )}
        {step === 4 && resumeData.isExperienced === true && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item mb-4">
                <div className="item-with-remove">
                  <div className="item-content space-y-2">
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleChange('experience', index, 'position', e.target.value)}
                      placeholder="Position (e.g., Mechatronics Engineer)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                      placeholder="Company (e.g., Borcelle Technologies)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleChange('experience', index, 'period', e.target.value)}
                      placeholder="Period (e.g., Jan 2023 - Present)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <h4 className="font-medium">Responsibilities:</h4>
                    {exp.responsibilities.map((resp, subIndex) => (
                      <div key={subIndex} className="item-with-remove flex items-center space-x-2">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => handleChange('experience', index, 'responsibilities', e.target.value, subIndex)}
                          placeholder={`Responsibility ${subIndex + 1}`}
                          required
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {exp.responsibilities.length > 1 && (
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                            onClick={() => removeItem('experience', index, subIndex)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem('experience', index)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
                    >
                      Add Responsibility
                    </button>
                  </div>
                  {resumeData.experience.length > 1 && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
                      onClick={() => removeItem('experience', index)}
                    >
                      Remove Work Experience
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('experience')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
            >
              Add Work Experience
            </button>
            <div className="button-group flex space-x-2">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 5 && resumeData.isExperienced === false && resumeData.hasInternships && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Internships</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item mb-4">
                <div className="item-with-remove">
                  <div className="item-content space-y-2">
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleChange('experience', index, 'position', e.target.value)}
                      placeholder="Role (e.g., Trainee)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                      placeholder="Company (e.g., TechCorp)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleChange('experience', index, 'period', e.target.value)}
                      placeholder="Period (e.g., Jan 2023 - Present)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <h4 className="font-medium">Responsibilities:</h4>
                    {exp.responsibilities.map((resp, subIndex) => (
                      <div key={subIndex} className="item-with-remove flex items-center space-x-2">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => handleChange('experience', index, 'responsibilities', e.target.value, subIndex)}
                          placeholder={`Responsibility ${subIndex + 1}`}
                          required
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {exp.responsibilities.length > 1 && (
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                            onClick={() => removeItem('experience', index, subIndex)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem('experience', index)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
                    >
                      Add Responsibility
                    </button>
                  </div>
                  {resumeData.experience.length > 1 && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
                      onClick={() => removeItem('experience', index)}
                    >
                      Remove Internship
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('experience')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
            >
              Add Internship
            </button>
            <div className="button-group flex space-x-2">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 6 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item mb-4">
                <div className="item-with-remove">
                  <div className="item-content space-y-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleChange('education', index, 'degree', e.target.value)}
                      placeholder="Degree (e.g., Bachelor of Mechatronics Engineering)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleChange('education', index, 'institution', e.target.value)}
                      placeholder="Institution (e.g., University of Engineering Excellence)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleChange('education', index, 'period', e.target.value)}
                      placeholder="Period (e.g., Aug 2016 - Oct 2019)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {resumeData.education.length > 1 && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
            >
              Add Education
            </button>
            <div className="button-group flex space-x-2">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 7 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            {resumeData.projects.map((proj, index) => (
              <div key={index} className="project-item mb-4">
                <div className="item-with-remove">
                  <div className="item-content space-y-2">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                      placeholder="Project Title (e.g., Automation System Design)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={proj.description}
                      onChange={(e) => handleChange('projects', index, 'description', e.target.value)}
                      placeholder="Project Description (e.g., Developed an advanced automation system...)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-y"
                    />
                    <input
                      type="text"
                      value={proj.period}
                      onChange={(e) => handleChange('projects', index, 'period', e.target.value)}
                      placeholder="Period (e.g., Jan 2023 - Mar 2023)"
                      required
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {resumeData.projects.length > 1 && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
            >
              Add Project
            </button>
            <div className="button-group flex space-x-2">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 8 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Additional Information</h3>
            <input
              type="text"
              value={resumeData.additionalInfo.technicalSkills}
              onChange={(e) => handleChange('additionalInfo', 0, 'technicalSkills', e.target.value)}
              placeholder="Technical Skills (e.g., Mechatronics System Integration, Robotics)"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={resumeData.additionalInfo.languages}
              onChange={(e) => handleChange('additionalInfo', 0, 'languages', e.target.value)}
              placeholder="Languages (e.g., English, Malay, Japan)"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={resumeData.additionalInfo.certifications}
              onChange={(e) => handleChange('additionalInfo', 0, 'certifications', e.target.value)}
              placeholder="Certifications (e.g., Professional Engineer (PE) License)"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={resumeData.additionalInfo.awards}
              onChange={(e) => handleChange('additionalInfo', 0, 'awards', e.target.value)}
              placeholder="Awards/Activities (e.g., Innovation for Tomorrow)"
              required
              className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="button-group flex space-x-2 mt-4">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 9 && (
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-2">Finish</h3>
            <p>Your resume is ready! Review it on the right and download as PDF.</p>
            <div className="button-group mt-4 flex space-x-2">
              <button
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Previous
              </button>
              <PDFDownloadLink
                document={<ResumePDF9 resumeData={resumeData} />}
                fileName={`${resumeData.header.name || 'Resume'}.pdf`}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </div>
      <div className="preview-side w-full md:w-1/2 p-6">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center space-x-6 border-b pb-4 mb-6">
            <img
              src={resumeData.header.profileImage || 'https://via.placeholder.com/112'}
              alt="Profile"
              className="w-28 h-28 object-cover border-4 border-blue-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-blue-800">
                {resumeData.header.name || 'BENJAMIN SHAH'}
              </h1>
              <p>
                <strong>Address:</strong> {resumeData.header.address || '123 Anywhere St., Any City'}
              </p>
              <p>
                <strong>Phone:</strong> {resumeData.header.phone || '123-456-7890'}
              </p>
              <p>
                <strong>Email:</strong> {resumeData.header.email || 'hello@reallygreatsite.com'}
              </p>
              <p>
                <strong>Website:</strong> {resumeData.header.website || 'www.reallygreatsite.com'}
              </p>
            </div>
          </div>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">SUMMARY</h2>
            <p className="text-gray-700">
              {resumeData.summary ||
                'Results-oriented Mechanical and Mechatronics Engineer seeking a challenging position...'}
            </p>
          </section>
          {(resumeData.isExperienced || resumeData.hasInternships) && resumeData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {resumeData.isExperienced ? 'WORK EXPERIENCE' : 'INTERNSHIPS'}
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">
                    {exp.position || 'Position'}, {exp.company || 'Company'}{' '}
                    <span className="float-right font-normal">{exp.period || 'Period'}</span>
                  </h3>
                  <ul className="list-disc ml-6 text-gray-700">
                    {exp.responsibilities.map((resp, subIndex) => (
                      <li key={subIndex}>{resp || 'Responsibility'}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
          {resumeData.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">PROJECTS</h2>
              {resumeData.projects.map((proj, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">
                    {proj.title || 'Project Title'}{' '}
                    <span className="float-right font-normal">{proj.period || 'Period'}</span>
                  </h3>
                  <p className="text-gray-700">{proj.description || 'Project Description'}</p>
                </div>
              ))}
            </section>
          )}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">EDUCATION</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold">
                  {edu.degree || 'Degree'}{' '}
                  <span className="float-right font-normal">{edu.period || 'Period'}</span>
                </h3>
                <p className="text-gray-700">{edu.institution || 'Institution'}</p>
              </div>
            ))}
          </section>
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">ADDITIONAL INFORMATION</h2>
            <ul className="list-disc ml-6 text-gray-700">
              <li>
                <strong>Technical Skills:</strong>{' '}
                {resumeData.additionalInfo.technicalSkills ||
                  'Mechatronics System Integration, Automotive Engineering Technology...'}
              </li>
              <li>
                <strong>Languages:</strong>{' '}
                {resumeData.additionalInfo.languages || 'English, Malay, Japan'}
              </li>
              <li>
                <strong>Certifications:</strong>{' '}
                {resumeData.additionalInfo.certifications ||
                  'Professional Engineer (PE) License, Project Management Professional (PMP)'}
              </li>
              <li>
                <strong>Awards/Activities:</strong>{' '}
                {resumeData.additionalInfo.awards ||
                  'Actively participated in the "Innovation for Tomorrow" community outreach program...'}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview9;