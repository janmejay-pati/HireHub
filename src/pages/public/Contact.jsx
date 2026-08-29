import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  return (
    <section className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-cyan-500/20 blur-3xl rounded-full" />
      <div className="absolute top-40 -right-40 w-125 h-125 bg-purple-500/20 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE INFO */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm">
            Contact HireHub Support
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Let’s build your <span className="text-cyan-400">career journey</span> together
          </h1>

          <p className="mt-6 text-slate-300">
            Have questions about jobs, recruiters, or your account?  
            Our team responds within 24 hours.
          </p>

          {/* CONTACT CARDS */}
          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
              <HiOutlineEnvelope className="text-cyan-400 text-2xl" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-slate-300">support@hirehub.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
              <HiOutlinePhone className="text-cyan-400 text-2xl" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-sm text-slate-300">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
              <HiOutlineMapPin className="text-cyan-400 text-2xl" />
              <div>
                <p className="font-semibold">Office</p>
                <p className="text-sm text-slate-300">Bhubaneswar, India</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

          <form className="space-y-5">

            {/* NAME */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-2xl bg-slate-900/40 border border-white/10 outline-none focus:border-cyan-400 transition"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-2xl bg-slate-900/40 border border-white/10 outline-none focus:border-cyan-400 transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {/* MESSAGE */}
            <textarea
              rows="5"
              placeholder="Your Message..."
              className="w-full p-4 rounded-2xl bg-slate-900/40 border border-white/10 outline-none focus:border-cyan-400 transition"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 transition py-4 rounded-2xl font-semibold"
            >
              <HiOutlinePaperAirplane />
              Send Message
            </button>

          </form>
        </motion.div>

      </div>

      {/* FOOTER STRIP */}
      <div className="text-center text-slate-400 text-sm py-10 border-t border-white/10">
        © {new Date().getFullYear()} HireHub AI • All rights reserved
      </div>

    </section>
  );
};

export default Contact;