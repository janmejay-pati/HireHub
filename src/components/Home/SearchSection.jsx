import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

const trendingSearches = [
  "Frontend Developer",
  "React.js",
  "UI/UX Designer",
  "Data Analyst",
  "AI Engineer",
  "Remote Jobs",
  "MERN Stack",
  "Cloud Engineer",
];

const jobCategories = [
  {
    name: "Frontend",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
  },
  {
    name: "Backend",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200",
  },
  {
    name: "MERN",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200",
  },
  {
    name: "Java",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
  },
  {
    name: "Python",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1200",
  },
  {
    name: "DevOps",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
  },
  {
    name: "Cloud",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200",
  },
  {
    name: "AI/ML",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
  },
  {
    name: "Data Science",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
  },
  {
    name: "UI/UX",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200",
  },
  {
    name: "Marketing",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
  },
  {
    name: "Remote",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
  },
];

const SearchSection = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    search: "",
    location: "",
  });

  const buildUrl = () => {
    const params = new URLSearchParams();

    if (searchData.search.trim()) {
      params.set("search", searchData.search.trim());
    }

    if (searchData.location.trim()) {
      params.set("location", searchData.location.trim());
    }

    return `/jobs?${params.toString()}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const handleSearch = () => {
    navigate(buildUrl());
  };

  const handleTrendingSearch = (keyword) => {
    navigate(`/jobs?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <section className="relative overflow-hidden py-24">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0">

        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1800&auto=format&fit=crop"
          alt="background"
          className="h-full w-full object-cover scale-110 animate-[pulse_10s_ease-in-out_infinite]"
        />

        <div className="absolute inset-0 bg-slate-950/80" />

        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-blue-600/20 to-violet-500/20" />

      </div>

      {/* GLOW EFFECTS */}

      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
          absolute -left-20 top-0
          h-87.5 w-[350px]
          rounded-full
          bg-cyan-500/20
          blur-3xl
        "
      />

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
          absolute bottom-0 right-0
          h-87.5 w-[350px]
          rounded-full
          bg-violet-500/20
          blur-3xl
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HERO ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto max-w-4xl text-center"
        >

          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-white/10
              bg-white/10
              px-5 py-2
              text-sm font-semibold
              text-cyan-100
              backdrop-blur-xl
            "
          >

            <HiOutlineSparkles className="h-5 w-5" />

            AI Powered Job Search

          </div>

          <h1
            className="
              mt-8 text-4xl
              font-black leading-tight
              text-white
              sm:text-5xl
              lg:text-7xl
            "
          >

            Discover Your

            <span
              className="
                bg-linear-to-r
                from-cyan-300 to-blue-400
                bg-clip-text text-transparent
              "
            >
              {" "}
              Dream Career
            </span>

          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">

            Explore premium opportunities from top companies worldwide
            with AI-powered smart job discovery.

          </p>

        </motion.div>

        {/* ================= SEARCH BOX ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto mt-14 max-w-5xl"
        >

          <div
            className="
              rounded-4xl
              border border-white/10
              bg-white/10
              p-4
              shadow-2xl
              backdrop-blur-2xl
            "
          >

            <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_auto]">

              {/* SEARCH */}

              <div
                className="
                  flex items-center gap-4
                  rounded-2xl
                  bg-white
                  px-5 py-5
                  shadow-xl
                "
              >

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-cyan-100
                    text-cyan-600
                  "
                >

                  <HiOutlineMagnifyingGlass className="h-6 w-6" />

                </div>

                <div className="flex-1">

                  <p
                    className="
                      text-xs font-semibold
                      uppercase tracking-[0.2em]
                      text-slate-400
                    "
                  >
                    Job Search
                  </p>

                  <input
                    type="text"
                    name="search"
                    value={searchData.search}
                    onChange={handleChange}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearch()
                    }
                    placeholder="Frontend Developer"
                    className="
                      mt-1 w-full bg-transparent
                      text-lg font-medium
                      text-slate-900 outline-none
                      placeholder:text-slate-400
                    "
                  />

                </div>

              </div>

              {/* LOCATION */}

              <div
                className="
                  flex items-center gap-4
                  rounded-2xl
                  bg-white
                  px-5 py-5
                  shadow-xl
                "
              >

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-violet-100
                    text-violet-600
                  "
                >

                  <HiOutlineMapPin className="h-6 w-6" />

                </div>

                <div className="flex-1">

                  <p
                    className="
                      text-xs font-semibold
                      uppercase tracking-[0.2em]
                      text-slate-400
                    "
                  >
                    Location
                  </p>

                  <input
                    type="text"
                    name="location"
                    value={searchData.location}
                    onChange={handleChange}
                    placeholder="Bangalore, India"
                    className="
                      mt-1 w-full bg-transparent
                      text-lg font-medium
                      text-slate-900 outline-none
                      placeholder:text-slate-400
                    "
                  />

                </div>

              </div>

              {/* SEARCH BUTTON */}

              <button
                onClick={handleSearch}
                className="
                  group flex items-center
                  justify-center gap-2
                  rounded-2xl
                  bg-linear-to-r
                  from-cyan-500 to-blue-600
                  px-8 py-5
                  text-lg font-semibold
                  text-white
                  shadow-2xl
                  transition duration-300
                  hover:scale-105
                "
              >

                <HiOutlineMagnifyingGlass className="h-6 w-6" />

                Search

              </button>

            </div>

          </div>

        </motion.div>

        {/* ================= TRENDING ================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
          }}
          viewport={{
            once: true,
          }}
          className="
            mt-10 flex flex-wrap
            items-center justify-center
            gap-4
          "
        >

          <div className="flex items-center gap-2 text-cyan-100">

            <HiOutlineArrowTrendingUp className="h-5 w-5" />

            <span className="font-medium">
              Trending:
            </span>

          </div>

          {trendingSearches.map((item) => (

            <button
              key={item}
              onClick={() =>
                handleTrendingSearch(item)
              }
              className="
                rounded-full border border-white/10
                bg-white/10
                px-5 py-2
                text-sm font-medium text-white
                backdrop-blur-xl
                transition duration-300
                hover:bg-white
                hover:text-slate-900
                hover:scale-105
              "
            >

              {item}

            </button>

          ))}

        </motion.div>

        {/* ================= CATEGORY BUTTONS ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="
            mt-16
            flex flex-wrap
            items-center justify-center
            gap-4
          "
        >

          {jobCategories.map((item, index) => (

            <motion.button
              key={item.name}
              whileHover={{
                y: -5,
                scale: 1.05,
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={() =>
                navigate(
                  `/jobs?category=${encodeURIComponent(item.name)}`
                )
              }
              className="
                group relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-white/10
                backdrop-blur-2xl
                w-[150px]
                h-[85px]
              "
            >

              {/* BG IMAGE */}

              <img
                src={item.image}
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                  transition duration-500
                  group-hover:scale-110
                "
              />

              {/* OVERLAY */}

              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition" />

              {/* CONTENT */}

              <div
                className="
                  relative z-10
                  flex h-full flex-col
                  items-center justify-center
                  text-center
                "
              >

                <h3 className="text-sm font-bold text-white">
                  {item.name}
                </h3>

                <p className="mt-1 text-[10px] text-slate-200">
                  Explore Jobs
                </p>

              </div>

            </motion.button>

          ))}

        </motion.div>

      </div>

    </section>
  );
};

export default SearchSection;