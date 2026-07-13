import React, { Suspense, Component, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import Build from './pages/Build.js';
import Jobs from './pages/Jobs.js';
import axios from 'axios';
import ResumeChecker from './components/ResumeChecker.js';
import LoadingPage from './components/LoadingPage.jsx';
import ResultsPage from './components/ResultsPage.jsx';
import resumeNexaLogo from './assets/Resumenexa.png';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthContext, AuthProvider } from './components/AuthContext.jsx';
import MatrixAssemblyResume from './components/MatrixAssemblyResume.jsx';

const Details = () => (
  <div className="min-h-[70vh] bg-slate-900 px-6 py-16 text-white">
    <div className="mx-auto max-w-5xl">
      <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-amber-400">Resume intelligence</p>
      <h2 className="mb-6 text-5xl font-black leading-tight">Resume Review Details</h2>
      <div className="border border-amber-500/10 bg-slate-950/70 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <p className="text-lg leading-relaxed text-slate-300">
        Get professional feedback on your resume to increase your chances of landing interviews.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="border border-amber-400/20 bg-amber-400/10 p-6">
          <h3 className="mb-3 text-xl font-black text-white">What We Check</h3>
          <ul className="space-y-2 text-slate-300">
            <li>Format & Structure</li>
            <li>Content Quality</li>
            <li>ATS Compatibility</li>
            <li>Keywords Optimization</li>
          </ul>
        </div>
        <div className="border border-amber-400/20 bg-amber-400/10 p-6">
          <h3 className="mb-3 text-xl font-black text-white">Benefits</h3>
          <ul className="space-y-2 text-slate-300">
            <li>Expert Recommendations</li>
            <li>Instant Scoring</li>
            <li>Actionable Insights</li>
            <li>Competitive Edge</li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  </div>
);

const Optimize = () => (
  <div className="min-h-[70vh] bg-slate-900 px-6 py-16 text-white">
    <div className="mx-auto max-w-4xl text-center">
      <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-amber-400">Next module</p>
      <h2 className="mb-4 text-5xl font-black">Optimize Resume</h2>
      <p className="mb-8 text-xl text-slate-300">Coming Soon</p>
      <div className="border border-amber-500/10 bg-slate-950/70 p-12 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="animate-pulse flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-amber-400 shadow-[0_0_70px_rgba(251,191,36,0.45)]"></div>
        </div>
        <p className="text-lg text-slate-300">
          We're working on powerful optimization tools to help you create the perfect resume.
        </p>
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-900 px-6 text-center text-white">
    <h1 className="mb-4 text-8xl font-black text-amber-400">404</h1>
    <h2 className="mb-4 text-3xl font-black">Page Not Found</h2>
    <p className="mb-8 text-slate-300">The page you're looking for doesn't exist.</p>
    <Link to="/">
      <button className="bg-amber-400 px-8 py-3 font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_20px_55px_rgba(251,191,36,0.22)] transition hover:-translate-y-1 hover:bg-white">
        Go Home
      </button>
    </Link>
  </div>
);

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-900 px-6 text-center text-white">
          <h2 className="mb-4 text-2xl font-black text-rose-300">Something went wrong</h2>
          <p className="mb-8 text-slate-300">Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-500 px-8 py-3 font-black uppercase tracking-[0.16em] text-white shadow-lg transition hover:bg-rose-600"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return (
      <Suspense fallback={<LoadingFallback />}>
        {this.props.children}
      </Suspense>
    );
  }
}

const LoadingFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-slate-900">
    <div className="text-center">
      <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-amber-400"></div>
      <p className="text-lg text-slate-300">Loading...</p>
    </div>
  </div>
);

const Home = () => {
  const stats = [
    { value: '10', label: 'resume templates' },
    { value: '4', label: 'score dimensions' },
    { value: 'PDF', label: 'export ready' },
  ];
  const workflow = [
    ['01', 'Choose a canvas', 'Start from a template built for structured resume content and fast editing.'],
    ['02', 'Shape the story', 'Use focused fields for contact, summary, experience, education, projects, and skills.'],
    ['03', 'Run the score', 'Check ATS readiness, keywords, formatting, and impact before sending.'],
  ];
  const scoreItems = [
    ['ATS parsing', 'Clean document structure and readable sections.'],
    ['Keyword match', 'Role-aligned phrases for the position you want.'],
    ['Impact language', 'Sharper bullets with measurable outcomes.'],
    ['Report export', 'Download a cleaner improvement report.'],
  ];

  return (
    <main className="overflow-hidden bg-slate-900 text-white">
      <section className="relative min-h-[calc(100vh-118px)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_77%_44%,rgba(251,191,36,0.1),transparent_29%),radial-gradient(circle_at_75%_46%,rgba(148,163,184,0.12),transparent_42%),linear-gradient(120deg,#0f172a_0%,#0f172a_50%,#111c35_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(#94a3b8_1px,transparent_1px),linear-gradient(90deg,#94a3b8_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute inset-y-0 right-0 z-[2] hidden w-[56%] items-center justify-center lg:flex lg:scale-[0.78] xl:scale-[0.88] 2xl:scale-100">
          <MatrixAssemblyResume />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,transparent_0%,rgba(15,23,42,0.02)_34%,rgba(15,23,42,0.72)_82%),linear-gradient(90deg,rgba(15,23,42,0.97)_0%,rgba(15,23,42,0.76)_38%,rgba(15,23,42,0.06)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-900 to-transparent" />

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100vh-118px)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-6 lg:px-8">
          <div className="pointer-events-auto max-w-3xl lg:max-w-[43%]">
            <div className="mb-6 inline-flex items-center gap-3 border border-amber-500/15 bg-slate-950/40 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.7)]" />
              Matrix assembly resume
            </div>

            <h1 className="text-5xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-6xl 2xl:text-7xl">
              Build a resume that feels engineered, not assembled.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Design your resume in a live editor, preview every section, then run an AI-powered score report before you send it.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/build">
                <button className="h-14 w-full bg-amber-400 px-7 text-sm font-black uppercase tracking-[0.18em] text-slate-950 shadow-[0_20px_55px_rgba(251,191,36,0.22)] transition hover:-translate-y-1 hover:bg-white sm:w-auto">
                  Open Builder
                </button>
              </Link>
              <Link to="/resume-checker">
                <button className="h-14 w-full border border-white/25 bg-white/10 px-7 text-sm font-black uppercase tracking-[0.18em] text-white backdrop-blur transition hover:-translate-y-1 hover:border-amber-500 hover:bg-white/18 sm:w-auto">
                  Check Score
                </button>
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 border border-amber-500/10 bg-slate-950/60 backdrop-blur-md">
              {stats.map((item, index) => (
                <div key={item.label} className={`p-5 ${index !== 0 ? 'border-l border-amber-500/10' : ''}`}>
                  <p className="text-3xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-amber-500/10 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {workflow.map(([number, title, text]) => (
            <article key={title} className="border border-amber-500/10 bg-slate-950/70 p-6 backdrop-blur-md">
              <p className="text-sm font-black text-amber-400">{number}</p>
              <h2 className="mt-5 text-2xl font-black">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-400">Resume intelligence</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            A checker that turns resume feedback into a practical edit plan.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            The analysis screen looks at structure, formatting, keywords, and writing strength, then gives suggestions tuned to the role you enter.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {scoreItems.map(([title, text]) => (
            <article key={title} className="border border-amber-500/10 bg-slate-950/70 p-5 backdrop-blur-md">
              <span className="mb-5 block h-1.5 w-12 bg-amber-400" />
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border border-amber-400/20 bg-amber-400/10 p-7 backdrop-blur md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-400">Ready to create</p>
            <h2 className="mt-3 text-3xl font-black text-white">Start with a template, finish with a score-backed resume.</h2>
          </div>
          <Link to="/build">
            <button className="bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:-translate-y-1 hover:bg-amber-400">
              Browse Templates
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

const Edit = () => {
  const { id } = useParams();
  const templateId = parseInt(id, 10);
  return (
    <div className="min-h-[70vh] bg-slate-900 px-6 py-16 text-white">
      <div className="container mx-auto">
      <h2 className="mb-6 text-3xl font-black">Edit Template {templateId}</h2>
      {/* Edit content */}
      </div>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, loading } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/build', label: 'Build' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/resume-checker', label: 'Resume Checker' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-amber-500/10 bg-slate-900/94 shadow-[0_18px_45px_rgba(0,0,0,0.34)] backdrop-blur-xl'
          : 'border-amber-500/10 bg-slate-900/82 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Go to ResumeNexa home">
          <img
            src={resumeNexaLogo}
            alt="ResumeNexa"
            className="h-14 w-14 object-contain"
          />
          <div>
            <div className="text-2xl font-black tracking-tight text-white transition duration-500 group-hover:text-white">
              ResumeNexa
            </div>
            <p className="hidden text-[10px] font-black uppercase tracking-[0.24em] text-amber-400/80 sm:block">
              Build Smarter. Apply Better.
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative py-3 text-base font-bold transition duration-700 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label={`Go to ${link.label} page`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.55)] transition-all duration-700 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {!loading && isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-right transition hover:opacity-80" aria-label="Open your profile">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-400">Profile</p>
                <p className="max-w-36 truncate text-sm font-black text-white">{user?.fullName || user?.email}</p>
              </Link>
              <button
                onClick={logout}
                className="h-12 border border-amber-500/15 bg-amber-400 px-5 text-sm font-black uppercase tracking-[0.12em] text-[#0f172a] shadow-[0_14px_32px_rgba(0,0,0,0.25)] transition duration-500 hover:-translate-y-0.5 hover:bg-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-black text-slate-400 transition hover:text-white">
                Login
              </Link>
              <Link to="/signup">
                <button className="h-12 border border-amber-500/15 bg-amber-400 px-5 text-sm font-black uppercase tracking-[0.12em] text-[#0f172a] shadow-[0_14px_32px_rgba(0,0,0,0.25)] transition duration-500 hover:-translate-y-0.5 hover:bg-white">
                  Signup
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {!loading && isAuthenticated ? (
            <button onClick={logout} className="bg-amber-400 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#0f172a]">
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-amber-400 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#0f172a]">
              Login
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center border border-amber-500/15 bg-slate-950/70 backdrop-blur-md transition hover:border-amber-500"
            aria-label="Toggle mobile menu"
          >
            <div className="flex h-4 w-5 flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`h-0.5 w-full bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-0.5 w-full bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-amber-500/10 bg-slate-900 transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'max-h-80' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
          {!loading && isAuthenticated && (
            <Link to="/profile" className="border border-amber-500/12 bg-slate-950/70 backdrop-blur-md px-4 py-4 text-sm text-slate-400 transition hover:border-amber-400">
              <span className="block text-xs font-black uppercase tracking-[0.16em] text-amber-400">Signed in</span>
              <span className="mt-1 block font-black text-white">{user?.fullName || user?.email}</span>
            </Link>
          )}
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-4 text-sm font-black uppercase tracking-[0.12em] transition ${
                  isActive
                    ? 'bg-amber-400 text-[#0f172a]'
                    : 'border border-amber-500/12 bg-slate-950/70 backdrop-blur-md text-slate-400 hover:border-amber-500 hover:bg-slate-900'
                }`}
                aria-label={`Go to ${link.label} page`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

    </header>
  );
};

const App = () => {
  axios.defaults.withCredentials = true;

  return (
    <div className="min-h-screen bg-slate-900 font-poppins">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
        <Route path="/optimize" element={<Optimize />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/build" element={<ProtectedRoute><Build /></ProtectedRoute>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/resume-checker" element={<ProtectedRoute><ResumeChecker /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/build/edit/:id" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
        <Route path="/loading" element={<ProtectedRoute><LoadingPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer */}
      <footer className="border-t border-amber-500/10 bg-[#020617] py-12 text-slate-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4 text-2xl font-black text-amber-400">
                ResumeNexa
              </div>
              <p className="text-sm text-slate-400">
                Building careers, one resume at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/build" className="transition-colors duration-200 hover:text-amber-400">Resume Builder</Link></li>
                <li><Link to="/jobs" className="transition-colors duration-200 hover:text-amber-400">Jobs in India & US</Link></li>
                <li><Link to="/resume-checker" className="transition-colors duration-200 hover:text-amber-400">Resume Checker</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/details" className="transition-colors duration-200 hover:text-amber-400">Blog</Link></li>
                <li><Link to="/details" className="transition-colors duration-200 hover:text-amber-400">Career Tips</Link></li>
                <li><Link to="/details" className="transition-colors duration-200 hover:text-amber-400">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/details" className="transition-colors duration-200 hover:text-amber-400">About Us</Link></li>
                <li><Link to="/details" className="transition-colors duration-200 hover:text-amber-400">Contact</Link></li>
                <li><Link to="/details" className="transition-colors duration-200 hover:text-amber-400">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-500/10 pt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} ResumeNexa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  </Router>
);

export default AppWrapper;
