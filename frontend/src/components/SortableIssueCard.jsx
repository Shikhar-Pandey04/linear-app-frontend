import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Trash2, Edit3, User, Hash } from 'lucide-react';

const SortableIssueCard = ({ issue, onEdit, onDelete, isOverlay = false }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: issue._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.4 : 1,
    };

    // --- Priority Styling Logic ---
    const getPriorityStyles = (priority) => {
        const p = priority?.toUpperCase();
        switch (p) {
            case 'HIGH':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'MEDIUM':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'LOW':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`group relative p-4 bg-[#161b22] border border-slate-800/60 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:bg-[#1c2128] hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 ${
                isOverlay ? 'ring-2 ring-indigo-500/50 shadow-2xl bg-[#1c2128]' : ''
            }`}
            {...attributes}
            {...listeners}
        >
            {/* --- Hover Action Menu --- */}
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-20">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(issue); }}
                    className="p-1.5 bg-[#0d1117] border border-slate-800 hover:border-slate-600 rounded-lg text-slate-400 hover:text-white transition-all shadow-lg"
                >
                    <Edit3 size={13} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(issue._id); }}
                    className="p-1.5 bg-[#0d1117] border border-slate-800 hover:border-red-900/50 rounded-lg text-slate-400 hover:text-red-400 transition-all shadow-lg"
                >
                    <Trash2 size={13} />
                </button>
            </div>

            {/* --- Issue Title --- */}
            <h4 className="text-[13.5px] font-semibold text-slate-200 leading-tight mb-2 group-hover:text-indigo-400 transition-colors">
                {issue.title}
            </h4>

            {/* --- Description --- */}
            {issue.description && (
                <p className="text-[12px] text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                    {issue.description}
                </p>
            )}

            {/* --- Card Footer --- */}
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    {/* Priority Tag */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wider ${getPriorityStyles(issue.priority)}`}>
                        <div className={`w-1 h-1 rounded-full ${issue.priority?.toUpperCase() === 'HIGH' ? 'bg-red-500' : issue.priority?.toUpperCase() === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        {issue.priority?.toUpperCase()}
                    </div>
                    
                    {/* Project/User Info */}
                    <div className="flex items-center gap-1.5 text-slate-600">
                         <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                            {issue.creator?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>

                {/* Issue ID Badge */}
                <div className="flex items-center gap-1 text-[10px] text-slate-700 font-mono">
                    <Hash size={10} />
                    <span>{issue._id.slice(-4)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default SortableIssueCard;