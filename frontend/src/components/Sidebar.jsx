import React, { useState, useEffect } from 'react';
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
  Hexagon,
  User,
  ChevronDown
} from 'lucide-react';
import API from '../api/axios';

const NavItem = ({ icon: Icon, label, badge, active = false, onClick }) => (
  <motion.div
    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
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

      <span
        className={`text-[14px] tracking-wide ${
          active ? 'font-black' : 'font-bold'
        }`}
      >
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

  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await API.get('/users/current-user');

      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error('Sidebar user fetch error:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // jab settings se avatar update hoke user wapas aaye
  useEffect(() => {
    fetchUser();
  }, [currentPath]);

  const handleLogout = () => {
    if (window.confirm('Bhai, logout karna hai?')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-66 h-screen bg-[#0b0e11] border-r border-slate-800/30 flex flex-col justify-between p-5 fixed left-0 top-0 z-50">
      {/* TOP */}
      <div>
        <div className="flex items-center gap-4 mb-12 px-2 mt-4">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Hexagon size={22} className="text-white" fill="white" />
          </div>

          <span className="text-2xl font-black tracking-tighter text-white italic">
            World
          </span>
        </div>

        {/* Main Menu */}
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

        {/* Records */}
        <div className="mb-10">
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] mb-5 px-2">
            Records
          </p>

          <NavItem icon={FolderOpen} label="Projects" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={Briefcase} label="Clients" />
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-slate-800/40 pt-6">
        {/* Profile Card */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 p-3 mb-4 rounded-2xl hover:bg-slate-800/40 transition-all cursor-pointer group border border-transparent hover:border-slate-800/50"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0 shadow-lg">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-black text-white truncate leading-tight">
              {userData?.fullName || 'Loading...'}
            </h4>

            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
              Admin
            </p>
          </div>

          <ChevronDown
            size={14}
            className="text-slate-600 group-hover:text-slate-300 transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="space-y-1">
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

          <div className="mt-2 pt-2 border-t border-slate-800/30">
            <NavItem
              icon={LogOut}
              label="Logout"
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;