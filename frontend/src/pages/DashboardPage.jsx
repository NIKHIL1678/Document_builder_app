import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Modular Components & APIs
import Sidebar from './Sidebar';
import { getDashboardSummary } from '../../Apis/Dashboard.api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH REAL-TIME VAULT TELEMETRY ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const result = await getDashboardSummary();
        // result matches your backend object: { totalFiles, storageFormatted, files: [...] }
        setDashboardData(result);
      } catch (error) {
        console.error("Vault Telemetry Failure:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Mapping Real Data to KPI Cards
  const statsCards = [
    { 
        label: 'Total Assets', 
        value: isLoading ? '---' : dashboardData?.data.totalFiles || '0', 
        growth: 'Live', 
        color: 'indigo' 
    },
    { 
        label: 'Vault Usage', 
        value: isLoading ? '---' : dashboardData?.data.storageFormatted || '0 MB', 
        growth: 'Optimized', 
        color: 'violet' 
    },
    { 
        label: 'System Status', 
        value: isLoading ? '---' : dashboardData?.data.vaultStatus || 'Active', 
        growth: 'Secure', 
        color: 'emerald' 
    },
    { 
        label: 'Neural Index', 
        value: 'Ready', 
        growth: 'v4.2', 
        color: 'blue' 
    },
  ];

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans selection:bg-indigo-100">
      
      <Sidebar activePage="Dashboard" />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-xl z-20 py-2 gap-6">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">Mission Control</h3>
            <p className="text-slate-500 font-medium mt-1">Real-time telemetry for {dashboardData?.data.totalFiles || 0} secure assets</p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
            <div className="relative group flex-1 xl:flex-none">
              <input
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all w-full xl:w-72 text-sm shadow-sm"
                placeholder="Search encrypted index..."
              />
              <span className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">🔍</span>
            </div>
            <button 
                onClick={() => navigate('/files')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Deploy Asset
            </button>
          </div>
        </header>

        {/* --- KPI STATS SECTION --- */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={item.label}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold bg-emerald-50 text-emerald-600 uppercase`}>
                  {item.growth}
                </span>
              </div>
              <div className="text-3xl font-black mt-3 text-slate-900 tracking-tight lowercase">
                {isLoading ? (
                    <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg" />
                ) : item.value}
              </div>
              <div className="mt-5 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isLoading ? '10%' : '65%' }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </section>

        {/* --- MAIN CONTENT GRID --- */}
        <section className="grid xl:grid-cols-3 gap-8">
          
          {/* REAL FILE LEDGER */}
          <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-xl tracking-tight text-slate-800">Recent Transmissions</h2>
              <button onClick={() => navigate('/files')} className="text-indigo-600 font-bold text-xs hover:underline underline-offset-4 uppercase tracking-tighter">VIEW ALL ASSETS</button>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                  [1, 2].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)
              ) : (dashboardData?.data.files?.length > 0) ? (
                  dashboardData.data.files.map((file, i) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex justify-between items-center p-5 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-200 uppercase">
                          {file.mime_type?.split('/')[1] || 'BIN'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm truncate max-w-[200px] md:max-w-xs">{file.original_name}</div>
                          <div className="text-xs text-slate-600 font-semibold mt-0.5">
                            {(file.size / 1024).toFixed(1)} KB • {file.is_encrypted ? 'Encrypted' : 'Public'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-black text-slate-600 group-hover:text-indigo-400 transition-colors uppercase">
                            {new Date(file.createdAt).toLocaleDateString()}
                        </div>
                        <div className="mt-1 flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                  <div className="text-center py-20 text-slate-400 font-medium italic">The vault is currently empty. Start by deploying an asset.</div>
              )}
            </div>
          </div>

          {/* AI PANEL: CONTEXT AWARE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e1e2e] text-white rounded-[2rem] p-8 shadow-2xl flex flex-col relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="font-black text-2xl tracking-tight leading-tight">Neural Intelligence</h2>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed font-medium">
                Analysis ready for <b>{dashboardData?.totalFiles || 0} assets</b>. Our engine will scan metadata for compliance and redundancy.
              </p>
            </div>

            <button 
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className={`mt-10 relative z-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
                isAnalyzing ? 'bg-slate-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Synthesizing...
                </>
              ) : (
                'Run Analysis'
              )}
            </button>
            <div className="mt-6 text-[10px] text-center font-bold text-slate-500 tracking-[0.2em] uppercase">Engine V4.2 Online</div>
          </motion.div>
        </section>

        {/* QUICK ACCESS FOOTER */}
        <footer className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {['Upload Asset', 'Grant Access', 'Rotate Keys', 'View Telemetry'].map((action) => (
            <button 
                key={action} 
                onClick={() => action === 'Upload Asset' && navigate('/files')}
                className="p-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all uppercase tracking-widest"
            >
              {action}
            </button>
          ))}
        </footer>

      </main>
    </div>
  );
}