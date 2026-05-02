import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import CreateIssueModal from '../components/CreateIssueModal';
import axios from '../api/axios';
import { Plus } from 'lucide-react';

const MyTasks = () => {
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
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

  const handleEdit = (issue) => {
    setEditingIssue(issue); 
    setIsModalOpen(true);    
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm("Bhai, pakka delete karna hai?")) return;
    try {
      await axios.delete(`/issues/delete/${issueId}`);
      fetchIssues(); 
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
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <Sidebar />

      <main className="flex-1 ml-64 p-10 pt-24">
        <div className="flex justify-between items-center mb-10">
          
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-1">
              My Tasks
            </h1>

            <p className="text-gray-400 font-medium text-sm tracking-wide">
              Manage your active issues
            </p>
          </div>
          
          <button 
            onClick={() => {
              setEditingIssue(null); 
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            <Plus size={16} />
            <span>New Issue</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="flex flex-col items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#238636] border-t-transparent rounded-full animate-spin"></div>
                <span>Fetching tasks...</span>
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