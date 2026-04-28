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

import KanbanColumn from './KanbanColumn';
import SortableIssueCard from './SortableIssueCard';
import API from '../api/axios';

const KanbanBoard = ({ issues: propIssues, onRefresh, onEdit, onDelete }) => {
  const [localIssues, setLocalIssues] = useState(propIssues || []);
  const [activeIssue, setActiveIssue] = useState(null);

  const COLUMNS = [
    { id: "todo", title: "TODO" },
    { id: "in-progress", title: "IN PROGRESS" },
    { id: "done", title: "DONE" }
  ];

  useEffect(() => {
    setLocalIssues(propIssues || []);
  }, [propIssues]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id) => {
    const column = COLUMNS.find((col) => col.id === id);
    if (column) return column.id;

    const issue = localIssues.find((item) => item._id === id);
    return issue ? issue.status : null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const issue = localIssues.find((item) => item._id === active.id);
    setActiveIssue(issue || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveIssue(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    const updatedIssues = localIssues.map((issue) =>
      issue._id === activeId
        ? { ...issue, status: overContainer }
        : issue
    );

    setLocalIssues(updatedIssues);

    try {
      await API.patch(`/issues/status/${activeId}`, {
        status: overContainer
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Status update failed:", error);
      setLocalIssues(propIssues || []);
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              issues={
                localIssues?.filter(
                  (issue) => issue.status === column.id
                ) || []
              }
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeIssue ? (
          <div className="rotate-3 scale-105 opacity-90 transition-transform">
            <SortableIssueCard
              issue={activeIssue}
              isOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;