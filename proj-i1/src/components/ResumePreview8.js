import React, { useState } from 'react';
import { Phone, Globe } from 'lucide-react';


const ResumePreview8 = () => {
  const [resumeData, setResumeData] = useState({
    header: { firstName: '', surname: '', jobTitle: '', email: '', phone: '', address: '', website: '' },
    summary: '',
    education: [{ institution: '', degree: '', duration: '' }],
    skills: [''],
    isExperienced: null, // null means not chosen yet
    hasInternships: null, // null means not chosen yet for fresher
    experience: [],
    references: [{ name: '', affiliation: '', phone: '', website: '' }],
  });

  const [step, setStep] = useState(1);

  const handleChange = (section, index, field, value, subindex) => {
    setResumeData((prev) => {
      if (section === 'header') {
        return { ...prev, header: { ...prev.header, [field]: value } };
      } else if (section === 'summary') {
        return { ...prev, summary: value };
      } else if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        return { ...prev, education: newEducation };
      } else if (section === 'skills') {
        const newSkills = [...prev.skills];
        newSkills[index] = value;
        return { ...prev, skills: newSkills };
      } else if (section === 'experience') {
        const newExperience = [...prev.experience];
        if (field === 'responsibilities') {
          newExperience[index].responsibilities[subindex] = value;
        } else {
          newExperience[index] = { ...newExperience[index], [field]: value };
        }
        return { ...prev, experience: newExperience };
      } else if (section === 'references') {
        const newReferences = [...prev.references];
        newReferences[index] = { ...newReferences[index], [field]: value };
        return { ...prev, references: newReferences };
      } else if (section === 'isExperienced') {
        return { ...prev, isExperienced: value, hasInternships: null };
      } else if (section === 'hasInternships') {
        return { ...prev, hasInternships: value };
      }
      return prev;
    });
  };

  const addItem = (section, index) => {
    setResumeData((prev) => {
      if (section === 'education') {
        return { ...prev, education: [...prev.education, { institution: '', degree: '', duration: '' }] };
      } else if (section === 'skills') {
        return { ...prev, skills: [...prev.skills, ''] };
      } else if (section === 'experience') {
        if (index !== undefined) {
          const newExperience = [...prev.experience];
          newExperience[index].responsibilities.push('');
          return { ...prev, experience: newExperience };
        } else {
          return { ...prev, experience: [...prev.experience, { position: '', company: '', period: '', description: '', responsibilities: [''] }] };
        }
      } else if (section === 'references') {
        return { ...prev, references: [...prev.references, { name: '', affiliation: '', phone: '', website: '' }] };
      }
      return prev;
    });
  };

  const removeItem = (section, index, subindex) => {
    setResumeData((prev) => {
      if (section === 'education') {
        const newEducation = [...prev.education];
        newEducation.splice(index, 1);
        return { ...prev, education: newEducation };
      } else if (section === 'skills') {
        const newSkills = [...prev.skills];
        newSkills.splice(index, 1);
        return { ...prev, skills: newSkills };
      } else if (section === 'experience') {
        if (subindex !== undefined) {
          const newExperience = [...prev.experience];
          newExperience[index].responsibilities.splice(subindex, 1);
          return { ...prev, experience: newExperience };
        } else {
          const newExperience = [...prev.experience];
          newExperience.splice(index, 1);
          return { ...prev, experience: newExperience };
        }
      } else if (section === 'references') {
        const newReferences = [...prev.references];
        newReferences.splice(index, 1);
        return { ...prev, references: newReferences };
      }
      return prev;
    });
  };

  const nextStep = () => {
    if (step === 1 && Object.values(resumeData.header).every((val) => val.trim() !== '')) setStep(2);
    else if (step === 2 && resumeData.summary.trim() !== '') setStep(3);
    else if (step === 3 && resumeData.education.every((edu) => Object.values(edu).every((val) => val.trim() !== ''))) setStep(4);
    else if (step === 4 && resumeData.skills.every((skill) => skill.trim() !== '')) setStep(5);
    else if (step === 5 && resumeData.isExperienced === null) return; // Wait for choice
    else if (step === 6 && resumeData.isExperienced === false && resumeData.hasInternships === null) return; // Wait for internship choice
    else if (step === 6 && resumeData.isExperienced && resumeData.experience.every((exp) => exp.position.trim() !== '' && exp.company.trim() !== '' && exp.period.trim() !== '' && exp.description.trim() !== '' && exp.responsibilities.every((resp) => resp.trim() !== ''))) setStep(7);
    else if (step === 7 && resumeData.isExperienced === false && resumeData.hasInternships && resumeData.experience.every((exp) => exp.position.trim() !== '' && exp.company.trim() !== '' && exp.period.trim() !== '' && exp.description.trim() !== '' && exp.responsibilities.every((resp) => resp.trim() !== ''))) setStep(8);
    else if (step === 7 && resumeData.isExperienced === false && resumeData.hasInternships === false) setStep(8); // Nothing case
    else if (step === 8 && resumeData.references.every((ref) => Object.values(ref).every((val) => val.trim() !== ''))) setStep(9);
    else alert('Please complete all required fields before proceeding.');
  };

  const prevStep = () => {
    if (step > 1) {
      if (step === 9) setStep(8); // Finish to References
      else if (step === 8 && resumeData.isExperienced === true) setStep(6); // References to Work Experience
      else if (step === 8 && resumeData.isExperienced === false && resumeData.hasInternships) setStep(7); // References to Internships
      else if (step === 8 && resumeData.isExperienced === false && resumeData.hasInternships === false) {
        setResumeData((prev) => ({ ...prev, hasInternships: null })); // Reset for choice
        setStep(6); // References to Internship question
      }
      else if (step === 7 && resumeData.isExperienced === false && resumeData.hasInternships) {
        setResumeData((prev) => ({ ...prev, hasInternships: null })); // Reset for choice
        setStep(6); // Internships to Internship question
      }
      else if (step === 7 && resumeData.isExperienced === true) setStep(6); // Should not occur, but safe fallback
      else if (step === 6) setStep(5); // Work Experience or Internship question to Experience choice
      else if (step === 5) setStep(4); // Experience choice to Skills
      else if (step === 4) setStep(3); // Skills to Education
      else if (step === 3) setStep(2); // Education to Summary
      else if (step === 2) setStep(1); // Summary to Personal Info
    }
  };

  const chooseExperience = (isExperienced) => {
    setResumeData((prev) => ({ ...prev, isExperienced, hasInternships: null, experience: [] })); // Reset experience
    setStep(6);
  };

  const handleInternshipChoice = (choice) => {
    setResumeData((prev) => ({
      ...prev,
      hasInternships: choice === 'Internships',
      experience: choice === 'Nothing' ? [] : prev.experience, // Clear experience if "Nothing"
    }));
    setStep(choice === 'Internships' ? 7 : 8); // Internships to 7, Nothing to 8
  };

  return (
    <div className="resume-editor">
      <div className="form-side">
        <h2>Edit Resume</h2>

        {step === 1 && (
          <div className="form-section">
            <h3>Personal Information</h3>
            <input type="text" value={resumeData.header.firstName} onChange={(e) => handleChange('header', 0, 'firstName', e.target.value)} placeholder="First Name" required />
            <input type="text" value={resumeData.header.surname} onChange={(e) => handleChange('header', 0, 'surname', e.target.value)} placeholder="Surname" required />
            <input type="text" value={resumeData.header.jobTitle} onChange={(e) => handleChange('header', 0, 'jobTitle', e.target.value)} placeholder="Job Title" required />
            <input type="text" value={resumeData.header.email} onChange={(e) => handleChange('header', 0, 'email', e.target.value)} placeholder="Email" required />
            <input type="text" value={resumeData.header.phone} onChange={(e) => handleChange('header', 0, 'phone', e.target.value)} placeholder="Phone Number" required />
            <input type="text" value={resumeData.header.address} onChange={(e) => handleChange('header', 0, 'address', e.target.value)} placeholder="Address" required />
            <input type="text" value={resumeData.header.website} onChange={(e) => handleChange('header', 0, 'website', e.target.value)} placeholder="Website" required />
            <div className="button-group">
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h3>Summary</h3>
            <textarea value={resumeData.summary} onChange={(e) => handleChange('summary', 0, 'summary', e.target.value)} placeholder="Write a brief professional summary..." required />
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h3>Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="item-with-remove">
                  <div className="item-content">
                    <input type="text" value={edu.institution} onChange={(e) => handleChange('education', index, 'institution', e.target.value)} placeholder="Institution" required />
                    <input type="text" value={edu.duration} onChange={(e) => handleChange('education', index, 'duration', e.target.value)} placeholder="Period (e.g., 2022 - 2024)" required />
                    <input type="text" value={edu.degree} onChange={(e) => handleChange('education', index, 'degree', e.target.value)} placeholder="Degree" required />
                  </div>
                  {resumeData.education.length > 1 && (
                    <button className="remove-btn" onClick={() => removeItem('education', index)}>Remove Education</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => addItem('education')} className="add-btn">Add Education</button>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-section">
            <h3>Skills</h3>
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="item-with-remove">
                  <div className="item-content">
                    <input type="text" value={skill} onChange={(e) => handleChange('skills', index, 'skill', e.target.value)} placeholder="Skill" required />
                  </div>
                  {resumeData.skills.length > 1 && (
                    <button className="remove-btn" onClick={() => removeItem('skills', index)}>Remove Skill</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => addItem('skills')} className="add-btn">Add Skill</button>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-section">
            <h3>Are you Experienced or a Fresher?</h3>
            <div className="toggle-experience">
              <button onClick={() => chooseExperience(true)} className="experience-choice">Work Experience</button>
              <button onClick={() => chooseExperience(false)} className="experience-choice">Fresher</button>
            </div>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
            </div>
          </div>
        )}

        {step === 6 && resumeData.isExperienced === false && (
          <div className="form-section">
            <h3>Any Internships or Nothing?</h3>
            <div className="toggle-experience">
              <button onClick={() => handleInternshipChoice('Internships')} className="experience-choice">Internships</button>
              <button onClick={() => handleInternshipChoice('Nothing')} className="experience-choice">Nothing</button>
            </div>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
            </div>
          </div>
        )}

        {step === 6 && resumeData.isExperienced === true && (
          <div className="form-section">
            <h3>Work Experience</h3>
            {resumeData.experience.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="item-with-remove">
                    <div className="item-content">
                      <input type="text" value={exp.position} onChange={(e) => handleChange('experience', index, 'position', e.target.value)} placeholder="Position" required />
                      <input type="text" value={exp.company} onChange={(e) => handleChange('experience', index, 'company', e.target.value)} placeholder="Company" required />
                      <input type="text" value={exp.period} onChange={(e) => handleChange('experience', index, 'period', e.target.value)} placeholder="Period (e.g., 2022 - 2024)" required />
                      <textarea value={exp.description} onChange={(e) => handleChange('experience', index, 'description', e.target.value)} placeholder="Description" required />
                      <h4>Responsibilities:</h4>
                      {exp.responsibilities.map((responsibility, subIndex) => (
                        <div key={subIndex} className="item-with-remove">
                          <input type="text" value={responsibility} onChange={(e) => handleChange('experience', index, 'responsibilities', e.target.value, subIndex)} placeholder={`Responsibility ${subIndex + 1}`} required />
                          {exp.responsibilities.length > 1 && (
                            <button className="remove-btn" onClick={() => removeItem('experience', index, subIndex)}>Remove Responsibility</button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addItem('experience', index)} className="add-btn">Add Responsibility</button>
                    </div>
                    {resumeData.experience.length > 1 && (
                      <button className="remove-btn" onClick={() => removeItem('experience', index)}>Remove Work Experience</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No work experience added.</p>
            )}
            <button onClick={() => addItem('experience')} className="add-btn">Add Work Experience</button>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {step === 7 && resumeData.isExperienced === false && resumeData.hasInternships && (
          <div className="form-section">
            <h3>Internships</h3>
            {resumeData.experience.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="item-with-remove">
                    <div className="item-content">
                      <input type="text" value={exp.position} onChange={(e) => handleChange('experience', index, 'position', e.target.value)} placeholder="Role" required />
                      <input type="text" value={exp.company} onChange={(e) => handleChange('experience', index, 'company', e.target.value)} placeholder="Company" required />
                      <input type="text" value={exp.period} onChange={(e) => handleChange('experience', index, 'period', e.target.value)} placeholder="Period (e.g., 2022 - 2024)" required />
                      <textarea value={exp.description} onChange={(e) => handleChange('experience', index, 'description', e.target.value)} placeholder="Description" required />
                      <h4>Responsibilities:</h4>
                      {exp.responsibilities.map((responsibility, subIndex) => (
                        <div key={subIndex} className="item-with-remove">
                          <input type="text" value={responsibility} onChange={(e) => handleChange('experience', index, 'responsibilities', e.target.value, subIndex)} placeholder={`Responsibility ${subIndex + 1}`} required />
                          {exp.responsibilities.length > 1 && (
                            <button className="remove-btn" onClick={() => removeItem('experience', index, subIndex)}>Remove Responsibility</button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addItem('experience', index)} className="add-btn">Add Responsibility</button>
                    </div>
                    {resumeData.experience.length > 1 && (
                      <button className="remove-btn" onClick={() => removeItem('experience', index)}>Remove Internship</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No internships added.</p>
            )}
            <button onClick={() => addItem('experience')} className="add-btn">Add Internship</button>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {(step === 8 || (step === 7 && resumeData.isExperienced === true)) && (
          <div className="form-section">
            <h3>References</h3>
            {resumeData.references.map((ref, index) => (
              <div key={index} className="reference-item">
                <div className="item-with-remove">
                  <div className="item-content">
                    <input type="text" value={ref.name} onChange={(e) => handleChange('references', index, 'name', e.target.value)} placeholder="Name" required />
                    <input type="text" value={ref.affiliation} onChange={(e) => handleChange('references', index, 'affiliation', e.target.value)} placeholder="Affiliation" required />
                    <input type="text" value={ref.phone} onChange={(e) => handleChange('references', index, 'phone', e.target.value)} placeholder="Phone" required />
                    <input type="text" value={ref.website} onChange={(e) => handleChange('references', index, 'website', e.target.value)} placeholder="Website" required />
                  </div>
                  {resumeData.references.length > 1 && (
                    <button className="remove-btn" onClick={() => removeItem('references', index)}>Remove Reference</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => addItem('references')} className="add-btn">Add Reference</button>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Finish</button>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="form-section">
            <h3>Finish</h3>
            <p>Your resume is ready! Review it on the right.</p>
            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
            </div>
          </div>
        )}
      </div>

      <div className="preview-side">
        <div className="resume-container">
          <header className="resume-header">
            <h1>{resumeData.header.firstName || 'Deepal'} {resumeData.header.surname || 'Surve'}</h1>
            <p>{resumeData.header.jobTitle || 'Office Manager'}</p>
            <div className="contact-info">
              <span>{resumeData.header.phone || '+123-456-7890'}</span>
              <span> | </span>
              <span>{resumeData.header.address || '123 Anywhere St., Any City'}</span>
              <span> | </span>
              <span>{resumeData.header.website || 'www.reallygreatsite.com'}</span>
              <span> | </span>
              <span>{resumeData.header.email || 'hello@reallygreatsite.com'}</span>
            </div>
          </header>

          <section className="summary-section">
            <h2>ABOUT ME</h2>
            <p className="summary-text">{resumeData.summary || 'Lorem ipsum dolor sit amet...'}</p>
          </section>

          <section className="education-section">
            <h2>EDUCATION</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="edu-header">
                  <h3>{edu.institution || 'Rimberio University'}</h3>
                  <span>{edu.duration || '2024 - 2027'}</span>
                </div>
                <p>{edu.degree || 'Lorem ipsum dolor'}</p>
              </div>
            ))}
          </section>

          <section className="skills-section">
            <h2>SKILLS</h2>
            <div className="skills-grid">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="skill-category">
                  <p>{skill || 'Budget Management'}</p>
                </div>
              ))}
            </div>
          </section>

          {(resumeData.isExperienced || (resumeData.isExperienced === false && resumeData.hasInternships)) && (
            <section className="experience-section">
              <h2>{resumeData.isExperienced ? 'WORK EXPERIENCE' : 'INTERNSHIPS'}</h2>
              {resumeData.experience.length > 0 ? (
                resumeData.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div className="exp-header">
                      <h3>{exp.company || 'Aldenaire & Partners'}</h3>
                      <span>{exp.period || '2024 - Now'}</span>
                    </div>
                    <p>{exp.position || 'Office Manager'}</p>
                    <p>{exp.description || 'Lorem ipsum dolor sit amet...'}</p>
                    <ul>
                      {exp.responsibilities.map((responsibility, subIndex) => (
                        <li key={subIndex}>{responsibility || 'Lorem ipsum dolor sit amet...'}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No {resumeData.isExperienced ? 'work experience' : 'internships'} added.</p>
              )}
            </section>
          )}

          <section className="references-section">
            <h2>REFERENCES</h2>
            <div className="references-grid">
              {resumeData.references.map((ref, index) => (
                <div key={index} className="reference-item">
                  <h3>{ref.name || 'Alexander Aronowitz'}</h3>
                  <p>{ref.affiliation || 'Rimberio University'}</p>
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{ref.phone || '+123-456-7890'}</span>
                  </div>
                  <div className="contact-item">
                    <Globe size={16} />
                    <a href={ref.website || 'www.reallygreatsite.com'}>{ref.website || 'www.reallygreatsite.com'}</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview8;