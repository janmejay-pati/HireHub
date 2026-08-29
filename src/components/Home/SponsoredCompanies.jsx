import { useEffect, useRef, useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  HiOutlineSparkles,
  HiOutlineCheckBadge,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineXMark,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";

import { useNavigate } from "react-router-dom";

const sponsors = [
  {
    name: "Google",

    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",

    jobs: "245 Jobs",

    openings: [
      {
        title:
          "Frontend Developer",

        location:
          "California, USA",

        salary:
          "$120k - $160k",
      },

      {
        title:
          "AI Engineer",

        location:
          "Remote",

        salary:
          "$150k - $220k",
      },

      {
        title:
          "Backend Developer",

        location:
          "New York, USA",

        salary:
          "$130k - $170k",
      },
    ],
  },

  {
    name: "Microsoft",

    logo:
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",

    jobs: "180 Jobs",

    openings: [
      {
        title:
          "Cloud Engineer",

        location:
          "Seattle, USA",

        salary:
          "$110k - $180k",
      },

      {
        title:
          "React Developer",

        location:
          "Remote",

        salary:
          "$100k - $150k",
      },

      {
        title:
          "Data Scientist",

        location:
          "India",

        salary:
          "$90k - $140k",
      },
    ],
  },

  {
    name: "Amazon",

    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",

    jobs: "320 Jobs",

    openings: [
      {
        title:
          "DevOps Engineer",

        location:
          "Texas, USA",

        salary:
          "$120k - $180k",
      },

      {
        title:
          "Java Developer",

        location:
          "India",

        salary:
          "$80k - $130k",
      },

      {
        title:
          "System Architect",

        location:
          "Remote",

        salary:
          "$150k - $230k",
      },
    ],
  },

  {
    name: "Netflix",

    logo:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",

    jobs: "95 Jobs",

    openings: [
      {
        title:
          "UI/UX Designer",

        location:
          "California, USA",

        salary:
          "$100k - $160k",
      },

      {
        title:
          "Motion Designer",

        location:
          "Remote",

        salary:
          "$90k - $140k",
      },
    ],
  },

  {
    name: "Apple",

    logo:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",

    jobs: "140 Jobs",

    openings: [
      {
        title:
          "iOS Developer",

        location:
          "California, USA",

        salary:
          "$140k - $200k",
      },

      {
        title:
          "Product Engineer",

        location:
          "Remote",

        salary:
          "$130k - $180k",
      },
    ],
  },

  {
    name: "Infosys",

    logo:
      "https://cdn.worldvectorlogo.com/logos/infosys-1.svg",

    jobs: "210 Jobs",

    openings: [
      {
        title:
          "Software Engineer",

        location:
          "Bangalore, India",

        salary:
          "$30k - $60k",
      },

      {
        title:
          "Python Developer",

        location:
          "Hyderabad, India",

        salary:
          "$35k - $70k",
      },
    ],
  },
];

const SponsoredCompanies = () => {
  const sliderRef = useRef(null);

  const navigate = useNavigate();

  const [
    selectedCompany,
    setSelectedCompany,
  ] = useState(null);

  /* AUTO SLIDE */

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    let animationFrame;

    const autoSlide = () => {
      slider.scrollLeft += 1;

      if (
        slider.scrollLeft >=
        slider.scrollWidth / 2
      ) {
        slider.scrollLeft = 0;
      }

      animationFrame =
        requestAnimationFrame(
          autoSlide
        );
    };

    animationFrame =
      requestAnimationFrame(
        autoSlide
      );

    return () =>
      cancelAnimationFrame(
        animationFrame
      );
  }, []);

  /* MANUAL SLIDE */

  const slideLeft = () => {
    sliderRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  /* APPLY FUNCTION */

  const handleApply = (
    company,
    job
  ) => {
    const isLoggedIn =
      localStorage.getItem("token");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate(
      "/candidate/apply/preview",
      {
        state: {
          jobId: `preview-${company.name}-${job.title}`,
          company: company.name,
          jobTitle: job.title,
          location: job.location,
          salary: job.salary,
          jobType: "Full Time",
          experienceLevel: "Mid Level",
          description: `Apply for ${job.title} at ${company.name}.`,
          postedBy: "recruiter-unknown",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          requirements: [],
        },
      }
    );
  };

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-20">

        {/* BACKGROUND */}

        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-3xl"></div>

        {/* GRID */}

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HEADER */}

          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 backdrop-blur-xl">

                <HiOutlineSparkles className="h-5 w-5" />

                Sponsored Companies

              </div>

              <h2 className="mt-6 text-4xl font-black text-white sm:text-5xl">

                Premium Companies

                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

                  {" "}
                  Hiring Now

                </span>

              </h2>

            </div>

            {/* MANUAL BUTTONS */}

            <div className="flex items-center gap-4">

              <button
                onClick={
                  slideLeft
                }
                className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  text-white
                  backdrop-blur-xl
                  transition hover:bg-white/10
                "
              >
                <HiOutlineArrowLeft className="h-6 w-6" />
              </button>

              <button
                onClick={
                  slideRight
                }
                className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-linear-to-r
                  from-cyan-500
                  to-blue-600
                  text-white
                  shadow-xl
                  shadow-cyan-500/20
                "
              >
                <HiOutlineArrowRight className="h-6 w-6" />
              </button>

            </div>

          </div>

          {/* SLIDER */}

          <div
            ref={sliderRef}
            className="
              no-scrollbar
              overflow-x-auto
              scroll-smooth
            "
          >

            <div className="flex gap-6 py-4">

              {[
                ...sponsors,
                ...sponsors,
              ].map(
                (
                  company,
                  index
                ) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      y: -10,
                      scale: 1.03,
                    }}
                    className="
                      group relative
                      min-w-[290px]
                      overflow-hidden
                      rounded-4xl
                      border border-white/10
                      bg-white/[0.05]
                      p-6
                      shadow-2xl
                      backdrop-blur-2xl
                    "
                  >

                    {/* GLOW */}

                    <div className="absolute inset-0 bg-linear-to-br from-cyan-500/0 via-blue-500/0 to-violet-500/0 opacity-0 transition duration-500 group-hover:opacity-100 group-hover:from-cyan-500/10 group-hover:via-blue-500/5 group-hover:to-violet-500/10"></div>

                    {/* TOP */}

                    <div className="relative flex items-center justify-between">

                      <div className="
                        flex h-16 w-16
                        items-center justify-center
                        rounded-2xl
                        bg-white
                        p-3 shadow-xl
                      ">

                        <img
                          src={
                            company.logo
                          }
                          alt={
                            company.name
                          }
                          className="h-10 object-contain"
                        />

                      </div>

                      <div className="
                        flex items-center gap-1
                        rounded-full
                        bg-emerald-500/10
                        px-3 py-1
                        text-xs font-semibold
                        text-emerald-400
                      ">

                        <HiOutlineCheckBadge className="h-4 w-4" />

                        Verified

                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="relative mt-6">

                      <h3 className="
                        text-2xl font-black
                        text-white
                      ">
                        {company.name}
                      </h3>

                      <p className="
                        mt-2 text-sm
                        text-slate-400
                      ">
                        Premium hiring partner
                      </p>

                      <div className="
                        mt-6 flex items-center
                        justify-between
                      ">

                        <div>

                          <p className="
                            text-sm text-slate-500
                          ">
                            Open Positions
                          </p>

                          <h4 className="
                            mt-1 text-xl
                            font-bold text-cyan-400
                          ">
                            {company.jobs}
                          </h4>

                        </div>

                        <button
                          onClick={() =>
                            setSelectedCompany(
                              company
                            )
                          }
                          className="
                            rounded-2xl
                            bg-linear-to-r
                            from-cyan-500
                            to-blue-600
                            px-5 py-3
                            text-sm font-semibold
                            text-white
                            shadow-lg
                            shadow-cyan-500/20
                            transition duration-300
                            hover:scale-105
                          "
                        >
                          View Jobs
                        </button>

                      </div>

                    </div>

                  </motion.div>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* MODAL */}

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
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/70
              p-4
              backdrop-blur-md
            "
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
              className="
                relative w-full
                max-w-3xl
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-slate-900
                shadow-[0_30px_120px_rgba(0,0,0,0.5)]
              "
            >

              {/* HEADER */}

              <div className="
                flex items-center
                justify-between
                border-b border-white/10
                p-8
              ">

                <div className="flex items-center gap-5">

                  <div className="
                    flex h-20 w-20
                    items-center justify-center
                    rounded-3xl
                    bg-white p-4
                  ">

                    <img
                      src={
                        selectedCompany.logo
                      }
                      alt=""
                      className="h-12 object-contain"
                    />

                  </div>

                  <div>

                    <h2 className="
                      text-4xl
                      font-black
                      text-white
                    ">
                      {
                        selectedCompany.name
                      }
                    </h2>

                    <p className="
                      mt-2 text-slate-400
                    ">
                      Available Jobs
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    setSelectedCompany(
                      null
                    )
                  }
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-white/10
                    text-white
                  "
                >
                  <HiOutlineXMark className="h-7 w-7" />
                </button>

              </div>

              {/* JOBS */}

              <div className="
                max-h-125
                overflow-y-auto
                p-8
              ">

                <div className="space-y-5">

                  {selectedCompany.openings.map(
                    (
                      job,
                      index
                    ) => (
                      <motion.div
                        key={index}
                        whileHover={{
                          y: -4,
                        }}
                        className="
                          rounded-4xl
                          border border-white/10
                          bg-white/[0.04]
                          p-6
                        "
                      >

                        <div className="
                          flex flex-col gap-5
                          lg:flex-row
                          lg:items-center
                          lg:justify-between
                        ">

                          <div>

                            <div className="
                              flex items-center gap-3
                            ">

                              <div className="
                                flex h-12 w-12
                                items-center justify-center
                                rounded-2xl
                                bg-cyan-500/10
                                text-cyan-400
                              ">

                                <HiOutlineBriefcase className="h-6 w-6" />

                              </div>

                              <div>

                                <h3 className="
                                  text-2xl
                                  font-bold
                                  text-white
                                ">
                                  {job.title}
                                </h3>

                                <div className="
                                  mt-2 flex flex-wrap
                                  items-center gap-4
                                  text-sm text-slate-400
                                ">

                                  <span className="flex items-center gap-1">

                                    <HiOutlineMapPin className="h-4 w-4" />

                                    {
                                      job.location
                                    }

                                  </span>

                                  <span className="flex items-center gap-1">

                                    <HiOutlineCurrencyDollar className="h-4 w-4" />

                                    {
                                      job.salary
                                    }

                                  </span>

                                </div>

                              </div>

                            </div>

                          </div>

                          {/* APPLY BUTTON */}

                          <button
                            onClick={() =>
                              handleApply(
                                selectedCompany,
                                job
                              )
                            }
                            className="
                              group
                              rounded-2xl
                              bg-linear-to-r
                              from-cyan-500
                              via-blue-500
                              to-indigo-600
                              px-6 py-4
                              font-semibold
                              text-white
                              shadow-xl
                              shadow-cyan-500/20
                              transition-all
                              duration-300
                              hover:scale-105
                              hover:shadow-cyan-500/40
                            "
                          >
                            <span className="flex items-center gap-2">

                              Apply Now

                              <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

                            </span>
                          </button>

                        </div>

                      </motion.div>
                    )
                  )}

                </div>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
};

export default SponsoredCompanies;