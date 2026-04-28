import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  FolderOpen, 
  Users, 
  Briefcase, 
  LifeBuoy, 
  Settings, 
  User, 
  LogOut, 
  Hexagon 
} from 'lucide-react';

const NavItem = ({ icon: Icon, label, badge, active = false, onClick }) => (
  <motion.div
    whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 group ${
      active 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
        : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon 
        size={20} 
        strokeWidth={active ? 2.5 : 2} 
        className={active ? 'text-indigo-500' : 'group-hover:text-gray-300'} 
      />
      <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </div>
    
    {badge && (
      <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-indigo-500/10">
        {badge}
      </span>
    )}
  </motion.div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    if(window.confirm("Bhai, logout karna hai?")) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
  };

  return (
    <div className="w-64 h-screen bg-[#0b0e11] border-r border-slate-800/20 flex flex-col p-5 fixed left-0 top-0 z-50">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
          <Hexagon size={18} className="text-white" fill="white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white italic">World</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em] mb-4 px-2">
            Menu
          </p>
          
          {/* Dashboard - Sirf Stats wala page */}
          <NavItem 
            icon={LayoutGrid} 
            label="Dashboard" 
            active={currentPath === '/dashboard'} 
            onClick={() => navigate('/dashboard')} 
          />

          {/* My Tasks - Kanban Board wala page */}
          <NavItem 
            icon={CheckSquare} 
            label="My Tasks" 
            active={currentPath === '/my-tasks'} 
            onClick={() => navigate('/my-tasks')} 
          />

          <NavItem 
            icon={Calendar} 
            label="Schedule" 
            active={currentPath === '/schedule'} 
            onClick={() => navigate('/schedule')} 
          />
          <NavItem 
            icon={BarChart3} 
            label="Reports" 
            active={currentPath === '/reports'} 
            onClick={() => navigate('/reports')} 
          />
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em] mb-4 px-2">
            Records
          </p>
          <NavItem icon={FolderOpen} label="Projects" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={Briefcase} label="Clients" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-1">
        <NavItem 
          icon={LifeBuoy} 
          label="Support" 
          active={currentPath === '/support'} 
          onClick={() => navigate('/support')} 
        />
        <NavItem 
          icon={Settings} 
          label="Settings" 
          active={currentPath === '/settings'}
          onClick={() => navigate('/settings')}
        />
        <div className="pt-2">
           <NavItem 
             icon={LogOut} 
             label="Logout" 
             onClick={handleLogout} 
           />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;