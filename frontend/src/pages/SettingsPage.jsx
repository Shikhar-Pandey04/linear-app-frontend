import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Camera, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    avatar: "",
  });

  const fileInputRef = useRef(null);

  // 🔥 LOAD USER + THEME
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setIsDarkMode(savedTheme === "dark");
    fetchUserData();
  }, []);

  // 🔥 THEME APPLY
  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // 🔥 FETCH USER
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/users/current-user");

      if (res.data.success) {
        const user = res.data.data;
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          bio: user.bio || "",
          avatar: user.avatar || "",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 IMAGE UPLOAD FIXED
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ validation
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Only image files allowed" });
      return;
    }

    try {
      setUploadingImage(true);

      const data = new FormData();
      data.append("avatar", file);

      const res = await API.post("/users/upload-avatar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        await fetchUserData();
        setMessage({ type: "success", text: "Image uploaded successfully" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setUploadingImage(false);
    }
  };

  // 🔥 SAVE PROFILE
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const res = await API.put("/users/update-account", formData);

      if (res.data.success) {
        setMessage({ type: "success", text: "Profile updated" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Sidebar />

      <main className="flex-1 ml-64 p-12 pt-28">
        <h1 className="text-5xl font-black mb-3">Settings</h1>
        <p className="mb-10 text-[var(--text-secondary)]">
          Manage your profile and preferences
        </p>

        {/* TABS */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-xl font-bold ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white"
                : "bg-[var(--bg-card)]"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-6 py-3 rounded-xl font-bold ${
              activeTab === "appearance"
                ? "bg-indigo-600 text-white"
                : "bg-[var(--bg-card)]"
            }`}
          >
            Appearance
          </button>
        </div>

        {/* MESSAGE */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`mb-6 p-3 rounded ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-xl">
            <div className="p-6 rounded-xl bg-[var(--bg-card)]">
              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-800">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-4 text-gray-400" />
                  )}
                </div>

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-indigo-600 text-white p-3 rounded-lg"
                >
                  {uploadingImage ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Camera />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"   // 🔥 important
                  hidden
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <input
              className="w-full p-3 rounded bg-[var(--bg-secondary)]"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />

            <input
              className="w-full p-3 rounded bg-[var(--bg-secondary)]"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <textarea
              className="w-full p-3 rounded bg-[var(--bg-secondary)]"
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />

            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-6 py-2 rounded"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === "appearance" && (
          <div className="p-6 rounded-xl bg-[var(--bg-card)] max-w-md flex justify-between items-center">
            <div>
              <p className="font-bold">
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Toggle theme
              </p>
            </div>

            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className={`w-14 h-8 rounded-full ${
                isDarkMode ? "bg-indigo-600" : "bg-gray-400"
              } relative`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                  isDarkMode ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;