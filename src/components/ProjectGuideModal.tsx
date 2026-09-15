import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Rocket, 
  GitBranch, 
  GraduationCap, 
  AlertTriangle,
  Code2,
  Lock,
  Server,
  Layers
} from 'lucide-react';

interface ProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectGuideModal: React.FC<ProjectGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vscode' | 'database' | 'admin' | 'vercel' | 'academic'>('vscode');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabs = [
    { id: 'vscode', label: 'Local VS Code Setup', icon: Terminal },
    { id: 'database', label: 'Supabase & Database', icon: Database },
    { id: 'admin', label: 'Admin Setup & Auth', icon: ShieldCheck },
    { id: 'vercel', label: 'Vercel & GitHub Deploy', icon: Rocket },
    { id: 'academic', label: 'CS Project Defense', icon: GraduationCap },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-[#262b3a] bg-[#0e1017] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e2330] px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Third Year CS Project: Complete Setup & Deployment Guide</h2>
              <p className="text-xs text-slate-400">Step-by-step documentation for local development, Supabase, and Vercel cloud hosting</p>
            </div>
          </div>
          <button
            id="close-guide-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1e2330] bg-[#0a0c10] px-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-300">
          {/* TAB 1: LOCAL VS CODE SETUP */}
          {activeTab === 'vscode' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">1. Prerequisites & Required Software</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Ensure you have the following installed on your machine (macOS, Windows, or Linux):
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3 text-xs">
                    <p className="font-semibold text-white">1. Node.js (v18 or v20+)</p>
                    <p className="mt-1 text-slate-400">Download from <span className="text-[#d4af37]">nodejs.org</span></p>
                  </div>
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3 text-xs">
                    <p className="font-semibold text-white">2. Visual Studio Code</p>
                    <p className="mt-1 text-slate-400">Official editor from <span className="text-[#d4af37]">code.visualstudio.com</span></p>
                  </div>
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3 text-xs">
                    <p className="font-semibold text-white">3. Git CLI</p>
                    <p className="mt-1 text-slate-400">Installed by default or from <span className="text-[#d4af37]">git-scm.com</span></p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">2. Verifying Node & npm</h3>
                <p className="mt-1 text-xs text-slate-400">Open your Terminal (macOS/Linux) or PowerShell (Windows):</p>
                <div className="mt-2 rounded-lg bg-[#07080b] p-3 font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <code>node -v && npm -v</code>
                  <button
                    onClick={() => copyToClipboard('node -v && npm -v', 'verify-cmd')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'verify-cmd' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">3. Installing Dependencies & Starting Locally</h3>
                <p className="mt-1 text-xs text-slate-400">In VS Code, press <code className="text-amber-300">Ctrl + `</code> (or <code className="text-amber-300">Cmd + `</code> on Mac) to open the Integrated Terminal:</p>
                
                <div className="mt-3 space-y-2">
                  <div className="rounded-lg bg-[#07080b] p-3 font-mono text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500"># 1. Install all dependencies</span>
                      <p className="text-emerald-400">npm install</p>
                    </div>
                    <button onClick={() => copyToClipboard('npm install', 'npm-i')} className="text-slate-400 hover:text-white">
                      {copiedKey === 'npm-i' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="rounded-lg bg-[#07080b] p-3 font-mono text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500"># 2. Run local development server</span>
                      <p className="text-emerald-400">npm run dev</p>
                    </div>
                    <button onClick={() => copyToClipboard('npm run dev', 'npm-dev')} className="text-slate-400 hover:text-white">
                      {copiedKey === 'npm-dev' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  <p className="font-semibold">Local URL:</p>
                  <p className="mt-0.5 font-mono">http://localhost:3000</p>
                  <p className="mt-1 text-slate-300">Open your browser and navigate to this address. Press <code className="bg-black/40 px-1 py-0.5 rounded">Ctrl + C</code> in your terminal anytime to stop the server.</p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">4. Configuring Environment Variables (.env.local)</h3>
                <p className="mt-1 text-xs text-slate-400">Create a file named <code className="text-amber-300">.env.local</code> in the root directory:</p>
                <div className="mt-2 rounded-lg bg-[#07080b] p-3 font-mono text-xs text-slate-300">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10 text-[11px] text-slate-400">
                    <span>.env.local</span>
                    <button 
                      onClick={() => copyToClipboard(`VITE_SUPABASE_URL=https://your-project-ref.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here\nNEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`, 'env-copy')}
                      className="hover:text-white flex items-center space-x-1"
                    >
                      {copiedKey === 'env-copy' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Copy Config</span>
                    </button>
                  </div>
                  <pre>{`# Vite environment keys (for preview & Vite runtimes):
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Next.js environment keys (for Next.js App Router):
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">5. Common Local Errors & Troubleshooting</h3>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3">
                    <p className="font-semibold text-amber-400">Port 3000 already in use:</p>
                    <p className="text-slate-400 mt-0.5">Run <code className="font-mono text-slate-200">npx kill-port 3000</code> or restart your terminal.</p>
                  </div>
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3">
                    <p className="font-semibold text-amber-400">Missing node_modules:</p>
                    <p className="text-slate-400 mt-0.5">Run <code className="font-mono text-slate-200">rm -rf node_modules package-lock.json && npm install</code>.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPABASE & DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">1. Creating Your Supabase Project</h3>
                <ol className="mt-2 list-decimal pl-5 space-y-2 text-xs text-slate-300">
                  <li>Visit <strong className="text-white">supabase.com</strong> and sign in (free tier available).</li>
                  <li>Click <strong className="text-white">"New Project"</strong>, select your organization, name your project <code className="text-[#d4af37]">aura-photography</code>, and generate a secure database password.</li>
                  <li>Wait ~60 seconds for provisioning to finish.</li>
                  <li>Go to <strong className="text-white">Project Settings → API</strong>.</li>
                  <li>Copy the <strong className="text-[#d4af37]">Project URL</strong> and the <strong className="text-[#d4af37]">anon / public API key</strong>.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">2. Executing the SQL Schema in Supabase</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Open the <strong className="text-white">SQL Editor</strong> on your Supabase dashboard (left sidebar icon with <code className="text-[#d4af37]">&gt;_</code>). Click <strong className="text-white">"New Query"</strong>, paste the complete schema below, and click <strong className="text-emerald-400">"Run"</strong>:
                </p>

                <div className="mt-3 rounded-lg border border-[#262b3a] bg-[#07080b] p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                    <span className="font-mono text-slate-400">supabase/schema.sql</span>
                    <button
                      onClick={() => copyToClipboard(`-- Copy from /supabase/schema.sql in the repo`, 'sql-schema')}
                      className="flex items-center space-x-1.5 text-xs text-[#d4af37] hover:underline"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Schema is saved in /supabase/schema.sql</span>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    The schema file has already been generated in your project root at <code className="text-amber-300">/supabase/schema.sql</code> with all 5 relational tables, indexes, triggers, seed data, and Row Level Security (RLS) policies.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">3. Database Schema Architecture</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3">
                    <p className="font-semibold text-white flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-[#d4af37]" />
                      <span>profiles (Extends auth.users)</span>
                    </p>
                    <p className="mt-1 text-slate-400">Stores full_name, email, phone, role ('customer' | 'admin'), avatar_url. Enforces RBAC authorization.</p>
                  </div>
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3">
                    <p className="font-semibold text-white flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-[#d4af37]" />
                      <span>bookings (Reservations)</span>
                    </p>
                    <p className="mt-1 text-slate-400">Links customer_id to service_id, date, time slot, location, notes, and status ('pending', 'confirmed', 'completed', 'cancelled').</p>
                  </div>
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3">
                    <p className="font-semibold text-white flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-[#d4af37]" />
                      <span>services & categories</span>
                    </p>
                    <p className="mt-1 text-slate-400">Catalog of photography packages, price points, session durations, features array, and category relationships.</p>
                  </div>
                  <div className="rounded-lg border border-[#212634] bg-[#12151e] p-3">
                    <p className="font-semibold text-white flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-[#d4af37]" />
                      <span>gallery_images (Portfolio)</span>
                    </p>
                    <p className="mt-1 text-slate-400">Stores visual assets with EXIF camera specs, category foreign keys, orientation tags, and featured flags.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">4. Row Level Security (RLS) Policies</h3>
                <div className="mt-2 rounded-lg bg-[#07080b] p-3 font-mono text-xs text-slate-300 space-y-1">
                  <p><span className="text-[#d4af37]">-- Customers access only their own records:</span></p>
                  <p>CREATE POLICY "View bookings policy" ON bookings FOR SELECT</p>
                  <p>  USING (customer_id = auth.uid()::text OR is_admin());</p>
                  <p className="pt-2"><span className="text-[#d4af37]">-- Admins have full access to all tables:</span></p>
                  <p>CREATE FUNCTION is_admin() RETURNS BOOLEAN AS ...</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN SETUP & AUTH */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">1. How Admin Authentication Works</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Role-Based Access Control (RBAC) is implemented directly into the database schema and application state. The <code className="text-amber-300">profiles.role</code> column determines authorization. If the role is <code className="text-[#d4af37] font-semibold">'admin'</code>, the user is granted access to the admin management dashboard and all CRUD capabilities.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">2. Quick Testing / Demo Accounts</h3>
                <p className="mt-1 text-xs text-slate-400">
                  In this live preview and local mode, default seeded credentials are provided:
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg border border-[#d4af37]/30 bg-[#161410] p-4">
                    <p className="font-bold text-[#d4af37]">Admin Account</p>
                    <p className="mt-1 text-slate-300">Email: <code className="font-mono text-white">admin@studio.com</code></p>
                    <p className="text-slate-300">Password: <code className="font-mono text-white">admin123</code></p>
                    <p className="mt-2 text-[11px] text-slate-400">Has access to Admin Dashboard, Booking Approvals, Gallery Uploads, and Service Pricing.</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-[#12151e] p-4">
                    <p className="font-bold text-white">Customer Account</p>
                    <p className="mt-1 text-slate-300">Email: <code className="font-mono text-white">customer@example.com</code></p>
                    <p className="text-slate-300">Password: <code className="font-mono text-white">customer123</code></p>
                    <p className="mt-2 text-[11px] text-slate-400">Can make shoot reservations, view personal booking history, and cancel pending shoots.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">3. Promoting a Real User to Admin in Supabase</h3>
                <p className="mt-1 text-xs text-slate-400">
                  When running with real Supabase Auth, sign up a new account via the website, then run this single SQL line in the Supabase SQL Editor:
                </p>
                <div className="mt-2 rounded-lg bg-[#07080b] p-3 font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <code>UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@example.com';</code>
                  <button
                    onClick={() => copyToClipboard("UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@example.com';", 'promote-sql')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'promote-sql' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">4. Protected Route Verification</h3>
                <p className="mt-1 text-xs text-slate-400">
                  If an unauthorized user attempts to access any admin view, the system verifies role privileges and redirects them to the login screen with an access violation notification.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: VERCEL & GITHUB */}
          {activeTab === 'vercel' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">1. GitHub Repository Setup</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Initialize and push your repository to GitHub using these standard commands:
                </p>
                <div className="mt-2 rounded-lg bg-[#07080b] p-3 font-mono text-xs text-slate-300 space-y-1.5">
                  <div className="flex justify-between">
                    <p className="text-emerald-400">git init</p>
                    <span className="text-slate-500"># Initialize Git tracking</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-emerald-400">git add .</p>
                    <span className="text-slate-500"># Stage all project files</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-emerald-400">git commit -m "Initial complete photography portfolio & booking platform"</p>
                    <span className="text-slate-500"># Commit with message</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-emerald-400">git branch -M main</p>
                    <span className="text-slate-500"># Set main branch</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-emerald-400">git remote add origin https://github.com/YOUR_USERNAME/aura-photography.git</p>
                    <span className="text-slate-500"># Link remote</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-emerald-400">git push -u origin main</p>
                    <span className="text-slate-500"># Push to GitHub</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">2. Vercel Cloud Deployment</h3>
                <ol className="mt-2 list-decimal pl-5 space-y-2 text-xs text-slate-300">
                  <li>Log in to <strong className="text-white">vercel.com</strong> with your GitHub account.</li>
                  <li>Click <strong className="text-white">"Add New... → Project"</strong>.</li>
                  <li>Select your <code className="text-[#d4af37]">aura-photography</code> repository and click <strong className="text-white">"Import"</strong>.</li>
                  <li>In the <strong className="text-white">Environment Variables</strong> section, expand and add:
                    <ul className="mt-1.5 list-disc pl-5 font-mono text-[11px] text-amber-300 space-y-1">
                      <li>NEXT_PUBLIC_SUPABASE_URL = your_supabase_url</li>
                      <li>NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key</li>
                      <li>VITE_SUPABASE_URL = your_supabase_url</li>
                      <li>VITE_SUPABASE_ANON_KEY = your_supabase_anon_key</li>
                    </ul>
                  </li>
                  <li>Click <strong className="text-emerald-400 font-bold">"Deploy"</strong>. Within ~90 seconds, your site will be live with a free SSL certificate!</li>
                </ol>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">3. Configuring Supabase Redirect URLs for Production</h3>
                <p className="mt-1 text-xs text-slate-400">
                  In Supabase Dashboard → <strong className="text-white">Authentication → URL Configuration</strong>, add your Vercel production domain:
                </p>
                <div className="mt-2 rounded-lg bg-[#07080b] p-2.5 font-mono text-xs text-slate-300">
                  Site URL: <code className="text-emerald-400">https://your-app.vercel.app</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACADEMIC DEFENSE */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">Third Year Computer Science Project Defense Notes</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Key technical concepts and architecture points to explain to examiners and professors:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-[#212634] bg-[#12151e] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#d4af37]">
                    <Code2 className="h-4 w-4" />
                    <span className="font-bold">1. Full-Stack Separation of Concerns</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Clear isolation between the presentation layer (React 19 / Next.js / Tailwind CSS), state orchestration (custom reactive database services), and persistence layer (PostgreSQL on Supabase).
                  </p>
                </div>

                <div className="rounded-lg border border-[#212634] bg-[#12151e] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#d4af37]">
                    <Lock className="h-4 w-4" />
                    <span className="font-bold">2. Security & Row Level Security (RLS)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Data integrity enforced at the database engine level via PostgreSQL RLS policies rather than solely relying on client-side guards. Anon keys cannot bypass RLS.
                  </p>
                </div>

                <div className="rounded-lg border border-[#212634] bg-[#12151e] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#d4af37]">
                    <Server className="h-4 w-4" />
                    <span className="font-bold">3. Concurrency & Double-Booking Prevention</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Active slot conflict queries ensure no two confirmed or pending bookings can collide on the exact same date and session window.
                  </p>
                </div>

                <div className="rounded-lg border border-[#212634] bg-[#12151e] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#d4af37]">
                    <Rocket className="h-4 w-4" />
                    <span className="font-bold">4. Performance & Responsive Design</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    GPU-accelerated transforms via Motion, lazy loading of high-resolution visual assets, responsive grid layouts adapting across mobile, tablet, and ultra-wide screens.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1e2330] bg-[#0a0c10] px-6 py-3 text-xs text-slate-400">
          <span>Aura Photography Studio • Computer Science Capstone Project</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#d4af37] px-4 py-1.5 font-semibold text-black hover:brightness-110"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
