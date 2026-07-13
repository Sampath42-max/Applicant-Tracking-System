import React, { useContext, useEffect, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, ExternalLink, FileText, Mail, Trash2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, apiCall } from '../config/api.js';
import { AuthContext } from './AuthContext.jsx';

const displayDate = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Recently'
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ user, resumes: [], savedJobs: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActivity = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall(API_ENDPOINTS.PROFILE);
      setProfile(data);
    } catch (loadError) {
      setError(loadError.message || 'Could not load your profile activity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  const removeSavedJob = async (savedId) => {
    try {
      await apiCall(`${API_ENDPOINTS.SAVED_JOBS}/${savedId}`, { method: 'DELETE' });
      setProfile((current) => ({
        ...current,
        savedJobs: current.savedJobs.filter((job) => job.savedId !== savedId),
        stats: {
          ...current.stats,
          savedJobCount: Math.max(0, (current.stats.savedJobCount || 0) - 1),
        },
      }));
    } catch (removeError) {
      setError(removeError.message || 'Could not remove the saved job.');
    }
  };

  const currentUser = profile.user || user;

  return (
    <main className="min-h-screen bg-slate-900 px-5 py-12 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="border border-amber-500/15 bg-slate-950/70 p-6 backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center border border-amber-500/20 bg-slate-900 text-amber-400">
              <UserRound size={30} />
            </div>
            <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-amber-400">Your profile</p>
            <h1 className="mt-3 text-3xl font-black">{currentUser?.fullName || 'ResumeNexa Member'}</h1>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400">
              <Mail size={15} className="text-amber-400" /> {currentUser?.email}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays size={15} className="text-amber-400" /> Joined {displayDate(currentUser?.createdAt)}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="border border-amber-500/10 bg-slate-900 p-4">
                <p className="text-3xl font-black text-amber-400">{profile.stats?.resumeCount || 0}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">Resumes</p>
              </div>
              <div className="border border-amber-500/10 bg-slate-900 p-4">
                <p className="text-3xl font-black text-amber-400">{profile.stats?.savedJobCount || 0}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">Saved Jobs</p>
              </div>
            </div>
          </aside>

          <div>
            {error && <div className="mb-5 border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-44 animate-pulse border border-amber-500/10 bg-slate-950/70" />
                ))}
              </div>
            ) : (
              <>
                <section className="border border-amber-500/15 bg-slate-950/70 p-6 backdrop-blur-md">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Analysis history</p>
                      <h2 className="mt-2 text-2xl font-black">Your resumes</h2>
                    </div>
                    <Link to="/resume-checker" className="bg-amber-400 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-950 transition hover:bg-white">
                      Analyze Resume
                    </Link>
                  </div>
                  {profile.resumes?.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {profile.resumes.map((resume) => (
                        <article key={resume.id} className="border border-amber-500/10 bg-slate-900 p-4">
                          <FileText size={20} className="mb-4 text-amber-400" />
                          <h3 className="truncate font-black text-white">{resume.fileName || 'Resume.pdf'}</h3>
                          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                            Checked {displayDate(resume.uploadedAt)}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="border border-amber-500/10 bg-slate-900 p-5 text-sm text-slate-400">
                      You have not analyzed a resume yet.
                    </p>
                  )}
                </section>

                <section className="mt-6 border border-amber-500/15 bg-slate-950/70 p-6 backdrop-blur-md">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Opportunity library</p>
                      <h2 className="mt-2 text-2xl font-black">Saved jobs</h2>
                    </div>
                    <Link to="/jobs" className="border border-amber-500/15 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-amber-400">
                      Browse Jobs
                    </Link>
                  </div>
                  {profile.savedJobs?.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {profile.savedJobs.map((job) => (
                        <article key={job.savedId} className="border border-amber-500/10 bg-slate-900 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <BriefcaseBusiness size={20} className="shrink-0 text-amber-400" />
                            <button
                              type="button"
                              onClick={() => removeSavedJob(job.savedId)}
                              className="text-slate-400 transition hover:text-rose-300"
                              aria-label={`Remove ${job.jobTitle} from saved jobs`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                          <h3 className="mt-4 text-lg font-black">{job.jobTitle}</h3>
                          <p className="mt-2 text-sm text-slate-400">{job.company || 'Company not listed'} / {job.location || 'Location not listed'}</p>
                          <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-amber-400">Saved {displayDate(job.savedAt)}</p>
                          {job.applyLink && (
                            <a href={job.applyLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:text-amber-400">
                              View opening <ExternalLink size={13} />
                            </a>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="border border-amber-500/10 bg-slate-900 p-5 text-sm text-slate-400">
                      Save jobs from the jobs page to keep opportunities here.
                    </p>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
