import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  rectIntersection,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import SortableIssueCard from './SortableIssueCard'; // Overlay ke liye
import API from '../api/axios';

const KanbanBoard = ({ issues: propIssues, onRefresh, onEdit, onDelete }) => {
  const [localIssues, setLocalIssues] = useState(propIssues);
  const [activeIssue, setActiveIssue] = useState(null); // Drag animation ke liye
  const COLUMNS = ["TODO", "IN PROGRESS", "DONE"];

  useEffect(() => {
    setLocalIssues(propIssues);
  }, [propIssues]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id) => {
    if (COLUMNS.includes(id)) return id;
    const issue = localIssues.find((i) => i._id === id);
    return issue ? issue.status : null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const issue = localIssues.find(i => i._id === active.id);
    setActiveIssue(issue);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveIssue(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // --- OPTIMISTIC UPDATE ---
    const updatedIssues = localIssues.map(issue => 
      issue._id === activeId ? { ...issue, status: overContainer } : issue
    );
    setLocalIssues(updatedIssues);

    try {
      await API.patch(`/issues/status/${activeId}`, { status: overContainer });
    } catch (err) {
      console.error("Update failed:", err);
      setLocalIssues(propIssues); 
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={rectIntersection} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        {/* --- Subtle Background Glow (Linear Style) --- */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* --- Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
          {COLUMNS.map((status) => (
            <KanbanColumn 
              key={status} 
              id={status} 
              title={status} 
              issues={localIssues?.filter(i => i.status === status) || []} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      {/* --- Drag Overlay: Card hawa mein kaise dikhega --- */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeIssue ? (
          <div className="rotate-3 scale-105 opacity-90 transition-transform">
            <SortableIssueCard issue={activeIssue} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;