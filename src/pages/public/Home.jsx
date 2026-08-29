// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   HiOutlineMagnifyingGlass,
//   HiOutlineSparkles,
//   HiOutlineBriefcase,
//   HiOutlineUserGroup,
//   HiOutlineBuildingOffice2
// } from "react-icons/hi2";
// import JobCard from "../../components/jobs/JobCard";

// const featuredJobs = [
//   {
//     _id: "job-1",
//     title: "Product Designer",
//     company: "Nimbus Labs",
//     location: "Remote",
//     jobType: "Full-time",
//     experienceLevel: "Mid",
//     description: "Design modern SaaS product experiences.",
//     deadline: new Date().toISOString()
//   },
//   {
//     _id: "job-2",
//     title: "Senior Backend Engineer",
//     company: "HireHub AI",
//     location: "New York",
//     jobType: "Full-time",
//     experienceLevel: "Senior",
//     description: "Build scalable AI-powered backend systems.",
//     deadline: new Date().toISOString()
//   }
// ];

// const stats = [
//   { label: "Jobs", value: "12K+", icon: HiOutlineBriefcase },
//   { label: "Candidates", value: "28K+", icon: HiOutlineUserGroup },
//   { label: "Companies", value: "1.8K", icon: HiOutlineBuildingOffice2 }
// ];

// const floatingJobs = [
//   {
//     title: "Frontend Developer",
//     company: "Google",
//     img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
//   },
//   {
//     title: "AI Engineer",
//     company: "OpenAI Startup",
//     img: "https://images.unsplash.com/photo-1551434678-e076c223a692"
//   },
//   {
//     title: "Backend Engineer",
//     company: "Amazon",
//     img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
//   }
// ];

// const Home = () => {
//   return (
//     <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-100">

//       {/* 🌈 BACKGROUND BLOBS */}
//       <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
//       <div className="absolute top-40 -right-40 h-125 w-125 rounded-full bg-purple-400/20 blur-3xl animate-pulse" />

//       {/* HERO SECTION */}
//       <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">

//         <div className="grid lg:grid-cols-2 gap-14 items-center">

//           {/* LEFT CONTENT */}
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold">
//                 <HiOutlineSparkles />
//                 AI-powered hiring platform
//               </div>

//               <h1 className="mt-6 text-5xl font-bold text-slate-900 leading-tight">
//                 Find your dream job
//                 <br />
//                 with AI precision
//               </h1>

//               <p className="mt-5 text-lg text-slate-600">
//                 Explore top companies, apply faster, and get matched with the best opportunities instantly.
//               </p>
//             </motion.div>

//             {/* SEARCH BAR */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="mt-8 flex gap-3 flex-col sm:flex-row"
//             >
//               <div className="flex items-center gap-3 bg-white border shadow-sm rounded-2xl px-5 py-4 w-full">
//                 <HiOutlineMagnifyingGlass className="text-cyan-500 text-xl" />
//                 <input
//                   placeholder="Search jobs, companies, skills..."
//                   className="w-full outline-none"
//                 />
//               </div>

//               <Link
//                 to="/jobs"
//                 className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-slate-800 transition"
//               >
//                 Search Jobs
//               </Link>
//             </motion.div>

//             {/* STATS */}
//             <div className="mt-10 grid grid-cols-3 gap-4">
//               {stats.map((s, i) => (
//                 <motion.div
//                   key={i}
//                   whileHover={{ scale: 1.05 }}
//                   className="bg-white shadow-md border rounded-2xl p-5 text-center"
//                 >
//                   <s.icon className="mx-auto text-cyan-500 text-2xl" />
//                   <p className="text-xl font-bold mt-2">{s.value}</p>
//                   <p className="text-sm text-slate-500">{s.label}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT SIDE - FLOATING UI + IMAGES */}
//           <div className="relative">

//             {/* MAIN IMAGE CARD */}
//             <motion.div
//               animate={{ y: [0, -10, 0] }}
//               transition={{ repeat: Infinity, duration: 4 }}
//               className="rounded-4xl overflow-hidden shadow-2xl"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
//                 className="h-[420px] w-full object-cover"
//               />
//             </motion.div>

//             {/* FLOATING CARDS */}
//             {floatingJobs.map((job, i) => (
//               <motion.div
//                 key={i}
//                 animate={{ y: [0, -12, 0] }}
//                 transition={{ repeat: Infinity, duration: 3 + i }}
//                 className={`absolute bg-white shadow-xl rounded-2xl p-4 border w-56 backdrop-blur-xl`}
//                 style={{
//                   top: `${20 + i * 120}px`,
//                   right: i % 2 === 0 ? "-20px" : "60px"
//                 }}
//               >
//                 <img
//                   src={job.img}
//                   className="h-20 w-full object-cover rounded-xl"
//                 />
//                 <p className="text-sm text-slate-500 mt-2">{job.company}</p>
//                 <h3 className="font-semibold">{job.title}</h3>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* FEATURED JOBS */}
//         <div className="mt-20 grid lg:grid-cols-2 gap-10">

//           <div className="bg-white rounded-3xl shadow-xl p-8">
//             <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>

//             <div className="space-y-5">
//               {featuredJobs.map((job, i) => (
//                 <motion.div
//                   key={job._id}
//                   initial={{ opacity: 0, x: -40 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.2 }}
//                 >
//                   <JobCard job={job} />
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT INFO */}
//           <div className="space-y-6">

//             <motion.div
//               whileHover={{ scale: 1.03 }}
//               className="bg-linear-to-br from-slate-900 to-slate-800 text-white p-10 rounded-3xl shadow-2xl"
//             >
//               <h3 className="text-xl font-bold">AI Smart Matching</h3>
//               <p className="text-slate-300 mt-3">
//                 We automatically match jobs based on your skills, experience, and activity.
//               </p>
//             </motion.div>

//             <motion.div
//               whileHover={{ scale: 1.03 }}
//               className="bg-white border p-10 rounded-3xl shadow-lg"
//             >
//               <h3 className="text-xl font-bold">Real-Time Hiring</h3>
//               <p className="text-slate-500 mt-3">
//                 Track applications, interviews, and hiring status in real-time.
//               </p>
//             </motion.div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };




import HeroSection from "../../components/Home/HeroSection";
import SearchSection from "../../components/Home/SearchSection";
import TopCompanies from "../../components/Home/TopCompanies";
import FeaturedJobs from "../../components/Home/FeaturedJobs";
import FeaturedCompanies from "../../components/Home/FeaturedCompanies";
import EventsSection from "../../components/Home/EventsSection";
import InterviewQuestions from "../../components/Home/InterviewQuestions";
import CareerGuidance from "../../components/Home/CareerGuidance";
import PopularCategories from "../../components/Home/PopularCategories";
import SponsoredCompanies from "../../components/Home/SponsoredCompanies";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <HeroSection />
      <SearchSection />
      <TopCompanies />
      <FeaturedCompanies />
      <SponsoredCompanies />
      <FeaturedJobs />
      <EventsSection />
      <InterviewQuestions />
      <CareerGuidance />
      <PopularCategories />
      <ScrollToTopButton />
    </div>
  );
};

export default Home;