// FeaturedCompanies.jsx

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineArrowRight,
  HiOutlineStar,
  HiOutlineBriefcase,
  HiOutlineCheckBadge,
  HiOutlineSparkles,
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineGlobeAlt,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const featuredCompanies = [
  {
    id: 1,
    name: "Google",
    rating: "4.9",
    jobs: "245 Jobs",
    employees: "1.8L+",
    location: "California, USA",
    website: "www.google.com",
    category: "AI",
    description:
      "Build next-generation AI products and scalable systems with global impact.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
  },

  {
    id: 2,
    name: "Microsoft",
    rating: "4.8",
    jobs: "198 Jobs",
    employees: "2.2L+",
    location: "Washington, USA",
    website: "www.microsoft.com",
    category: "Cloud",
    description:
      "Empowering developers with cloud computing and enterprise technologies.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
  },

  {
    id: 3,
    name: "Amazon",
    rating: "4.7",
    jobs: "310 Jobs",
    employees: "15L+",
    location: "Seattle, USA",
    website: "www.amazon.com",
    category: "E-Commerce",
    description:
      "Innovating in cloud, logistics and global digital commerce.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200",
  },

  {
    id: 4,
    name: "OpenAI",
    rating: "5.0",
    jobs: "42 Jobs",
    employees: "5K+",
    location: "San Francisco",
    website: "www.openai.com",
    category: "AI",
    description:
      "Researching and deploying safe artificial intelligence systems.",
    logo:
      "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png",
    banner:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1200",
  },

  {
    id: 5,
    name: "Netflix",
    rating: "4.8",
    jobs: "58 Jobs",
    employees: "13K+",
    location: "Los Angeles",
    website: "www.netflix.com",
    category: "Media",
    description:
      "Creating premium streaming experiences for millions worldwide.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200",
  },

  {
    id: 6,
    name: "Adobe",
    rating: "4.6",
    jobs: "90 Jobs",
    employees: "29K+",
    location: "California, USA",
    website: "www.adobe.com",
    category: "Design",
    description:
      "Building creative tools and digital experiences for creators.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200",
  },

  {
    id: 7,
    name: "Spotify",
    rating: "4.7",
    jobs: "61 Jobs",
    employees: "9K+",
    location: "Sweden",
    website: "www.spotify.com",
    category: "Music",
    description:
      "Powering the future of music streaming and podcast experiences.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
    banner:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200",
  },

  {
    id: 8,
    name: "Tesla",
    rating: "4.5",
    jobs: "144 Jobs",
    employees: "1.4L+",
    location: "Texas, USA",
    website: "www.tesla.com",
    category: "Auto",
    description:
      "Accelerating sustainable energy and autonomous driving technology.",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    banner:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200",
  },
];

const FeaturedCompanies = () => {
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
        left: 260,
        behavior: "smooth",
      });

      if (
        slider.scrollLeft +
          slider.clientWidth >=
        slider.scrollWidth - 10
      ) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 2500);

    return () =>
      clearInterval(interval);
  }, []);

  /* MANUAL SLIDE */

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
      <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-100 py-16">

        {/* BACKGROUND */}

        <div className="absolute left-0 top-0 h-75 w-75 rounded-full bg-cyan-300/20 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 h-75 w-75 rounded-full bg-violet-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4">

          {/* HEADER */}

          <div className="mb-10 flex items-center justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">

                <HiOutlineSparkles className="h-5 w-5" />

                Top Companies

              </div>

              <h2 className="mt-4 text-4xl font-black text-slate-900">

                Featured Hiring Companies

              </h2>

              <p className="mt-2 text-slate-500">

                Discover companies hiring worldwide

              </p>

            </div>

            {/* SLIDE BUTTONS */}

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  scroll("left")
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl transition hover:-translate-y-1"
              >

                <HiOutlineChevronLeft className="h-5 w-5" />

              </button>

              <button
                onClick={() =>
                  scroll("right")
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl transition hover:-translate-y-1"
              >

                <HiOutlineChevronRight className="h-5 w-5" />

              </button>

            </div>

          </div>

          {/* SLIDER */}

          <div
            ref={sliderRef}
            className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-4"
          >

            {featuredCompanies.map(
              (company, index) => (

                <motion.div
                  key={company.id}
                  initial={{
                    opacity: 0,
                    x: 80,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.6,
                  }}
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                  }}
                  onClick={() =>
                    setSelectedCompany(
                      company
                    )
                  }
                  className="group relative min-w-[250px] overflow-hidden rounded-4xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer"
                >

                  {/* IMAGE */}

                  <img
                    src={
                      company.banner
                    }
                    alt={company.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* OVERLAY */}

                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>

                  {/* CONTENT */}

                  <div className="relative z-10 flex h-[330px] flex-col justify-between p-5">

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xl">

                        <img
                          src={
                            company.logo
                          }
                          alt=""
                          className="h-7 object-contain"
                        />

                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-300 backdrop-blur-xl">

                        <HiOutlineStar className="h-4 w-4" />

                        {
                          company.rating
                        }

                      </div>

                    </div>

                    {/* BOTTOM */}

                    <div>

                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-xl">

                        <HiOutlineCheckBadge className="h-4 w-4" />

                        Verified Company

                      </div>

                      <h3 className="text-2xl font-black text-white">

                        {
                          company.name
                        }

                      </h3>

                      <p className="mt-2 text-sm text-white/80 line-clamp-2">

                        {
                          company.description
                        }

                      </p>

                      {/* STATS */}

                      <div className="mt-5 flex items-center justify-between text-sm text-white/90">

                        <div className="flex items-center gap-2">

                          <HiOutlineBriefcase className="h-4 w-4" />

                          {
                            company.jobs
                          }

                        </div>

                        <div className="flex items-center gap-2">

                          <HiOutlineUsers className="h-4 w-4" />

                          {
                            company.employees
                          }

                        </div>

                      </div>

                      {/* BUTTON */}

                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white hover:text-slate-900"
                      >

                        View Details

                        <HiOutlineArrowRight className="h-4 w-4" />

                      </button>

                    </div>

                  </div>

                </motion.div>

              )
            )}

          </div>

        </div>

      </section>

      {/* POPUP MODAL */}

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
                scale: 0.9,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
              }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
            >

              {/* CLOSE */}

              <button
                onClick={() =>
                  setSelectedCompany(
                    null
                  )
                }
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xl transition hover:rotate-90"
              >

                <HiOutlineXMark className="h-5 w-5 text-slate-700" />

              </button>

              {/* TOP IMAGE */}

              <div className="relative h-64 overflow-hidden">

                <img
                  src={
                    selectedCompany.banner
                  }
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent"></div>

                <div className="absolute bottom-6 left-6 flex items-center gap-5">

                  <div className="flex h-24 w-24 items-center justify-center rounded-4xl bg-white shadow-2xl">

                    <img
                      src={
                        selectedCompany.logo
                      }
                      alt=""
                      className="h-10 object-contain"
                    />

                  </div>

                  <div>

                    <h2 className="text-4xl font-black text-white">

                      {
                        selectedCompany.name
                      }

                    </h2>

                    <p className="mt-1 text-white/80">

                      {
                        selectedCompany.category
                      }

                    </p>

                  </div>

                </div>

              </div>

              {/* BODY */}

              <div className="p-7">

                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineBriefcase className="h-6 w-6 text-cyan-500" />

                    <p className="mt-3 text-xs text-slate-500">

                      Open Jobs

                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">

                      {
                        selectedCompany.jobs
                      }

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineUsers className="h-6 w-6 text-violet-500" />

                    <p className="mt-3 text-xs text-slate-500">

                      Employees

                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">

                      {
                        selectedCompany.employees
                      }

                    </h3>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="mt-7">

                  <h3 className="text-2xl font-black text-slate-900">

                    About Company

                  </h3>

                  <p className="mt-3 leading-8 text-slate-600">

                    {
                      selectedCompany.description
                    }

                  </p>

                </div>

                {/* EXTRA INFO */}

                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-3 text-slate-700">

                    <HiOutlineMapPin className="h-5 w-5 text-cyan-500" />

                    {
                      selectedCompany.location
                    }

                  </div>

                  <div className="flex items-center gap-3 text-slate-700">

                    <HiOutlineGlobeAlt className="h-5 w-5 text-cyan-500" />

                    {
                      selectedCompany.website
                    }

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  onClick={() => {
                    setSelectedCompany(null);
                    navigate("/jobs");
                  }}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white shadow-xl transition hover:scale-[1.02]"
                >

                  Explore Jobs

                  <HiOutlineArrowRight className="h-4 w-4" />

                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
};

export default FeaturedCompanies;