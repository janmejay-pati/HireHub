import { useEffect, useRef, useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  HiOutlineBookmark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
} from "react-icons/hi2";

import { usePortal } from "../../context/PortalContext";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    salary: "₹18L",
    posted: "2d ago",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
    description:
      "Build modern frontend apps using React ecosystem.",
  },

  {
    id: 2,
    title: "Backend Engineer",
    company: "Amazon",
    location: "Remote",
    salary: "₹22L",
    posted: "1d ago",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    description:
      "Develop scalable backend APIs and cloud services.",
  },

  {
    id: 3,
    title: "UI UX Designer",
    company: "Adobe",
    location: "Delhi",
    salary: "₹15L",
    posted: "5h ago",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Adobe_Systems_logo_and_wordmark.svg",
    banner:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200",
    description:
      "Design modern digital experiences and interfaces.",
  },

  {
    id: 4,
    title: "Cloud Engineer",
    company: "Netflix",
    location: "Pune",
    salary: "₹28L",
    posted: "Today",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    banner:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    description:
      "Manage cloud infrastructure and deployments.",
  },

  {
    id: 5,
    title: "AI Engineer",
    company: "OpenAI",
    location: "Remote",
    salary: "₹35L",
    posted: "1h ago",
    logo:
      "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png",
    banner:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1200",
    description:
      "Build next-gen AI products and systems.",
  },

  {
    id: 6,
    title: "Product Designer",
    company: "Spotify",
    location: "Mumbai",
    salary: "₹17L",
    posted: "3h ago",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
    banner:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200",
    description:
      "Design premium music experiences.",
  },

  {
    id: 7,
    title: "Software Engineer",
    company: "Tesla",
    location: "Hyderabad",
    salary: "₹30L",
    posted: "Today",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    banner:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200",
    description:
      "Develop smart automotive software systems.",
  },

  {
    id: 8,
    title: "Cyber Security Analyst",
    company: "Cisco",
    location: "Chennai",
    salary: "₹19L",
    posted: "5h ago",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
    banner:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200",
    description:
      "Secure enterprise infrastructure and cloud.",
  },

  {
    id: 9,
    title: "Mobile Developer",
    company: "Apple",
    location: "Remote",
    salary: "₹25L",
    posted: "2h ago",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    banner:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200",
    description:
      "Build beautiful mobile experiences for iOS.",
  },

  {
    id: 10,
    title: "Full Stack Developer",
    company: "Meta",
    location: "Bangalore",
    salary: "₹23L",
    posted: "4h ago",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Inc._logo.svg",
    banner:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200",
    description:
      "Develop scalable web apps with MERN stack.",
  },
];

const FeaturedJobs = () => {
  const { openApplyModal, hasApplied } = usePortal();

  const sliderRef = useRef(null);

  const [selectedJob, setSelectedJob] =
    useState(null);

  const [savedJobs, setSavedJobs] =
    useState([]);

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
        slider.scrollWidth - 20
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

  /* MANUAL SCROLL */

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left:
        direction === "left"
          ? -320
          : 320,
      behavior: "smooth",
    });
  };

  /* SAVE */

  const toggleSave = (id) => {
    setSavedJobs((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  };

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-slate-100 via-white to-slate-100 py-16">

        {/* BG GLOW */}

        <div className="absolute left-0 top-0 h-87.5 w-[350px] rounded-full bg-cyan-300/20 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 h-87.5 w-[350px] rounded-full bg-violet-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4">

          {/* HEADER */}

          <div className="mb-10 flex items-center justify-between">

            <div>

              <h2 className="text-4xl font-black text-slate-900">
                Featured Jobs
              </h2>

              <p className="mt-2 text-slate-500">
                Explore premium career opportunities
              </p>

            </div>

            {/* BUTTONS */}

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  scroll("left")
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl transition duration-300 hover:-translate-x-1 hover:bg-slate-900 hover:text-white"
              >

                <HiOutlineChevronLeft className="h-5 w-5" />

              </button>

              <button
                onClick={() =>
                  scroll("right")
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl transition duration-300 hover:translate-x-1 hover:bg-slate-900 hover:text-white"
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

            {jobs.map((job, index) => (

              <motion.div
                key={job.id}
                initial={{
                  opacity: 0,
                  x: 80,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.06,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                onClick={() =>
                  setSelectedJob(job)
                }
                className="group relative min-w-[260px] h-85 overflow-hidden rounded-3xl cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
              >

                {/* IMAGE */}

                <img
                  src={job.banner}
                  alt={job.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* OVERLAY */}

                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/35 to-transparent"></div>

                {/* SAVE */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id);
                  }}
                  className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl backdrop-blur-xl transition ${
                    savedJobs.includes(
                      job.id
                    )
                      ? "bg-cyan-500 text-white"
                      : "bg-white/20 text-white border border-white/20"
                  }`}
                >

                  <HiOutlineBookmark className="h-5 w-5" />

                </button>

                {/* CONTENT */}

                <div className="absolute bottom-0 left-0 z-10 w-full p-5">

                  {/* COMPANY */}

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">

                      <img
                        src={job.logo}
                        alt={job.company}
                        className="h-7 object-contain"
                      />

                    </div>

                    <div>

                      <h3 className="line-clamp-1 text-xl font-black text-white">

                        {job.title}

                      </h3>

                      <p className="text-sm text-white/80">
                        {job.company}
                      </p>

                    </div>

                  </div>

                  {/* INFO */}

                  <div className="space-y-2 text-sm text-white/90">

                    <div className="flex items-center gap-2">

                      <HiOutlineMapPin className="h-4 w-4" />

                      {job.location}

                    </div>

                    <div className="flex items-center gap-2">

                      <HiOutlineCurrencyDollar className="h-4 w-4" />

                      {job.salary}

                    </div>

                    <div className="flex items-center gap-2">

                      <HiOutlineClock className="h-4 w-4" />

                      {job.posted}

                    </div>

                  </div>

                  {/* BUTTON */}

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/20 px-4 py-3 text-sm font-bold text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-slate-900">

                    View Details

                    <HiOutlineArrowRight className="h-4 w-4" />

                  </button>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* MODAL */}

      <AnimatePresence>

        {selectedJob && (

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
              className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
            >

              {/* CLOSE */}

              <button
                onClick={() =>
                  setSelectedJob(null)
                }
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xl transition hover:rotate-90"
              >

                <HiOutlineXMark className="h-5 w-5 text-slate-700" />

              </button>

              {/* TOP IMAGE */}

              <div className="relative h-64">

                <img
                  src={selectedJob.banner}
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

                <div className="absolute bottom-6 left-6 flex items-center gap-4">

                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-white shadow-2xl">

                    <img
                      src={selectedJob.logo}
                      alt=""
                      className="h-10 object-contain"
                    />

                  </div>

                  <div>

                    <h2 className="text-3xl font-black text-white">
                      {selectedJob.company}
                    </h2>

                    <p className="mt-1 text-white/80">
                      {selectedJob.title}
                    </p>

                  </div>

                </div>

              </div>

              {/* BODY */}

              <div className="p-7">

                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineCurrencyDollar className="h-6 w-6 text-emerald-500" />

                    <p className="mt-3 text-xs text-slate-500">
                      Salary
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                      {selectedJob.salary}
                    </h3>

                  </div>

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineMapPin className="h-6 w-6 text-cyan-500" />

                    <p className="mt-3 text-xs text-slate-500">
                      Location
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                      {selectedJob.location}
                    </h3>

                  </div>

                </div>

                <div className="mt-7">

                  <h3 className="text-2xl font-black text-slate-900">
                    About Job
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {selectedJob.description}
                  </p>

                </div>

                <button
                  onClick={() => openApplyModal(selectedJob)}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition duration-300 hover:scale-[1.02]"
                >

                  {hasApplied(selectedJob?._id || selectedJob?.id) ? "Applied" : "Apply Now"}

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

export default FeaturedJobs;