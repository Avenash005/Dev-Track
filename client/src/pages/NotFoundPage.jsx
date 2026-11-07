import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-text-muted mb-4">
        <HelpCircle className="h-8 w-8 text-secondary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">404 - Page Not Found</h1>
      <p className="mt-1 max-w-sm text-xs text-text-muted">
        The route you are trying to access does not exist on DevTrack AI.
      </p>
      <Link
        to="/dashboard"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Return to Dashboard
      </Link>
    </div>
  );
}

