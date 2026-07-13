import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ResumeChecker = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [targetRole, setTargetRole] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please upload a smaller file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleFileChange = (event) => {
    validateAndSetFile(event.target.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    validateAndSetFile(event.dataTransfer.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
  };

  const handleAnalyze = () => {
    if (!file) {
      setError('Please select a resume file to analyze.');
      return;
    }

    navigate('/loading', {
      state: {
        file,
        targetRole: targetRole.trim(),
        companyId: null,
        withCompany: false,
      },
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const index = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, index)) * 100) / 100} ${sizes[index]}`;
  };

  const openFilePicker = () => {
    document.getElementById('resumeFileInput')?.click();
  };

  const reviewPillars = [
    { label: 'ATS parsing', value: '96%', tone: 'bg-amber-400' },
    { label: 'Keyword match', value: '88%', tone: 'bg-amber-400' },
    { label: 'Impact writing', value: '74%', tone: 'bg-amber-400' },
  ];

  const analysisCards = [
    {
      title: 'Role-fit keywords',
      text: 'Checks whether your resume speaks the same language as the job you want.',
    },
    {
      title: 'Content strength',
      text: 'Finds vague bullets and turns attention toward measurable outcomes.',
    },
    {
      title: 'Formatting quality',
      text: 'Looks for ATS blockers, file issues, noisy symbols, and readability gaps.',
    },
    {
      title: 'Downloadable report',
      text: 'Creates a cleaner summary you can keep while improving your resume.',
    },
  ];

  const uploadStateClass = isDragging
    ? 'border-amber-400 bg-amber-400/10 shadow-[0_22px_70px_rgba(251,191,36,0.18)]'
    : file
      ? 'border-emerald-300 bg-emerald-300/10'
      : error
        ? 'border-rose-300 bg-rose-400/10'
        : 'border-amber-500/15 bg-slate-950/55 hover:border-amber-400 hover:bg-slate-950/75';

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-900 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_84%_8%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(135deg,#0f172a_0%,#020617_54%,#020617_100%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(rgba(251,191,36,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.06)_1px,transparent_1px)] bg-[size:38px_38px]" />
      </div>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex min-h-[640px] flex-col justify-between border border-amber-500/10 bg-slate-950/70 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-md sm:p-8 lg:p-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border border-amber-400/35 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.9)]" />
              AI resume audit
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Check your resume before it reaches the recruiter.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Upload your resume, add the target role if you want sharper advice, and get a clean score with focused improvements for ATS, keywords, formatting, and impact.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['PDF, DOC, DOCX', 'Under 5MB', 'Role based tips'].map((item) => (
                <div key={item} className="border border-amber-500/10 bg-slate-950/55 px-4 py-4">
                  <CheckCircleIcon className="mb-3 text-amber-400" />
                  <p className="text-sm font-bold text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border border-amber-500/10 bg-slate-950/70 p-5 text-white shadow-[0_22px_55px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Live report preview</p>
                <h2 className="mt-2 text-2xl font-black">Resume readiness</h2>
              </div>
              <div className="bg-amber-400 px-4 py-2 text-2xl font-black text-slate-950">91</div>
            </div>

            <div className="mt-6 space-y-5">
              {reviewPillars.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-200">{item.label}</span>
                    <span className="font-black text-white">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/15">
                    <div className={`h-2 rounded-full ${item.tone}`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-amber-500/10 bg-slate-950/70 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-md sm:p-7 lg:p-8">
          <div className="mb-7 flex flex-col gap-3 border-b border-amber-500/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">Start analysis</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Resume checker</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-300">
              The role field is optional, but it helps tune keywords and suggestions.
            </p>
          </div>

          <label htmlFor="targetRole" className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-slate-200">
            Target role
          </label>
          <input
            id="targetRole"
            type="text"
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="Frontend Developer, Data Analyst, Cloud Engineer..."
            className="mb-6 h-14 w-full border border-amber-500/15 bg-slate-950/70 px-5 text-base font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-4 focus:ring-[#fbbf24]/15"
          />

          <div
            className={`group flex min-h-[290px] cursor-pointer flex-col items-center justify-center border-2 border-dashed p-7 text-center transition duration-300 ${uploadStateClass}`}
            onClick={openFilePicker}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') openFilePicker();
            }}
          >
            <input
              type="file"
              id="resumeFileInput"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />

            {!file ? (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center bg-amber-400 text-slate-950 shadow-[0_18px_45px_rgba(251,191,36,0.24)] transition group-hover:-translate-y-1">
                  <UploadIcon style={{ fontSize: '2.6rem' }} />
                </div>
                <h3 className="text-2xl font-black text-white">
                  {isDragging ? 'Drop your resume here' : 'Upload your resume'}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                  Drag your file into this panel or click to browse. Keep the file clean and readable for the best analysis.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['PDF', 'DOC', 'DOCX', '5MB max'].map((item) => (
                    <span key={item} className="border border-amber-500/10 bg-slate-900/70 px-3 py-1 text-xs font-bold text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full max-w-xl">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center bg-emerald-400 text-slate-950 shadow-[0_18px_45px_rgba(52,211,153,0.2)]">
                  <InsertDriveFileIcon style={{ fontSize: '2.5rem' }} />
                </div>
                <h3 className="truncate text-2xl font-black text-white">{file.name}</h3>
                <p className="mt-2 text-sm font-semibold text-emerald-200">
                  Ready to analyze • {formatFileSize(file.size)}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="mt-7 inline-flex items-center gap-2 border border-rose-300/30 bg-rose-400/10 px-5 py-3 text-sm font-black text-rose-200 transition hover:border-rose-300 hover:bg-rose-400/20"
                >
                  <DeleteIcon style={{ fontSize: '1.15rem' }} />
                  Remove file
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-5 flex gap-3 border border-rose-300/30 bg-rose-400/10 p-4 text-rose-100">
              <ErrorIcon className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-black">Upload issue</h4>
                <p className="mt-1 text-sm leading-6">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file}
            className={`mt-6 flex h-14 w-full items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.18em] transition ${
              file
                ? 'bg-amber-400 text-slate-950 shadow-[0_18px_45px_rgba(251,191,36,0.18)] hover:-translate-y-0.5 hover:bg-white'
                : 'cursor-not-allowed bg-white/10 text-slate-500'
            }`}
          >
            Analyze resume
            <span className="text-lg">→</span>
          </button>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-6 grid max-w-7xl gap-4 md:grid-cols-4">
        {analysisCards.map((card, index) => (
          <article key={card.title} className="border border-amber-500/10 bg-slate-950/70 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-slate-950">
              {index + 1}
            </div>
            <h3 className="text-lg font-black text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default ResumeChecker;
