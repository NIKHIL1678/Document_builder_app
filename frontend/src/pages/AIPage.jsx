import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function AIPage() {
  const [isScanning, setIsScanning] = useState(false);

  const metrics = [
    { label: 'Neural Accuracy', value: '99.2%', trend: '+0.4%' },
    { label: 'Semantic Nodes', value: '1,284', trend: 'Active' },
    { label: 'Index Coverage', value: '94.8%', trend: 'High' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar activePage="AI Intelligence" />
      
      <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto">
        {/* --- Page Header --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Neural Intelligence</h3>
            <p className="text-slate-500 text-sm mt-1">Advanced semantic mapping and predictive workspace analytics.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                View History
             </button>
             <button 
               onClick={() => { setIsScanning(true); setTimeout(() => setIsScanning(false), 3000); }}
               className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
             >
                {isScanning ? "Scanning..." : "✨ Run Deep Scan"}
             </button>
          </div>
        </header>

        {/* --- Top Metrics --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {metrics.map((m, i) => (
            <motion.div 
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{m.value}</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">{m.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* --- Terminal/Briefing Section --- */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="font-bold text-sm text-slate-700 uppercase tracking-tight">Global Workspace Synthesis</h2>
                <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-red-400" />
                   <div className="w-2 h-2 rounded-full bg-amber-400" />
                   <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="p-6">
                <div className="p-5 bg-slate-950 rounded-xl text-indigo-300 font-mono text-[13px] leading-relaxed border-l-4 border-indigo-500 shadow-inner">
                  <span className="text-slate-500 opacity-50">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400">STATUS:</span> Neural engine online.<br/>
                  <span className="text-slate-500 opacity-50">[{new Date().toLocaleTimeString()}]</span> <span className="text-indigo-400">ANALYSIS:</span> Found 42.1GB redundant data in <span className="text-white">/backups/temp</span>.<br/>
                  <span className="text-slate-500 opacity-50">[{new Date().toLocaleTimeString()}]</span> <span className="text-indigo-400">MAPPING:</span> 84% of resources classified as business-critical.<br/>
                  <span className="text-slate-500 opacity-50">[{new Date().toLocaleTimeString()}]</span> <span className="text-amber-400">WARN:</span> Entropy detected in <span className="text-white">/finance</span> key rotation suggested.
                </div>
              </div>
            </div>

            {/* --- AI Capabilities Section --- */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { t: 'Semantic Clustering', d: 'Automatically organizes unstructured data into topical nodes using NLP.', icon: '🧠' },
                { t: 'Behavioral Audit', d: 'Identifies anomalous data movement and access patterns in real-time.', icon: '🛡️' }
              ].map(item => (
                <div key={item.t} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2">{item.t}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- Sidebar Insights --- */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-800 p-7 rounded-[2rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-sm opacity-80 uppercase tracking-widest mb-1">Processing Status</h3>
                <div className="text-3xl font-black mb-6">Neural_Live</div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-2">
                      <span className="opacity-70">CPU UTILIZATION</span>
                      <span>85%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '85%' }} 
                        className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-2">
                      <span className="opacity-70">SHARDING COMPLETION</span>
                      <span>62%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '62%' }} 
                        className="h-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.8)]" 
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full mt-8 bg-white text-indigo-700 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">
                  Optimize Infrastructure
                </button>
              </div>
              
              {/* Subtle background glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">Classified Entities</h3>
               <div className="space-y-3">
                  {['Legal (24)', 'Invoices (112)', 'Source Code (84)'].map(tag => (
                    <div key={tag} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-bold text-slate-700">{tag}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}