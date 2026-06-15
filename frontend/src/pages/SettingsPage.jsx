import React from 'react';
import Sidebar from './Sidebar';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar activePage="Settings" />
      
      <main className="flex-1 p-8 lg:p-10 max-w-5xl mx-auto">
        {/* --- Page Header --- */}
        <header className="mb-10">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Infrastructure Settings</h3>
          <p className="text-slate-500 text-sm mt-1">Manage global security protocols, API integrations, and vault encryption.</p>
        </header>

        <div className="space-y-6">
          {/* --- Security Section --- */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30">
              <h2 className="font-bold text-sm text-slate-800 uppercase tracking-tight">Security & Authentication</h2>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Toggle Row 1 */}
              <div className="flex justify-between items-start">
                <div className="max-w-md">
                  <div className="font-bold text-[14px] text-slate-800">Multi-Factor Authentication (MFA)</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">Require a secondary biometric or token-based verification for all administrative actions and high-volume data transfers.</div>
                </div>
                <button className="w-10 h-5 bg-indigo-600 rounded-full relative transition-colors">
                  <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                </button>
              </div>

              {/* Toggle Row 2 */}
              <div className="flex justify-between items-start">
                <div className="max-w-md">
                  <div className="font-bold text-[14px] text-slate-800">Zero-Knowledge Auto-Encryption</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">Automatically apply AES-256 encryption at the ingress layer. Private keys are never stored on VaultAI primary nodes.</div>
                </div>
                <button className="w-10 h-5 bg-slate-200 rounded-full relative transition-colors hover:bg-slate-300">
                  <div className="w-3.5 h-3.5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                </button>
              </div>
            </div>
          </section>

          {/* --- API Configuration --- */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30">
              <h2 className="font-bold text-sm text-slate-800 uppercase tracking-tight">Developer Infrastructure</h2>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Secret Access Key</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Use this key to authenticate CLI and SDK requests.</p>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Rotate Key</button>
              </div>
              
              <div className="group relative">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[12px] text-slate-600 flex justify-between items-center group-hover:border-slate-300 transition-all">
                  <span className="tracking-tighter opacity-80">vault_live_72x_k8s_9b2v_f92kd02js92ks02lsk02</span>
                  <button className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm">
                    Copy Key
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- Danger Zone --- */}
          <section className="bg-red-50/30 rounded-3xl border border-red-100 p-8 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-sm text-red-800">Purge Workspace Data</h2>
              <p className="text-xs text-red-600/70 mt-1">Permanently erase all sharded nodes and metadata. This action is irreversible.</p>
            </div>
            <button className="px-5 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
              Delete Infrastructure
            </button>
          </section>
        </div>

        <footer className="mt-10 flex justify-end gap-3">
          <button className="px-6 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard Changes</button>
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">Save Configuration</button>
        </footer>
      </main>
    </div>
  );
}