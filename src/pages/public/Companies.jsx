import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
  HiOutlineCheckBadge,
} from "react-icons/hi2";

import { companyService } from "../../services/company_service";
import { jobService } from "../../services/jobService";

const { DEFAULT_BANNER } = companyService;

const handleImageError = (event, fallback = DEFAULT_BANNER) => {
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback;
  }
};

const dropdownOptions = {
  type: ["All", "MNC", "IT", "Remote", "Startup"],
  industry: ["All", "IT", "Software", "Cloud", "E-Commerce", "Music Tech", "Technology"],
  experience: ["All", "Fresher", "Entry Level", "Mid Level", "Senior Level"],
  department: ["All", "Development", "Testing", "Cloud", "Design", "Support", "Operations"],
  business: ["All", "Product Based", "Service Based"],
  location: ["All", "Bangalore", "Hyderabad", "Pune", "Bhubaneswar", "Chennai", "Noida", "Remote"],
};

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "All",
    industry: searchParams.get("industry") || "All",
    experience: searchParams.get("experience") || "All",
    department: searchParams.get("department") || "All",
    business: searchParams.get("business") || "All",
    location: searchParams.get("location") || "All",
  });

  const loadCompanies = useCallback(() => {
    setCompanies(companyService.getPublicCompanies());
  }, []);

  useEffect(() => {
    loadCompanies();

    const reloadCompanies = () => loadCompanies();
    window.addEventListener("storage", reloadCompanies);
    window.addEventListener("companies-updated", reloadCompanies);

    return () => {
      window.removeEventListener("storage", reloadCompanies);
      window.removeEventListener("companies-updated", reloadCompanies);
    };
  }, [loadCompanies]);

  useEffect(() => {
    setFilters({
      type: searchParams.get("type") || "All",
      industry: searchParams.get("industry") || "All",
      experience: searchParams.get("experience") || "All",
      department: searchParams.get("department") || "All",
      business: searchParams.get("business") || "All",
      location: searchParams.get("location") || "All",
    });
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  const syncParams = useCallback(
    (nextFilters, nextSearch = searchText) => {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextFilters.type !== "All") params.set("type", nextFilters.type);
      if (nextFilters.industry !== "All") params.set("industry", nextFilters.industry);
      if (nextFilters.experience !== "All") params.set("experience", nextFilters.experience);
      if (nextFilters.department !== "All") params.set("department", nextFilters.department);
      if (nextFilters.business !== "All") params.set("business", nextFilters.business);
      if (nextFilters.location !== "All") params.set("location", nextFilters.location);

      const nextString = params.toString();
      if (nextString !== searchParams.toString()) {
        setSearchParams(params, { replace: true });
      }
    },
    [searchText, searchParams, setSearchParams]
  );

  useEffect(() => {
    const timeout = setTimeout(() => syncParams(filters, searchText), 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleFilter = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    syncParams(nextFilters, searchText);
  };

  const filteredCompanies = useMemo(() => {
    return companyService.getPublicCompanies({
      ...filters,
      search: searchText,
    });
  }, [filters, searchText, companies]);

  const companyJobs = useMemo(() => {
    if (!selectedCompany) return [];
    return jobService
      .getPublicJobs()
      .filter(
        (job) =>
          String(job.company || "").toLowerCase() ===
          String(selectedCompany.name || "").toLowerCase()
      );
  }, [selectedCompany]);

  const heroSlides =
    filteredCompanies.length > 0
      ? filteredCompanies
      : [{ id: "fallback", name: "Companies", image: DEFAULT_BANNER, logo: DEFAULT_BANNER }];

  return (
    <section className="min-h-screen bg-(--bg)">
      <div className="relative h-96 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex h-full w-max"
        >
          {[...heroSlides, ...heroSlides].map((c, i) => (
            <img
              key={`${c.id}-${i}`}
              src={c.image}
              alt={c.name}
              className="h-96 w-screen shrink-0 object-cover"
              onError={(e) => handleImageError(e, c.image)}
            />
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            <HiOutlineSparkles className="mr-1 inline" />
            Explore Companies
          </div>

          <h1 className="mt-6 text-5xl font-black text-(--text)">
            Dream <span className="text-cyan-400">Companies</span>
          </h1>

          <div className="mt-6 flex w-full max-w-xl items-center gap-3 rounded-2xl bg-(--surface) p-4 backdrop-blur-xl">
            <HiOutlineMagnifyingGlass className="text-(--text)" />
            <input
              className="w-full bg-transparent text-(--text) outline-none placeholder:text-(--muted)"
              placeholder="Search companies..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row">
        <div className="hidden w-full space-y-5 lg:block lg:w-72">
          {Object.entries(dropdownOptions).map(([key, values]) => (
            <div key={key}>
              <p className="mb-2 capitalize text-(--muted)">{key}</p>
              <select
                value={filters[key]}
                onChange={(e) => handleFilter(key, e.target.value)}
                className="hover-glow"
              >
                {values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="mb-6 flex justify-between">
            <h2 className="text-2xl font-bold text-(--text)">Companies</h2>
            <span className="text-cyan-300">{filteredCompanies.length} Found</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => setSelectedCompany(company)}
                className="card-hover-glow w-full max-w-[280px] cursor-pointer overflow-hidden rounded-2xl border border-(--border) bg-(--surface) backdrop-blur-xl"
              >
                <div className="relative h-28 overflow-hidden bg-slate-800">
                  <img
                    src={company.image}
                    alt={company.name}
                    className="h-full w-full object-cover"
                    onError={(e) => handleImageError(e, company.image)}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-10 w-10 rounded-xl bg-white object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.src = companyService.buildLogoUrl(company.name);
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-(--text)">{company.name}</h3>
                      <p className="flex items-center gap-1 text-xs text-emerald-400">
                        <HiOutlineCheckBadge />
                        {company.verified ? "Verified" : company.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-(--muted)">
                    <p>{company.location}</p>
                    <p>{company.jobs}</p>
                    <p>{company.employees}</p>
                  </div>

                  <button className="hover-glow mt-4 w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-2 text-sm text-white">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {selectedCompany && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setSelectedCompany(null)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[90%] max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6"
          >
            <div className="flex items-center gap-3">
              <img
                src={selectedCompany.logo}
                alt={selectedCompany.name}
                className="h-12 w-12 rounded-xl bg-white object-contain p-1"
                onError={(e) => {
                  e.currentTarget.src = companyService.buildLogoUrl(selectedCompany.name);
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCompany.name}</h2>
                <p className="text-sm text-slate-400">{selectedCompany.location}</p>
              </div>
            </div>

            {selectedCompany.description && (
              <p className="mt-4 text-sm text-slate-400">{selectedCompany.description}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <p>Type: {selectedCompany.type}</p>
              <p>Industry: {selectedCompany.industry}</p>
              <p>Department: {selectedCompany.department}</p>
              <p>Business: {selectedCompany.business}</p>
              <p>Employees: {selectedCompany.employees}</p>
              <p>Jobs: {selectedCompany.jobs}</p>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-semibold text-white">Open Vacancies</h3>
              <div className="max-h-60 space-y-2 overflow-auto pr-2">
                {companyJobs.length > 0 ? (
                  companyJobs.map((job) => (
                    <div
                      key={job._id || job.id}
                      className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm text-slate-200"
                    >
                      <span>{job.title}</span>
                      <span className="text-xs text-cyan-400">{job.location}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No open roles listed yet.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedCompany(null)}
              className="mt-6 w-full rounded-xl bg-red-500/10 py-2 text-red-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Companies;
