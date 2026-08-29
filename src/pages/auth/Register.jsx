// Updated Register.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  HiOutlineBriefcase,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";
import { roleDefaultRoute } from "../../utils/routeUtils";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(roleDefaultRoute(user.role));
    }
  }, [user, navigate]);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      role: "candidate",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      designation: "",
      companySize: "",
      location: "",
    });

  /* =========================
      HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  /* =========================
      VALIDATION
  ========================= */

  const validateForm = () => {

    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role,
      companyName,
      designation,
      companySize,
      location,
    } = formData;

    // NAME
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    // EMAIL
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error(
        "Enter valid email"
      );
      return false;
    }

    // PHONE
    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      toast.error(
        "Enter valid mobile number"
      );
      return false;
    }

    // PASSWORD
    if (password.length < 6) {
      toast.error(
        "Password minimum 6 characters"
      );
      return false;
    }

    // CONFIRM PASSWORD
    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return false;
    }

    // RECRUITER
if (role === "recruiter") {
        if (!companyName.trim()) {
          toast.error("Company name required");
          return false;
        }

        if (!designation.trim()) {
          toast.error("Designation required");
          return false;
        }

        if (!companySize.trim()) {
          toast.error("Company size required");
          return false;
        }

        if (!location.trim()) {
          toast.error("Location required");
          return false;
        }
      }

    return true;
  };

  /* =========================
      HANDLE REGISTER
  ========================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        company: formData.role === "recruiter" ? formData.companyName.trim() : undefined,
        designation: formData.role === "recruiter" ? formData.designation.trim() : undefined,
        companySize: formData.role === "recruiter" ? formData.companySize.trim() : undefined,
        location: formData.role === "recruiter" ? formData.location.trim() : undefined,
      };

      const response = await registerUser(payload);

      if (!response.success) {
        toast.error(response.message || "Registration failed");
        return;
      }

      const registeredUser = response.data.user;
      login(registeredUser);
      toast.success("Registration Successful");
      navigate(roleDefaultRoute(registeredUser.role));
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen overflow-hidden bg-slate-950">

      {/* LEFT SIDE */}

      <div className="relative hidden w-1/2 overflow-hidden lg:flex">

        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"
          alt="register"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/80 via-blue-600/70 to-slate-950/90" />

        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">

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

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl">

              <HiOutlineBriefcase className="h-8 w-8" />

            </div>

            <div>

              <h1 className="text-4xl font-black">
                HireHub
              </h1>

              <p className="text-white/80">
                AI Job Portal
              </p>

            </div>

          </motion.div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full max-w-xl"
        >

          {/* HEADER */}

          <div className="mb-10 text-center">

            <h2 className="text-5xl font-black text-slate-900">
              Create Account
            </h2>

            <p className="mt-4 text-slate-500">
              Start your professional journey today
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={
              handleRegister
            }
            className="space-y-5"
          >

            {/* ROLE */}

            <select
              name="role"
              value={
                formData.role
              }
              onChange={
                handleChange
              }
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
            >

              <option value="candidate">
                Candidate
              </option>

              <option value="recruiter">
                Recruiter
              </option>

            </select>

            {/* NAME */}

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
            />

            {/* EMAIL */}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
            />

            {/* PHONE */}

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
            />

            {/* RECRUITER */}

            {formData.role ===
              "recruiter" && (
              <>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={
                    formData.companyName
                  }
                  onChange={
                    handleChange
                  }
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
                />

                <input
                  type="text"
                  name="designation"
                  placeholder="Your Designation"
                  value={
                    formData.designation
                  }
                  onChange={
                    handleChange
                  }
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
                />

                <input
                  type="text"
                  name="companySize"
                  placeholder="Company Size"
                  value={
                    formData.companySize
                  }
                  onChange={
                    handleChange
                  }
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={
                    formData.location
                  }
                  onChange={
                    handleChange
                  }
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
                />
              </>
            )}

            {/* PASSWORD */}

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >

                {showPassword ? (
                  <HiOutlineEyeSlash />
                ) : (
                  <HiOutlineEye />
                )}

              </button>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >

                {showConfirmPassword ? (
                  <HiOutlineEyeSlash />
                ) : (
                  <HiOutlineEye />
                )}

              </button>

            </div>

            {/* BUTTON */}

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white"
            >

              {loading
                ? "Creating..."
                : "Create Account"}

            </button>

          </form>

          {/* LOGIN */}

          <p className="mt-7 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-cyan-600"
            >
              Login
            </Link>

          </p>

        </motion.div>

      </div>

    </section>
  );
};

export default Register;