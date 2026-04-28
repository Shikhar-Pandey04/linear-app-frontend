import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import CreateIssueModal from '../components/CreateIssueModal';
import axios from '../api/axios';

const MyTasks = () => {
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null); 
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Issues ---
  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');
      setIssues(res.data.data || []);
    } catch (err) {
      console.error("Issues fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // --- 2. Edit Logic ---
  const handleEdit = (issue) => {
    setEditingIssue(issue); 
    setIsModalOpen(true);    
  };

  // --- 3. Delete Logic (With Confirmation) ---
  const handleDelete = async (issueId) => {
    if (!window.confirm("Bhai, pakka delete karna hai?")) return;
    try {
      await axios.delete(`/issues/delete/${issueId}`);
      fetchIssues(); // Refresh board
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete nahi ho paya bhai!");
    }
  };

  const handleCloseModal = () => {
    setEditingIssue(null); 
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0e11]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pt-20">
        {/* --- Header Section --- */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">My Tasks</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and track your active project issues</p>
          </div>
          
          <button 
            onClick={() => {
              setEditingIssue(null); 
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <span className="text-xl">+</span> New Issue
          </button>
        </div>

        {/* --- Kanban Board Section (No Analytics here) --- */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500 italic">
            <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Fetching your tasks...</span>
            </div>
          </div>
        ) : (
          <div className="mt-4">
             <KanbanBoard 
                issues={issues} 
                onRefresh={fetchIssues} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
          </div>
        )}

        {/* --- Modal Section --- */}
        <CreateIssueModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSuccess={fetchIssues} 
          initialData={editingIssue} 
        />
      </main>
    </div>
  );
};

export default MyTasks;