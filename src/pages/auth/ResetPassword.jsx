import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenInput, setTokenInput] = useState(token || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength checker
  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthText = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const useToken = token || tokenInput;

    if (!useToken) {
      toast.error("Reset token is required. Go back to Forgot Password page.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(useToken, password);
      if (result.success) {
        setSuccess(true);
        toast.success("Your password has been reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-10 top-10 h-72 w-72 bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute right-10 bottom-10 h-72 w-72 bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <HiOutlineCheckCircle className="h-10 w-10 text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Password Reset!</h1>
          <p className="mt-4 text-slate-400">
            Your password has been successfully reset. Redirecting to login...
          </p>

          <div className="mt-8 flex items-center justify-center gap-1">
            <motion.div
              className="h-2 w-2 rounded-full bg-cyan-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-cyan-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-cyan-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-10 top-10 h-72 w-72 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-72 w-72 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <button
  onClick={() => navigate("/forgot-password")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Forgot Password
        </button>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
                <HiOutlineLockClosed className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create New Password</h1>
              <p className="mt-2 text-slate-400">
                Please enter a strong password to secure your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Token Input (if no token in URL) */}
              {!token && (
                <div>
                  <Input
                    label="Reset Token"
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Paste the token from your email or OTP flow"
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    💡 Tip: You can find this token in the password reset email or after OTP verification
                  </p>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  New Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 pl-12 pr-12 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash className="h-5 w-5" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Password Strength</span>
                      <span className={`text-xs font-semibold ${strength === 4 ? "text-emerald-400" : strength === 3 ? "text-yellow-400" : "text-red-400"}`}>
                        {strengthText[strength]}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${strengthColor[strength]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(strength / 4) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      ✓ Mix uppercase, lowercase, numbers, and symbols for a strong password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className={`w-full rounded-2xl border bg-slate-800 px-4 py-3 pl-12 pr-12 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 ${
                      password && confirmPassword
                        ? password === confirmPassword
                          ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/30"
                          : "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showConfirm ? (
                      <HiOutlineEyeSlash className="h-5 w-5" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {password && confirmPassword && (
                  <p className={`mt-2 text-xs ${password === confirmPassword ? "text-emerald-400" : "text-red-400"}`}>
                    {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Reset Password
              </Button>

              <p className="text-center text-xs text-slate-500">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-xs font-semibold text-slate-300 mb-2">🔒 Security Tips:</p>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Use a unique password you haven''t used before</li>
            <li>• Don''t share your password with anyone</li>
            <li>• Never enter your password on unsecured websites</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
