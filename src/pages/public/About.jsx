import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineRocketLaunch,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineChartBar,
} from "react-icons/hi2";

const features = [
  {
    title: "AI Job Matching",
    desc: "Get jobs tailored to your profile using AI ranking.",
    icon: HiOutlineSparkles,
  },
  {
    title: "Premium Visibility",
    desc: "Stand out to recruiters with boosted profile ranking.",
    icon: HiOutlineUserGroup,
  },
  {
    title: "Career Analytics",
    desc: "Track profile views, applications, and recruiter interest.",
    icon: HiOutlineChartBar,
  },
  {
    title: "Priority Applications",
    desc: "Get faster responses from top companies.",
    icon: HiOutlineRocketLaunch,
  },
];

const stats = [
  { label: "Active Users", value: "120K+" },
  { label: "Companies", value: "8.5K+" },
  { label: "Jobs Posted", value: "250K+" },
  { label: "Success Rate", value: "92%" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Basic job search", "Apply to jobs", "Limited visibility"],
  },
  {
    name: "Premium",
    price: "$12/mo",
    highlight: true,
    features: [
      "AI job recommendations",
      "Top recruiter visibility",
      "Profile insights",
      "Priority applications",
    ],
  },
  {
    name: "Pro",
    price: "$29/mo",
    features: [
      "Everything in Premium",
      "Resume review AI",
      "Direct recruiter chat",
      "Advanced analytics",
    ],
  },
];

export default function About() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white">

      {/* 🌈 Background Glow */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-cyan-500/20 blur-3xl rounded-full" />
      <div className="absolute top-40 -right-40 w-125 h-125 bg-purple-500/20 blur-3xl rounded-full" />

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm">
            AI Powered Career Platform
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Build your career with{" "}
            <span className="text-cyan-400">Premium AI Hiring</span>
          </h1>

          <p className="mt-6 text-slate-300 max-w-2xl mx-auto">
            A modern job platform inspired by LinkedIn Premium — connect,
            apply, and grow faster with AI-powered insights and recruiter
            visibility.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition">
              Get Started
            </button>
            <button className="px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10">
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 pb-20">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-lg"
          >
            <h3 className="text-3xl font-bold text-cyan-400">{s.value}</h3>
            <p className="text-sm text-slate-300 mt-2">{s.label}</p>
          </motion.div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Professionals Choose Us
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg"
              >
                <Icon className="h-10 w-10 text-cyan-400" />
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-slate-300 mt-2">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Create Profile",
            "Get AI Matches",
            "Apply & Get Hired",
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/5 p-6 rounded-2xl border border-white/10"
            >
              <div className="text-cyan-400 text-2xl font-bold">{i + 1}</div>
              <p className="mt-4">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`rounded-2xl p-8 border backdrop-blur-lg ${
                p.highlight
                  ? "bg-cyan-500/10 border-cyan-400"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="text-3xl font-bold mt-2">{p.price}</p>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                {p.features.map((f, i) => (
                  <p key={i} className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-cyan-400" />
                    {f}
                  </p>
                ))}
              </div>

              <button className="mt-6 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600">
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 bg-linear-to-r from-cyan-500/10 to-purple-500/10">
        <h2 className="text-4xl font-bold">Start your career journey today</h2>
        <p className="mt-4 text-slate-300">
          Join thousands of professionals already growing their careers.
        </p>
        <button className="mt-8 px-8 py-4 bg-cyan-500 rounded-2xl hover:bg-cyan-600">
          Join Now
        </button>
      </section>
    </div>
  );
}