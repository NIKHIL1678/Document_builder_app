import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import {
    UploadCloud, FileText, AlertCircle, CheckCircle2,
    X, ArrowRight, Activity, RefreshCw, TerminalSquare,
    Lock, Globe, Users, Building2, ShieldAlert, FilePlus2,
    HardDriveUpload, FileJson, FileType2, FileBox
} from "lucide-react";

import { initializeDocument } from "../../Apis/Document.api";

export default function DocumentImportPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // --- Core State ---
    const [creationMode, setCreationMode] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [error, setError] = useState("");

    // --- Modal & Metadata State ---
    const [showModal, setShowModal] = useState(false);
    const [docTitle, setDocTitle] = useState("");
    const [accessLevel, setAccessLevel] = useState("private");
    const [targetFormat, setTargetFormat] = useState("native"); // 'native' | 'pdf' | 'word'
    const [shareUserIds, setShareUserIds] = useState("");
    const [shareDepartmentId, setShareDepartmentId] = useState("");

    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const handleStartBlank = () => {
        setCreationMode('blank');
        setFileData(null);
        setDocTitle("");
        setTargetFormat("native");
        setShowModal(true);
    };

    const processFile = (file) => {
        setError("");
        if (!file) return;

        const validExtensions = [".txt", ".md"];
        const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

        if (!validExtensions.includes(fileExt)) {
            setError(`Invalid Format. System strictly requires ${validExtensions.join(" or ")}`);
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(`Payload Exceeds Limit. Maximum capacity is ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            setTimeout(() => {
                const textContent = e.target.result;
                const cleanName = file.name.replace(/\.(txt|md)$/i, '');

                setFileData({
                    name: file.name,
                    size: (file.size / 1024).toFixed(1),
                    content: textContent,
                    wordCount: textContent.split(/\s+/).filter(w => w.length > 0).length,
                    type: fileExt === '.md' ? 'Markdown' : 'Plain Text'
                });

                setDocTitle(cleanName);
                setIsProcessing(false);
                setShowModal(true);
            }, 600);
        };

        reader.onerror = () => {
            setError("File buffer read fault. Please try again.");
            setIsProcessing(false);
        };

        reader.readAsText(file);
    };

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const onDrop = (e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files?.[0]); };
    const onFileSelect = (e) => processFile(e.target.files?.[0]);

    const resetState = () => {
        setCreationMode(null);
        setFileData(null);
        setDocTitle("");
        setAccessLevel("private");
        setTargetFormat("native");
        setShareUserIds("");
        setShareDepartmentId("");
        setError("");
        setShowModal(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleBuildDocument = async () => {
        if (!docTitle) return;
        setIsCreating(true);

        const payload = {
            title: docTitle,
            content: creationMode === 'blank' ? "" : (fileData?.content || ""),
            targetFormat: targetFormat,
            accessLevel: accessLevel,
            sharedUsers: accessLevel === 'shared' ? shareUserIds : null,
            sharedDepartment: accessLevel === 'shared' ? shareDepartmentId : null
        };

        try {
            const response = await initializeDocument(payload);

            if (response.success) {
                navigate(`/edit/${response.data.documentId}`);
            } else {
                setError(response.message || "Database rejected initialization.");
                setShowModal(false);
            }
        } catch (err) {
            console.error("Network Error:", err);
            setError(err.message || "CRITICAL: Failed to reach backend services.");
            setShowModal(false);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif]">
            <Sidebar activePage="Import" />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* --- HEADER --- */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-30">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">WORKSPACE CREATION MODULE</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isProcessing || isCreating ? 'bg-indigo-500 animate-pulse' : fileData || creationMode === 'blank' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                {isCreating ? 'Writing to Database...' : isProcessing ? 'Processing...' : creationMode === 'blank' ? 'Blank Draft Ready' : fileData ? 'Data Loaded' : 'Awaiting Selection'}
                            </p>
                        </div>
                    </div>
                </header>

                {/* --- MAIN WORKSPACE --- */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col">
                    <div className="w-full max-w-4xl mx-auto flex flex-col h-full min-h-[600px]">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
                            {[
                                { title: "Target Format", value: ".TXT / .MD", icon: TerminalSquare, color: "text-blue-600" },
                                { title: "Max Capacity", value: `${MAX_FILE_SIZE_MB} MB`, icon: Activity, color: "text-indigo-600" },
                                { title: "Connection", value: "Secure Local", icon: CheckCircle2, color: "text-emerald-600" },
                            ].map((item, i) => (
                                <motion.div key={item.title} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                    <div className={`p-1.5 rounded-lg bg-slate-50 w-fit mb-2 ${item.color}`}><item.icon size={14} /></div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{item.title}</p>
                                    <h2 className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</h2>
                                </motion.div>
                            ))}
                        </div>

                        {!creationMode && !fileData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full h-48 mt-4">
                                {/* Path 1: Blank Document */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={handleStartBlank}
                                    className="relative flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl transition-all cursor-pointer overflow-hidden bg-white hover:border-indigo-400 hover:shadow-sm hover:-translate-y-0.5 group"
                                >
                                    <div className="p-2 rounded-lg mb-2 transition-all bg-indigo-50 text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-100">
                                        <FilePlus2 size={20} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 text-center">Create Blank Draft</h3>
                                    <p className="text-[11px] font-medium text-slate-400 text-center max-w-[180px] mt-0.5 leading-normal">
                                        Initialize an empty workspace and build from scratch.
                                    </p>
                                </motion.div>

                                {/* Path 2: File Upload */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 }}
                                    onClick={() => setCreationMode('upload')}
                                    className="relative flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl transition-all cursor-pointer overflow-hidden bg-white hover:border-emerald-400 hover:shadow-sm hover:-translate-y-0.5 group"
                                >
                                    <div className="p-2 rounded-lg mb-2 transition-all bg-emerald-50 text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-100">
                                        <HardDriveUpload size={20} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 text-center">Import Local File</h3>
                                    <p className="text-[11px] font-medium text-slate-400 text-center max-w-[180px] mt-0.5 leading-normal">
                                        Extract text from a .txt or .md file to seed the workspace.
                                    </p>
                                </motion.div>
                            </div>
                        )}

                        {creationMode === 'upload' && !fileData && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClick={() => !isProcessing && fileInputRef.current?.click()}
                                className={`relative w-full max-w-2xl mx-auto h-56 flex flex-col items-center justify-center p-6 border border-dashed rounded-xl transition-all cursor-pointer overflow-hidden mt-4 ${isDragging
                                        ? "border-emerald-500 bg-emerald-50/50"
                                        : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50"
                                    }`}
                            >
                                <input type="file" ref={fileInputRef} onChange={onFileSelect} accept=".txt,.md" className="hidden" />

                                <div className={`p-2 rounded-lg mb-3 transition-all ${isDragging ? "bg-emerald-100 text-emerald-600 scale-105" : "bg-slate-100 text-slate-500"}`}>
                                    <UploadCloud size={20} />
                                </div>

                                <h3 className="text-sm font-bold text-slate-900 mb-0.5">
                                    {isDragging ? "Drop Payload to Inject" : "Click or Drag File Here"}
                                </h3>
                                <p className="text-[11px] font-medium text-slate-500 mb-4">
                                    Initialize Draft From Local Source
                                </p>

                                <button
                                    onClick={(e) => { e.stopPropagation(); resetState(); }}
                                    className="px-4 py-1.5 border bg-amber-500 text-black border-slate-200 rounded-md text-[10px] font-bold uppercase hover:bg-red-200 transition-colors z-20 cursor-pointer"
                                >
                                    Cancel Import
                                </button>

                                {isProcessing && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                        <RefreshCw className="text-emerald-600 animate-spin mb-2" size={20} />
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-pulse">Executing Parse...</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center gap-2 shrink-0">
                                <AlertCircle size={14} className="text-red-500" />
                                <p className="text-xs font-semibold text-red-700">{error}</p>
                            </motion.div>
                        )}

                        {fileData && !error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between p-4 bg-slate-50/50 border-b border-slate-100 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{fileData.name}</h4>
                                            <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">Buffer Loaded</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={resetState}
                                            className="px-4 py-2 cursor-pointer bg-white border border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="px-4 py-2 cursor-pointer bg-indigo-600 text-white text-[11px] font-semibold uppercase tracking-wider rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                        >
                                            Configure Asset
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-5 flex flex-col overflow-hidden">
                                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 border border-slate-100 rounded-xl p-4 text-[13px] text-slate-600 font-mono whitespace-pre-wrap leading-relaxed">
                                        {fileData.content}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* --- CONFIGURATION MODAL (POPUP) --- */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => !isCreating && setShowModal(false)}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
                            >
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
                                            <ShieldAlert size={16} />
                                        </div>
                                        <h2 className="text-sm font-bold text-slate-900">Document Configuration</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        disabled={isCreating}
                                        className="p-1.5 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center divide-x divide-slate-200 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                        <div className="flex-1 text-center">
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Payload Size</p>
                                            <p className="text-xs font-bold text-slate-700">{creationMode === 'upload' && fileData ? `${fileData.size} KB` : '0 KB'}</p>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Word Count</p>
                                            <p className="text-xs font-bold text-slate-700">{creationMode === 'upload' && fileData ? fileData.wordCount : '0'}</p>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Source</p>
                                            <p className="text-xs font-bold text-slate-700">{creationMode === 'upload' ? 'Local File' : 'Blank Canvas'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest pl-0.5 flex items-center gap-1">
                                            Document Identity <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={docTitle}
                                            onChange={(e) => setDocTitle(e.target.value)}
                                            placeholder="Enter document title..."
                                            disabled={isCreating}
                                            className="w-full p-2.5 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 disabled:bg-slate-50 disabled:text-slate-400"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest pl-0.5 flex items-center gap-1">
                                            Target Format Profile <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button onClick={() => setTargetFormat('native')} disabled={isCreating} className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${targetFormat === 'native' ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'} disabled:opacity-50`}>
                                                <FileJson size={14} /><span className="text-[10px] font-bold uppercase tracking-wider">Native</span>
                                            </button>
                                            <button onClick={() => setTargetFormat('pdf')} disabled={isCreating} className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${targetFormat === 'pdf' ? 'bg-red-50 border-red-300 text-red-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'} disabled:opacity-50`}>
                                                <FileBox size={14} /><span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                                            </button>
                                            <button onClick={() => setTargetFormat('word')} disabled={isCreating} className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${targetFormat === 'word' ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'} disabled:opacity-50`}>
                                                <FileType2 size={14} /><span className="text-[10px] font-bold uppercase tracking-wider">Word</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest pl-0.5 flex items-center gap-1">
                                            Access Protocol <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => setAccessLevel('private')} disabled={isCreating} className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${accessLevel === 'private' ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'} disabled:opacity-50`}>
                                                <Lock size={14} /> <span className="text-[11px] font-bold uppercase tracking-wider">Private</span>
                                            </button>
                                            <button onClick={() => setAccessLevel('shared')} disabled={isCreating} className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${accessLevel === 'shared' ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'} disabled:opacity-50`}>
                                                <Globe size={14} /> <span className="text-[11px] font-bold uppercase tracking-wider">Shared</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                                    <button onClick={() => setShowModal(false)} disabled={isCreating} className="flex-1 cursor-pointer py-2 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-semibold uppercase tracking-wide hover:bg-slate-50 hover:text-slate-700 transition-all active:scale-[0.98] disabled:opacity-50">Back</button>
                                    <button onClick={handleBuildDocument} disabled={!docTitle || isCreating} className="flex-[2] cursor-pointer py-2 bg-slate-800 text-white/90 rounded-lg text-[10px] font-semibold uppercase tracking-wide hover:bg-indigo-500 transition-all shadow-sm shadow-slate-200/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                                        {isCreating ? <><RefreshCw size={12} className="animate-spin" /> Committing...</> : <>Initialize Document <ArrowRight size={12} /></>}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
        </div>
    );
}