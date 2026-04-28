import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Trash2, Edit3 } from 'lucide-react';

const SortableIssueCard = ({ issue, onEdit, onDelete }) => {
    // dnd-kit hooks logic
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: issue._id });

    // Dragging style setup
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2, borderColor: '#334155' }}
            className={`group relative p-4 bg-[#161b22] border border-slate-800/60 rounded-xl cursor-grab active:cursor-grabbing shadow-sm hover:shadow-indigo-500/5 transition-all ${isDragging ? 'ring-2 ring-indigo-500/50 border-indigo-500' : ''}`}
            {...attributes}
            {...listeners}
        >
            {/* --- Hover Actions Menu --- */}
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onEdit(issue);
                    }}
                    className="p-1.5 bg-slate-800/90 hover:bg-indigo-600 rounded-lg text-gray-400 hover:text-white transition-all shadow-lg"
                    title="Edit Task"
                >
                    <Edit3 size={13} />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm("Bhai, delete kar du?")) onDelete(issue._id);
                    }}
                    className="p-1.5 bg-slate-800/90 hover:bg-rose-600 rounded-lg text-gray-400 hover:text-white transition-all shadow-lg"
                    title="Delete Task"
                >
                    <Trash2 size={13} />
                </button>
            </div>

            {/* --- Card Content --- */}
            <div className="flex justify-between items-start mb-2 pr-12">
                <h4 className="text-[13px] font-semibold text-gray-200 leading-snug tracking-tight">
                    {issue.title}
                </h4>
            </div>

            {issue.description && (
                <p className="text-[12px] text-slate-500 line-clamp-2 mt-1 mb-4 font-medium leading-relaxed">
                    {issue.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    {/* Priority Badge - Fixed for UPPERCASE */}
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-black tracking-wider border ${
                        issue.priority === 'HIGH' || issue.priority === 'URGENT'
                        ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' 
                        : issue.priority === 'MEDIUM'
                        ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
                        : 'border-slate-500/20 text-slate-400 bg-slate-500/5'
                    }`}>
                        {issue.priority?.toUpperCase()}
                    </span>
                    
                    {/* User Avatar Initial */}
                    <div className="w-5 h-5 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 font-bold" title={issue.creator?.username}>
                        {issue.creator?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>

                <span className="text-[10px] text-slate-700 font-mono tracking-tighter">
                    #{issue._id.slice(-4)}
                </span>
            </div>
        </motion.div>
    );
};

export default SortableIssueCard;