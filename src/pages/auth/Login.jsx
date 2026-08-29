// Login.jsx

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  HiOutlineBriefcase,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { roleDefaultRoute } from "../../utils/routeUtils";
import toast from "react-hot-toast";

const Login = () => {

  const navigate = useNavigate();

  const { login, user } = useAuth();

  useEffect(() => {

    if (user) {
      navigate(roleDefaultRoute(user.role));
    }

  }, [user, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* =========================
      HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  /* =========================
      HANDLE LOGIN
  ========================= */

  const handleLogin = async (e) => {

    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {

      toast.error("Please fill all fields");

      return;

    }

    setLoading(true);

    try {

      /* =========================
          DEFAULT ADMIN LOGIN
      ========================= */

      const adminEmail = "admin@gmail.com";

      const adminPassword = "admin123";

      if (
        email === adminEmail &&
        password === adminPassword
      ) {

        const adminUser = {
          id: "admin-1",
          name: "Admin",
          email: adminEmail,
          role: "admin",
        };

        // SAVE LOGIN
        login(adminUser);

        // SAVE TO LOCAL STORAGE
        localStorage.setItem(
          "hirehub_user",
          JSON.stringify(adminUser)
        );

        toast.success("Welcome Admin");

        navigate("/admin/dashboard");

        return;

      }

      /* =========================
          NORMAL USER LOGIN
      ========================= */

      const response = await loginUser({
        email,
        password,
      });

      if (!response.success) {

        toast.error(
          response.message ||
          "Invalid email or password"
        );

        return;

      }

      const loggedInUser =
        response.data.user;

      login(loggedInUser);

      toast.success(
        `Welcome ${loggedInUser.name}`
      );

      navigate(
        roleDefaultRoute(
          loggedInUser.role
        )
      );

    } catch (error) {

      console.error(error);

      toast.error("Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="relative flex min-h-screen overflow-hidden bg-slate-950">

      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className="relative hidden w-1/2 overflow-hidden lg:flex">

        {/* IMAGE */}

        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          alt="login"
          className="h-full w-full object-cover"
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/80 via-blue-600/70 to-slate-950/90" />

        {/* FLOATING GLOW */}

        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]" />

        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]" />

        {/* CONTENT */}

        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">

          {/* LOGO */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex items-center gap-4"
          >

            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: 8,
              }}
              className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl"
            >

              <HiOutlineBriefcase className="h-8 w-8" />

            </motion.div>

            <div>

              <h1 className="text-4xl font-black">
                HireHub
              </h1>

              <p className="text-white/80">
                AI Job Portal
              </p>

            </div>

          </motion.div>

          {/* TEXT */}

          <div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="max-w-xl text-6xl font-black leading-tight"
            >
              Welcome Back to the Future of Hiring
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="mt-6 max-w-lg text-lg leading-8 text-white/80"
            >
              Login to access your smart
              AI-powered hiring dashboard.
            </motion.p>

            {/* FEATURES */}

            <div className="mt-10 space-y-5">

              {[
                "AI Smart Job Recommendations",
                "Premium Recruiter Dashboard",
                "Fast & Secure Hiring Platform",
              ].map((item) => (

                <motion.div
                  key={item}
                  whileHover={{
                    x: 8,
                  }}
                  className="flex items-center gap-3"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl">

                    <HiOutlineCheckCircle className="h-6 w-6" />

                  </div>

                  <span className="text-lg font-medium">
                    {item}
                  </span>

                </motion.div>

              ))}

            </div>

          </div>

          {/* BOTTOM */}

          <div className="flex items-center gap-3 text-sm text-white/70">

            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

            Trusted by 10,000+ users worldwide

          </div>

        </div>

      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-white px-6 py-12">

        {/* GLOW */}

        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-cyan-100 blur-[120px]" />

        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-100 blur-[120px]" />

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative z-10 w-full max-w-xl"
        >

          {/* HEADER */}

          <div className="mb-10 text-center">

            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="text-5xl font-black text-slate-900"
            >
              Welcome Back
            </motion.h2>

            <p className="mt-4 text-slate-500">
              Login to continue your
              career journey
            </p>

          </div>

          {/* LOGIN CARD */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            className="rounded-4xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl"
          >

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div className="relative">

                <HiOutlineEnvelope className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />

                <input
                  type="email"
                  name="email"
                  aria-label="Email address"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-5 outline-none transition-all duration-300 focus:border-cyan-500 focus:bg-white placeholder:text-slate-400"
                  style={{ paddingLeft: '3rem' }}
                />

              </div>

              {/* PASSWORD */}

              <div className="relative">

                <HiOutlineLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  aria-label="Password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 outline-none transition-all duration-300 focus:border-cyan-500 focus:bg-white placeholder:text-slate-400"
                  style={{ paddingLeft: '3rem', paddingRight: '3.5rem' }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >

                  {showPassword ? (
                    <HiOutlineEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiOutlineEye className="h-5 w-5" />
                  )}

                </button>

              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* LOGIN BUTTON */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                disabled={loading}
                className="w-full rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
              >

                {loading
                  ? "Signing In..."
                  : "Login to HireHub"}

              </motion.button>

            </form>

            {/* REGISTER */}

            <p className="mt-7 text-center text-sm text-slate-500">

              Don’t have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-cyan-600 transition hover:text-cyan-700"
              >
                Create Account
              </Link>

            </p>

            {/* DEMO ADMIN */}



          </motion.div>

        </motion.div>

      </div>

    </section>

  );

};

export default Login;