import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Camera,
  Moon,
  Sun,
  Save,
  Loader2,
  Palette,
  ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: ''
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    avatar: ''
  });

  const fileInputRef = useRef(null);

  // Load theme + user data
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    fetchUserData();
  }, []);

  // Apply Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const response = await API.get('/users/current-user');

      if (response.data.success) {
        const user = response.data.data;

        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          bio: user.bio || '',
          avatar: user.avatar || ''
        });
      }
    } catch (error) {
      console.error(error);

      setMessage({
        type: 'error',
        text: 'Failed to load profile.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      const data = new FormData();
      data.append('avatar', file);

      const response = await API.post('/users/upload-avatar', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        await fetchUserData();

        setMessage({
          type: 'success',
          text: 'Profile image updated successfully.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Image upload failed.'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await API.put(
        '/users/update-account',
        formData
      );

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to save changes.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0b0e11] text-black dark:text-white transition-all">
      <Sidebar />

      <main className="flex-1 ml-64 p-12 pt-28">
        <h1 className="text-5xl font-black mb-3">
          Settings
        </h1>

        <p className="text-slate-500 mb-10">
          Manage your profile and preferences
        </p>

        {/* Tabs */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-bold ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-6 py-3 rounded-xl font-bold ${
              activeTab === 'appearance'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
          >
            Appearance
          </button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`mb-8 p-4 rounded-xl ${
                message.type === 'success'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : activeTab === 'profile' ? (
          <div className="space-y-8 max-w-3xl">
            {/* Avatar */}
            <div className="p-8 rounded-2xl bg-slate-100 dark:bg-[#161b22]">
              <h2 className="text-xl font-bold mb-6">
                Profile Picture
              </h2>

              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-300 dark:bg-slate-800">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <User size={40} />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center"
                  >
                    {uploadingImage ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Camera size={16} />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 rounded-2xl bg-slate-100 dark:bg-[#161b22] space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value
                  })
                }
                className="w-full p-4 rounded-xl bg-white dark:bg-[#0b0e11]"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
                className="w-full p-4 rounded-xl bg-white dark:bg-[#0b0e11]"
              />

              <textarea
                rows="4"
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value
                  })
                }
                className="w-full p-4 rounded-xl bg-white dark:bg-[#0b0e11]"
              />

              <button
                onClick={handleSave}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl p-8 rounded-2xl bg-slate-100 dark:bg-[#161b22]">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-xl">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-slate-500 text-sm">
                  Toggle application theme
                </p>
              </div>

              <button
                onClick={() =>
                  setIsDarkMode((prev) => !prev)
                }
                className={`w-14 h-8 rounded-full relative transition-all ${
                  isDarkMode
                    ? 'bg-indigo-600'
                    : 'bg-slate-500'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                    isDarkMode ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;