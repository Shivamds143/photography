import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Key, Link2, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabaseUrl } from '../lib/supabase';
import { db } from '../lib/databaseService';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [urlInput, setUrlInput] = useState(
    (typeof window !== 'undefined' && (window as unknown as { __SUPABASE_URL__?: string }).__SUPABASE_URL__) || supabaseUrl || ''
  );
  const [keyInput, setKeyInput] = useState(
    (typeof window !== 'undefined' && (window as unknown as { __SUPABASE_ANON_KEY__?: string }).__SUPABASE_ANON_KEY__) || ''
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveCredentials = () => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __SUPABASE_URL__?: string }).__SUPABASE_URL__ = urlInput.trim();
      (window as unknown as { __SUPABASE_ANON_KEY__?: string }).__SUPABASE_ANON_KEY__ = keyInput.trim();
      localStorage.setItem('aura_temp_supabase_url', urlInput.trim());
      localStorage.setItem('aura_temp_supabase_key', keyInput.trim());
      setStatusMessage('Credentials saved! Reloading application state...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all mock/local storage data back to initial seeds?')) {
      db.resetDemoData();
      onDataChanged();
      setStatusMessage('Demo database reset to factory initial state!');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-[#272b38] bg-[#0e1017] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1e2330] pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database & Supabase Connection</h3>
              <p className="text-xs text-slate-400">Manage persistence mode and Supabase credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className="mt-4 rounded-xl border border-[#212634] bg-[#12151e] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {isSupabaseConfigured ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Sparkles className="h-5 w-5 text-amber-400" />
              )}
              <div>
                <p className="text-xs font-semibold text-white">
                  {isSupabaseConfigured ? 'Connected to Live Supabase' : 'Running in High-Fidelity Demo Engine'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isSupabaseConfigured
                    ? `Active URL: ${supabaseUrl}`
                    : 'Interactive mock state with local persistence and full CRUD.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-300">
            {statusMessage}
          </div>
        )}

        {/* Supabase Live Credentials Configuration */}
        <div className="mt-5 space-y-3.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Connect Live Supabase (Optional)</h4>
          <div>
            <label className="block text-xs text-slate-400">Supabase Project URL</label>
            <div className="mt-1 flex items-center rounded-lg border border-[#272b38] bg-[#07080b] px-3 py-2 text-xs text-white">
              <Link2 className="mr-2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-transparent outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400">Supabase Anon / Public API Key</label>
            <div className="mt-1 flex items-center rounded-lg border border-[#272b38] bg-[#07080b] px-3 py-2 text-xs text-white">
              <Key className="mr-2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                className="w-full bg-transparent outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            onClick={handleSaveCredentials}
            className="w-full rounded-lg bg-[#d4af37] py-2 text-xs font-bold text-black uppercase tracking-wider hover:brightness-110"
          >
            Apply & Connect
          </button>
        </div>

        {/* Demo Database Utilities */}
        <div className="mt-6 border-t border-[#1e2330] pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-300">Reset Demo Data</p>
              <p className="text-[11px] text-slate-500">Restore default photography, services, and bookings.</p>
            </div>
            <button
              onClick={handleResetData}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-[#161922] px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
