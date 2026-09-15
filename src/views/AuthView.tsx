import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Camera, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { UserProfile, PageView } from '../types';
import { db } from '../lib/databaseService';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthViewProps {
  initialMode?: 'login' | 'register' | 'admin-login';
  onAuthSuccess: (user: UserProfile) => void;
  setCurrentPage: (page: PageView) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  setCurrentPage
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(
    initialMode === 'register' ? 'register' : 'login'
  );
  const isAdminPortal = initialMode === 'admin-login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillDemoAccount = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@studio.com');
      setPassword('admin123');
    } else {
      setEmail('customer@example.com');
      setPassword('customer123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (mode === 'login') {
          const { data, error: authErr } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (authErr) throw authErr;

          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const userProfile: UserProfile = profile || {
              id: data.user.id,
              email: data.user.email || email,
              full_name: data.user.user_metadata?.full_name || email.split('@')[0],
              role: (data.user.user_metadata?.role as 'customer' | 'admin') || 'customer',
              created_at: new Date().toISOString()
            };

            db.setCurrentUser(userProfile);
            onAuthSuccess(userProfile);
            return;
          }
        } else {
          // Register in Supabase
          const { data, error: regErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: 'customer'
              }
            }
          });
          if (regErr) throw regErr;

          if (data.user) {
            const userProfile: UserProfile = {
              id: data.user.id,
              email,
              full_name: fullName,
              phone,
              role: 'customer',
              created_at: new Date().toISOString()
            };
            db.setCurrentUser(userProfile);
            onAuthSuccess(userProfile);
            return;
          }
        }
      }

      // Demo / Local storage authentication engine
      if (mode === 'login') {
        const role = isAdminPortal || email.includes('admin') ? 'admin' : 'customer';
        const user = await db.login(email, role);
        onAuthSuccess(user);
      } else {
        const user = await db.register({
          email,
          full_name: fullName,
          phone,
          role: 'customer'
        });
        onAuthSuccess(user);
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#0c0d10] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#232734] bg-[#12151e] p-8 shadow-2xl">
        {/* Top Emblem */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#9e7c22] p-0.5 shadow-lg shadow-[#d4af37]/15">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c0d10]">
              {isAdminPortal ? (
                <ShieldCheck className="h-6 w-6 text-[#d4af37]" />
              ) : (
                <Camera className="h-6 w-6 text-[#d4af37]" />
              )}
            </div>
          </div>

          <h2 className="mt-4 font-serif text-2xl font-bold text-white">
            {isAdminPortal
              ? 'Atelier Administrator Portal'
              : mode === 'login'
              ? 'Welcome Back to Aura'
              : 'Create Customer Account'}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {isAdminPortal
              ? 'Enter verified administrative credentials to access booking control'
              : mode === 'login'
              ? 'Sign in to access your photography dashboard and shoot status'
              : 'Register to manage bookings and receive private photo gallery links'}
          </p>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="mt-6 rounded-xl border border-[#272b38] bg-[#090b10] p-3 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium text-slate-300">
              <KeyRound className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>1-Click Demo Fill:</span>
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer')}
              className="rounded-lg border border-[#2a2f40] bg-[#141720] py-1.5 text-[11px] font-medium text-slate-200 hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="rounded-lg border border-[#2a2f40] bg-[#141720] py-1.5 text-[11px] font-medium text-[#d4af37] hover:brightness-125"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        {!isAdminPortal && (
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-[#090b10] p-1 border border-[#212634]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300">Full Name</label>
                <div className="mt-1 flex items-center rounded-xl border border-[#272b38] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                  <User className="mr-2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Eleanor Rostova"
                    className="w-full bg-transparent outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Phone Number (Optional)</label>
                <div className="mt-1 flex items-center rounded-xl border border-[#272b38] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                  <Phone className="mr-2 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-transparent outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300">Email Address</label>
            <div className="mt-1 flex items-center rounded-xl border border-[#272b38] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
              <Mail className="mr-2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminPortal ? 'admin@studio.com' : 'client@example.com'}
                className="w-full bg-transparent outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Password</label>
            <div className="mt-1 flex items-center rounded-xl border border-[#272b38] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
              <Lock className="mr-2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38c20] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <span>
              {isLoading
                ? 'Authenticating...'
                : isAdminPortal
                ? 'Sign In as Administrator'
                : mode === 'login'
                ? 'Sign In to Portal'
                : 'Complete Registration'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Bottom Toggle links */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isAdminPortal ? (
            <button
              onClick={() => setCurrentPage('login')}
              className="text-slate-300 hover:text-[#d4af37] transition-colors"
            >
              ← Back to Customer Login
            </button>
          ) : (
            <button
              onClick={() => setCurrentPage('admin-login')}
              className="text-slate-500 hover:text-[#d4af37] transition-colors"
            >
              Studio Staff? Access Admin Panel →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
