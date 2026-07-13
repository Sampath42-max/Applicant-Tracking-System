import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiCall } from '../config/api';

const LoadingPage = () => {
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { file, targetRole, companyId, withCompany } = location.state || {};
  const analysisStartedRef = useRef(false);

  useEffect(() => {
    console.log('LoadingPage: Received state:', { file: !!file, targetRole, companyId, withCompany });

    if (!file) {
      console.error('LoadingPage: No file provided');
      navigate('/resume-checker', { state: { error: 'No file provided for analysis.' } });
      return;
    }

    // Show estimated progress while the backend is working. It waits at 92% until the API returns.
    const checklistInterval = setInterval(() => {
      setChecklistProgress((prev) => {
        if (prev >= 92) return prev;
        return Math.min(prev + 3, 92);
      });
    }, 700);

    // Smooth scan progress
    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 50);

    // Rotating step messages
    const steps = [
      'Parsing document structure...',
      'Analyzing keywords...',
      'Checking grammar and readability...',
      'Evaluating formatting...',
      'Calculating final score...',
    ];
    
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    // Perform API call
    const performAnalysis = async () => {
      const formData = new FormData();
      formData.append('resume', file);
      if (targetRole && targetRole.trim()) {
        formData.append('targetRole', targetRole.trim());
      }
      
      // Note: We removed company-specific analysis, so we only use one endpoint
      if (withCompany && companyId) {
        formData.append('companyId', companyId);
      }

      try {
        console.log('LoadingPage: Calling API:', API_ENDPOINTS.RESUME_CHECK);
        
        // Use the new API helper
        const data = await apiCall(API_ENDPOINTS.RESUME_CHECK, {
          method: 'POST',
          body: formData,
        });

        console.log('LoadingPage: API response:', data);
        
        if (!data || Object.keys(data).length === 0) {
          throw new Error('Empty response from API');
        }

        setChecklistProgress(100);
        setTimeout(() => {
          navigate('/results', {
            state: {
              analysis: data,
              targetRole: targetRole || data.targetRole || '',
              analysisType: 'withoutCompany', // Always without company now
            },
          });
        }, 550);
      } catch (error) {
        console.error('LoadingPage: Error uploading resume:', error);
        const errorMessage = error.message || 'Failed to analyze resume. Please check server connection.';
        navigate('/resume-checker', { state: { error: errorMessage } });
      }
    };

    if (!analysisStartedRef.current) {
      analysisStartedRef.current = true;
      performAnalysis();
    }

    return () => {
      clearInterval(checklistInterval);
      clearInterval(scanInterval);
      clearInterval(stepInterval);
    };
  }, [file, targetRole, companyId, withCompany, navigate]);

  const checklistItems = [
    { code: '01', label: 'Reading resume structure', detail: 'Sections, hierarchy, and contact blocks' },
    { code: '02', label: 'Matching ATS signals', detail: 'Keywords, skills, and role alignment' },
    { code: '03', label: 'Reviewing writing quality', detail: 'Grammar, readability, and clarity' },
    { code: '04', label: 'Checking layout safety', detail: 'Formatting patterns that parsers understand' },
    { code: '05', label: 'Preparing final score', detail: 'Weighted feedback and improvement notes' },
  ];

  const steps = [
    'Parsing document structure...',
    'Analyzing keywords...',
    'Checking grammar and readability...',
    'Evaluating formatting...',
    'Calculating final score...',
  ];

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(251,191,36,0.12),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(135deg,#0f172a_0%,#020617_52%,#020617_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col justify-center">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-amber-400/35 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
              Resume score engine
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-none tracking-normal text-white sm:text-5xl lg:text-6xl">
              Analyzing your resume with ATS-grade checks.
            </h1>
          </div>
          <div className="border border-amber-500/10 bg-slate-950/70 px-5 py-4 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">Current pass</p>
            <p className="mt-1 text-base font-extrabold text-white">{steps[currentStep]}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="border border-amber-500/10 bg-slate-950/70 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-400">Document scan</p>
                <h2 className="mt-1 text-2xl font-black text-white">Parsing file content</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center bg-amber-400 text-sm font-black text-slate-950">
                AI
              </div>
            </div>

            <div className="relative mx-auto min-h-[430px] max-w-sm overflow-hidden border border-amber-500/10 bg-white/[0.9] p-7 shadow-2xl shadow-black/30">
              <div className="mb-7 border-b border-slate-200 pb-5">
                <div className="h-5 w-3/4 rounded bg-slate-900" />
                <div className="mt-3 h-2.5 w-1/2 rounded bg-slate-200" />
                <div className="mt-2 h-2.5 w-2/3 rounded bg-slate-200" />
              </div>

              <div className="space-y-4">
                {[92, 76, 84, 62, 95, 70, 88, 58, 79].map((width, index) => (
                  <div key={index} className="grid gap-2">
                    <div
                      className={`h-2 rounded transition-colors duration-500 ${
                        checklistProgress >= (index + 1) * 10 ? 'bg-amber-400' : 'bg-slate-200'
                      }`}
                      style={{ width: `${width}%` }}
                    />
                    {index % 3 === 0 && <div className="h-12 rounded border border-slate-100 bg-slate-50" />}
                  </div>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
                <div
                  className="absolute inset-x-0 h-10 border-y border-amber-400/50 bg-amber-400/20 shadow-[0_0_35px_rgba(251,191,36,0.45)]"
                  style={{ top: `${scanProgress}%`, transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          </section>

          <section className="border border-amber-500/10 bg-slate-950/70 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-400">Analysis progress</p>
                <h2 className="mt-1 text-2xl font-black text-white">Building your score report</h2>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-amber-400">{Math.round(checklistProgress)}%</div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Complete</p>
              </div>
            </div>

            <div className="mb-8 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="loading-progress h-full rounded-full bg-amber-400"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>

            <div className="space-y-3">
              {checklistItems.map((item, index) => {
                const isDone = checklistProgress >= (index + 1) * 20;
                const isActive = !isDone && checklistProgress >= index * 20;

                return (
                  <div
                    key={item.code}
                    className={`grid grid-cols-[52px_1fr_auto] items-center gap-4 rounded-lg border p-4 transition-all duration-300 ${
                      isDone
                        ? 'border-amber-400/30 bg-amber-400/10'
                        : isActive
                        ? 'border-amber-500/20 bg-slate-900/70 shadow-md'
                        : 'border-amber-500/10 bg-slate-950/55'
                    }`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-black ${
                      isDone ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
                    }`}>
                      {isDone ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        item.code
                      )}
                    </div>
                    <div>
                      <p className="font-black text-white">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                      isDone ? 'bg-amber-400 text-slate-950' : isActive ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-500'
                    }`}>
                      {isDone ? 'Done' : isActive ? 'Now' : 'Queued'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 border border-amber-500/10 bg-slate-950/70 p-4">
              <p className="text-sm font-bold leading-6 text-slate-300">
                Keep this page open while your score is generated. Larger PDFs can take a little longer because the text extraction and AI review happen together.
              </p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .loading-progress {
          position: relative;
          overflow: hidden;
          transition: width 500ms ease;
        }

        .loading-progress::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
          animation: loading-sheen 1.8s ease-in-out infinite;
        }

        @keyframes loading-sheen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
