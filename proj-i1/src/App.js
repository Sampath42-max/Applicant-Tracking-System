import React, { Suspense, Component, useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import Build from './pages/Build.js';
import axios from 'axios';
import Companies from './components/Companies.jsx';
import ResumeChecker from './components/ResumeChecker.js';
import LoadingPage from './components/LoadingPage.jsx';
import ResultsPage from './components/ResultsPage.jsx';
import CompanyDetails from './components/CompanyDetails.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthContext, AuthProvider } from './components/AuthContext.jsx';

// Import images from src/images/
import Image1 from './images/re1.jpg';
import Image2 from './images/re2.jpg';



const Details = () => <h2 className="text-2xl font-semibold text-gray-800">Details Page</h2>;
const Optimize = () => <h2 className="text-2xl font-semibold text-gray-800">Optimize Resume Page (Coming Soon)</h2>;
const NotFound = () => <div className="text-center text-gray-600">404 - Page Not Found</div>;

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
      return <div className="text-center text-red-600">Something went wrong. Please try again later.</div>;
    }

    return (
      <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
        {this.props.children}
      </Suspense>
    );
  }
}

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext) || { isAuthenticated: false };
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const refreshTimeout = useRef(null);

  const images = [Image1, Image2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Debounce refresh
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
      refreshTimeout.current = setTimeout(() => {
        refreshTimeout.current = null;
      }, 500);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  return (
    <main className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-20 min-h-[85vh] bg-gradient-to-br from-blue-50 via-indigo-100 to-white transition-all duration-500 ease-in-out font-poppins relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] animate-pulse-slow z-0"></div>
      <div className="max-w-full md:max-w-[50%] z-10 animate-slide-in-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6 drop-shadow-sm">
          Job-Winning Resume Templates
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 font-normal animate-fade-in-up animation-delay-200">
          Get hired 2x faster! Use recruiter-approved templates and step-by-step content recommendations to create or optimize your resume.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/build">
                <button
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold uppercase tracking-wide shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  aria-label="Build your resume"
                >
                  Build Resume
                </button>
              </Link>
              <Link to="/resume-checker">
                <button
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-full font-semibold uppercase tracking-wide shadow-lg hover:from-green-700 hover:to-teal-600 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  aria-label="Check your resume score"
                >
                  Check Score
                </button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <button
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold uppercase tracking-wide shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                aria-label="Login to create a resume"
              >
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="w-full md:w-[40%] mt-10 md:mt-0 z-10">
        <div className="relative w-full h-[400px] rounded-lg shadow-xl overflow-hidden" ref={sliderRef}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 flip-horizontal"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

const Edit = () => {
  const { id } = useParams();
  const templateId = parseInt(id, 10);
  // ... (rest of Edit component unchanged)
  return <div>{/* Edit content */}</div>;
};

const App = () => {
  const authContext = useContext(AuthContext) || { isAuthenticated: false, login: () => {}, logout: () => {}, loading: false };
  const { isAuthenticated, logout, loading } = authContext;

  axios.defaults.withCredentials = true;

  // Wait for auth check before rendering routes
  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  // Redirect unauthenticated users from home to login, but only if not authenticated
  if (!isAuthenticated && window.location.pathname === '/') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <header className="flex justify-between items-center px-4 sm:px-10 py-5 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 sticky top-0 z-50 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
          ResumeForge
        </div>
        <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="text-sm text-cyan-500 font-medium hover:text-blue-600 transition-colors duration-200">
            NEW! Get hired faster with a resume review.{' '}
            <Link to="/details" className="text-cyan-500 font-semibold hover:text-blue-600">
              See more details
            </Link>
          </span>
          <Link
            to="/"
            className="text-gray-700 text-sm sm:text-base px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            aria-label="Go to Home page"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/build"
                className="text-gray-700 text-sm sm:text-base px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                aria-label="Go to Build page"
              >
                Build
              </Link>
              <Link
                to="/companies"
                className="text-gray-700 text-sm sm:text-base px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                aria-label="Go to Companies page"
              >
                Companies
              </Link>
              <Link
                to="/resume-checker"
                className="text-gray-700 text-sm sm:text-base px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                aria-label="Go to Resume Checker page"
              >
                Resume Checker
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 text-sm sm:text-base px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                aria-label="Go to Profile page"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="text-gray-700 text-sm sm:text-base px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white text-sm sm:text-base bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-200"
                aria-label="Go to Login page"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 text-sm sm:text-base px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                aria-label="Go to Signup page"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
        <Route path="/optimize" element={<Optimize />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/build"
          element={
            <ProtectedRoute>
              <Build />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/:id"
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-checker"
          element={
            <ProtectedRoute>
              <ResumeChecker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/build/edit/:id"
          element={
            <ProtectedRoute>
              <Edit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loading"
          element={
            <ProtectedRoute>
              <LoadingPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;