import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Sidebar from './Sidebar';
import { 
    Bold, Italic, Strikethrough, Heading1, Heading2, 
    List, ListOrdered, Save, ArrowLeft, Terminal, Activity
} from 'lucide-react';


import { getDocumentById, updateDocument } from '../../Apis/Document.api';

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const Button = ({ onClick, isActive, children }) => (
        <button
            onClick={onClick}
            className={`p-1.5 rounded transition-all flex items-center justify-center border ${
                isActive 
                ? 'bg-slate-800 text-white border-slate-800' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex items-center gap-1.5 p-2 bg-slate-50 border-b border-slate-200">
            <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}><Bold size={14} /></Button>
            <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><Italic size={14} /></Button>
            <Button onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}><Strikethrough size={14} /></Button>
            
            <div className="w-px h-4 bg-slate-300 mx-1" />
            
            <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}><Heading1 size={14} /></Button>
            <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}><Heading2 size={14} /></Button>
            
            <div className="w-px h-4 bg-slate-300 mx-1" />

            <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}><List size={14} /></Button>
            <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}><ListOrdered size={14} /></Button>
        </div>
    );
};

export default function EditorPage() {
    const { documentId } = useParams(); // Extract ID from the route /editor/:documentId
    const navigate = useNavigate();
    
    const [title, setTitle] = useState("Loading...");
    const [isSaving, setIsSaving] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [sysError, setSysError] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[600px] text-slate-800 pb-20',
            },
        },
    });

    // 1. Fetch Document Data on Mount
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await getDocumentById(documentId);
                const docData = response.data; // Ensure your backend returns the record here
                
                setTitle(docData.title);
                
                // Hydrate TipTap Editor
                if (editor) {
                    editor.commands.setContent(docData.content);
                }
            } catch (err) {
                setSysError(err.message || "Failed to retrieve document stream.");
            } finally {
                setIsFetching(false);
            }
        };

        if (documentId && editor) {
            fetchDocument();
        }
    }, [documentId, editor]);

    // 2. Save Updated Content
    const handleSave = async () => {
        if (!editor) return;
        setIsSaving(true);
        
        try {
            // Depending on your need, you can save as JSON or HTML
            // editor.getHTML() is often better if your PDF generator expects HTML tags
            const documentContent = editor.getHTML(); 
            
            await updateDocument(documentId, {
                title,
                content: documentContent
            });
            
        } catch (err) {
            setSysError("Sync failed: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100 font-['Inter',sans-serif]">
            <Sidebar activePage="Editor" />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* --- HEADER --- */}
                <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded transition-all"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        
                        <div className="flex flex-col justify-center">
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isFetching}
                                className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-transparent border-none outline-none focus:ring-0 p-0 w-64 disabled:opacity-50"
                            />
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Terminal size={10} className="text-indigo-500" />
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    {isFetching ? "Establishing Stream..." : `ID: ${documentId.split('-')[0]}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {sysError && <span className="text-[10px] font-bold text-red-500 uppercase">{sysError}</span>}
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isFetching}
                            className="h-8 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Activity size={12} className="animate-pulse" /> : <Save size={12} />}
                            <span>{isSaving ? "SYNCING..." : "COMMIT"}</span>
                        </button>
                    </div>
                </header>

                {/* --- EDITOR WORKSPACE --- */}
                <div className="flex-1 overflow-hidden flex flex-col p-6">
                    <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                        
                        <MenuBar editor={editor} />
                        
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {isFetching ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Loading Buffer...</p>
                                </div>
                            ) : (
                                <EditorContent editor={editor} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}