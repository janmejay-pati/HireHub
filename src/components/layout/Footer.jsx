import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";

import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";

const socialLinks = [
  {
    icon: FaLinkedinIn,
    link: "https://www.linkedin.com/",
  },
  {
    icon: FaXTwitter,
    link: "https://x.com/",
  },
  {
    icon: FaInstagram,
    link: "https://www.instagram.com/",
  },
  {
    icon: FaFacebookF,
    link: "https://www.facebook.com/",
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950 text-slate-300">

      {/* TOP SECTION */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-xl font-black text-white shadow-lg">
                H
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  HireHub
                </h2>

                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                  AI Job Portal
                </p>
              </div>

            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Smart AI-powered recruitment platform helping candidates
              find jobs and recruiters hire top talent faster.
            </p>

            {/* SOCIALS */}

            <div className="mt-6 flex items-center gap-3">

              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -4,
                    scale: 1.08,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400 transition hover:border-cyan-500 hover:text-cyan-400"
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}

            </div>

          </div>

          {/* LOCATION */}

          <div>

            <h3 className="text-lg font-bold text-white">
              Location
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-900 p-2">
                  <HiOutlineMapPin className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <p className="text-sm text-slate-300">
                    Bhubaneswar, Odisha
                  </p>

                  <p className="text-xs text-slate-500">
                    India
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="text-lg font-bold text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-900 p-2">
                  <HiOutlinePhone className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm text-slate-300">
                    +91 9876543210
                  </p>

                  <p className="text-xs text-slate-500">
                    Mon - Sat
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-900 p-2">
                  <HiOutlineEnvelope className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <p className="text-sm text-slate-300">
                    support@hirehub.com
                  </p>

                  <p className="text-xs text-slate-500">
                    24/7 Support
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h3 className="text-lg font-bold text-white">
              Quick Links
            </h3>

            <div className="mt-5 space-y-3">

              {[
                {
                  name: "Browse Jobs",
                  path: "/jobs",
                },
                {
                  name: "Companies",
                  path: "/companies",
                },
                {
                  name: "About",
                  path: "/about",
                },
                {
                  name: "Support",
                  path: "/support",
                },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-sm text-slate-400 transition hover:text-cyan-400"
                >
                  {item.name}
                </Link>
              ))}

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row">

          <p>
            © 2026 HireHub. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <Link
              to="/privacy"
              className="transition hover:text-cyan-400"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-cyan-400"
            >
              Terms
            </Link>

            <Link
              to="/support"
              className="transition hover:text-cyan-400"
            >
              Support
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;