import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import {
  Trash2, FolderOpen, ShieldCheck, HardDrive, BarChart3, Plus,
  Brain, Zap, Tag, MessageSquareText, ChevronRight, Activity, PenSquare, Eye
} from "lucide-react";

import { getAllFiles, deleteFileById } from "../../Apis/Files.api";
import { uploadFileToVault } from "../../Apis/UploadFile.api";

export default function FilesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Intelligence Panel State
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await getAllFiles();
      // FIX: Ensure we are mapping the unified ledger from res?.data
      setFiles(res?.allFiles || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      await uploadFileToVault(file);
      await fetchFiles(); // Refresh the unified ledger
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await deleteFileById(id, token);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      if (selectedFile?.id === id) setSelectedFile(null);
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const stats = useMemo(() => {
    const total = files.length;
    const storage = files.reduce((acc, f) => acc + (f.size || 0), 0);
    return {
      total,
      storageMB: (storage / (1024 * 1024)).toFixed(2),
      neuralNodes: total * 14,
    };
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchSearch = f.original_name?.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "All" ? true : filterType === "Encrypted" ? f.is_encrypted : !f.is_encrypted;
      return matchSearch && matchType;
    });
  }, [files, search, filterType]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif]">
      <Sidebar activePage="Files" />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-30">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">KNOWLEDGE LEDGER</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isUploading ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`} />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {isUploading ? 'Indexing Shards...' : 'Neural Engine Active'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[10px]">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH_INDEX..."
                className="h-8 w-64 pl-8 pr-3 rounded border border-slate-200 bg-slate-50 text-[10px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400 uppercase tracking-wider"
              />
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-8 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              {isUploading ? <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={12} />}
              <span>{isUploading ? "SYNCING" : "UPLOAD"}</span>
            </button>
          </div>
        </header>

        {/* --- DUAL PANE CONTENT --- */}
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT: TABLE AREA */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { title: "Total Objects", value: stats.total, icon: FolderOpen, color: "text-blue-600" },
                { title: "Neural Nodes", value: stats.neuralNodes, icon: Brain, color: "text-indigo-600" },
                { title: "Storage Payload", value: `${stats.storageMB} MB`, icon: HardDrive, color: "text-purple-600" },
                { title: "Network Status", value: "Optimal", icon: Activity, color: "text-emerald-600" },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className={`p-1.5 rounded bg-slate-50 mb-2 ${item.color}`}><item.icon size={14} /></div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.title}</p>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">{item.value}</h2>
                </motion.div>
              ))}
            </div>

            {/* Filter Strip */}
            <div className="flex p-1 bg-slate-200/50 rounded border border-slate-200 w-fit mb-4">
              {["All", "Encrypted", "Public"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilterType(item)}
                  className={`px-4 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${filterType === item ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset_Identity</th>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="2" className="py-12 text-center"><div className="animate-spin w-5 h-5 border-2 border-t-indigo-600 rounded-full mx-auto" /></td></tr>
                  ) : filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={(e) => {
                        if (!file.signedUrl) {
                          alert("Monthly View limit exceeded ! Upgrade Your Plan");
                          return;
                        }
                        setSelectedFile(file);
                        window.open(file.signedUrl, "_blank");
                      }}
                      className={`hover:bg-slate-50 transition-all group cursor-pointer ${selectedFile?.id === file.id ? "bg-indigo-50/40" : ""}`}
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center text-[9px] font-black uppercase transition-all ${file.source_type === 'system_document' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-200 group-hover:bg-white'}`}>
                            {file.mime_type?.split("/")[1] || "FILE"}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 tracking-tight">{file.original_name}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5 flex items-center gap-1.5">
                              {(file.size / 1024).toFixed(1)} KB • <span className={file.is_encrypted ? "text-emerald-500" : "text-blue-500"}>{file.source_type === 'system_document' ? "DRAFT" : file.is_encrypted ? "PROTECTED" : "STANDARD"}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end items-center gap-1.5">

                          {/* ULTRA-COMPACT ACTIONS: Minimum padding, 8px text, 8px icons */}

                          {file.source_type === "system_document" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit/${file.id}`);
                              }}
                              className="px-2 py-0.5 flex items-center gap-1 text-[8px] font-bold rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
                            >
                              <PenSquare size={8} strokeWidth={2.5} /> EDIT
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              console.log("FILE:", file);
                              console.log("SIGNED URL:", file.signedUrl);

                              if (!file.signedUrl) {
                                alert("Monthly View limit exceeded ! Upgrade Your Plan");
                                return;
                              }

                              setSelectedFile(file);
                              window.open(file.signedUrl, "_blank");
                            }}
                            className="px-2 py-0.5 flex items-center gap-1 text-[8px] font-bold rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
                          >
                            <Eye size={8} strokeWidth={2.5} /> {file.source_type === "system_document" ? "PDF" : "VIEW"}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(file);
                            }}
                            className="px-2 py-0.5 text-[8px] font-bold rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
                          >
                            SUMMARY
                          </button>

                          <div className="w-px h-2.5 bg-slate-200 mx-0.5" />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file.id);
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-transparent rounded-full hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
                          >
                            <Trash2 size={10} strokeWidth={2.5} />
                          </button>

                          <ChevronRight
                            size={10}
                            strokeWidth={2.5}
                            className={`text-slate-300 transition-transform ml-0.5 ${selectedFile?.id === file.id ? "rotate-90 text-indigo-500" : ""}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: KNOWLEDGE INSIGHT SIDE PANEL */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-[350px] bg-white border-l border-slate-200 h-full flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-40 relative shrink-0"
              >
                {/* Panel Header */}
                <div className="p-6 border-b border-slate-100 shrink-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                      <Brain size={16} />
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded transition-all"><ChevronRight size={16} /></button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug break-words">{selectedFile.original_name}</h4>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                    <Zap size={8} className="text-amber-500" /> Neural Briefing Active
                  </p>
                </div>

                {/* Panel Scroll Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {/* Content Summary */}
                  <section>
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageSquareText size={12} className="text-indigo-500" />
                      <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Semantic Profile</h5>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-[10px] font-medium text-slate-600 leading-relaxed font-mono">
                        "Autonomous scan detected this document as a high-priority asset. Content pertains to fiscal architecture and resource sharding."
                      </p>
                    </div>
                  </section>

                  {/* Knowledge Entities */}
                  <section>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Tag size={12} className="text-indigo-500" />
                      <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Entities</h5>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Infrastructure", "Fiscal", "Encrypted_Block"].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* AI Capabilities Link */}
                  <section className="pt-2">
                    <button className="w-full py-2.5 bg-slate-900 text-white rounded text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5">
                      <Brain size={10} /> Initialize Chat
                    </button>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}