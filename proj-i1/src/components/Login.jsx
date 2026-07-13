import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from './AuthContext.jsx';
import { API_ENDPOINTS, apiCall } from '../config/api.js';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      login(data.user);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 px-5 py-16 text-white">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-amber-400">Welcome back</p>
          <h1 className="text-5xl font-black leading-tight">Login to continue your ResumeNexa workflow.</h1>
          <p className="mt-5 text-base leading-8 text-slate-400">
            Browsing is open for everyone. Editing resumes, analyzing files, and applying from job details need an account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-amber-500/15 bg-slate-950/70 backdrop-blur-md p-6 shadow-[0_28px_90px_rgba(0,0,0,0.4)]">
          <h2 className="mb-6 text-2xl font-black">Login</h2>
          {message && <div className="mb-4 border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">{message}</div>}

          <label className="mb-4 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-amber-400">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="h-13 w-full border border-amber-500/15 bg-slate-900 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-500"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-amber-400">Password</span>
            <div className="flex border border-amber-500/15 bg-slate-900">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="h-13 w-full bg-transparent px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="flex w-14 items-center justify-center text-amber-400 transition hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="min-h-13 w-full bg-amber-400 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0f172a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            New here? <Link to="/signup" state={location.state} className="font-black text-amber-400">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
