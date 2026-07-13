import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Briefcase, Building2, ExternalLink, Filter, MapPin, Search, X } from 'lucide-react';
import { API_ENDPOINTS, apiCall } from '../config/api.js';
import { AuthContext } from '../components/AuthContext.jsx';

const categories = [
  { id: 'all', label: 'All Jobs', hint: 'Open roles across fields' },
  { id: 'it', label: 'IT', hint: 'Software, data, cloud' },
  { id: 'non-it', label: 'Non-IT', hint: 'Sales, HR, finance' },
  { id: 'core', label: 'Core', hint: 'Mechanical, civil, electrical' },
];

const experienceFilters = [
  ['all', 'Any experience'],
  ['fresher', 'Fresher'],
  ['experienced', 'Experienced'],
];

const workModeFilters = [
  ['all', 'Any mode'],
  ['remote', 'Remote'],
  ['hybrid', 'Hybrid'],
  ['office', 'In office'],
];

const JOBS_PER_PAGE = 10;

const compactText = (value) => (value || '').toString().toLowerCase();

const jobSearchText = (job) => {
  const highlights = Object.values(job.highlights || {}).flat().join(' ');
  return compactText(`${job.title} ${job.company} ${job.location} ${job.description} ${highlights}`);
};

const getWorkMode = (job) => {
  const text = jobSearchText(job);
  if (compactText(job.workMode).includes('hybrid')) return 'hybrid';
  if (compactText(job.workMode).includes('remote')) return 'remote';
  if (job.isRemote || text.includes('remote')) return 'remote';
  if (text.includes('hybrid')) return 'hybrid';
  return 'office';
};

const getExperienceLevel = (job) => {
  const text = jobSearchText(job);
  const requiredExperience = job.requiredExperience || {};
  if (compactText(job.experienceLevel).includes('fresher')) return 'fresher';
  if (compactText(job.experienceLevel).includes('experienced')) return 'experienced';
  if (compactText(job.employmentType).includes('entry level')) return 'fresher';
  if (compactText(job.employmentType).includes('professional')) return 'experienced';
  if (requiredExperience.no_experience_required) return 'fresher';
  if (text.includes('fresher') || text.includes('entry level') || text.includes('graduate') || text.includes('internship')) {
    return 'fresher';
  }
  if (text.includes('senior') || text.includes('lead') || text.includes('manager') || /\b[2-9]\+?\s*(years|yrs)\b/.test(text)) {
    return 'experienced';
  }
  return 'all';
};

const workModeLabel = (job) => ({
  hybrid: 'Hybrid',
  remote: 'Remote',
  office: 'In office',
}[getWorkMode(job)]);

const experienceLabel = (job) => ({
  fresher: 'Fresher',
  experienced: 'Experienced',
  all: 'Experience not specified',
}[getExperienceLevel(job)]);

const highlightEntries = (highlights = {}) => Object.entries(highlights).filter(([, values]) => Array.isArray(values) && values.length > 0);

const Jobs = () => {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [experience, setExperience] = useState('all');
  const [workMode, setWorkMode] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [savingJob, setSavingJob] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const filteredJobs = useMemo(() => {
    const locationNeedle = compactText(locationFilter);
    return jobs.filter((job) => {
      const text = jobSearchText(job);
      const matchesLocation = !locationNeedle || compactText(job.location).includes(locationNeedle) || text.includes(locationNeedle);
      const matchesWorkMode = workMode === 'all' || getWorkMode(job) === workMode;
      const jobExperience = getExperienceLevel(job);
      const matchesExperience = experience === 'all' || jobExperience === experience;
      return matchesLocation && matchesWorkMode && matchesExperience;
    });
  }, [experience, jobs, locationFilter, workMode]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedJobs = filteredJobs.slice(
    (safeCurrentPage - 1) * JOBS_PER_PAGE,
    safeCurrentPage * JOBS_PER_PAGE
  );
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const visible = [...new Set([1, totalPages, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1])]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((left, right) => left - right);
    const pages = [];
    visible.forEach((page, index) => {
      if (index > 0 && page - visible[index - 1] > 1) {
        pages.push(`ellipsis-${page}`);
      }
      pages.push(page);
    });
    return pages;
  }, [safeCurrentPage, totalPages]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        category,
        query,
        date_posted: 'all',
      });
      const data = await apiCall(`${API_ENDPOINTS.JOBS_INDIA}?${params.toString()}`);
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      setCurrentPage(1);
      setSelectedJob(null);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to fetch active jobs right now.');
      setJobs([]);
      setSelectedJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    setCurrentPage(1);
  }, [experience, locationFilter, workMode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJobs();
  };

  const requireLoginForApply = () => {
    navigate('/login', { state: { from: location } });
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      requireLoginForApply();
      return;
    }
    setSavingJob(true);
    setSaveStatus('');
    try {
      const saved = await apiCall(API_ENDPOINTS.SAVED_JOBS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: String(selectedJob.id || selectedJob.applyLink).slice(0, 255),
          title: (selectedJob.title || '').slice(0, 255),
          company: (selectedJob.company || '').slice(0, 255),
          location: (selectedJob.location || '').slice(0, 255),
          description: (selectedJob.description || '').slice(0, 50000),
          applyLink: (selectedJob.applyLink || '').slice(0, 4000),
          publisher: (selectedJob.publisher || 'Company careers').slice(0, 255),
          postedAt: selectedJob.postedAt || null,
        }),
      });
      setSaveStatus(saved.message || 'Job saved to your profile.');
    } catch (saveError) {
      setSaveStatus(saveError.message || 'Could not save this job.');
    } finally {
      setSavingJob(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <section className="relative overflow-hidden border-b border-amber-500/10 px-5 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,191,36,0.12),transparent_42%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fbbf24_1px,transparent_1px),linear-gradient(90deg,#fbbf24_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-amber-400">India career radar</p>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] sm:text-6xl">
                Explore active openings before you apply.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Explore openings from leading company career pages, filter them by your choice, then open the official apply page.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="border border-amber-500/15 bg-slate-950/70 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur">
              <label className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-amber-400">
                Search role, company, or skill
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="flex min-h-14 items-center gap-3 border border-amber-500/15 bg-slate-900 px-4">
                  <Search size={18} className="text-amber-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="e.g., React developer, HR executive, mechanical engineer"
                    className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-500"
                  />
                </div>
                <button className="min-h-14 bg-amber-400 px-6 text-sm font-black uppercase tracking-[0.14em] text-[#0f172a] transition hover:bg-white">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[310px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto border border-amber-500/15 bg-slate-950/70 backdrop-blur-md p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between border-b border-amber-500/10 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">Filters</p>
                <h2 className="mt-1 text-xl font-black text-white">Refine jobs</h2>
              </div>
              <Filter size={22} className="text-amber-400" />
            </div>

            <div className="mb-5 grid gap-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`border px-4 py-3 text-left transition ${
                    category === item.id
                      ? 'border-amber-500 bg-amber-400 text-[#0f172a]'
                      : 'border-amber-500/12 bg-slate-900 text-white hover:border-amber-400'
                  }`}
                >
                  <span className="block text-sm font-black uppercase tracking-[0.14em]">{item.label}</span>
                  <span className={`mt-1 block text-xs font-bold ${category === item.id ? 'text-slate-800' : 'text-slate-500'}`}>
                    {item.hint}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid gap-3">
            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">Experience</span>
              <div className="flex min-h-12 items-center gap-3 border border-amber-500/15 bg-slate-900 px-4">
              <Filter size={17} className="text-amber-400" />
              <select
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                className="w-full bg-slate-900 text-sm font-black text-white outline-none"
              >
                {experienceFilters.map(([value, label]) => (
                  <option key={value} value={value} className="bg-slate-950/70 backdrop-blur-md text-white">
                    {label}
                  </option>
                ))}
              </select>
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">Work mode</span>
              <div className="flex min-h-12 items-center gap-3 border border-amber-500/15 bg-slate-900 px-4">
              <Building2 size={17} className="text-amber-400" />
              <select
                value={workMode}
                onChange={(event) => setWorkMode(event.target.value)}
                className="w-full bg-slate-900 text-sm font-black text-white outline-none"
              >
                {workModeFilters.map(([value, label]) => (
                  <option key={value} value={value} className="bg-slate-950/70 backdrop-blur-md text-white">
                    {label}
                  </option>
                ))}
              </select>
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">Location</span>
              <div className="flex min-h-12 items-center gap-3 border border-amber-500/15 bg-slate-900 px-4">
              <MapPin size={17} className="text-amber-400" />
              <input
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-sm font-black text-white outline-none placeholder:text-slate-500"
              />
              </div>
            </label>
          </div>
          </aside>

          <div>
        {loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-64 animate-pulse border border-amber-500/10 bg-slate-950/70 backdrop-blur-md" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="border border-rose-300/30 bg-rose-500/10 p-6 text-rose-100">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
          <div className="grid gap-4 md:grid-cols-2">
            {paginatedJobs.map((job) => (
              <article key={job.id || `${job.company}-${job.title}`} className="group flex min-h-[620px] min-w-0 flex-col border border-amber-500/12 bg-slate-950/70 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-400 hover:bg-slate-900">
                <div className="mb-5 flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 break-words text-xs font-black uppercase tracking-[0.16em] text-amber-400">{job.careerArea || 'Active role'}</p>
                    <h2 className="break-words text-2xl font-black leading-tight text-white">{job.title || 'Untitled role'}</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-amber-500/12 bg-slate-900">
                    {job.logo ? <img src={job.logo} alt={`${job.company || 'Company'} logo`} className="h-full w-full object-contain p-2" /> : <Briefcase size={22} className="text-amber-400" />}
                  </div>
                </div>

                <div className="mb-4 grid gap-2 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2"><Building2 size={15} className="text-amber-400" /> {job.company || 'Company not listed'}</span>
                  <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-amber-400" /> {job.location || 'India'}</span>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="border border-amber-500/20 bg-slate-900 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-amber-400">{workModeLabel(job)}</span>
                  <span className="border border-white/10 bg-slate-900 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-200">{experienceLabel(job)}</span>
                </div>

                <p className="mb-5 line-clamp-4 text-sm leading-6 text-slate-400">
                  {job.description || 'No description was provided by the publisher.'}
                </p>

                <div className="mt-auto flex min-h-[74px] flex-wrap items-center justify-between gap-3 border-t border-amber-500/10 pt-4">
                  <span className="min-w-0 flex-1 truncate text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    {job.publisher || 'Company careers'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSaveStatus('');
                      setSelectedJob(job);
                    }}
                    className="inline-flex shrink-0 items-center gap-2 bg-amber-400 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#0f172a] transition hover:bg-white"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filteredJobs.length > JOBS_PER_PAGE && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="min-h-11 border border-amber-500/15 bg-slate-950/70 backdrop-blur-md px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              {pageNumbers.map((pageNumber) => typeof pageNumber === 'string' ? (
                <span key={pageNumber} className="flex h-11 min-w-8 items-center justify-center text-slate-400">...</span>
              ) : (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`h-11 min-w-11 border px-4 text-sm font-black transition ${
                    safeCurrentPage === pageNumber
                      ? 'border-amber-500 bg-amber-400 text-[#0f172a]'
                      : 'border-amber-500/15 bg-slate-950/70 backdrop-blur-md text-white hover:border-amber-400'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safeCurrentPage === totalPages}
                className="min-h-11 border border-amber-500/15 bg-slate-950/70 backdrop-blur-md px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
          </>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="border border-amber-500/12 bg-slate-950/70 backdrop-blur-md p-8 text-center text-slate-400">
            No active jobs were found for these filters. Clear one filter or try another search.
          </div>
        )}
          </div>
        </div>
      </section>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 p-4 backdrop-blur">
          <article className="max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-amber-500/14 bg-slate-950/70 backdrop-blur-md p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-amber-500/10 pb-5">
              <div className="min-w-0 flex-1">
                {selectedJob.logo && <img src={selectedJob.logo} alt={`${selectedJob.company || 'Company'} logo`} className="mb-5 h-10 w-24 object-contain object-left" />}
                <p className="mb-2 break-words text-xs font-black uppercase tracking-[0.16em] text-amber-400">{selectedJob.careerArea || 'Active role'}</p>
                <h2 className="break-words text-3xl font-black leading-tight text-white">{selectedJob.title || 'Untitled role'}</h2>
                <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2"><Building2 size={15} className="text-amber-400" /> {selectedJob.company || 'Company not listed'}</span>
                  <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-amber-400" /> {selectedJob.location || 'India'}</span>
                  <span className="inline-flex items-center gap-2"><Building2 size={15} className="text-amber-400" /> {workModeLabel(selectedJob)}</span>
                  <span className="inline-flex items-center gap-2"><Briefcase size={15} className="text-amber-400" /> {experienceLabel(selectedJob)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-amber-500/12 bg-slate-900 text-white transition hover:border-amber-400"
                aria-label="Close job details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-amber-400">Complete Job Details</h3>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                  {selectedJob.description || 'No complete description was provided by the publisher.'}
                </p>

                {[
                  ['Eligibility', selectedJob.eligibility],
                  ['Requirements', selectedJob.requirements],
                  ['Eligible Batch', selectedJob.batch],
                  ['Job Responsibilities', selectedJob.responsibilities],
                ].map(([heading, value]) => value && (
                  <section key={heading} className="mt-6 border-t border-amber-500/10 pt-5">
                    <h4 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-amber-400">{heading}</h4>
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{value}</p>
                  </section>
                ))}

                {highlightEntries(selectedJob.highlights).map(([heading, values]) => (
                  <section key={heading} className="mt-6 border-t border-amber-500/10 pt-5">
                    <h4 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-white">{heading.replace(/_/g, ' ')}</h4>
                    <ul className="space-y-2 text-sm leading-6 text-slate-400">
                      {values.map((value, index) => (
                        <li key={`${heading}-${index}`} className="border-l-2 border-amber-400 pl-3">{value}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <aside className="border border-amber-500/12 bg-slate-900 p-5">
                <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-white">Before Applying</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  <p>Experience: {experienceLabel(selectedJob)}</p>
                  <p>Work mode: {workModeLabel(selectedJob)}</p>
                  <p>Location: {selectedJob.location || 'India'}</p>
                  <p>Source: {selectedJob.publisher || 'Company careers'}</p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveJob}
                  disabled={savingJob}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-amber-500/20 bg-slate-950/70 px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-amber-400 hover:text-amber-400 disabled:cursor-wait disabled:opacity-60"
                >
                  <Bookmark size={14} /> {savingJob ? 'Saving...' : isAuthenticated ? 'Save Job' : 'Login to Save'}
                </button>
                {saveStatus && <p className="mt-3 text-sm font-bold text-amber-400">{saveStatus}</p>}

                {selectedJob.applyLink && isAuthenticated ? (
                  <a
                    href={selectedJob.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-amber-400 px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-[#0f172a] transition hover:bg-white"
                  >
                    Apply Now <ExternalLink size={14} />
                  </a>
                ) : selectedJob.applyLink ? (
                  <button
                    type="button"
                    onClick={requireLoginForApply}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-amber-400 px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-[#0f172a] transition hover:bg-white"
                  >
                    Login to Apply
                  </button>
                ) : (
                  <p className="mt-6 border border-amber-500/12 p-4 text-sm text-slate-500">Apply link was not provided for this job.</p>
                )}
              </aside>
            </div>
          </article>
        </div>
      )}
    </main>
  );
};

export default Jobs;
