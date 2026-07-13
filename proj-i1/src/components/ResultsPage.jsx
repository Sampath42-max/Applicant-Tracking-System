import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const scoreMeta = [
  { key: 'experienceSkillsScore', label: 'Content', note: 'Experience, skills, and relevance' },
  { key: 'structureFormattingScore', label: 'Formatting', note: 'ATS-safe structure and readability' },
  { key: 'grammarReadabilityScore', label: 'Impact', note: 'Clarity, metrics, and action language' },
  { key: 'keywordMatchingScore', label: 'Keywords', note: 'Role and industry keyword coverage' },
];

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, analysisType, targetRole: stateTargetRole } = location.state || {};

  useEffect(() => {
    if (!analysis || !analysisType) {
      navigate('/resume-checker', { state: { error: 'No analysis data available.' } });
    }
  }, [analysis, analysisType, navigate]);

  if (!analysis || !analysisType) return null;

  const targetRole = stateTargetRole || analysis.targetRole || '';
  const details = analysis.normalScoreDetails || {};
  const overallScore = Number(analysis.normalScore || 0);

  const cleanText = (value) => {
    if (value === null || value === undefined) return '';
    let text = String(value);

    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      text = textarea.value;
    }

    const printableText = Array.from(text)
      .filter((char) => {
        const code = char.charCodeAt(0);
        return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126);
      })
      .join('');

    return printableText
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/(?:&[A-Za-z0-9#]+;?){2,}/g, ' ')
      .replace(/&[#A-Za-z0-9]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[-*•\d.)\s]+/, '')
      .trim();
  };

  const cleanList = (items = []) =>
    items
      .map(cleanText)
      .filter((item) => item && item.length > 2)
      .slice(0, 8);

  const suggestions = (() => {
    const aiSuggestions = cleanList(details.improvements || []).map((description, index) => ({
      title: targetRole ? `${targetRole} improvement ${index + 1}` : `Resume improvement ${index + 1}`,
      priority: index < 2 ? 'High priority' : 'Recommended',
      description,
    }));

    if (aiSuggestions.length) return aiSuggestions;

    const generated = [];
    if ((details.keywordMatchingScore || 0) < 80) {
      generated.push({
        title: targetRole ? `Add ${targetRole} keywords` : 'Add stronger role keywords',
        priority: 'High priority',
        description: targetRole
          ? `Add skills, tools, and responsibility phrases that commonly appear in ${targetRole} job descriptions.`
          : 'Add role-specific skills, tools, and responsibility phrases from the jobs you are targeting.',
      });
    }
    if ((details.grammarReadabilityScore || 0) < 80) {
      generated.push({
        title: 'Make achievements measurable',
        priority: 'High priority',
        description: 'Rewrite bullets with action verbs, scope, and measurable outcomes such as percentages, volume, time saved, or quality improvements.',
      });
    }
    if ((details.structureFormattingScore || 0) < 80) {
      generated.push({
        title: 'Improve ATS formatting',
        priority: 'Recommended',
        description: 'Use standard section names, simple bullet lists, consistent dates, and avoid symbols or layouts that can break parsing.',
      });
    }
    return generated;
  })();

  const strengths = cleanList(details.strengths || []);
  const strongKeywords = cleanList(details.keywordAnalysis?.strongKeywords || []);
  const missingKeywords = cleanList(details.keywordAnalysis?.missingKeywords || []);
  const scoreCards = scoreMeta.map((item) => ({
    ...item,
    value: Number(details[item.key] || 0),
  }));

  const scoreTone = overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : overallScore >= 55 ? 'Needs work' : 'Needs major improvement';

  const writeWrapped = (doc, text, x, y, maxWidth, lineHeight = 5) => {
    const lines = doc.splitTextToSize(cleanText(text), maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  const ensurePage = (doc, y, needed = 24) => {
    if (y + needed <= 282) return y;
    doc.addPage();
    return 22;
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    let y = 18;

    doc.setFillColor(18, 24, 38);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.text('Resume Score Report', 18, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(targetRole ? `Target role: ${cleanText(targetRole)}` : 'Target role: General resume review', 18, y + 8);
    doc.text('ATS readiness, content quality, formatting, impact, and keyword review', 18, y + 15);

    y = 56;
    doc.setTextColor(18, 24, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('Overall Score', 18, y);
    doc.setFontSize(32);
    doc.text(`${overallScore}%`, 158, y + 2);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(scoreTone, 158, y + 10);

    y += 22;
    scoreCards.forEach((card, index) => {
      const x = 18 + (index % 2) * 88;
      const rowY = y + Math.floor(index / 2) * 26;
      doc.setDrawColor(220, 226, 235);
      doc.roundedRect(x, rowY, 78, 19, 2, 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(card.label, x + 5, rowY + 7);
      doc.setFontSize(13);
      doc.text(`${card.value}%`, x + 58, rowY + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(cleanText(card.note), x + 5, rowY + 14, { maxWidth: 66 });
    });

    y += 60;
    if (strengths.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Strengths', 18, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      strengths.forEach((item, index) => {
        y = ensurePage(doc, y, 18);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}.`, 18, y);
        doc.setFont('helvetica', 'normal');
        y = writeWrapped(doc, item, 26, y, 164) + 4;
      });
    }

    if (suggestions.length) {
      y = ensurePage(doc, y, 24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Improvement Plan', 18, y);
      y += 8;
      suggestions.forEach((suggestion, index) => {
        y = ensurePage(doc, y, 26);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`${index + 1}. ${cleanText(suggestion.title)}`, 18, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(cleanText(suggestion.priority), 18, y + 5);
        doc.setFontSize(10);
        y = writeWrapped(doc, suggestion.description, 18, y + 11, 174) + 6;
      });
    }

    if (strongKeywords.length || missingKeywords.length) {
      y = ensurePage(doc, y, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Keyword Notes', 18, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      if (strongKeywords.length) {
        y = writeWrapped(doc, `Strong keywords: ${strongKeywords.join(', ')}`, 18, y, 174) + 5;
      }
      if (missingKeywords.length) {
        y = ensurePage(doc, y, 16);
        y = writeWrapped(doc, `Consider adding: ${missingKeywords.join(', ')}`, 18, y, 174) + 5;
      }
    }

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setTextColor(110, 118, 130);
      doc.setFontSize(8);
      doc.text(`ResumeNexa report • Page ${page} of ${pageCount}`, 18, 290);
    }

    doc.save('resume-score-report.pdf');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(135deg,#0f172a_0%,#020617_55%,#020617_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-70" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-amber-500/10 bg-slate-950/70 p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">Resume analysis complete</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">Your resume score report is ready.</h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {targetRole
                ? `Suggestions are tailored for ${targetRole}.`
                : 'This review is role-neutral. Add a target role next time for more specific keyword recommendations.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={handleDownloadReport}
                className="bg-amber-400 px-6 py-3 font-black text-slate-950 shadow-[0_20px_55px_rgba(251,191,36,0.18)] transition hover:-translate-y-1 hover:bg-white"
              >
                Download Report
              </button>
              <button
                onClick={() => navigate('/resume-checker')}
                className="border border-amber-500/15 bg-slate-900/70 px-6 py-3 font-black text-white transition hover:-translate-y-1 hover:border-amber-400"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>

          <div className="border border-amber-500/10 bg-slate-950/70 p-7 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-md">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">Overall resume score</p>
                <p className="mt-3 text-7xl font-black leading-none">{overallScore}%</p>
              </div>
              <span className="rounded-full bg-amber-400/10 px-4 py-2 text-sm font-black text-white">{scoreTone}</span>
            </div>
            <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(overallScore, 100)}%` }} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {scoreCards.map((card) => (
                <div key={card.key} className="rounded-lg border border-amber-500/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black">{card.label}</p>
                    <p className="text-xl font-black text-amber-400">{card.value}%</p>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-white/65">{card.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border border-amber-500/10 bg-slate-950/70 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <h2 className="text-2xl font-black text-white">Strengths</h2>
            <div className="mt-5 space-y-3">
              {(strengths.length ? strengths : ['Your resume has enough information to generate a score. Add a target role for sharper strengths.']).map((item, index) => (
                <div key={index} className="border-l-4 border-amber-400 bg-amber-400/10 p-4">
                  <p className="font-bold leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-amber-500/10 bg-slate-950/70 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <h2 className="text-2xl font-black text-white">Improvement Plan</h2>
            <div className="mt-5 space-y-4">
              {suggestions.map((suggestion, index) => (
                <article key={index} className="border border-amber-500/10 bg-slate-900/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-white">{suggestion.title}</h3>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-amber-400">{suggestion.priority}</p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center bg-amber-400 text-sm font-black text-slate-950">{index + 1}</span>
                  </div>
                  <p className="mt-3 leading-6 text-slate-300">{suggestion.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {(strongKeywords.length > 0 || missingKeywords.length > 0) && (
          <section className="mt-6 border border-amber-500/10 bg-slate-950/70 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <h2 className="text-2xl font-black text-white">Keyword Analysis</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="font-black text-amber-400">Strong keywords found</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {strongKeywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-amber-400/10 px-3 py-1 text-sm font-bold text-white">{keyword}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-black text-rose-300">Consider adding</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {missingKeywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-rose-400/10 px-3 py-1 text-sm font-bold text-rose-100">{keyword}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
