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
  Palette
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

// Accent color options
const accentColors = [
  { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500', hex: '#6366f1' },
  { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-500', hex: '#10b981' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-500', hex: '#f43f5e' },
  { name: 'Amber', value: 'amber', bg: 'bg-amber-500', hex: '#f59e0b' },
  { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-500', hex: '#06b6d4' },
];

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset'; // Replace with your preset
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'; // Replace with your cloud name

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('indigo');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    avatar: ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Load theme preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAccent = localStorage.getItem('accentColor');
    
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
      }
    }
    
    if (savedAccent) {
      setAccentColor(savedAccent);
      document.documentElement.setAttribute('data-accent', savedAccent);
    }
  }, []);

  // Fetch current user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/users/current-user');
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          bio: userData.bio || '',
          avatar: userData.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setMessage({ type: 'error', text: 'Failed to load user data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle theme toggle
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // Handle accent color change
  const handleAccentChange = (color) => {
    setAccentColor(color.value);
    document.documentElement.setAttribute('data-accent', color.value);
    localStorage.setItem('accentColor', color.value);
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size should be less than 5MB' });
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataCloud = new FormData();
      formDataCloud.append('file', file);
      formDataCloud.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataCloud,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, avatar: data.secure_url }));
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const response = await API.put('/users/update-account', {
        fullName: formData.fullName,
        email: formData.email,
        bio: formData.bio,
        avatar: formData.avatar
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Tab animation variants
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Manage your profile and customize your experience
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[var(--bg-secondary)] p-1 rounded-xl w-fit">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Palette }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[rgb(var(--accent-color))] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'success' ? <Check size={18} /> : <span className="text-lg">⚠</span>}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-[rgb(var(--accent-color))]" size={32} />
                </div>
              ) : (
                <>
                  {/* Avatar Section */}
                  <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 border border-[var(--border-color)]">
                    <h2 className="text-lg font-semibold mb-6">Profile Picture</h2>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-[var(--bg-card)] border-2 border-[var(--border-color)]">
                          {formData.avatar ? (
                            <img 
                              src={formData.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[rgb(var(--accent-color))]/10">
                              <User size={40} className="text-[rgb(var(--accent-color))]" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[rgb(var(--accent-color))] text-white flex items-center justify-center shadow-lg hover:bg-[rgb(var(--accent-dark))] transition-colors disabled:opacity-50"
                        >
                          {uploadingImage ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Camera size={14} />
                          )}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Upload your photo</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          JPG, PNG or GIF. Max size 5MB.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Profile Info Section */}
                  <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 border border-[var(--border-color)]">
                    <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
                    
                    <div className="space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <User size={14} className="text-[rgb(var(--accent-color))]" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[rgb(var(--accent-color))] focus:ring-1 focus:ring-[rgb(var(--accent-color))] transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <Mail size={14} className="text-[rgb(var(--accent-color))]" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[rgb(var(--accent-color))] focus:ring-1 focus:ring-[rgb(var(--accent-color))] transition-all"
                          placeholder="Enter your email"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <FileText size={14} className="text-[rgb(var(--accent-color))]" />
                          Bio <span className="text-[var(--text-secondary)] font-normal">(Optional)</span>
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          maxLength={500}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[rgb(var(--accent-color))] focus:ring-1 focus:ring-[rgb(var(--accent-color))] transition-all resize-none"
                          placeholder="Tell us a bit about yourself..."
                        />
                        <p className="text-xs text-[var(--text-secondary)] mt-2 text-right">
                          {formData.bio.length}/500 characters
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgb(var(--accent-color))] text-white font-medium hover:bg-[rgb(var(--accent-dark))] transition-all disabled:opacity-50 shadow-lg shadow-[rgb(var(--accent-color))]/20"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="appearance"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              {/* Theme Section */}
              <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 border border-[var(--border-color)]">
                <h2 className="text-lg font-semibold mb-2">Theme</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Choose your preferred appearance
                </p>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card)]">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Moon size={20} className="text-[rgb(var(--accent-color))]" />
                    ) : (
                      <Sun size={20} className="text-[rgb(var(--accent-color))]" />
                    )}
                    <span className="font-medium">
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={toggleTheme}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      isDarkMode ? 'bg-[rgb(var(--accent-color))]' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isDarkMode ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                    />
                  </button>
                </div>
              </section>

              {/* Accent Color Section */}
              <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-color)]">
                <h2 className="text-lg font-semibold mb-2">Accent Color</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Select your preferred accent color for the interface
                </p>

                <div className="flex gap-4">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleAccentChange(color)}
                      className={`group relative w-12 h-12 rounded-full ${color.bg} transition-all duration-200 ${
                        accentColor === color.value 
                          ? 'ring-2 ring-offset-2 ring-[var(--text-primary)] scale-110' 
                          : 'hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {accentColor === color.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check size={20} className="text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-[var(--text-secondary)] mt-6">
                  Selected: <span className="text-[rgb(var(--accent-color))] font-medium capitalize">{accentColor}</span>
                </p>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SettingsPage;
