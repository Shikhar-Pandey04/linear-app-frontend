import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  rectIntersection
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import API from '../api/axios';

const KanbanBoard = ({ issues: propIssues, onRefresh, onEdit, onDelete }) => {
  const [localIssues, setLocalIssues] = useState(propIssues);
  const COLUMNS = ["TODO", "IN PROGRESS", "DONE"];

  useEffect(() => {
    setLocalIssues(propIssues);
  }, [propIssues]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  // --- MAGIC FUNCTION: Status/Container dhundne ke liye ---
  const findContainer = (id) => {
    // 1. Agar ID khud ek column ka naam hai (TODO/DONE), toh wahi return karo
    if (COLUMNS.includes(id)) return id;

    // 2. Agar ID card ki hai, toh dhundo wo card kis status/column mein hai
    const issue = localIssues.find((i) => i._id === id);
    return issue ? issue.status : null;
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Sahi column/status pata lagao
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
      // Backend ko CAPS mein bhejo
      await API.patch(`/issues/status/${activeId}`, { status: overContainer });
      
      // Parent ko refresh karne ka signal (Optional, but safe for syncing)
      // onRefresh(); 
    } catch (err) {
      console.error("Update failed:", err);
      alert("Status update fail ho gaya, wapas purani jagah!");
      setLocalIssues(propIssues); 
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      // closestCorners ki jagah rectIntersection zyada accurate hota hai cross-column ke liye
      collisionDetection={rectIntersection} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
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
    </DndContext>
  );
};

export default KanbanBoard;