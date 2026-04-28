import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import CreateIssueModal from '../components/CreateIssueModal';
import axios from '../api/axios';
import { Plus } from 'lucide-react';

const MyTasks = () => {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]); // 👈 Naya: Projects store karne ke liye
  const [selectedProjectId, setSelectedProjectId] = useState(""); // 👈 Naya: Selected Project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null); 
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Issues & Projects ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Dono data ek saath fetch karte hain
      const [issuesRes, projectsRes] = await Promise.all([
        axios.get('/issues/get-issues'),
        axios.get('/projects/get-projects') // 👈 Make sure ye route sahi hai
      ]);

      setIssues(issuesRes.data.data || []);
      const fetchedProjects = projectsRes.data.data || [];
      setProjects(fetchedProjects);

      // Agar projects hain, toh pehle wale ko default select kar lo
      if (fetchedProjects.length > 0) {
        setSelectedProjectId(fetchedProjects[0]._id);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (issue) => {
    setEditingIssue(issue); 
    setIsModalOpen(true);    
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm("Bhai, pakka delete karna hai?")) return;
    try {
      await axios.delete(`/issues/delete/${issueId}`);
      fetchData(); 
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
    <div className="flex min-h-screen bg-[#0b0e11] text-slate-200">
      <Sidebar />

      <main className="flex-1 ml-64 p-10 pt-24">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-1">My Tasks</h1>
            <p className="text-slate-500 font-medium text-sm tracking-wide">Manage your project issues</p>
            
            {/* --- Project Selector (Simple Dropdown) --- */}
            {projects.length > 0 && (
              <select 
                className="mt-4 bg-[#161b22] border border-slate-800 text-xs font-bold text-indigo-400 p-2 rounded-lg outline-none"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>
          
          <button 
            onClick={() => {
              if(!selectedProjectId) return alert("Pehle ek project banao bhai!");
              setEditingIssue(null); 
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>New Issue</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500">
            <div className="flex flex-col items-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Fetching tasks...</span>
            </div>
          </div>
        ) : (
          <div className="mt-4">
             <KanbanBoard 
                issues={issues} 
                onRefresh={fetchData} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
          </div>
        )}

        {/* --- MODAL SECTION (Ab projectId pass ho rahi hai!) --- */}
        <CreateIssueModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSuccess={fetchData} 
          initialData={editingIssue} 
          projectId={selectedProjectId} // 👈 Ye rahi missing link!
        />
      </main>
    </div>
  );
};

export default MyTasks;