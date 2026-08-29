// TopCompanies.jsx

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  HiOutlineCheckBadge,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

const companies = [
  {
    id: 1,
    name: "Google",
    industry: "Technology",
    employees: "180k+",
    jobs: "245 Jobs",
    location: "California",
    rating: "4.9",
    website: "google.com",
    about:
      "Google builds world-class AI and cloud technologies.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200",
    gradient: "from-blue-500 to-cyan-500",
  },

  {
    id: 2,
    name: "Microsoft",
    industry: "Cloud & AI",
    employees: "220k+",
    jobs: "180 Jobs",
    location: "Washington",
    rating: "4.8",
    website: "microsoft.com",
    about:
      "Microsoft powers cloud and enterprise systems globally.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
    gradient: "from-violet-500 to-purple-600",
  },

  {
    id: 3,
    name: "Amazon",
    industry: "E-Commerce",
    employees: "1.5M+",
    jobs: "320 Jobs",
    location: "Seattle",
    rating: "4.7",
    website: "amazon.com",
    about:
      "Amazon delivers modern ecommerce and cloud solutions.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200",
    gradient: "from-orange-500 to-amber-600",
  },

  {
    id: 4,
    name: "Netflix",
    industry: "Entertainment",
    employees: "12k+",
    jobs: "95 Jobs",
    location: "California",
    rating: "4.9",
    website: "netflix.com",
    about:
      "Netflix creates premium streaming experiences globally.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200",
    gradient: "from-rose-500 to-red-600",
  },

  {
    id: 5,
    name: "Meta",
    industry: "Social Media",
    employees: "86k+",
    jobs: "165 Jobs",
    location: "California",
    rating: "4.8",
    website: "meta.com",
    about:
      "Meta connects billions through social technologies.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
    banner:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200",
    gradient: "from-sky-500 to-blue-600",
  },

  {
    id: 6,
    name: "Apple",
    industry: "Devices",
    employees: "164k+",
    jobs: "210 Jobs",
    location: "Cupertino",
    rating: "4.9",
    website: "apple.com",
    about:
      "Apple designs premium devices and software products.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    banner:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1200",
    gradient: "from-slate-700 to-slate-900",
  },
];

const TopCompanies = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  /* AUTO SLIDE */

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollBy({
        left: 280,
        behavior: "smooth",
      });

      if (
        slider.scrollLeft +
          slider.clientWidth >=
        slider.scrollWidth - 50
      ) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  /* MANUAL */

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left:
        direction === "left"
          ? -280
          : 280,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-slate-100 py-16">

        {/* GLOW */}

        <div className="absolute left-0 top-0 h-[250px] w-[250px] rounded-full bg-cyan-300/20 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 h-[250px] w-[250px] rounded-full bg-violet-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4">

          {/* HEADER */}

          <div className="mb-8 flex items-center justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-700">

                <HiOutlineSparkles className="h-4 w-4" />

                Top Companies

              </div>

              <h2 className="mt-4 text-3xl font-black text-slate-900">

                Hiring
                <span className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  Worldwide
                </span>

              </h2>

            </div>

            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                onClick={() =>
                  scroll("left")
                }
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg transition hover:-translate-x-1 hover:scale-110"
              >

                <HiOutlineChevronLeft className="h-5 w-5" />

              </button>

              <button
                onClick={() =>
                  scroll("right")
                }
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition hover:translate-x-1 hover:scale-110"
              >

                <HiOutlineChevronRight className="h-5 w-5" />

              </button>

            </div>

          </div>

          {/* SLIDER */}

          <div
            ref={sliderRef}
            className="no-scrollbar flex gap-4 overflow-x-auto pb-4 scroll-smooth"
          >

            {companies.map(
              (company, index) => (

                <motion.div
                  key={company.id}
                  initial={{
                    opacity: 0,
                    x: 100,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.04,
                    rotate: 1,
                  }}
                  className="group relative min-w-[240px] overflow-hidden rounded-[1.8rem] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.08)]"
                >

                  {/* IMAGE */}

                  <div className="relative h-[120px] overflow-hidden">

                    <img
                      src={company.banner}
                      alt={company.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

                  </div>

                  {/* BODY */}

                  <div className="relative p-4">

                    {/* LOGO */}

                    <motion.div
                      whileHover={{
                        rotate: 8,
                        scale: 1.08,
                      }}
                      className="absolute -top-8 left-4 flex h-[58px] w-[58px] items-center justify-center rounded-2xl border-4 border-white bg-white shadow-xl"
                    >

                      <img
                        src={company.logo}
                        alt={company.name}
                        className="h-6 object-contain"
                      />

                    </motion.div>

                    {/* VERIFIED */}

                    <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100">

                      <HiOutlineCheckBadge className="h-4 w-4 text-cyan-600" />

                    </div>

                    <div className="mt-8">

                      <div className="flex items-center justify-between">

                        <h3 className="text-lg font-black text-slate-900">
                          {company.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">

                          <HiOutlineStar className="h-4 w-4 fill-yellow-400" />

                          {company.rating}

                        </div>

                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {company.industry}
                      </p>

                    </div>

                    {/* INFO */}

                    <div className="mt-4 space-y-2">

                      <div className="flex items-center gap-2 text-xs text-slate-500">

                        <HiOutlineMapPin className="h-4 w-4 text-rose-500" />

                        {company.location}

                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">

                        <HiOutlineBriefcase className="h-4 w-4 text-cyan-500" />

                        {company.jobs}

                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">

                        <HiOutlineUsers className="h-4 w-4 text-violet-500" />

                        {company.employees}

                      </div>

                    </div>

                    {/* BUTTON */}

                    <motion.button
                      whileHover={{
                        scale: 1.04,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      onClick={() =>
                        setSelectedCompany(company)
                      }
                      className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r ${company.gradient} px-4 py-3 text-xs font-bold text-white shadow-lg`}
                    >

                      View Details

                      <HiOutlineArrowRight className="h-4 w-4" />

                    </motion.button>

                  </div>

                </motion.div>

              )
            )}

          </div>

        </div>

      </section>

      {/* POPUP */}

      <AnimatePresence>

        {selectedCompany && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 80,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
              }}
              className="relative w-full max-w-xl overflow-hidden rounded-4xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
            >

              {/* CLOSE */}

              <button
                onClick={() =>
                  setSelectedCompany(null)
                }
                className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:rotate-90"
              >

                <HiOutlineXMark className="h-5 w-5 text-slate-700" />

              </button>

              {/* BANNER */}

              <div className="relative h-[220px] overflow-hidden">

                <img
                  src={
                    selectedCompany.banner
                  }
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

                <div className="absolute bottom-5 left-5 flex items-center gap-4">

                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white shadow-2xl">

                    <img
                      src={
                        selectedCompany.logo
                      }
                      alt=""
                      className="h-8 object-contain"
                    />

                  </div>

                  <div>

                    <h2 className="text-3xl font-black text-white">
                      {
                        selectedCompany.name
                      }
                    </h2>

                    <p className="mt-1 text-white/80">
                      {
                        selectedCompany.industry
                      }
                    </p>

                  </div>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-2xl bg-slate-100 p-4">

                    <p className="text-xs text-slate-500">
                      Open Jobs
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      {
                        selectedCompany.jobs
                      }
                    </h3>

                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">

                    <p className="text-xs text-slate-500">
                      Employees
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      {
                        selectedCompany.employees
                      }
                    </h3>

                  </div>

                </div>

                <div className="mt-6">

                  <h3 className="text-xl font-black text-slate-900">
                    About Company
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {
                      selectedCompany.about
                    }
                  </p>

                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">

                  <HiOutlineGlobeAlt className="h-5 w-5 text-cyan-500" />

                  {
                    selectedCompany.website
                  }

                </div>

                <button
                  onClick={() => {
                    setSelectedCompany(null);
                    navigate("/jobs");
                  }}
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r ${selectedCompany.gradient} px-5 py-4 font-semibold text-white shadow-xl transition hover:scale-[1.02]`}
                >

                  View Open Jobs

                  <HiOutlineArrowRight className="h-5 w-5" />

                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
};

export default TopCompanies;