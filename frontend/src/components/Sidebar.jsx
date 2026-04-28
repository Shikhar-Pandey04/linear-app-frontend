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
    whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all mb-2 group ${
      active 
        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20' 
        : 'text-slate-500 hover:text-slate-200'
    }`}
  >
    <div className="flex items-center gap-4">
      <Icon 
        size={20} 
        strokeWidth={active ? 2.5 : 2} 
        className={active ? 'text-indigo-500' : 'group-hover:text-slate-400'} 
      />
      {/* --- Label Font Scaled Up --- */}
      <span className={`text-[14px] tracking-wide ${active ? 'font-black' : 'font-bold'}`}>
        {label}
      </span>
    </div>
    
    {badge && (
      <span className="bg-indigo-600/20 text-indigo-400 text-[11px] font-black px-2 py-0.5 rounded-lg border border-indigo-500/10">
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
    <div className="w-66 h-screen bg-[#0b0e11] border-r border-slate-800/30 flex flex-col justify-between p-5 fixed left-0 top-0 z-50">
      
      {/* --- TOP SECTION --- */}
      <div>
        {/* Brand Logo (Bigger) */}
        <div className="flex items-center gap-4 mb-12 px-2 mt-4">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Hexagon size={22} className="text-white" fill="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white italic">World</span>
        </div>

        {/* Menu Section */}
        <div className="mb-10">
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] mb-5 px-2">
            Main Menu
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
        <div className="mb-10">
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] mb-5 px-2">
            Records
          </p>
          <NavItem icon={FolderOpen} label="Projects" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={Briefcase} label="Clients" />
        </div>
      </div>

      {/* --- BOTTOM SECTION (Perfectly Anchored) --- */}
      <div className="pb-6 border-t border-slate-800/40 pt-8">
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
        <div className="mt-4">
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