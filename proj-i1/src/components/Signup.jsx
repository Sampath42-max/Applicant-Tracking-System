import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from './AuthContext.jsx';
import { API_ENDPOINTS, apiCall } from '../config/api.js';

const getPasswordRules = (password) => [
  { label: '8 to 12 characters', valid: password.length >= 8 && password.length <= 12 },
  { label: 'Must not start with a number', valid: password.length > 0 && !/^[0-9]/.test(password) },
  { label: 'At least one uppercase letter', valid: /[A-Z]/.test(password) },
  { label: 'At least one lowercase letter', valid: /[a-z]/.test(password) },
  { label: 'At least one number', valid: /[0-9]/.test(password) },
];

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const redirectTo = location.state?.from?.pathname || '/';
  const passwordRuleState = getPasswordRules(formData.password);
  const isPasswordValid = passwordRuleState.every((rule) => rule.valid);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const notifyRegistrationComplete = async () => {
    if (!('Notification' in window)) return;
    try {
      const permission = Notification.permission === 'default'
        ? await Notification.requestPermission()
        : Notification.permission;
      if (permission === 'granted') {
        new Notification('ResumeNexa', {
          body: 'Your account registration is complete.',
          icon: '/logo192.png',
        });
      }
    } catch (error) {
      // Browser notifications are optional and should never block registration.
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await apiCall(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      login(data.user);
      await notifyRegistrationComplete();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 px-5 py-16 text-white">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-amber-400">Create account</p>
          <h1 className="text-5xl font-black leading-tight">Signup once, then build and analyze freely.</h1>
          <p className="mt-5 text-base leading-8 text-slate-400">
            Your account connects resume analysis, saved uploads, and future job actions to your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-amber-500/15 bg-slate-950/70 backdrop-blur-md p-6 shadow-[0_28px_90px_rgba(0,0,0,0.4)]">
          <h2 className="mb-6 text-2xl font-black">Sign Up</h2>
          {message && <div className="mb-4 border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">{message}</div>}

          <label className="mb-4 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-amber-400">Full name</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="h-13 w-full border border-amber-500/15 bg-slate-900 px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-500"
              placeholder="Your name"
              required
            />
          </label>

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

          <label className="mb-4 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-amber-400">Password</span>
            <div className="flex border border-amber-500/15 bg-slate-900">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="h-13 w-full bg-transparent px-4 py-4 text-sm font-bold text-white outline-none placeholder:text-slate-500"
                placeholder="Create password"
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

          <div className="mb-6 border border-amber-500/10 bg-slate-900 p-4">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-amber-400">Password rules</p>
            <ul className="space-y-2 text-sm">
              {passwordRuleState.map((rule) => {
                const Icon = rule.valid ? CheckCircle2 : Circle;
                return (
                  <li key={rule.label} className={`flex items-center gap-2 ${rule.valid ? 'text-emerald-300' : 'text-slate-400'}`}>
                    <Icon size={17} />
                    <span>{rule.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="min-h-13 w-full bg-amber-400 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0f172a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" state={location.state} className="font-black text-amber-400">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Signup;
