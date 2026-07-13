import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Image, Link, Page, Path, StyleSheet, Svg, Text, View, pdf } from '@react-pdf/renderer';
import { Download, Github, Linkedin, LoaderCircle, Mail, MapPin, Phone } from 'lucide-react';

const emptyEducation = { school: '', degree: '', duration: '', score: '' };
const emptyExperience = { type: 'Work Experience', company: '', designation: '', duration: '', description: '' };
const emptyProject = { title: '', link: '', bullets: '' };
const emptyCertification = { name: '', issuer: '' };
const emptyOther = { title: 'Languages', mode: 'text', content: '', bullets: '' };

const templateThemes = {
  1: { accent: '#1e3a8a', header: 'center', section: 'bar' },
  2: { accent: '#0f172a', header: 'left', section: 'line' },
  3: { accent: '#7c3aed', header: 'center', section: 'soft' },
  4: { accent: '#111827', header: 'left', section: 'block' },
  5: { accent: '#0f766e', header: 'center', section: 'line' },
  6: { accent: '#b91c1c', header: 'left', section: 'bar' },
  7: { accent: '#92400e', header: 'left', section: 'line' },
  8: { accent: '#be185d', header: 'center', section: 'soft' },
  9: { accent: '#2563eb', header: 'left', section: 'block' },
  10: { accent: '#ea580c', header: 'sidebar', section: 'bar' },
};

const templateSectionLabels = {
  1: { summary: 'About Me', skills: 'Skill', experience: 'Work Experience' },
  2: { summary: 'About Me', experience: 'Experience' },
  3: { summary: 'About Me', experience: 'Work Experience', skills: 'Skill' },
  4: { experience: 'Experience', other: 'Involvement' },
  5: { skills: 'Skill', experience: 'Experience' },
  6: { skills: 'Skills Summary', experience: 'Work Experience' },
  7: { summary: 'Summary', experience: 'Work Experience' },
  8: { summary: 'About Me', skills: 'Skill', experience: 'Work Experience', certifications: 'Reference' },
  9: { summary: 'Summary', other: 'Hobbies' },
  10: { summary: 'Summary', experience: 'Experience' },
};

const defaultResume = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    linkedinLabel: '',
    github: '',
    githubLabel: '',
    location: '',
    photo: '',
  },
  summary: '',
  education: [{ ...emptyEducation }],
  skills: [
    { category: 'Programming', items: '' },
    { category: 'Tools', items: '' },
    { category: 'Professional', items: '' },
    { category: 'Communication', items: '' },
  ],
  experience: [{ ...emptyExperience }],
  projects: [{ ...emptyProject }],
  certifications: [{ ...emptyCertification }],
  otherSections: [{ ...emptyOther }],
};

const defaultSettings = {
  pageSize: 'A4',
  fontFamily: 'Inter',
  fontWeight: 'normal',
  fontSize: 12,
  lineHeight: 1.38,
  bulletSymbol: '•',
  skillsLayout: 'grid',
  accentColor: '',
  includeMargins: true,
  margin: 26,
  showSectionBoxes: false,
};

const tabs = [
  ['personal', 'Personal Info'],
  ['summary', 'Summary'],
  ['education', 'Education'],
  ['skills', 'Skills'],
  ['experience', 'Work / Internship'],
  ['projects', 'Projects'],
  ['certifications', 'Certifications'],
  ['other', 'Other Sections'],
  ['settings', 'Settings'],
];

const otherOptions = [
  'Hobbies',
  'Languages',
  'Strengths',
  'Weakness',
  'Publication',
  'Extra Curricular Activities',
  'Custom Section',
];

const pageSizes = {
  A4: { width: 608.12, height: 860.1, pdfWidth: 210, pdfHeight: 297 },
  B4: { width: 690, height: 974.28, pdfWidth: 250, pdfHeight: 353 },
};

const pdfPageSizes = {
  A4: [595.28, 841.89],
  B4: [708.66, 1000.63],
};

const pdfFontMap = {
  Inter: 'Helvetica',
  Arial: 'Helvetica',
  Georgia: 'Times-Roman',
  'Times New Roman': 'Times-Roman',
  Verdana: 'Helvetica',
};

const getPdfLines = (value) =>
  String(value || '')
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const typedBullet = item.match(/^([-*•▪→])\s*[-*•▪→]*\s*(.*)$/);
      return typedBullet ? { bullet: typedBullet[1], text: typedBullet[2] } : { bullet: '', text: item };
    });

const PdfIcon = ({ kind, color = '#1e3a8a' }) => {
  const iconProps = { width: 8, height: 8, viewBox: '0 0 24 24' };
  const pathProps = { stroke: color, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

  if (kind === 'email') {
    return (
      <Svg {...iconProps}>
        <Path {...pathProps} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
        <Path {...pathProps} d="m22 6-10 7L2 6" />
      </Svg>
    );
  }

  if (kind === 'location') {
    return (
      <Svg {...iconProps}>
        <Path {...pathProps} d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <Path {...pathProps} d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </Svg>
    );
  }

  if (kind === 'linkedin') {
    return (
      <Svg {...iconProps}>
        <Path {...pathProps} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <Path {...pathProps} d="M2 9h4v12H2z" />
        <Path {...pathProps} d="M4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
      </Svg>
    );
  }

  if (kind === 'github') {
    return (
      <Svg {...iconProps}>
        <Path {...pathProps} d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-6.5.08-1.3-.27-2.58-1-3.65.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5a10.4 10.4 0 0 0-6 0C8 1.35 7 1.35 7 1.35a7 7 0 0 0 0 3.5A6 6 0 0 0 6 8.5C6 13 9 15 12 15a4.8 4.8 0 0 0-1 3.5v4" />
        <Path {...pathProps} d="M9 18c-4.5 2-5-2-7-2" />
      </Svg>
    );
  }

  return (
    <Svg {...iconProps}>
      <Path {...pathProps} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.34 1.9.63 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.29 1.84.5 2.8.63A2 2 0 0 1 22 16.92Z" />
    </Svg>
  );
};

const createPdfStyles = ({ accent, settings, templateId }) => {
  const fontFamily = pdfFontMap[settings.fontFamily] || 'Helvetica';
  const fontSize = Number(settings.fontSize) || 12;
  const margin = settings.includeMargins ? Number(settings.margin) || 26 : 16;
  const isSidebar = Number(templateId) === 10;
  const isPhotoHeader = [6, 9, 10].includes(Number(templateId));

  return StyleSheet.create({
    page: {
      padding: margin,
      backgroundColor: '#ffffff',
      color: '#111827',
      fontFamily,
      fontSize,
      lineHeight: Number(settings.lineHeight) || 1.38,
      fontWeight: settings.fontWeight === 'bold' ? 700 : 400,
    },
    shell: {
      flexDirection: isSidebar ? 'row' : 'column',
      minHeight: '100%',
    },
    sidebar: {
      width: isSidebar ? '30%' : '100%',
      paddingRight: isSidebar ? 18 : 0,
      borderRightWidth: isSidebar ? 1 : 0,
      borderRightColor: '#e2e8f0',
    },
    main: {
      flex: 1,
      paddingLeft: isSidebar ? 18 : 0,
    },
    header: {
      flexDirection: 'column',
      marginBottom: 18,
      paddingBottom: 0,
    },
    headerInner: {
      flexDirection: isPhotoHeader ? 'row' : 'column',
      alignItems: isPhotoHeader ? 'center' : 'center',
      minHeight: isPhotoHeader ? 72 : 52,
      paddingBottom: 8,
    },
    headerDivider: {
      height: 1,
      backgroundColor: accent,
      width: '100%',
    },
    photo: {
      width: 62,
      height: 62,
      marginRight: isPhotoHeader ? 18 : 0,
      objectFit: 'cover',
      backgroundColor: '#f1f5f9',
    },
    photoPlaceholder: {
      width: 62,
      height: 62,
      marginRight: isPhotoHeader ? 18 : 0,
      backgroundColor: '#f1f5f9',
      borderWidth: 1,
      borderColor: '#cbd5e1',
    },
    headerText: {
      flex: 1,
      alignItems: isPhotoHeader ? 'flex-start' : 'center',
    },
    name: {
      color: accent,
      fontSize: fontSize + 10,
      fontWeight: 700,
      letterSpacing: Number(templateId) === 5 ? 4 : 0,
      textAlign: isPhotoHeader ? 'left' : 'center',
      marginBottom: 8,
      textTransform: Number(templateId) === 5 ? 'uppercase' : 'none',
    },
    contactLine: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: isPhotoHeader ? 'flex-start' : 'center',
      marginTop: 0,
      width: '100%',
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 14,
      marginBottom: 5,
      minHeight: 12,
      maxWidth: 150,
    },
    contactIcon: {
      width: 9,
      height: 9,
      marginRight: 5,
      flexShrink: 0,
    },
    contactText: {
      fontSize: Math.max(8, fontSize - 3),
      color: '#334155',
      lineHeight: 1.15,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      color: Number(templateId) === 6 ? '#002b6c' : '#111827',
      backgroundColor: [1, 3, 6, 10].includes(Number(templateId)) ? accent : 'transparent',
      fontSize: fontSize + 3,
      fontWeight: 700,
      textTransform: 'uppercase',
      paddingVertical: [1, 3, 6, 10].includes(Number(templateId)) ? 6 : 0,
      paddingHorizontal: [1, 3, 6, 10].includes(Number(templateId)) ? 8 : 0,
      marginBottom: 8,
      borderBottomWidth: [1, 3, 6, 10].includes(Number(templateId)) ? 0 : 1,
      borderBottomColor: accent,
    },
    sectionTitleBarText: {
      color: [1, 3, 6, 10].includes(Number(templateId)) ? '#ffffff' : '#111827',
    },
    paragraph: {
      color: '#334155',
      marginBottom: 4,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 7,
    },
    rowMain: {
      flex: 1,
      paddingRight: 12,
    },
    rowRight: {
      color: accent,
      fontSize: Math.max(9, fontSize - 2),
      fontWeight: 700,
      textAlign: 'right',
      minWidth: 90,
    },
    strong: {
      fontWeight: 700,
      color: '#111827',
    },
    muted: {
      color: '#475569',
    },
    bulletRow: {
      flexDirection: 'row',
      marginBottom: 3,
      paddingRight: 4,
    },
    bullet: {
      width: 12,
      color: accent,
      fontWeight: 700,
    },
    bulletText: {
      flex: 1,
      color: '#334155',
    },
    skillGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillPill: {
      color: '#334155',
      marginRight: 12,
      marginBottom: 5,
    },
    link: {
      color: accent,
      textDecoration: 'none',
      fontWeight: 700,
    },
  });
};

const PdfSectionTitle = ({ styles, children }) => (
  <View style={styles.sectionTitle}>
    <Text style={styles.sectionTitleBarText}>{children}</Text>
  </View>
);

const PdfDetailLines = ({ styles, text, bulletSymbol }) => {
  const lines = getPdfLines(text);
  if (!lines.length) return null;

  return (
    <View>
      {lines.map((line, index) =>
        line.bullet ? (
          <View style={styles.bulletRow} key={`${line.text}-${index}`}>
            <Text style={styles.bullet}>{line.bullet || bulletSymbol}</Text>
            <Text style={styles.bulletText}>{line.text}</Text>
          </View>
        ) : (
          <Text style={styles.paragraph} key={`${line.text}-${index}`}>{line.text}</Text>
        )
      )}
    </View>
  );
};

const PdfResumeDocument = ({ accent, contactItems, fullName, normalizeUrl, pageSize, resume, sectionLabels, settings, supportsPhoto, templateId }) => {
  const styles = createPdfStyles({ accent, settings, templateId });
  const skillItems = resume.skills.flatMap((skill) =>
    splitSkillItems(skill.items).map((item) => ({ category: skill.category, item }))
  );
  const isSidebar = Number(templateId) === 10;
  const pageSizeValue = pdfPageSizes[pageSize] || pdfPageSizes.A4;

  const Header = (
    <View style={styles.header}>
      <View style={styles.headerInner}>
      {supportsPhoto && (
        resume.personal.photo ? (
          <Image src={resume.personal.photo} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder} />
        )
      )}
      <View style={styles.headerText}>
        <Text style={styles.name}>{fullName}</Text>
        <View style={styles.contactLine}>
          {contactItems.map((item) => {
            return (
              <View style={styles.contactItem} key={`${item.kind}-${item.label}`} wrap={false}>
                <View style={styles.contactIcon}><PdfIcon kind={item.kind} color={accent} /></View>
                <Text style={styles.contactText}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
      </View>
      <View style={styles.headerDivider} />
    </View>
  );

  const SummarySection = (
    <View style={styles.section} wrap={false}>
      <PdfSectionTitle styles={styles}>{sectionLabels.summary || 'Summary'}</PdfSectionTitle>
      <Text style={styles.paragraph}>{resume.summary || 'Your professional summary will appear here. Keep it clear, role-focused, and achievement-oriented.'}</Text>
    </View>
  );

  const EducationSection = (
    <View style={styles.section}>
      <PdfSectionTitle styles={styles}>Education</PdfSectionTitle>
      {resume.education.map((edu, index) => (
        <View style={styles.row} key={`edu-${index}`} wrap={false}>
          <View style={styles.rowMain}>
            <Text style={styles.strong}>{edu.school || 'School / University'}</Text>
            <Text style={styles.muted}>{edu.degree || 'Stream / Degree'}</Text>
            {edu.score ? <Text style={styles.muted}>{edu.score}</Text> : null}
          </View>
          <Text style={styles.rowRight}>{edu.duration || 'Duration'}</Text>
        </View>
      ))}
    </View>
  );

  const SkillsSection = (
    <View style={styles.section}>
      <PdfSectionTitle styles={styles}>{sectionLabels.skills || 'Skills'}</PdfSectionTitle>
      {skillItems.length ? (
        settings.skillsLayout === 'bullets' ? (
          <View>
            {skillItems.map(({ item }, index) => (
              <View style={styles.bulletRow} key={`${item}-${index}`} wrap={false}>
                <Text style={styles.bullet}>{settings.bulletSymbol}</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.skillGrid}>
            {skillItems.map(({ item }, index) => <Text style={styles.skillPill} key={`${item}-${index}`}>{item}</Text>)}
          </View>
        )
      ) : (
        <View style={styles.skillGrid}>
          {resume.skills.map((skill, index) => (
            <Text style={styles.skillPill} key={`skill-${index}`}>{skill.category}: Skills will appear here</Text>
          ))}
        </View>
      )}
    </View>
  );

  const ExperienceSection = (
    <View style={styles.section}>
      <PdfSectionTitle styles={styles}>{sectionLabels.experience || 'Experience / Internship'}</PdfSectionTitle>
      {resume.experience.map((exp, index) => (
        <View key={`exp-${index}`} wrap={false}>
          <View style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.strong}>{exp.designation || exp.type}</Text>
              {exp.company ? <Text style={styles.muted}>{exp.company}</Text> : null}
            </View>
            <Text style={styles.rowRight}>{exp.duration}</Text>
          </View>
          <PdfDetailLines styles={styles} text={exp.description} bulletSymbol={settings.bulletSymbol} />
        </View>
      ))}
    </View>
  );

  const ProjectsSection = (
    <View style={styles.section}>
      <PdfSectionTitle styles={styles}>Projects</PdfSectionTitle>
      {resume.projects.map((project, index) => (
        <View key={`project-${index}`} wrap={false}>
          {project.link ? (
            <Link src={normalizeUrl(project.link)} style={styles.link}>{project.title || 'Project Title'}</Link>
          ) : (
            <Text style={styles.strong}>{project.title || 'Project Title'}</Text>
          )}
          <PdfDetailLines styles={styles} text={project.bullets} bulletSymbol={settings.bulletSymbol} />
        </View>
      ))}
    </View>
  );

  const CertificationSection = resume.certifications.some((cert) => cert.name || cert.issuer) ? (
    <View style={styles.section}>
      <PdfSectionTitle styles={styles}>{sectionLabels.certifications || 'Certifications'}</PdfSectionTitle>
      {resume.certifications.map((cert, index) => (
        <View style={styles.row} key={`cert-${index}`} wrap={false}>
          <Text style={styles.strong}>{cert.name}</Text>
          <Text style={styles.rowRight}>{cert.issuer}</Text>
        </View>
      ))}
    </View>
  ) : null;

  const OtherSections = resume.otherSections.some((item) => item.content || item.bullets)
    ? resume.otherSections.map((item, index) => (
      <View style={styles.section} key={`other-${index}`}>
        <PdfSectionTitle styles={styles}>{sectionLabels.other || item.title}</PdfSectionTitle>
        {item.mode === 'bullets' ? (
          <PdfDetailLines styles={styles} text={item.bullets} bulletSymbol={settings.bulletSymbol} />
        ) : (
          <Text style={styles.paragraph}>{item.content}</Text>
        )}
      </View>
    ))
    : null;

  return (
    <Document title={`${fullName} Resume`}>
      <Page size={pageSizeValue} style={styles.page} wrap>
        <View style={styles.shell}>
          {isSidebar ? (
            <>
              <View style={styles.sidebar}>{Header}{SkillsSection}{OtherSections}</View>
              <View style={styles.main}>{SummarySection}{ExperienceSection}{EducationSection}{ProjectsSection}{CertificationSection}</View>
            </>
          ) : (
            <View style={styles.main}>{Header}{SummarySection}{EducationSection}{SkillsSection}{ExperienceSection}{ProjectsSection}{CertificationSection}{OtherSections}</View>
          )}
        </View>
      </Page>
    </Document>
  );
};

const Field = ({ label, value, onChange, placeholder, type = 'text', className = '' }) => (
  <label className={`universal-field ${className}`}>
    <span>{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder || label} />
  </label>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 4, className = '' }) => (
  <label className={`universal-field ${className}`}>
    <span>{label}</span>
    <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder || label} rows={rows} />
  </label>
);

const splitSkillItems = (value) =>
  String(value || '')
    .split(/\n|,/)
    .map((item) => item.trim().replace(/^[-*•▪→]\s*/, ''))
    .filter(Boolean);

const ResumeTemplateEditor = ({ templateId = 1 }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [resume, setResume] = useState(defaultResume);
  const [settings, setSettings] = useState(defaultSettings);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const previewRef = useRef(null);

  const theme = templateThemes[templateId] || templateThemes[1];
  const sectionLabels = templateSectionLabels[Number(templateId)] || {};
  const supportsPhoto = [6, 9, 10].includes(Number(templateId));
  const usesClassicContactHeader = Number(templateId) === 1;
  const accent = settings.accentColor || theme.accent;
  const page = pageSizes[settings.pageSize] || pageSizes.A4;
  const skillItems = resume.skills.flatMap((skill) =>
    splitSkillItems(skill.items).map((item) => ({ category: skill.category, item }))
  );
  const hasSummary = Boolean(resume.summary.trim());
  const hasEducation = resume.education.some((entry) => Object.values(entry).some((value) => String(value).trim()));
  const hasExperience = resume.experience.some((entry) =>
    [entry.company, entry.designation, entry.duration, entry.description].some((value) => String(value).trim())
  );
  const hasProjects = resume.projects.some((entry) =>
    [entry.title, entry.link, entry.bullets].some((value) => String(value).trim())
  );
  useEffect(() => {
    const paper = previewRef.current;
    const content = paper?.querySelector('.universal-resume-content');
    if (!content) return undefined;

    const updatePageCount = () => {
      const nextCount = Math.max(1, Math.ceil((content.scrollHeight - 1) / page.height));
      setPageCount((currentCount) => (currentCount === nextCount ? currentCount : nextCount));
    };

    updatePageCount();
    const observer = new ResizeObserver(updatePageCount);
    observer.observe(content);
    return () => observer.disconnect();
  }, [page.height, templateId]);

  const update = (section, value) => setResume((prev) => ({ ...prev, [section]: value }));
  const updatePersonal = (field, value) =>
    setResume((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  const updateSettings = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));

  const updateArray = (section, index, field, value) => {
    setResume((prev) => {
      const next = [...prev[section]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [section]: next };
    });
  };

  const addArrayItem = (section, item) => update(section, [...resume[section], { ...item }]);
  const removeArrayItem = (section, index) => update(section, resume[section].filter((_, itemIndex) => itemIndex !== index));

  const fullName = `${resume.personal.firstName || 'First Name'} ${resume.personal.lastName || 'Last Name'}`.trim();
  const linkLabelName = fullName.replace(/First Name|Last Name/g, '').trim() || 'Profile';

  const handlePhotoUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonal('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const normalizeUrl = (value) => {
    if (!value) return '';
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setDownloadError('');
    setIsDownloading(true);
    let objectUrl;
    try {
      const filenameName = fullName
        .replace(/First Name|Last Name/g, '')
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase() || 'resume';

      const document = (
        <PdfResumeDocument
          accent={accent}
          contactItems={headerContactItems}
          fullName={fullName}
          normalizeUrl={normalizeUrl}
          pageSize={settings.pageSize}
          resume={resume}
          sectionLabels={sectionLabels}
          settings={settings}
          supportsPhoto={supportsPhoto}
          templateId={templateId}
        />
      );
      const blob = await pdf(document).toBlob();
      objectUrl = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = objectUrl;
      link.download = `${filenameName}-resume.pdf`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      setDownloadError('Could not generate the PDF. Please try again.');
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setIsDownloading(false);
    }
  };

  const contactItems = [
    resume.personal.phone && { kind: 'phone', type: 'text', icon: Phone, label: resume.personal.phone },
    resume.personal.email && { kind: 'email', type: 'email', icon: Mail, label: resume.personal.email, href: `mailto:${resume.personal.email}` },
    resume.personal.location && { kind: 'location', type: 'text', icon: MapPin, label: resume.personal.location },
    resume.personal.linkedin && {
      kind: 'linkedin',
      type: 'link',
      icon: Linkedin,
      label: resume.personal.linkedinLabel || `${linkLabelName} LinkedIn`,
      href: normalizeUrl(resume.personal.linkedin),
    },
    resume.personal.github && {
      kind: 'github',
      type: 'link',
      icon: Github,
      label: resume.personal.githubLabel || `${linkLabelName} GitHub`,
      href: normalizeUrl(resume.personal.github),
    },
  ].filter(Boolean);
  const contactOrder = {
    1: ['phone', 'email', 'linkedin', 'github'],
    2: ['phone', 'location', 'email', 'linkedin', 'github'],
    3: ['phone', 'location', 'linkedin', 'github', 'email'],
    4: ['location', 'email', 'phone', 'linkedin', 'github'],
    5: ['phone', 'email', 'linkedin', 'github', 'location'],
    6: ['phone', 'email', 'linkedin', 'github', 'location'],
    7: ['phone', 'email', 'github', 'linkedin', 'location'],
    8: ['phone', 'location', 'linkedin', 'github', 'email'],
    9: ['location', 'phone', 'email', 'linkedin', 'github'],
    10: ['phone', 'email', 'location', 'linkedin', 'github'],
  };
  const itemsByKind = Object.fromEntries(contactItems.map((item) => [item.kind, item]));
  const headerContactItems = (contactOrder[Number(templateId)] || contactItems.map((item) => item.kind))
    .map((kind) => itemsByKind[kind])
    .filter(Boolean);

  const previewVars = useMemo(
    () => ({
      '--resume-accent': accent,
      '--resume-font-family': settings.fontFamily,
      '--resume-font-weight': settings.fontWeight,
      '--resume-font-size': `${settings.fontSize}px`,
      '--resume-line-height': settings.lineHeight,
      '--resume-margin': settings.includeMargins ? `${settings.margin}px` : '16px',
      '--resume-page-height': `${page.height}px`,
      width: `min(100%, ${page.width}px)`,
      maxWidth: '100%',
      minWidth: 0,
      height: 'auto',
      minHeight: `${page.height * pageCount}px`,
    }),
    [accent, page.height, page.width, pageCount, settings]
  );

  const SectionTitle = ({ children }) => (
    <h2 className={`universal-preview-section-title section-${theme.section}`}>{children}</h2>
  );

  const renderDetailLines = (text) => {
    const lines = String(text || '')
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!lines.length) return null;
    return (
      <div className="detail-lines">
        {lines.map((line, index) => {
          const typedBullet = line.match(/^([-*•▪→])\s*[-*•▪→]*\s*(.*)$/);
          return typedBullet ? (
            <p className="detail-bullet" key={`${line}-${index}`}>
              <span>{typedBullet[1]}</span>
              {typedBullet[2]}
            </p>
          ) : (
            <p key={`${line}-${index}`}>{line}</p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="universal-resume-editor resume-editor">
      <aside className="form-side universal-form-side">
        <div className="universal-form-header">
          <p>Template {templateId}</p>
          <h2>Resume Details</h2>
        </div>

        <div className="universal-tabs" aria-label="Resume form sections">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" onClick={() => setActiveTab(id)} className={activeTab === id ? 'is-active' : ''}>
              {label}
            </button>
          ))}
        </div>

        <div className="universal-form-panel">
          {activeTab === 'personal' && (
            <div className="universal-grid">
              <Field label="First Name" value={resume.personal.firstName} onChange={(value) => updatePersonal('firstName', value)} />
              <Field label="Last Name" value={resume.personal.lastName} onChange={(value) => updatePersonal('lastName', value)} />
              <Field label="Email" type="email" value={resume.personal.email} onChange={(value) => updatePersonal('email', value)} />
              <Field label="Phone Number" value={resume.personal.phone} onChange={(value) => updatePersonal('phone', value)} />
              <Field label="Location" value={resume.personal.location} onChange={(value) => updatePersonal('location', value)} />
              <Field label="LinkedIn URL" value={resume.personal.linkedin} onChange={(value) => updatePersonal('linkedin', value)} />
              <Field label="LinkedIn Display Name" value={resume.personal.linkedinLabel} onChange={(value) => updatePersonal('linkedinLabel', value)} placeholder="e.g., John LinkedIn / Julia LinkedIn" />
              <Field label="GitHub URL" value={resume.personal.github} onChange={(value) => updatePersonal('github', value)} />
              <Field label="GitHub Display Name" value={resume.personal.githubLabel} onChange={(value) => updatePersonal('githubLabel', value)} placeholder="e.g., John GitHub / Julia GitHub" />
              {supportsPhoto && (
                <label className="universal-field span-2">
                  <span>Profile Photo</span>
                  <input type="file" accept="image/*" onChange={(event) => handlePhotoUpload(event.target.files?.[0])} />
                </label>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <TextArea label="Summary / About" value={resume.summary} onChange={(value) => update('summary', value)} rows={7} />
          )}

          {activeTab === 'education' && (
            <ArrayEditor title="Education" onAdd={() => addArrayItem('education', emptyEducation)}>
              {resume.education.map((edu, index) => (
                <div className="universal-repeat" key={index}>
                  <Field label="School / University" value={edu.school} onChange={(value) => updateArray('education', index, 'school', value)} />
                  <Field label="Stream / Degree" value={edu.degree} onChange={(value) => updateArray('education', index, 'degree', value)} />
                  <Field label="Duration" value={edu.duration} onChange={(value) => updateArray('education', index, 'duration', value)} />
                  <Field label="CGPA / GPA / Percentage" value={edu.score} onChange={(value) => updateArray('education', index, 'score', value)} />
                  {resume.education.length > 1 && <RemoveButton onClick={() => removeArrayItem('education', index)} />}
                </div>
              ))}
            </ArrayEditor>
          )}

          {activeTab === 'skills' && (
            <>
              <label className="universal-field universal-layout-choice">
                <span>Skills Presentation</span>
                <select value={settings.skillsLayout} onChange={(event) => updateSettings('skillsLayout', event.target.value)}>
                  <option value="grid">Rows and Columns</option>
                  <option value="bullets">Bullet Points</option>
                </select>
              </label>
              <ArrayEditor title="Skills" onAdd={() => addArrayItem('skills', { category: 'Skill Category', items: '' })}>
                {resume.skills.map((skill, index) => (
                  <div className="universal-repeat" key={index}>
                    <Field label="Skill Type" value={skill.category} onChange={(value) => updateArray('skills', index, 'category', value)} />
                    <TextArea label="Skills" value={skill.items} onChange={(value) => updateArray('skills', index, 'items', value)} placeholder="React, Python, Communication..." rows={3} />
                    {resume.skills.length > 1 && <RemoveButton onClick={() => removeArrayItem('skills', index)} />}
                  </div>
                ))}
              </ArrayEditor>
            </>
          )}

          {activeTab === 'experience' && (
            <ArrayEditor title="Work Experience / Internship" onAdd={() => addArrayItem('experience', emptyExperience)}>
              {resume.experience.map((exp, index) => (
                <div className="universal-repeat" key={index}>
                  <label className="universal-field">
                    <span>Type</span>
                    <select value={exp.type} onChange={(event) => updateArray('experience', index, 'type', event.target.value)}>
                      <option>Work Experience</option>
                      <option>Internship</option>
                    </select>
                  </label>
                  <Field label="Company Name" value={exp.company} onChange={(value) => updateArray('experience', index, 'company', value)} />
                  <Field label="Designation" value={exp.designation} onChange={(value) => updateArray('experience', index, 'designation', value)} />
                  <Field label="Duration" value={exp.duration} onChange={(value) => updateArray('experience', index, 'duration', value)} />
                  <TextArea className="span-2" label="Work Details / Bullet Points" value={exp.description} onChange={(value) => updateArray('experience', index, 'description', value)} rows={4} />
                  {resume.experience.length > 1 && <RemoveButton onClick={() => removeArrayItem('experience', index)} />}
                </div>
              ))}
            </ArrayEditor>
          )}

          {activeTab === 'projects' && (
            <ArrayEditor title="Projects" onAdd={() => addArrayItem('projects', emptyProject)}>
              {resume.projects.map((project, index) => (
                <div className="universal-repeat" key={index}>
                  <Field label="Project Title" value={project.title} onChange={(value) => updateArray('projects', index, 'title', value)} />
                  <Field label="Deploy / Repo Link" value={project.link} onChange={(value) => updateArray('projects', index, 'link', value)} />
                  <TextArea className="span-2" label="Project Bullet Points" value={project.bullets} onChange={(value) => updateArray('projects', index, 'bullets', value)} rows={4} />
                  {resume.projects.length > 1 && <RemoveButton onClick={() => removeArrayItem('projects', index)} />}
                </div>
              ))}
            </ArrayEditor>
          )}

          {activeTab === 'certifications' && (
            <ArrayEditor title="Certifications" onAdd={() => addArrayItem('certifications', emptyCertification)}>
              {resume.certifications.map((cert, index) => (
                <div className="universal-repeat" key={index}>
                  <Field label="Certification Name" value={cert.name} onChange={(value) => updateArray('certifications', index, 'name', value)} />
                  <Field label="Certified Company" value={cert.issuer} onChange={(value) => updateArray('certifications', index, 'issuer', value)} />
                  {resume.certifications.length > 1 && <RemoveButton onClick={() => removeArrayItem('certifications', index)} />}
                </div>
              ))}
            </ArrayEditor>
          )}

          {activeTab === 'other' && (
            <ArrayEditor title="Other Sections" onAdd={() => addArrayItem('otherSections', emptyOther)}>
              {resume.otherSections.map((section, index) => (
                <div className="universal-repeat" key={index}>
                  <label className="universal-field">
                    <span>Section</span>
                    <select value={section.title} onChange={(event) => updateArray('otherSections', index, 'title', event.target.value)}>
                      {otherOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="universal-field">
                    <span>Content Type</span>
                    <select value={section.mode} onChange={(event) => updateArray('otherSections', index, 'mode', event.target.value)}>
                      <option value="text">Text</option>
                      <option value="bullets">Heading Bullet Points</option>
                    </select>
                  </label>
                  {section.mode === 'bullets' ? (
                    <TextArea className="span-2" label="Bullet Points" value={section.bullets} onChange={(value) => updateArray('otherSections', index, 'bullets', value)} rows={4} />
                  ) : (
                    <TextArea className="span-2" label="Details" value={section.content} onChange={(value) => updateArray('otherSections', index, 'content', value)} rows={4} />
                  )}
                  {resume.otherSections.length > 1 && <RemoveButton onClick={() => removeArrayItem('otherSections', index)} />}
                </div>
              ))}
            </ArrayEditor>
          )}

          {activeTab === 'settings' && (
            <div className="universal-grid">
              <label className="universal-field">
                <span>Resume Size</span>
                <select value={settings.pageSize} onChange={(event) => updateSettings('pageSize', event.target.value)}>
                  <option>A4</option>
                  <option>B4</option>
                </select>
              </label>
              <label className="universal-field">
                <span>Font Family</span>
                <select value={settings.fontFamily} onChange={(event) => updateSettings('fontFamily', event.target.value)}>
                  <option>Inter</option>
                  <option>Arial</option>
                  <option>Georgia</option>
                  <option>Times New Roman</option>
                  <option>Verdana</option>
                </select>
              </label>
              <label className="universal-field">
                <span>Font Style</span>
                <select value={settings.fontWeight} onChange={(event) => updateSettings('fontWeight', event.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
              <Field label="Font Size" type="number" value={settings.fontSize} onChange={(value) => updateSettings('fontSize', Number(value))} />
              <Field label="Line Spacing" type="number" value={settings.lineHeight} onChange={(value) => updateSettings('lineHeight', Number(value))} />
              <label className="universal-field">
                <span>Skills Bullet Symbol</span>
                <select value={settings.bulletSymbol} onChange={(event) => updateSettings('bulletSymbol', event.target.value)}>
                  <option>•</option>
                  <option>-</option>
                  <option>*</option>
                  <option>▪</option>
                  <option>→</option>
                </select>
              </label>
              <Field label="Accent Color" type="color" value={accent} onChange={(value) => updateSettings('accentColor', value)} />
              <Field label="Margin" type="number" value={settings.margin} onChange={(value) => updateSettings('margin', Number(value))} />
              <label className="universal-toggle"><input type="checkbox" checked={settings.includeMargins} onChange={(event) => updateSettings('includeMargins', event.target.checked)} /> Include margins</label>
              <label className="universal-toggle"><input type="checkbox" checked={settings.showSectionBoxes} onChange={(event) => updateSettings('showSectionBoxes', event.target.checked)} /> Show section boxes</label>
            </div>
          )}
        </div>
      </aside>

      <section className="preview-side universal-preview-side">
        <div className="universal-preview-toolbar">
          <div>
            <p>Live preview</p>
            <span>{settings.pageSize} document · {pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
          </div>
          <button type="button" className="universal-download-btn" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <LoaderCircle size={18} className="download-spinner" /> : <Download size={18} />}
            {isDownloading ? 'Preparing PDF' : 'Download PDF'}
          </button>
          {downloadError && <p className="universal-download-error" role="alert">{downloadError}</p>}
        </div>
        <div ref={previewRef} data-template={templateId} data-pages={pageCount} className={`universal-resume-paper template-${templateId} header-${theme.header} ${settings.showSectionBoxes ? 'show-boxes' : ''} ${pageCount > 1 ? 'has-multiple-pages' : ''}`} style={previewVars}>
          <div className="universal-resume-content">
            <header>
              {supportsPhoto && (
                resume.personal.photo ? (
                  <img className="resume-profile-photo" src={resume.personal.photo} alt={`${fullName} profile`} />
                ) : (
                  <div className="resume-profile-photo resume-profile-photo-placeholder" aria-label="Profile photo preview" />
                )
              )}
              <h1>{fullName}</h1>
              {usesClassicContactHeader && resume.personal.location && (
                <p className="classic-header-location">{resume.personal.location}</p>
              )}
              {headerContactItems.length > 0 && <div className="contact-line">
                {headerContactItems.map((item) => {
                  const Icon = item.icon;
                  return item.href ? (
                    <a className={`contact-item contact-${item.kind}`} key={`${item.label}-${item.href}`} href={item.href} target={item.type === 'link' ? '_blank' : undefined} rel={item.type === 'link' ? 'noreferrer' : undefined}>
                      <span className="contact-icon" aria-hidden="true">
                        <Icon size={13} strokeWidth={2.5} />
                      </span>
                      <span className="contact-label">{item.label}</span>
                    </a>
                  ) : (
                    <span className={`contact-item contact-${item.kind}`} key={item.label}>
                      <span className="contact-icon" aria-hidden="true">
                        <Icon size={13} strokeWidth={2.5} />
                      </span>
                      <span className="contact-label">{item.label}</span>
                    </span>
                  );
                })}
              </div>}
            </header>

            <section className={`summary-section ${hasSummary ? '' : 'is-empty-section'}`}>
              <SectionTitle>{sectionLabels.summary || 'Summary'}</SectionTitle>
              <p>{resume.summary || 'Your professional summary will appear here. Keep it clear, role-focused, and achievement-oriented.'}</p>
            </section>

            <section className={`education-section ${hasEducation ? '' : 'is-empty-section'}`}>
              <SectionTitle>Education</SectionTitle>
              {resume.education.map((edu, index) => (
                <div className="preview-row" key={index}>
                  <div>
                    <strong>{edu.school || 'School / University'}</strong>
                    <p>{edu.degree || 'Stream / Degree'}</p>
                    {edu.score && <p>{edu.score}</p>}
                  </div>
                  <span>{edu.duration || 'Duration'}</span>
                </div>
              ))}
            </section>

            <section className={`skills-section ${skillItems.length > 0 ? '' : 'is-empty-section'}`}>
              <SectionTitle>{sectionLabels.skills || 'Skills'}</SectionTitle>
              {skillItems.length ? (
                settings.skillsLayout === 'bullets' ? (
                  <ul className="skills-item-list">
                    {skillItems.map(({ item }, index) => (
                      <li key={`${item}-${index}`}><span>{settings.bulletSymbol}</span>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="skills-items-grid">
                    {skillItems.map(({ item }, index) => <span key={`${item}-${index}`}>{item}</span>)}
                  </div>
                )
              ) : (
                <div className="skills-grid is-grid">
                  {resume.skills.map((skill, index) => (
                    <div key={index}>
                      <strong>{skill.category}</strong>
                      <p>Skills will appear here</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={`experience-section ${hasExperience ? '' : 'is-empty-section'}`}>
              <SectionTitle>{sectionLabels.experience || 'Experience / Internship'}</SectionTitle>
              {resume.experience.map((exp, index) => (
                <div className="preview-item" key={index}>
                  <div className="preview-row">
                    <strong>{exp.designation || exp.type}</strong>
                    <span>{exp.duration}</span>
                  </div>
                  <p>{exp.company}</p>
                  {renderDetailLines(exp.description)}
                </div>
              ))}
            </section>

            <section className={`projects-section ${hasProjects ? '' : 'is-empty-section'}`}>
              <SectionTitle>Projects</SectionTitle>
              {resume.projects.map((project, index) => (
                <div className="preview-item" key={index}>
                  {project.link ? (
                    <a href={normalizeUrl(project.link)} target="_blank" rel="noreferrer"><strong>{project.title || 'Project Title'}</strong></a>
                  ) : (
                    <strong>{project.title || 'Project Title'}</strong>
                  )}
                  {renderDetailLines(project.bullets)}
                </div>
              ))}
            </section>

            {resume.certifications.some((cert) => cert.name || cert.issuer) && (
              <section className="certifications-section">
                <SectionTitle>{sectionLabels.certifications || 'Certifications'}</SectionTitle>
                {resume.certifications.map((cert, index) => (
                  <div className="preview-row" key={index}>
                    <strong>{cert.name}</strong>
                    <span>{cert.issuer}</span>
                  </div>
                ))}
              </section>
            )}

            {resume.otherSections.some((item) => item.content || item.bullets) && resume.otherSections.map((item, index) => (
              <section className="other-section" key={index}>
                <SectionTitle>{sectionLabels.other || item.title}</SectionTitle>
                {item.mode === 'bullets' ? renderDetailLines(item.bullets) : <p>{item.content}</p>}
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ArrayEditor = ({ title, onAdd, children }) => (
  <div>
    <div className="universal-array-heading">
      <h3>{title}</h3>
      <button type="button" onClick={onAdd}>+ Add Details</button>
    </div>
    <div className="universal-array-list">{children}</div>
  </div>
);

const RemoveButton = ({ onClick }) => (
  <button type="button" className="universal-remove" onClick={onClick}>Remove</button>
);

export default ResumeTemplateEditor;
