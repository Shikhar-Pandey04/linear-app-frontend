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

  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');
      setIssues(res.data.data || []);
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0b0e11]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pt-20">
        {/* --- Header Section (Photo 1 jaisa) --- */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Issue Board</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your team tasks and track progress</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            + New Issue
          </button>
        </div>

        {/* --- Analytics Section (Photo 2 wale cards) --- */}
        <div className="mb-12">
           <Analytics issues={issues} />
        </div>

        {/* --- Kanban Board Section (Photo 1 wala Board yahan wapas aa gaya) --- */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Live Task Board
          </h2>
          {loading ? (
            <div className="text-slate-500 italic">Fetching issues...</div>
          ) : (
            <KanbanBoard issues={issues} onRefresh={fetchIssues} />
          )}
        </div>

        {/* Modal for creating issues */}
        {isModalOpen && (
          <CreateIssueModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={fetchIssues} 
          />
        )}
      </main>
    </div>
  );
};

export default Overview;