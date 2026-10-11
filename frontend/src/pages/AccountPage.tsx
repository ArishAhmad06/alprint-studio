import { useState } from 'react';
import { Button } from '../components/ui';
import { getStoredUser } from '../services/auth';

type AuthView = 'login' | 'signup' | 'otp' | 'profile';

export default function AccountPage() {
  const storedUser = getStoredUser();
  const [view, setView] = useState<AuthView>(storedUser ? 'profile' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // TODO: Replace with real auth service call
    await new Promise((r) => setTimeout(r, 800));
    setMessage('Login is a prototype. Backend auth not yet connected.');
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // TODO: Replace with real auth service call
    await new Promise((r) => setTimeout(r, 800));
    setView('otp');
    setMessage('Signup is a prototype. In production, an OTP would be sent to your email.');
    setLoading(false);
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // TODO: Replace with real auth service call
    await new Promise((r) => setTimeout(r, 800));
    setMessage('OTP verification is a prototype. Backend not yet connected.');
    setLoading(false);
  };

  return (
    <main className="max-w-lg mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-light text-ink">
          {view === 'profile' ? 'Your Account' : view === 'signup' ? 'Create Account' : view === 'otp' ? 'Verify Email' : 'Welcome Back'}
        </h1>
        <p className="text-sm text-muted mt-2">
          {view === 'profile'
            ? 'Manage your profile and orders'
            : view === 'signup'
            ? 'Join Alprint to save designs and track orders'
            : view === 'otp'
            ? 'Enter the code sent to your email'
            : 'Sign in to your Alprint account'}
        </p>
      </div>

      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 lg:p-8">
        {message && (
          <div className="mb-4 p-3 bg-vermilion/5 border border-vermilion/20 rounded-[var(--radius-sm)] text-xs text-vermilion">
            {message}
          </div>
        )}

        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="text-xs font-medium text-ink block mb-1.5">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-xs font-medium text-ink block mb-1.5">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
            <div className="text-center space-y-2">
              <button type="button" className="text-xs text-vermilion hover:text-vermilion-dark">
                Login with OTP instead
              </button>
              <p className="text-xs text-muted">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setView('signup'); setMessage(''); }} className="text-vermilion hover:text-vermilion-dark font-medium">
                  Sign up
                </button>
              </p>
            </div>
          </form>
        )}

        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="text-xs font-medium text-ink block mb-1.5">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="text-xs font-medium text-ink block mb-1.5">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="text-xs font-medium text-ink block mb-1.5">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2.5 border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                placeholder="Min 8 characters"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
            <p className="text-xs text-muted text-center">
              Already have an account?{' '}
              <button type="button" onClick={() => { setView('login'); setMessage(''); }} className="text-vermilion hover:text-vermilion-dark font-medium">
                Sign in
              </button>
            </p>
          </form>
        )}

        {view === 'otp' && (
          <form onSubmit={handleOTPVerify} className="space-y-4">
            <div>
              <label htmlFor="otp-code" className="text-xs font-medium text-ink block mb-1.5">Verification Code</label>
              <input
                id="otp-code"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full px-3 py-2.5 border border-border rounded-[var(--radius-sm)] text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                placeholder="000000"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Verify
            </Button>
            <button type="button" className="text-xs text-vermilion hover:text-vermilion-dark block mx-auto">
              Resend code
            </button>
          </form>
        )}

        {view === 'profile' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="font-medium text-ink">Demo User</p>
              <p className="text-xs text-muted">demo@alprint.com</p>
            </div>

            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 text-sm border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 transition-colors flex items-center justify-between">
                <span>Profile Settings</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button className="w-full text-left px-4 py-3 text-sm border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 transition-colors flex items-center justify-between">
                <span>Saved Addresses</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button className="w-full text-left px-4 py-3 text-sm border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 transition-colors flex items-center justify-between">
                <span>Order History</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button className="w-full text-left px-4 py-3 text-sm border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 transition-colors flex items-center justify-between">
                <span>Saved Designs</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setView('login')}>
              Sign Out
            </Button>

            <p className="text-[10px] text-muted text-center">
              Profile view is a prototype. Auth backend not yet connected.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
