import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
        <div className="text-center space-y-1.5">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/20">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-text-primary pt-2">
            Create DevTrack AI Account
          </h2>
          <p className="text-xs text-text-secondary">
            Join the AI-powered student engineering platform
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full rounded-lg border border-border bg-zinc-900 py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@university.edu"
                className="w-full rounded-lg border border-border bg-zinc-900 py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-zinc-900 py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
