import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home,
  CheckSquare, 
  Calendar, 
  BarChart3, 
  FolderOpen, 
  Users, 
  Briefcase, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  Hexagon 
} from 'lucide-react';

const NavItem = ({ icon: Icon, label, badge, active = false, onClick }) => (
  <motion.div
    whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all mb-1 group ${
      active 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' 
        : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon 
        size={18} 
        strokeWidth={active ? 2.5 : 2} 
        className={active ? 'text-indigo-500' : 'group-hover:text-gray-400'} 
      />
      <span className={`text-[13px] ${active ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </div>
    
    {badge && (
      <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-indigo-500/10">
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
    <div className="w-64 h-screen bg-[#0b0e11] border-r border-slate-800/20 flex flex-col justify-between p-4 fixed left-0 top-0 z-50">
      
      {/* --- TOP SECTION (Brand + Main Nav) --- */}
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/40">
            <Hexagon size={18} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">World</span>
        </div>

        {/* Menu Section */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em] mb-4 px-2">
            Menu
          </p>
          <NavItem 
            icon={Home} 
            label="Dashboard" 
            active={currentPath === '/dashboard'} 
            onClick={() => navigate('/dashboard')} 
          />
          <NavItem 
            icon={CheckSquare} 
            label="My Tasks" 
            badge="1" 
            active={currentPath === '/my-tasks'} 
            onClick={() => navigate('/my-tasks')} 
          />
          <NavItem icon={Calendar} label="Schedule" />
          <NavItem icon={BarChart3} label="Reports" />
        </div>

        {/* Records Section */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em] mb-4 px-2">
            Records
          </p>
          <NavItem icon={FolderOpen} label="Projects" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={Briefcase} label="Clients" />
        </div>
      </div>

      {/* --- BOTTOM SECTION (Footer Actions) --- */}
      {/* mt-auto use nahi kiya, justify-between handles it better */}
      <div className="pb-4 border-t border-slate-800/40 pt-6">
        <NavItem 
          icon={Settings} 
          label="Settings" 
          active={currentPath === '/settings'}
          onClick={() => navigate('/settings')}
        />
        <NavItem 
          icon={LifeBuoy} 
          label="Support" 
          active={currentPath === '/support'} 
          onClick={() => navigate('/support')} 
        />
        <div className="mt-2">
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