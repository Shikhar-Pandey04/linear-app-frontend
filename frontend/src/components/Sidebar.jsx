import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  LifeBuoy,
  Settings,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import API from '../api/axios';

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <motion.div
    whileHover={{ x: 4 }}
    onClick={onClick}
    className={`group relative flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
      active
        ? 'bg-[#161b22] text-white border border-gray-800 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
        : 'text-gray-400 hover:text-white hover:bg-[#161b22]'
    }`}
  >
    {/* 🔥 Glow Effect */}
    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 blur-md"></div>

    <Icon
      size={18}
      className="relative z-10 transition-all duration-300 group-hover:text-indigo-400"
    />

    <span className="relative z-10 text-[14px] font-medium">
      {label}
    </span>
  </motion.div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await API.get('/users/current-user');
      if (res.data.success) {
        setUserData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [currentPath]);

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-64 h-screen bg-[#010409] border-r border-gray-800 flex flex-col p-6 fixed left-0 top-0">

      {/* 🔥 EVEN DISTRIBUTION */}
      <div className="flex flex-col justify-evenly h-full">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-white font-bold text-3xl tracking-wide">
            CoreTrack
          </span>
        </div>

        {/* MAIN MENU */}
        <p className="text-[12px] text-gray-400 uppercase tracking-widest font-semibold">
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

        {/* DIVIDER */}
        <div className="border-t border-gray-800" />

        {/* PROFILE */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-md bg-[#161b22] flex items-center justify-center overflow-hidden">
            {userData?.avatar ? (
              <img src={userData.avatar} className="w-full h-full object-cover" />
            ) : (
              <User size={18} />
            )}
          </div>

          <div className="flex-1">
            <h4 className="text-white text-sm">
              {userData?.fullName || 'Loading...'}
            </h4>
            <p className="text-gray-500 text-xs">Admin</p>
          </div>

          <ChevronDown size={14} />
        </div>

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

        <NavItem
          icon={LogOut}
          label="Logout"
          onClick={handleLogout}
        />

      </div>
    </div>
  );
};

export default Sidebar;