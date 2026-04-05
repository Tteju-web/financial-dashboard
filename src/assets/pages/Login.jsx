import { useState } from "react";
import { FiTrendingUp, FiAlertCircle, FiUser, FiLock, FiMail } from "react-icons/fi";
import { login, signup } from "../../auth/authUtils";

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match!");
      setShake(true);
      setLoading(false);
      setTimeout(() => setShake(false), 600);
      return;
    }

    // Small delay to simulate processing
    setTimeout(() => {
      if (isSignUp) {
        signup(email, password);
        onLogin();
      } else {
        const success = login(email, password);
        if (success) {
          onLogin();
        } else {
          setLoading(false);
          setError("Invalid email or password.");
          setShake(true);
          setTimeout(() => setShake(false), 600);
          setPassword("");
        }
      }
    }, 700);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05060f] relative overflow-hidden px-4 transition-colors duration-500">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[310px] py-4 relative z-10">
        
        {/* Card */}
        <div className={`bg-[#0d0f1a]/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/60 border border-white/10 overflow-hidden transition-all duration-300 ${shake ? "animate-shake" : ""}`}>
          
          <div className="p-5 sm:p-6">
            
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 flex items-center justify-center transform hover:scale-105 transition-transform">
                <FiTrendingUp className="text-white transform -rotate-12" size={18} />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-5">
              <h1 className="text-base font-black text-white tracking-tight mb-0.5">
                {isSignUp ? "Create Account" : "Financial Dashboard"}
              </h1>
              <p className="text-[10px] text-gray-400 font-medium leading-none">
                {isSignUp ? "Join us to manage finances" : "Sign in to your dashboard"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              
              {isSignUp && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-[10px] font-bold text-gray-300 ml-0.5 flex items-center gap-1.5 leading-none">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder=""
                    required={isSignUp}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-[10px]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-300 ml-0.5 flex items-center gap-1.5 leading-none">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  required
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-[10px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-300 ml-0.5 flex items-center gap-1.5 leading-none">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  required
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-[10px]"
                />
              </div>

              {isSignUp && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-[10px] font-bold text-gray-300 ml-0.5 flex items-center gap-1.5 leading-none">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=""
                    required={isSignUp}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-[10px]"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-[8px] font-bold border border-red-500/20 animate-in fade-in slide-in-from-top-1 duration-200 leading-tight">
                  <FiAlertCircle size={9} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? "..." : (isSignUp ? "Create Account" : "Sign In")}
              </button>
            </form>

            <div className="text-center mt-5">
              {!isSignUp && (
                <div className="mb-3 space-y-0.5">
                  <p className="text-[8px] text-gray-500 font-medium leading-none">
                    Default Email: <span className="text-gray-300 font-bold">admin@dashboard.com</span>
                  </p>
                  <p className="text-[8px] text-gray-500 font-medium leading-none">
                    Default Password: <span className="text-gray-300 font-bold">admin123</span>
                  </p>
                </div>
              )}
              <div className="pt-3 border-t border-white/5">
                <p className="text-[9px] text-gray-400">
                  {isSignUp ? "Have an account?" : "Don't have one?"}
                  <button 
                    onClick={toggleMode}
                    className="ml-1 text-blue-400 font-bold hover:text-blue-300 transition-colors"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[8px] text-slate-400 dark:text-gray-600 mt-4 font-medium italic opacity-50">
          © 2026 Financial Dashboard.
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.6s ease-in-out; }
      `}</style>
    </div>
  );
}

export default Login;











