import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

import {
  HiOutlineSparkles,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlinePlayCircle,
  HiOutlineArrowRight,
} from "react-icons/hi2";

const interviewQuestions = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer",
    level: "Mid Level",
    question: "Explain Virtual DOM in React.",
    category: "React",
    duration: "15 mins",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Backend Engineer",
    level: "Senior",
    question: "How does JWT authentication work?",
    category: "Backend",
    duration: "20 mins",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    id: 3,
    company: "Amazon",
    role: "Product Manager",
    level: "Experienced",
    question: "Describe a difficult customer problem.",
    category: "Behavioral",
    duration: "10 mins",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: 4,
    company: "Netflix",
    role: "DevOps Engineer",
    level: "Senior",
    question: "Explain CI/CD pipeline architecture.",
    category: "DevOps",
    duration: "18 mins",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: 5,
    company: "IBM",
    role: "Data Scientist",
    level: "Mid Level",
    question: "What is overfitting in Machine Learning?",
    category: "AI/ML",
    duration: "14 mins",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: 6,
    company: "Adobe",
    role: "UI UX Designer",
    level: "Junior",
    question: "What makes a good user experience?",
    category: "Design",
    duration: "12 mins",
    image:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: 7,
    company: "Infosys",
    role: "Java Developer",
    level: "Fresher",
    question: "Difference between JDK and JVM?",
    category: "Java",
    duration: "8 mins",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    id: 8,
    company: "Meta",
    role: "Security Engineer",
    level: "Senior",
    question: "How do you prevent SQL Injection?",
    category: "Cyber Security",
    duration: "16 mins",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    gradient: "from-emerald-500 to-green-600",
  },
];

const InterviewQuestions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollBy({ left: 300, behavior: "smooth" });

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 20
      ) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scroll = (dir) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50 py-20">

      {/* BACKGROUND */}
      <div className="absolute left-0 top-0 h-75 w-75 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-75 w-75 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              <HiOutlineSparkles />
              Interview Practice
            </div>

            <h2 className="mt-5 text-4xl font-black text-slate-900">
              Top Questions
            </h2>
          </div>

          <div className="hidden gap-3 md:flex">
            <button onClick={() => scroll("left")} className="rounded-xl border bg-white p-3 shadow">
              <HiOutlineChevronLeft />
            </button>
            <button onClick={() => scroll("right")} className="rounded-xl border bg-white p-3 shadow">
              <HiOutlineChevronRight />
            </button>
          </div>

        </div>

        {/* SLIDER */}
        <div ref={sliderRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-5">

          {interviewQuestions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-lg"
            >

              {/* IMAGE */}
              <div className="relative h-[130px] overflow-hidden">
                <img
                  src={item.image}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />

                {/* CATEGORY */}
                <div className={`absolute left-3 top-3 rounded-full bg-linear-to-r ${item.gradient} px-3 py-1 text-xs font-bold text-white`}>
                  {item.category}
                </div>

                {/* COMPANY */}
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-bold">{item.company}</p>
                  <p className="text-xs text-slate-200">{item.role}</p>
                </div>

                {/* PLAY ICON */}
                <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
                  <HiOutlinePlayCircle className="h-6 w-6" />
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                  {item.question}
                </h3>

                {/* META */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">

                  <div className="flex items-center gap-1">
                    <HiOutlineClock />
                    {item.duration}
                  </div>

                  <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold">
                    {item.level}
                  </span>

                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    user
                      ? navigate("/candidate/practice", {
                          state: { question: item },
                        })
                      : navigate("/login")
                  }
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r ${item.gradient} py-2 text-sm font-semibold text-white`}
                >
                  Practice
                  <HiOutlineArrowRight />
                </button>

              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default InterviewQuestions;