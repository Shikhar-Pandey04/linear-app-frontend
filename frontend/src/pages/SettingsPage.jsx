import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  FileText, 
  Camera, 
  Moon, 
  Sun, 
  Check, 
  Save,
  Loader2,
  Palette,
  ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

// Accent color options
const accentColors = [
  { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500' },
  { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-500' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-500' },
  { name: 'Amber', value: 'amber', bg: 'bg-amber-500' },
  { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-500' },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('indigo');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    avatar: ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Load theme and fetch user data
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedAccent = localStorage.getItem('accentColor') || 'indigo';
    setIsDarkMode(savedTheme === 'dark');
    setAccentColor(savedAccent);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/users/current-user');
      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          bio: userData.bio || '',
          avatar: userData.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setMessage({ type: 'error', text: 'Failed to synchronize profile data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Invalid file type. Please upload an image.' });
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      data.append('avatar', file); // Matches backend multer field name

      const response = await API.post('/users/upload-avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, avatar: response.data.data.avatar }));
        setMessage({ type: 'success', text: 'Profile image updated successfully.' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Upload failed. Check server connection.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const response = await API.put('/users/update-account', formData);

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Account settings saved successfully.' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update account.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-slate-200">
      <Sidebar />

      <main className="flex-1 ml-64 p-12 pt-28 overflow-y-auto">
        {/* --- Header Section --- */}
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter">Settings</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your professional profile and workspace preferences</p>
        </header>

        {/* --- Tab Navigation --- */}
        <div className="flex gap-2 mb-10 bg-[#161b22] p-1.5 rounded-2xl w-fit border border-slate-800/50">
          {[
            { id: 'profile', label: 'General Profile', icon: User },
            { id: 'appearance', label: 'Interface', icon: Palette }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Status Message --- */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${
                message.type === 'success' 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
              }`}
            >
              {message.type === 'success' ? <ShieldCheck size={20} /> : <span className="text-lg">!</span>}
              <span className="text-sm font-bold">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Content Area --- */}
        <div className="max-w-3xl">
          {activeTab === 'profile' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Avatar Section */}
              <section className="bg-[#161b22]/40 border border-slate-800/50 rounded-[2rem] p-8">
                <h2 className="text-xl font-bold text-white mb-6">Profile Picture</h2>
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-2xl">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-500/5 text-indigo-500">
                          <User size={48} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xl hover:bg-indigo-700 transition-all border-4 border-[#0b0e11] disabled:opacity-50"
                    >
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Upload new avatar</h3>
                    <p className="text-slate-500 text-sm mt-1">Recommended size: 400x400px. Max 5MB.</p>
                  </div>
                </div>
              </section>

              {/* Form Section */}
              <section className="bg-[#161b22]/40 border border-slate-800/50 rounded-[2.5rem] p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" name="fullName" value={formData.fullName} 
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#0b0e11] border border-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" name="email" value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#0b0e11] border border-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
                  <textarea 
                    rows={4} name="bio" value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#0b0e11] border border-slate-800 focus:border-indigo-500 outline-none transition-all font-medium text-white resize-none"
                    placeholder="Brief description for your profile..."
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Update Profile
                  </button>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <section className="bg-[#161b22]/40 border border-slate-800/50 rounded-[2.5rem] p-8">
                  <h2 className="text-xl font-bold text-white mb-6">Interface Theme</h2>
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-[#0b0e11] border border-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                        {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                        <p className="text-slate-500 text-xs">Switch between dark and light themes</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`w-14 h-8 rounded-full transition-all relative ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
               </section>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;