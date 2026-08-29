// EventsSection.jsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineTicket,
  HiOutlineFire,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineClock,
  HiOutlineBriefcase,
} from "react-icons/hi2";

const events = [
  {
    id: 1,
    title: "AI Hiring Summit",
    company: "HireHub AI",
    date: "12 June 2026",
    time: "10:00 AM",
    location: "Bangalore",
    attendees: "2.5k+",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    tag: "Trending",
    mode: "Offline",
    about:
      "Join AI leaders, recruiters and engineers discussing the future of AI hiring and talent.",
    gradient: "from-cyan-500 to-blue-600",
  },

  {
    id: 2,
    title: "Frontend Challenge",
    company: "Google",
    date: "18 June 2026",
    time: "11:30 AM",
    location: "Remote",
    attendees: "8k+",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    tag: "Hackathon",
    mode: "Online",
    about:
      "Compete with developers worldwide in a frontend engineering challenge.",
    gradient: "from-violet-500 to-fuchsia-600",
  },

  {
    id: 3,
    title: "Startup Career Fair",
    company: "Startup India",
    date: "25 June 2026",
    time: "09:00 AM",
    location: "Hyderabad",
    attendees: "5k+",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    tag: "Career Fair",
    mode: "Offline",
    about:
      "Meet top startups and explore career opportunities with growing companies.",
    gradient: "from-emerald-500 to-green-600",
  },

  {
    id: 4,
    title: "Cloud Bootcamp",
    company: "Microsoft",
    date: "28 June 2026",
    time: "02:00 PM",
    location: "Delhi",
    attendees: "3k+",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    tag: "Workshop",
    mode: "Offline",
    about:
      "Hands-on cloud deployment and Azure architecture bootcamp.",
    gradient: "from-orange-500 to-red-500",
  },

  {
    id: 5,
    title: "Design Masters",
    company: "Adobe",
    date: "1 July 2026",
    time: "05:00 PM",
    location: "Mumbai",
    attendees: "1.2k+",
    image:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200&auto=format&fit=crop",
    tag: "UI/UX",
    mode: "Offline",
    about:
      "Master modern UI/UX workflows with top designers from Adobe.",
    gradient: "from-pink-500 to-rose-600",
  },

  {
    id: 6,
    title: "DevOps Meetup",
    company: "Netflix",
    date: "5 July 2026",
    time: "07:00 PM",
    location: "Pune",
    attendees: "4k+",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    tag: "Live",
    mode: "Offline",
    about:
      "Explore modern CI/CD pipelines and scalable infrastructure systems.",
    gradient: "from-sky-500 to-cyan-600",
  },

  {
    id: 7,
    title: "AI Workshop",
    company: "OpenAI",
    date: "10 July 2026",
    time: "04:30 PM",
    location: "Remote",
    attendees: "10k+",
    image:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1200&auto=format&fit=crop",
    tag: "AI",
    mode: "Online",
    about:
      "Deep dive into modern AI tools, LLMs and machine learning systems.",
    gradient: "from-indigo-500 to-purple-600",
  },

  {
    id: 8,
    title: "Tech Networking",
    company: "Amazon",
    date: "15 July 2026",
    time: "06:00 PM",
    location: "Chennai",
    attendees: "6k+",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    tag: "Networking",
    mode: "Offline",
    about:
      "Connect with recruiters, engineers and tech founders worldwide.",
    gradient: "from-yellow-500 to-orange-600",
  },

  {
    id: 9,
    title: "Cyber Security Expo",
    company: "Cisco",
    date: "20 July 2026",
    time: "12:00 PM",
    location: "Kolkata",
    attendees: "2k+",
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200&auto=format&fit=crop",
    tag: "Security",
    mode: "Offline",
    about:
      "Learn advanced security trends and enterprise protection systems.",
    gradient: "from-red-500 to-rose-600",
  },

  {
    id: 10,
    title: "React Native Summit",
    company: "Meta",
    date: "22 July 2026",
    time: "01:00 PM",
    location: "Remote",
    attendees: "7k+",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    tag: "Mobile",
    mode: "Online",
    about:
      "Build high performance mobile apps with React Native experts.",
    gradient: "from-blue-500 to-indigo-600",
  },
];

const EventsSection = () => {
  const navigate = useNavigate();

  const sliderRef = useRef(null);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  // AUTO SLIDE

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
    }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  // MANUAL SLIDE

  const scroll = (dir) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left:
        dir === "left"
          ? -280
          : 280,
      behavior: "smooth",
    });
  };

  // WHATSAPP REGISTER

  const handleRegister = (
    event
  ) => {
    const phone =
      "916370315367";

    const message = `Hello Admin,
I want to register for the event:

🎯 Event: ${event.title}
🏢 Company: ${event.company}
📍 Location: ${event.location}
📅 Date: ${event.date}

Please share further details.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(
      whatsappUrl,
      "_blank"
    );
  };

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-100 py-20">

        {/* BG */}

        <div className="absolute left-0 top-0 h-87.5 w-[350px] rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-87.5 w-[350px] rounded-full bg-violet-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">

          {/* HEADER */}

          <div className="mb-10 flex items-center justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">

                <HiOutlineSparkles />

                Events & Challenges

              </div>

              <h2 className="mt-5 text-4xl font-black text-slate-900">

                Premium Tech Events

              </h2>

            </div>

            {/* BUTTONS */}

            <div className="hidden gap-3 md:flex">

              <button
                onClick={() =>
                  scroll("left")
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:bg-slate-900 hover:text-white"
              >

                <HiOutlineChevronLeft />

              </button>

              <button
                onClick={() =>
                  scroll("right")
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:bg-slate-900 hover:text-white"
              >

                <HiOutlineChevronRight />

              </button>

            </div>

          </div>

          {/* SLIDER */}

          <div
            ref={sliderRef}
            className="no-scrollbar flex gap-5 overflow-x-auto pb-4 scroll-smooth"
          >

            {events.map(
              (
                event,
                index
              ) => (
                <motion.div
                  key={event.id}
                  initial={{
                    opacity: 0,
                    x: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.04,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                  className="group relative h-85 min-w-[260px] cursor-pointer overflow-hidden rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                >

                  {/* FULL IMAGE */}

                  <img
                    src={
                      event.image
                    }
                    alt={
                      event.title
                    }
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* OVERLAY */}

                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />

                  {/* TOP */}

                  <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between">

                    <div
                      className={`rounded-full bg-linear-to-r ${event.gradient} px-3 py-1 text-xs font-bold text-white`}
                    >

                      {event.tag}

                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-xl">

                      <HiOutlineUsers />

                      {
                        event.attendees
                      }

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="absolute bottom-0 left-0 z-10 w-full p-5">

                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-xl">

                      <HiOutlineBriefcase />

                      {event.company}

                    </div>

                    <h3 className="text-2xl font-black text-white">

                      {event.title}

                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-white/90">

                      <div className="flex items-center gap-2">

                        <HiOutlineCalendarDays />

                        {event.date}

                      </div>

                      <div className="flex items-center gap-2">

                        <HiOutlineMapPin />

                        {
                          event.location
                        }

                      </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-5 flex gap-3">

                      <button
                        onClick={() =>
                          setSelectedEvent(
                            event
                          )
                        }
                        className="flex-1 rounded-xl bg-white/15 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/25"
                      >

                        View

                      </button>

                      <button
                        onClick={() =>
                          handleRegister(
                            event
                          )
                        }
                        className={`flex-1 rounded-xl bg-linear-to-r ${event.gradient} py-3 text-sm font-semibold text-white`}
                      >

                        Register

                      </button>

                    </div>

                  </div>

                </motion.div>
              )
            )}

          </div>

        </div>

      </section>

      {/* POPUP */}

      <AnimatePresence>

        {selectedEvent && (

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
                  setSelectedEvent(
                    null
                  )
                }
                className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xl transition hover:rotate-90"
              >

                <HiOutlineXMark className="h-5 w-5 text-slate-700" />

              </button>

              {/* IMAGE */}

              <div className="relative h-[280px]">

                <img
                  src={
                    selectedEvent.image
                  }
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-6 left-6">

                  <div
                    className={`mb-3 inline-flex rounded-full bg-linear-to-r ${selectedEvent.gradient} px-4 py-2 text-sm font-bold text-white`}
                  >

                    {
                      selectedEvent.tag
                    }

                  </div>

                  <h2 className="text-4xl font-black text-white">

                    {
                      selectedEvent.title
                    }

                  </h2>

                  <p className="mt-2 text-white/80">

                    {
                      selectedEvent.company
                    }

                  </p>

                </div>

              </div>

              {/* BODY */}

              <div className="p-7">

                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineCalendarDays className="h-6 w-6 text-cyan-500" />

                    <p className="mt-3 text-xs text-slate-500">

                      Date

                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">

                      {
                        selectedEvent.date
                      }

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineClock className="h-6 w-6 text-violet-500" />

                    <p className="mt-3 text-xs text-slate-500">

                      Time

                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">

                      {
                        selectedEvent.time
                      }

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineMapPin className="h-6 w-6 text-rose-500" />

                    <p className="mt-3 text-xs text-slate-500">

                      Location

                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">

                      {
                        selectedEvent.location
                      }

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-slate-100 p-5">

                    <HiOutlineGlobeAsiaAustralia className="h-6 w-6 text-emerald-500" />

                    <p className="mt-3 text-xs text-slate-500">

                      Mode

                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">

                      {
                        selectedEvent.mode
                      }

                    </h3>

                  </div>

                </div>

                {/* ABOUT */}

                <div className="mt-7">

                  <h3 className="text-2xl font-black text-slate-900">

                    About Event

                  </h3>

                  <p className="mt-3 leading-8 text-slate-600">

                    {
                      selectedEvent.about
                    }

                  </p>

                </div>

                {/* FOOTER */}

                <div className="mt-8 flex gap-4">

                  <button
                    onClick={() =>
                      setSelectedEvent(
                        null
                      )
                    }
                    className="flex-1 rounded-2xl border border-slate-200 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
                  >

                    Close

                  </button>

                  <button
                    onClick={() =>
                      handleRegister(
                        selectedEvent
                      )
                    }
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r ${selectedEvent.gradient} py-4 font-semibold text-white`}
                  >

                    Register Now

                    <HiOutlineArrowRight className="h-5 w-5" />

                  </button>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
};

export default EventsSection;