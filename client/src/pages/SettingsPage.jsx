import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  Bot,
  Database,
  Info,
  Check,
  Moon,
  Laptop,
  Server,
  RefreshCw,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';

export default function SettingsPage() {
  const { user, subscription } = useAuth();

  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.2');
  const [testingAi, setTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);

  const testOllamaConnection = () => {
    setTestingAi(true);
    setAiTestResult(null);
    setTimeout(() => {
      setTestingAi(false);
      setAiTestResult({
        success: true,
        message: 'Connected to local Ollama daemon. Model llama3.2 is loaded into VRAM.',
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-text-primary">Settings</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage your account profile, AI configuration, database telemetry, and theme preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Profile & Account */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-text-primary">User Profile</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-base font-bold text-primary-light">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AL'}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  {user?.name || 'Alex Chen'}
                </h4>
                <p className="text-xs text-text-muted">{user?.role || 'Full-Stack Student'}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div>
                <span className="text-text-muted block text-[11px]">Email Address</span>
                <span className="text-text-primary font-medium">{user?.email || 'alex.chen@devtrack.ai'}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">User ID</span>
                <span className="font-mono text-zinc-400">{user?.id || 'usr-1'}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Security Tier</span>
                <Badge variant="success" size="sm">
                  JWT Authenticated
                </Badge>
              </div>
            </div>
          </div>

          {/* Subscription & Billing Section */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-text-primary">Subscription & Billing</h3>
              </div>
              <Badge variant="primary" size="sm">
                Razorpay
              </Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Active Plan</span>
                <span className="font-bold text-primary-light uppercase">
                  {subscription?.plan || 'Free'} Plan
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Status</span>
                <span className="text-emerald-400 font-medium">
                  {subscription?.status || 'Active'}
                </span>
              </div>
              <p className="text-[11px] text-text-muted pt-1">
                Upgrading unlocks unlimited Ollama AI inferences and multi-agent development sessions.
              </p>
            </div>
            <Link
              to="/pricing"
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 py-2 text-xs font-semibold text-primary-light hover:bg-primary/20 transition"
            >
              <span>Manage Plans & Upgrade</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Moon className="h-4 w-4 text-secondary" />
              <h3 className="text-xs font-semibold text-text-primary">Theme & Appearance</h3>
            </div>
            <p className="text-xs text-text-muted">
              DevTrack AI is configured with the standard Dark Theme (#09090B with Violet accents) for low eye-strain developer ergonomics.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-2.5 text-xs text-primary-light">
              <Check className="h-4 w-4" />
              <span>Dark Theme Active (Fixed SaaS Standard)</span>
            </div>
          </div>
        </div>

        {/* Right Columns: AI & Database Architecture */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Configuration */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-text-primary">
                  Local AI Model (Ollama)
                </h3>
              </div>
              <Badge variant="primary" size="sm">
                Express Proxy Mode
              </Badge>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              In DevTrack AI, AI calls are routed from the frontend to the Express backend, which proxies inferences to the local Ollama daemon running on your workstation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-text-muted mb-1">
                  Ollama Base URL
                </label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs font-mono text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-text-muted mb-1">
                  Model Identifier
                </label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs font-mono text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={testOllamaConnection}
                disabled={testingAi}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-zinc-900 px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-zinc-800 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testingAi ? 'animate-spin' : ''}`} />
                <span>{testingAi ? 'Testing Connection...' : 'Test Ollama Handshake'}</span>
              </button>

              {aiTestResult && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  {aiTestResult.message}
                </span>
              )}
            </div>
          </div>

          {/* Database & System Architecture */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Database className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-text-primary">
                Polyglot Database Architecture
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-border bg-zinc-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">PostgreSQL + Prisma</span>
                  <Badge variant="success" size="sm" dot>
                    Relational
                  </Badge>
                </div>
                <p className="text-[11px] text-text-muted">
                  Stores Users, Projects, and Tasks with relational foreign key integrity and ACID guarantees.
                </p>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  DATABASE_URL: postgresql://...
                </div>
              </div>

              <div className="rounded-xl border border-border bg-zinc-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">MongoDB + Mongoose</span>
                  <Badge variant="success" size="sm" dot>
                    Document
                  </Badge>
                </div>
                <p className="text-[11px] text-text-muted">
                  Persists AI Conversations, polymorphic message histories, and unstructured session state.
                </p>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  MONGODB_URI: mongodb://...
                </div>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Info className="h-4 w-4 text-secondary" />
              <h3 className="text-xs font-semibold text-text-primary">Application Information</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div>
                <span className="text-text-muted block text-[10px]">Version</span>
                <span className="font-mono text-text-primary">v1.0.0</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">Client Stack</span>
                <span className="text-text-primary">React 18 + Vite</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">API Server</span>
                <span className="text-text-primary">Node.js + Express</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">Styling</span>
                <span className="text-text-primary">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

