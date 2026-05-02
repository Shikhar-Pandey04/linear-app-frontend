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
  User,
  ChevronDown
} from 'lucide-react';
import API from '../api/axios';

const NavItem = ({ icon: Icon, label, badge, active = false, onClick }) => (
  <motion.div
    whileHover={{ x: 3 }}
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all mb-1 ${
      active
        ? 'bg-[#161b22] text-white border border-gray-800'
        : 'text-gray-400 hover:text-white hover:bg-[#161b22]'
    }`}
  >
    <div className="flex items-center gap-4">
      <Icon size={18} strokeWidth={2} className="text-gray-400" />

      <span className="text-[14px] font-medium tracking-wide">
        {label}
      </span>
    </div>

    {badge && (
      <span className="bg-[#238636]/20 text-[#238636] text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#238636]/20">
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
    <div className="w-64 h-screen bg-[#010409] border-r border-gray-800 flex flex-col justify-between p-5 fixed left-0 top-0 z-50">
      
      {/* TOP */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-4">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-lg font-semibold text-white">
            World
          </span>
        </div>

        {/* Main Menu */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-4 px-2">
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

          {/* 🔥 FIXED SCHEDULE */}
          <NavItem
            icon={Calendar}
            label="Schedule"
            active={currentPath === '/schedule'}
            onClick={() => navigate('/schedule')}
          />

          <NavItem
            icon={BarChart3}
            label="Reports"
          />
        </div>

        {/* Records */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-4 px-2">
            Records
          </p>

          <NavItem icon={FolderOpen} label="Projects" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={Briefcase} label="Clients" />
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 pt-6">
        
        {/* Profile */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 p-3 mb-4 rounded-lg hover:bg-[#161b22] transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-md overflow-hidden border border-gray-700 bg-[#161b22] flex items-center justify-center">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-gray-500" />
            )}
          </div>

          <div className="flex-1">
            <h4 className="text-[13px] font-medium text-white truncate">
              {userData?.fullName || 'Loading...'}
            </h4>

            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Admin
            </p>
          </div>

          <ChevronDown size={14} className="text-gray-500" />
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

          <div className="mt-2 pt-2 border-t border-gray-800">
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