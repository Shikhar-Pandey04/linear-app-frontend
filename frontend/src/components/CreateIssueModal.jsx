import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import API from '../api/axios';

const CreateIssueModal = ({ isOpen, onClose, onSuccess, initialData = null, projectId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'low', // Default lowercase rakho
        status: 'todo'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                priority: initialData.priority?.toLowerCase() || 'medium',
                status: initialData.status?.toLowerCase() || 'todo'
            });
        } else {
            setFormData({ title: '', description: '', priority: 'medium', status: 'todo' });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return alert("Title toh dalo bhai!");
        
        // --- Sabse Zaruri Check ---
        // Agar naya issue bana rahe ho, toh projectId hona hi chahiye
        if (!initialData && !projectId) {
            return alert("Bhai, bina project ke task kahan save hoga? Project ID missing hai.");
        }

        setLoading(true);

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            // Backend lowercase maang raha hai
            priority: formData.priority.toLowerCase(),
            status: initialData ? formData.status.toLowerCase() : "todo",
            // Ye rahi wo missing field!
            project: projectId 
        };
        
        console.log("🚀 Backend ko ye bhej raha hoon:", payload);

        try {
            if (initialData) {
                await API.patch(`/issues/status/${initialData._id}`, payload);
            } else {
                // Route check karna: '/issues/create' ya '/issues/create-issue'
                await API.post('/issues/create', payload); 
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error("❌ Saving Error Details:", error.response?.data);
            alert(`Garbad ho gayi: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#161b22] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
                                    {initialData ? 'Update Issue' : 'Create New Issue'}
                                </h2>
                                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#0b0e11] border border-slate-800 p-3.5 rounded-xl text-sm text-slate-200 focus:border-indigo-500 outline-none transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Kiya kaam hai?"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                                    <textarea 
                                        className="w-full bg-[#0b0e11] border border-slate-800 p-3.5 rounded-xl text-sm text-slate-200 h-28 focus:border-indigo-500 outline-none resize-none transition-all"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Thoda vistaar mein batao..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</label>
                                    <div className="flex gap-3">
                                        {['low', 'medium', 'high'].map((p) => (
                                            <button
                                                key={p} type="button"
                                                onClick={() => setFormData({...formData, priority: p})}
                                                className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                                                    formData.priority === p 
                                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-slate-800/50">
                                    <button type="button" onClick={onClose} className="text-sm font-bold text-slate-500 hover:text-slate-300">
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" disabled={loading}
                                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-xl transition-all shadow-xl shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : (initialData ? "Update" : "Create")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateIssueModal;