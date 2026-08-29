import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineEnvelope,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import {
  requestPasswordReset,
  requestOTP,
  verifyOTP,
} from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email -> otp-choice -> otp-verify -> success
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const maskEmail = (email) => {
    const [local, domain] = email.split("@");
    const maskedLocal =
      local.substring(0, 2) + "*".repeat(Math.max(0, local.length - 4)) + local.slice(-2);
    return `${maskedLocal}@${domain}`;
  };

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await requestOTP(email);
      if (res.success) {
        setGeneratedOtp(res.data.code);
        setOtpMode(true);
        setStep("otp-verify");
        setTimeLeft(600); // 10 minutes
        toast.success(`OTP sent to ${maskEmail(email)}`);
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP(email, otpCode);
      if (res.success) {
        setResetToken(res.data.token);
        setStep("success");
        toast.success("OTP verified! Redirecting to reset password...");
        setTimeout(() => {
          navigate(`/reset-password/${res.data.token}`);
        }, 1500);
      } else {
        toast.error(res.message || "Invalid OTP");
        setOtpCode("");
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Timer for OTP
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
          onClick={() => navigate("/login")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
                    <HiOutlineEnvelope className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
                  <p className="mt-2 text-slate-400">
                    Enter your email address and we''ll send you an OTP to reset your password
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    loading={loading}
                  >
                    Send OTP Code
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp-verify" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/30">
                    <HiOutlineShieldCheck className="h-8 w-8 text-blue-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Verify OTP</h1>
                  <p className="mt-2 text-slate-400">
                    We''ve sent a 6-digit code to{" "}
                    <span className="font-semibold text-cyan-300">{maskEmail(email)}</span>
                  </p>
                </div>

                {/* OTP Demo Card */}
                <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Demo Code</p>
                      <p className="mt-2 text-2xl font-mono font-bold tracking-widest text-emerald-300">
                        {generatedOtp}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedOtp);
                        toast.success("Code copied!");
                      }}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <form onSubmit={handleOtpVerify} className="space-y-6">
                  <Input
                    label="Enter 6-Digit Code"
                    type="text"
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtpCode(val);
                    }}
                    placeholder="000000"
                    maxLength="6"
                    required
                  />

                  <div className="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <HiOutlineClock className="h-4 w-4" />
                      <span>
                        {timeLeft > 0
                          ? `Code expires in ${formatTime(timeLeft)}`
                          : "Code expired. Request a new one."}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    loading={loading}
                    disabled={timeLeft === 0}
                  >
                    Verify Code
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtpCode("");
                      setTimeLeft(0);
                    }}
                    className="w-full text-sm font-medium text-slate-400 hover:text-slate-200 transition"
                  >
                    Send to Different Email
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-8 text-center"
              >
                <motion.div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <HiOutlineCheckCircle className="h-8 w-8 text-emerald-400" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white">Verified!</h1>
                <p className="mt-2 text-slate-400">
                  Your email has been verified. Redirecting to password reset...
                </p>

                <div className="mt-6 flex items-center justify-center gap-1">
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
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Having trouble?{" "}
          <button
            onClick={() => toast.error("Contact support team")}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Contact Support
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
