import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Trash2, Edit3, Hash } from 'lucide-react';

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
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className={`group relative p-4 bg-[#161b22] border border-gray-800 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200
            hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 hover:border-gray-600 ${
                isOverlay ? 'ring-1 ring-gray-600 bg-[#1c2128]' : ''
            }`}
            {...attributes}
            {...listeners}
        >

            {/* Hover Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(issue); }}
                    className="p-1 bg-[#0d1117] border border-gray-800 hover:border-gray-600 rounded-md text-gray-400 hover:text-white"
                >
                    <Edit3 size={12} />
                </button>

                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(issue._id); }}
                    className="p-1 bg-[#0d1117] border border-gray-800 hover:border-red-800 rounded-md text-gray-400 hover:text-red-400"
                >
                    <Trash2 size={12} />
                </button>
            </div>

            {/* Title */}
            <h4 className="text-[13px] font-medium text-white mb-1">
                {issue.title}
            </h4>

            {/* Description */}
            {issue.description && (
                <p className="text-[12px] text-gray-400 mb-3 line-clamp-2">
                    {issue.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    
                    {/* Priority */}
                    <div className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${getPriorityStyles(issue.priority)}`}>
                        {issue.priority?.toUpperCase()}
                    </div>

                </div>

                {/* ID */}
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <Hash size={10} />
                    <span>{issue._id.slice(-4)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default SortableIssueCard;