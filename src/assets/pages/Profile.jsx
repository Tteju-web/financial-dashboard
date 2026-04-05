import { FiUser, FiMapPin, FiShield, FiBell, FiLock, FiCamera, FiX, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { getStoredPassword, setStoredPassword } from "../../auth/authUtils";

const AVATAR_OPTIONS = [
  { id: 'cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop', label: 'Cat' },
  { id: 'dog', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop', label: 'Dog' },
  { id: 'monkey', url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=150&h=150&fit=crop', label: 'Monkey' },
  { id: 'panda', url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=150&h=150&fit=crop', label: 'Panda' },
  { id: 'bird', url: 'https://images.unsplash.com/photo-1552728089-57169abce2a0?w=150&h=150&fit=crop', label: 'Bird' },
  { id: 'fox', url: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=150&h=150&fit=crop', label: 'Fox' },
  { id: 'lion', url: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=150&h=150&fit=crop', label: 'Lion' },
  { id: 'tiger', url: 'https://images.unsplash.com/photo-1549480017-d564169624e1?w=150&h=150&fit=crop', label: 'Tiger' },
  { id: 'bear', url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=150&h=150&fit=crop', label: 'Bear' },
  { id: 'owl', url: 'https://images.unsplash.com/photo-1543160352-7e937d5786ed?w=150&h=150&fit=crop', label: 'Owl' },
  { id: 'rabbit', url: 'https://images.unsplash.com/photo-1585110396000-c9faf4e4f9ba?w=150&h=150&fit=crop', label: 'Rabbit' },
  { id: 'penguin', url: 'https://images.unsplash.com/photo-1590457632619-38b488563cbf?w=150&h=150&fit=crop', label: 'Penguin' },
  { id: 'elephant', url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=150&h=150&fit=crop', label: 'Elephant' },
];

function Profile() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }
  const toastTimer = useRef(null);

  // Profile State
  const [profile, setProfile] = useState({
    name: "Teju",
    email: "teju@email.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    location: "San Francisco, CA",
    avatar: "",
  });

  const [editMode, setEditMode] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Auto detect location
  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", "error");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const city = data.city || data.locality || "Unknown City";
          const state = data.principalSubdivision || data.countryCode || "Unknown State";
          setProfile(prev => ({ ...prev, location: `${city}, ${state}` }));
        } catch (error) {
          showToast("Could not fetch location details", "error");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        showToast("Unable to retrieve your location. Check browser permissions.", "error");
        setIsDetectingLocation(false);
      }
    );
  };

  // Save profile
  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setEditMode(false);
    window.dispatchEvent(new Event("profileUpdated"));
    showToast("Profile saved successfully!", "success");
  };

  return (
    <div className="text-slate-900 dark:text-white animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* User Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
            {/* Header Gradient */}
            <div className="h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative">
            </div>

            <div className="px-6 pb-6 relative">
              {/* Avatar Container */}
              <div className="absolute -top-12 left-6">
                <div className="relative group/avatar cursor-pointer">
                  {/* Avatar Image */}
                  <div className="border-4 border-white dark:border-gray-900 rounded-full w-24 h-24 overflow-hidden bg-gray-200 shadow-sm relative">
                    <img
                      src={profile.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name || "User"}&backgroundColor=e2e8f0`}
                      alt="Avatar"
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" onClick={() => setIsAvatarModalOpen(true)}>
                      <FiCamera className="text-white text-xl" />
                    </div>
                  </div>

                  {/* Active Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-16 mt-1">
                <h2 className="text-xl font-bold truncate">{profile.name || "Your Name"}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium truncate">{profile.role || "Role"}</p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FiMapPin className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <span className="truncate">{profile.location || "Location"}</span>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className={`mt-6 w-full py-2.5 rounded-xl font-medium transition duration-300 flex justify-center items-center gap-2 ${editMode
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  : "bg-slate-100 dark:bg-gray-800/80 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-900 dark:text-white"
                  }`}
              >
                {editMode ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Quick Preferences */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white mb-5">Quick Preferences</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer shadow-inner transition-colors">
                  <div className="absolute top-0.5 right-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-all"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Marketing Emails</span>
                <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full relative cursor-pointer shadow-inner transition-colors">
                  <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-all"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* FORM */}
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FiUser className="text-blue-500" /> Personal Information
              </h3>
              {editMode && <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full animate-pulse">EDITING</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  disabled={!editMode}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address <span className="text-green-500 text-xs ml-1 font-semibold">✓ Verified</span></label>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  disabled={!editMode}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  disabled={!editMode}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Role</label>
                <input
                  name="role"
                  value={profile.role}
                  onChange={handleChange}
                  placeholder="Enter role"
                  disabled={!editMode}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                  {editMode && (
                    <button
                      onClick={autoDetectLocation}
                      disabled={isDetectingLocation}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-1 disabled:opacity-50 transition"
                      title="Detect my location"
                    >
                      <FiMapPin size={12} />
                      {isDetectingLocation ? "Detecting..." : "Auto-detect"}
                    </button>
                  )}
                </div>
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  disabled={!editMode}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {editMode && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition duration-300 hover:-translate-y-0.5"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* SECURITY */}
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiShield className="text-red-500" /> Security Settings
            </h3>

            <div className="space-y-4">

              {/* Change Password */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-gray-100 dark:border-gray-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-xl shrink-0"><FiLock size={20} /></div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Change Password</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="shrink-0 px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition w-full sm:w-auto"
                >
                  Update
                </button>
              </div>

              {/* Two Factor Auth */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-gray-100 dark:border-gray-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-xl shrink-0"><FiBell size={20} /></div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Add an extra layer of security</p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-14 h-7 rounded-full relative cursor-pointer shadow-inner shrink-0 self-start sm:self-auto transition-colors duration-300 ${twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 bg-white w-5 h-5 rounded-full shadow-sm transition-all duration-300 ${twoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* --- In-Page Toast Notification --- */}
      {toast && (
        <div
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, transition: 'all 0.3s' }}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 ${toast.type === 'success' ? 'bg-gray-900 dark:bg-gray-800' : 'bg-red-600'
            }`}
        >
          {toast.type === 'success'
            ? <FiCheckCircle className="text-green-400 shrink-0" size={18} />
            : <FiAlertCircle className="text-red-200 shrink-0" size={18} />
          }
          {toast.message}
        </div>
      )}

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose an Avatar</h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-3 gap-4">
              {/* Default Avatar option */}
              <div
                onClick={() => {
                  const newProfile = { ...profile, avatar: "" };
                  setProfile(newProfile);
                  localStorage.setItem("userProfile", JSON.stringify(newProfile));
                  window.dispatchEvent(new Event("profileUpdated"));
                  setIsAvatarModalOpen(false);
                }}
                className={`flex flex-col items-center gap-2 cursor-pointer group p-2 rounded-xl transition-all ${!profile.avatar ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
              >
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name || "User"}&backgroundColor=e2e8f0`}
                  alt="Default Format"
                  className="w-16 h-16 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Default</span>
              </div>

              {AVATAR_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    const newProfile = { ...profile, avatar: opt.url };
                    setProfile(newProfile);
                    localStorage.setItem("userProfile", JSON.stringify(newProfile));
                    window.dispatchEvent(new Event("profileUpdated"));
                    setIsAvatarModalOpen(false);
                  }}
                  className={`flex flex-col items-center gap-2 cursor-pointer group p-2 rounded-xl transition-all ${profile.avatar === opt.url ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  <img src={opt.url} alt={opt.label} className="w-16 h-16 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{opt.label}</span>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 flex justify-end">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-slate-700 dark:text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={(msg) => { setIsPasswordModalOpen(false); showToast(msg, "success"); }}
          onError={(msg) => showToast(msg, "error")}
        />
      )}
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose, onSuccess, onError }) {
  const [fields, setFields] = useState({ newPwd: '', confirm: '' });
  const [show, setShow] = useState({ newPwd: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { label: 'Too short', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-red-400' },
      { label: 'Fair', color: 'bg-yellow-400' },
      { label: 'Good', color: 'bg-blue-400' },
      { label: 'Strong', color: 'bg-green-500' },
    ];
    return { score, ...map[score] };
  };

  const strength = getStrength(fields.newPwd);

  const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  const toggleShow = (key) => setShow(s => ({ ...s, [key]: !s[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fields.newPwd) { onError('Please enter a new password.'); return; }
    if (fields.newPwd.length < 8) { onError('New password must be at least 8 characters.'); return; }
    if (fields.newPwd !== fields.confirm) { onError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      setStoredPassword(fields.newPwd);
      setLoading(false);
      onSuccess('Password updated successfully!');
    }, 800);
  };

  const inputClass = "w-full p-3 pr-11 rounded-xl bg-slate-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
              <FiLock className="text-indigo-500" size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">New Password</label>
            <div className="relative">
              <input
                name="newPwd"
                type={show.newPwd ? 'text' : 'password'}
                value={fields.newPwd}
                onChange={handleChange}
                placeholder=""
                className={inputClass}
              />
              <button type="button" onClick={() => toggleShow('newPwd')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                {show.newPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {/* Strength Bar */}
            {fields.newPwd && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength.score <= 1 ? 'text-red-500' : strength.score === 2 ? 'text-yellow-500' : strength.score === 3 ? 'text-blue-500' : 'text-green-500'
                  }`}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirm New Password</label>
            <div className="relative">
              <input
                name="confirm"
                type={show.confirm ? 'text' : 'password'}
                value={fields.confirm}
                onChange={handleChange}
                placeholder=""
                className={`${inputClass} ${fields.confirm && fields.confirm !== fields.newPwd ? 'border-red-400 focus:ring-red-400' : ''
                  }`}
              />
              <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                {show.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {fields.confirm && fields.confirm !== fields.newPwd && (
              <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;