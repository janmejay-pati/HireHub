// Full Modern Updated Dashboard.jsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { resumeService } from "../../services/resume_service";

import {
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineEye,
  HiOutlineCheckBadge,
  HiOutlineMapPin,
  HiOutlineBuildingOffice2,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineBellAlert,
  HiOutlineBolt,
} from "react-icons/hi2";

const Dashboard = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const currentUser = user || {};

  const [latestResume, setLatestResume] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setLatestResume(
        resumeService.getLatestResumeByUser(user.id)
      );
    }
  }, [user?.id]);

  // JOBS

  const recentJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      salary: "$120K",
      type: "Remote",
      location: "Bangalore",
      experience: "2+ Years",
      category: "Frontend",
      logo:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
      skills: ["React", "Tailwind", "JavaScript"],
    },

    {
      id: 2,
      title: "Backend Engineer",
      company: "Microsoft",
      salary: "$140K",
      type: "Hybrid",
      location: "Hyderabad",
      experience: "3+ Years",
      category: "Backend",
      logo:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
      skills: ["Node.js", "MongoDB", "Express"],
    },

    {
      id: 3,
      title: "UI/UX Designer",
      company: "Amazon",
      salary: "$100K",
      type: "Full Time",
      location: "Mumbai",
      experience: "1+ Years",
      category: "Design",
      logo:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      skills: ["Figma", "Adobe XD", "UI Design"],
    },

    {
      id: 4,
      title: "AI Engineer",
      company: "OpenAI",
      salary: "$180K",
      type: "Remote",
      location: "Pune",
      experience: "4+ Years",
      category: "AI/ML",
      logo:
        "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
      skills: ["Python", "LLM", "TensorFlow"],
    },
  ];

  // STATS

  const stats = [
    {
      title: "Applied Jobs",
      value: "24",
      icon: HiOutlineBriefcase,
      color: "from-cyan-500 to-blue-600",
    },

    {
      title: "Saved Jobs",
      value: "12",
      icon: HiOutlineHeart,
      color: "from-pink-500 to-rose-600",
    },

    {
      title: "Profile Views",
      value: "148",
      icon: HiOutlineEye,
      color: "from-emerald-500 to-green-600",
    },

    {
      title: "Interviews",
      value: "7",
      icon: HiOutlineCheckBadge,
      color: "from-violet-500 to-purple-600",
    },
  ];

  // APPLY FUNCTION

  const handleApplyJob = (job) => {
    navigate(`/candidate/apply/${job.id}`, {
      state: {
        id: job.id,
        title: job.title,
        company: job.company,
        companyName: job.company,
        salary: job.salary,
        location: job.location,
        jobType: job.type,
        experienceLevel: job.experience,
        category: job.category,
        jobCategory: job.category,
        skills: job.skills,
        logo: job.logo,
        description: `Join ${job.company} as a ${job.title} and build next-generation products with amazing engineering teams.`,
      },
    });
  };

  return (
    <div className="space-y-5">

      {/* HERO */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-slate-950 p-6 shadow-lg"
      >

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>

        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-400/5 blur-3xl"></div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}

          <div className="max-w-2xl">

            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-200 backdrop-blur-sm">
              <HiOutlineBolt className="h-3.5 w-3.5" />
              AI Powered Dashboard
            </div>

            <h1 className="text-3xl font-bold leading-tight text-white lg:text-4xl">
              Welcome back,
              <br />
              {currentUser.name || "Candidate"} 👋
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-cyan-100">
              Track your applications, discover opportunities, and get hired faster.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={() => navigate("/candidate/jobs")}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition hover:bg-slate-100"
              >
                Explore Jobs
              </button>

              <button
                onClick={() => navigate("/candidate/profile")}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Update Profile
              </button>

            </div>

          </div>

          {/* PROFILE */}

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >

            <img
              src={
                currentUser.profileImage ||
                "https://i.pravatar.cc/200?img=12"
              }
              alt="profile"
              className="mx-auto h-24 w-24 rounded-lg border-2 border-white/20 object-cover shadow-lg"
            />

            <h3 className="mt-3 text-center text-lg font-bold text-white">
              {currentUser.name || "Candidate"}
            </h3>

            <p className="mt-1 text-center text-xs text-cyan-200">
              MERN Stack Developer
            </p>

            <div className="mt-4 rounded-lg bg-white/10 p-3 text-center">
              <p className="text-xs text-cyan-100">
                Resume Score
              </p>

              <h2 className="mt-1 text-3xl font-bold text-white">
                85%
              </h2>
            </div>

          </motion.div>

        </div>

      </motion.div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item, index) => (

          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2 }}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >

            <div
              className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-r ${item.color} opacity-10 blur-2xl`}
            ></div>

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {item.value}
                </h2>

              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${item.color}`}
              >
                <item.icon className="h-6 w-6 text-white" />
              </div>

            </div>

          </motion.div>
        ))}

      </div>

      {/* MAIN */}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">

        {/* JOBS */}

        <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-white">
                Recommended
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                AI matched opportunities
              </p>

            </div>

            <button
              onClick={() => navigate("/candidate/jobs")}
              className="rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20"
            >
              View All
            </button>

          </div>

          {/* SMALL MODERN CARDS */}

          <div className="grid gap-3 md:grid-cols-2">

            {recentJobs.map((job) => (

              <motion.div
                key={job.id}
                whileHover={{ y: -3 }}
                className="group rounded-lg border border-white/10 bg-slate-900/50 p-4 transition-all duration-300 hover:border-cyan-500/20"
              >

                {/* TOP */}

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-2 shadow-lg">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="h-8 w-8 object-contain"
                      />
                    </div>

                    <div>

                      <h3 className="text-base font-bold text-white">
                        {job.title}
                      </h3>

                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">

                        <HiOutlineBuildingOffice2 className="h-3 w-3 text-cyan-400" />

                        {job.company}

                      </div>

                    </div>

                  </div>

                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-300">
                    {job.type}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">

                  <div className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1">
                    <HiOutlineMapPin className="h-3 w-3 text-emerald-400" />
                    {job.location}
                  </div>

                  <div className="rounded-lg bg-white/5 px-2 py-1 text-cyan-300">
                    {job.category}
                  </div>

                </div>

                {/* SKILLS */}

                <div className="mt-3 flex flex-wrap gap-1.5">

                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

                {/* BOTTOM */}

                <div className="mt-4 flex items-center justify-between">

                  <div>

                    <p className="text-[10px] text-slate-500">
                      Salary
                    </p>

                    <h3 className="mt-0.5 text-lg font-bold text-emerald-400">
                      {job.salary}
                    </h3>

                  </div>

                  <button
                    onClick={() => handleApplyJob(job)}
                    className="group flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-cyan-500/15 transition-all duration-300 hover:shadow-xl"
                  >
                    Apply

                    <HiOutlineArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />

                  </button>

                </div>

              </motion.div>
            ))}

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-5">

          {/* PROFILE STRENGTH */}

          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-bold text-white">
                Profile Strength
              </h3>

              <HiOutlineSparkles className="h-5 w-5 text-cyan-400" />

            </div>

            <div className="mt-5 flex justify-center">

              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-cyan-500/15">

                <div className="absolute inset-0 rounded-full border-[8px] border-cyan-500 border-t-transparent"></div>

                <div>

                  <h2 className="text-center text-3xl font-bold text-white">
                    85%
                  </h2>

                  <p className="mt-1 text-center text-xs text-slate-400">
                    Complete
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* QUICK INFO */}

          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-bold text-white">
                Notifications
              </h3>

              <HiOutlineBellAlert className="h-5 w-5 text-cyan-400" />

            </div>

            <div className="mt-4 space-y-2.5">

              <div className="rounded-lg bg-slate-900/50 p-3">
                <p className="text-sm font-medium text-white">
                  Google viewed your profile
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  2 hours ago
                </p>
              </div>

              <div className="rounded-lg bg-slate-900/50 p-3">
                <p className="text-sm font-medium text-white">
                  New AI jobs available
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Based on your skills
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;