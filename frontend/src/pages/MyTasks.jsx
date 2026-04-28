import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import CreateIssueModal from '../components/CreateIssueModal';
import axios from '../api/axios';

const MyTasks = () => {
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null); // 👈 Edit ke liye naya state
  const [loading, setLoading] = useState(true);

  // Database se issues fetch karne ka function
  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');
      setIssues(res.data.data || []);
    } catch (err) {
      console.error("Issues fetch fail ho gaya bhai:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // --- EDIT LOGIC ---
  const handleEdit = (issue) => {
    setEditingIssue(issue); // Card ka data state mein dalo
    setIsModalOpen(true);    // Modal kholo
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (issueId) => {
    try {
      await axios.delete(`/issues/delete/${issueId}`);
      fetchIssues(); // Refresh board
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete nahi ho paya bhai!");
    }
  };

  // Modal band karte waqt data reset karo
  const handleCloseModal = () => {
    setEditingIssue(null); 
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0e11]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pt-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">My Tasks</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and track your active project issues</p>
          </div>
          
          <button 
            onClick={() => {
              setEditingIssue(null); // Naya issue hai toh purana data saaf karo
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <span className="text-xl">+</span> New Issue
          </button>
        </div>

        {/* --- Kanban Board Section --- */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500 italic">
            Fetching your tasks...
          </div>
        ) : (
          <KanbanBoard 
            issues={issues} 
            onRefresh={fetchIssues} 
            onEdit={handleEdit}    // 👈 Edit function pass kiya
            onDelete={handleDelete} // 👈 Delete function pass kiya
          />
        )}

        {/* --- Issue Create/Edit Modal --- */}
        <CreateIssueModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSuccess={fetchIssues} 
          initialData={editingIssue} // 👈 Ye modal ko batayega ki Edit karna hai
        />
      </main>
    </div>
  );
};

export default MyTasks;