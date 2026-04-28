import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Analytics from '../components/Analytics';
import KanbanBoard from '../components/KanbanBoard';
import CreateIssueModal from '../components/CreateIssueModal';
import axios from '../api/axios';

const Overview = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null); // 👈 Ye add kiya

  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');
      setIssues(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Bhai, delete kar dein?")) return;
    try {
      await axios.delete(`/issues/delete/${id}`);
      fetchIssues();
    } catch (err) {
      alert("Delete fail!");
    }
  };

  // --- Edit Mode ON ---
  const handleEditIssue = (issue) => {
    setEditingIssue(issue); // Pehle data set karo
    setIsModalOpen(true);    // Phir modal kholo
  };

  // --- Modal Close hone par state saaf karo ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIssue(null); // Data saaf taaki agli baar "New Issue" khule
  };

  return (
    <div className="flex min-h-screen bg-[#0b0e11]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 pt-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Issue Board</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage tasks smoothly</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg"
          >
            + New Issue
          </button>
        </div>

        <div className="mb-12">
           <Analytics issues={issues} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Live Task Board</h2>
          {loading ? (
            <div className="text-slate-500 italic">Loading...</div>
          ) : (
            <KanbanBoard 
              issues={issues} 
              onRefresh={fetchIssues} 
              onEdit={handleEditIssue} // 👈 Pass handleEdit
              onDelete={handleDeleteIssue} 
            />
          )}
        </div>

        <CreateIssueModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} // 👈 Use handleCloseModal
          onSuccess={fetchIssues}
          initialData={editingIssue} // 👈 Ye sabse zaroori line hai
        />
      </main>
    </div>
  );
};

export default Overview;