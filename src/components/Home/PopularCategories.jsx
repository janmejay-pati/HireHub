import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  HiOutlineCodeBracket,
  HiOutlinePaintBrush,
  HiOutlineChartBar,
  HiOutlineCpuChip,
  HiOutlineMegaphone,
  HiOutlineBanknotes,
  HiOutlineCloud,
  HiOutlineBriefcase,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const categories = [
  {
    id: 1,
    title: "Software Development",
    jobs: "12,450+ Jobs",
    icon: HiOutlineCodeBracket,
    gradient: "from-cyan-500 to-blue-600",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200",
  },
  {
    id: 2,
    title: "UI/UX Design",
    jobs: "4,230+ Jobs",
    icon: HiOutlinePaintBrush,
    gradient: "from-pink-500 to-rose-600",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
  },
  {
    id: 3,
    title: "Data Science",
    jobs: "3,890+ Jobs",
    icon: HiOutlineChartBar,
    gradient: "from-violet-500 to-fuchsia-600",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
  },
  {
    id: 4,
    title: "Artificial Intelligence",
    jobs: "2,740+ Jobs",
    icon: HiOutlineCpuChip,
    gradient: "from-emerald-500 to-green-600",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
  },
  {
    id: 5,
    title: "Digital Marketing",
    jobs: "5,140+ Jobs",
    icon: HiOutlineMegaphone,
    gradient: "from-orange-500 to-amber-600",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200",
  },
  {
    id: 6,
    title: "Finance & Banking",
    jobs: "2,980+ Jobs",
    icon: HiOutlineBanknotes,
    gradient: "from-sky-500 to-indigo-600",
    image:
      "https://images.unsplash.com/photo-1565372919363-9e6f14c0b1d6?q=80&w=1200",
  },
  {
    id: 7,
    title: "Cloud Computing",
    jobs: "3,210+ Jobs",
    icon: HiOutlineCloud,
    gradient: "from-teal-500 to-cyan-600",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
  },
  {
    id: 8,
    title: "Business Management",
    jobs: "6,800+ Jobs",
    icon: HiOutlineBriefcase,
    gradient: "from-slate-700 to-slate-900",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200",
  },
];

const PopularCategories = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollBy({ left: 260, behavior: "smooth" });

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 50
      ) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scroll = (dir) => {
    sliderRef.current?.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  const goToCategory = (title) => {
    const qs = new URLSearchParams();
    qs.set("category", title);
    navigate(`/jobs?${qs.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">

      {/* BACKGROUND */}
      <div className="absolute left-0 top-0 h-87.5 w-[350px] rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-87.5 w-[350px] rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <div className="mb-10 flex items-end justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <HiOutlineSparkles />
              Explore Categories
            </div>

            <h2 className="mt-5 text-4xl font-black text-white">
              Popular Job{" "}
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Categories
              </span>
            </h2>
          </div>

          {/* NAV */}
          <div className="hidden gap-3 md:flex">
            <button
              onClick={() => scroll("left")}
              className="h-11 w-11 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              <HiOutlineChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="h-11 w-11 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              <HiOutlineChevronRight />
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-4"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => goToCategory(category.title)}
                className="group relative min-w-[240px] overflow-hidden rounded-2xl shadow-xl"
              >

                {/* IMAGE BACKGROUND */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-60 w-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/20" />

                {/* ICON */}
                <div
                  className={`absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r ${category.gradient} text-white shadow-lg`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* TEXT */}
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-lg font-bold">
                    {category.title}
                  </h3>

                  <p className="text-sm text-white/80">
                    {category.jobs}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCategory(category.title);
                    }}
                    className={`mt-3 inline-flex items-center gap-2 rounded-xl bg-linear-to-r ${category.gradient} px-3 py-2 text-xs font-semibold`}
                  >
                    Explore <HiOutlineArrowRight />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;