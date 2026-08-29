import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineRocketLaunch,
  HiOutlineChartBar,
  HiOutlineLightBulb,
  HiOutlineArrowTrendingUp,
  HiOutlineBriefcase,
  HiOutlineCheckBadge,
} from "react-icons/hi2";

const guidanceCards = [
  {
    title: "AI Resume Analysis",
    desc: "Get ATS score, keyword suggestions and recruiter insights instantly.",
    icon: HiOutlineSparkles,
    gradient: "from-cyan-500 to-blue-600",
  },

  {
    title: "Career Roadmaps",
    desc: "Explore personalized learning paths for your dream job role.",
    icon: HiOutlineRocketLaunch,
    gradient: "from-violet-500 to-fuchsia-600",
  },

  {
    title: "Skill Gap Analysis",
    desc: "Identify missing skills based on trending industry jobs.",
    icon: HiOutlineChartBar,
    gradient: "from-emerald-500 to-green-600",
  },

  {
    title: "Interview Preparation",
    desc: "Practice real company interview questions with AI assistance.",
    icon: HiOutlineAcademicCap,
    gradient: "from-orange-500 to-red-500",
  },
];

const CareerGuidance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goResumeBuilder = () => {
    if (user && user.role === 'candidate') navigate('/candidate/resume-builder');
    else navigate('/login');
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white py-24">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-32 left-0 h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-0 top-40 h-87.5 w-[350px] rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* TOP SECTION */}
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              <HiOutlineSparkles className="h-5 w-5" />
              AI Career Guidance
            </div>

            <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Grow your career with
              <span className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                {" "}
                AI-powered insights
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Discover personalized job recommendations, resume improvements,
              interview preparation, and skill-based career growth tools —
              designed like modern platforms such as LinkedIn and Naukri.
            </p>

            {/* FEATURES */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2">

              <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-lg shadow-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600">
                  <HiOutlineArrowTrendingUp className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Trending Skills
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Know what recruiters are hiring for.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-lg shadow-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
                  <HiOutlineLightBulb className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Smart Suggestions
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    AI recommendations based on your profile.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">

                <button onClick={() => navigate('/services')} className="rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30 transition hover:scale-105">
                  Explore Guidance
                </button>

                <button onClick={goResumeBuilder} className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Open Resume Builder
                </button>

            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >

            {/* MAIN IMAGE */}
            <div className="overflow-hidden rounded-4xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl">

              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
                alt="Career guidance"
                className="h-125 w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg">
                    <HiOutlineBriefcase className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">
                      25,000+ Career Opportunities
                    </h3>

                    <p className="mt-1 text-sm text-white/70">
                      AI-powered job recommendations updated daily.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* FLOATING CARD */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-10 top-12 hidden rounded-3xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl lg:block"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <HiOutlineCheckBadge className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Resume Score Improved
                  </p>

                  <p className="text-xs text-slate-500">
                    +82% recruiter visibility
                  </p>
                </div>

              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* GUIDANCE CARDS */}
        <div className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {guidanceCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100 transition"
            >

              <div
                className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 transition duration-500 group-hover:opacity-100`}
              />

              <div className="relative z-10">

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 transition group-hover:bg-white/20">
                  <card.icon className="h-8 w-8 text-slate-900 transition group-hover:text-white" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900 transition group-hover:text-white">
                  {card.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600 transition group-hover:text-white/80">
                  {card.desc}
                </p>

              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default CareerGuidance;