import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineCog6Tooth,
  HiOutlineEyeSlash,
  HiOutlineMoon,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import ThemeToggle from "../../components/common/ThemeToggle";

const Settings = () => {

  const [activeTab, setActiveTab] =
    useState("account");

  const [saved, setSaved] =
    useState(false);

  const defaultSettings = {
    profile: {
      email: "",
      phone: "",
      language: "English",
    },

    notifications: {
      jobRecommendations: true,
      applicationUpdates: true,
      interviewReminders: true,
    },

    privacy: {
      showEmail: false,
      showPhone: false,
      allowMessages: true,
    },

    appearance: {
      darkMode: true,
    },
  };

  const [settings, setSettings] =
    useState(defaultSettings);

  /* LOAD */

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(
        "candidateSettings"
      );

    if (savedSettings) {
      setSettings(
        JSON.parse(savedSettings)
      );
    }
  }, []);

  /* SAVE */

  const saveSettings = () => {
    localStorage.setItem(
      "candidateSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  /* TOGGLE */

  const handleToggle = (
    section,
    key
  ) => {
    const updated = {
      ...settings,

      [section]: {
        ...settings[section],

        [key]:
          !settings[section][key],
      },
    };

    setSettings(updated);

    localStorage.setItem(
      "candidateSettings",
      JSON.stringify(updated)
    );
  };

  /* INPUT CHANGE */

  const handleInput = (
    section,
    key,
    value
  ) => {
    setSettings({
      ...settings,

      [section]: {
        ...settings[section],

        [key]: value,
      },
    });
  };

  const tabs = [
    {
      id: "account",
      label: "Account",
      icon: HiOutlineUser,
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: HiOutlineBell,
    },

    {
      id: "privacy",
      label: "Privacy",
      icon: HiOutlineEyeSlash,
    },

    {
      id: "appearance",
      label: "Appearance",
      icon: HiOutlineMoon,
    },
  ];

  const Toggle = ({
    enabled,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className={`relative h-8 w-16 rounded-full transition-all duration-300 ${
        enabled
          ? "bg-cyan-500"
          : "bg-slate-700"
      }`}
    >
      <motion.div
        animate={{
          x: enabled ? 32 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg"
      />
    </button>
  );

  return (
    <div className="relative min-h-screen space-y-8 text-white">

      {/* BG */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute right-0 top-0 h-87.5 w-[350px] rounded-full bg-violet-500/10 blur-[120px]" />

        <div className="absolute bottom-0 left-1/3 h-75 w-75 rounded-full bg-blue-500/10 blur-[120px]" />

      </div>

      {/* HERO */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="
        relative overflow-hidden
        rounded-3xl
        border border-white/10
        bg-linear-to-br
        from-cyan-500
        via-blue-600
        to-slate-900
        p-10
        shadow-2xl
      "
      >

        <div className="relative z-10">

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black">Settings ⚙️</h1>
              <p className="mt-4 max-w-2xl text-lg text-cyan-50">Manage account, notifications, privacy and appearance with modern UI.</p>
            </div>

            <div>
              <ThemeToggle />
            </div>
          </div>

        </div>

      </motion.div>

      {/* SAVE MESSAGE */}

      <AnimatePresence>

        {saved && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
            }}

            className="
            flex items-center gap-3
            rounded-2xl
            border border-emerald-500/20
            bg-emerald-500/10
            p-4
            text-emerald-400
          "
          >

            <HiOutlineCheckCircle className="h-6 w-6" />

            Settings saved successfully

          </motion.div>
        )}

      </AnimatePresence>

      {/* TABS */}

      <div className="flex flex-wrap gap-4">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}

              whileHover={{
                y: -4,
                scale: 1.03,
              }}

              whileTap={{
                scale: 0.96,
              }}

              onClick={() =>
                setActiveTab(tab.id)
              }

              className={`flex items-center gap-3 rounded-2xl px-6 py-4 font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30"
                  : "bg-slate-900/50 hover:bg-slate-800"
              }`}
            >

              <Icon className="h-5 w-5" />

              {tab.label}

            </motion.button>
          );
        })}

      </div>

      {/* ACCOUNT */}

      {activeTab === "account" && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
          rounded-4xl
          border border-white/10
          bg-white/[0.03]
          p-8
          backdrop-blur-3xl
        "
        >

          <h2 className="mb-8 text-3xl font-black">
            Account Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-3 block text-sm text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                value={
                  settings.profile.email
                }

                onChange={(e) =>
                  handleInput(
                    "profile",
                    "email",
                    e.target.value
                  )
                }

                className="
                w-full rounded-2xl
                border border-white/10
                bg-slate-900/60
                px-5 py-4
                text-white
                outline-none
                transition-all
                duration-300
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/20
              "
                placeholder="Enter email"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm text-slate-300">
                Phone Number
              </label>

              <input
                type="text"
                value={
                  settings.profile.phone
                }

                onChange={(e) =>
                  handleInput(
                    "profile",
                    "phone",
                    e.target.value
                  )
                }

                className="
                w-full rounded-2xl
                border border-white/10
                bg-slate-900/60
                px-5 py-4
                text-white
                outline-none
                transition-all
                duration-300
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/20
              "
                placeholder="Enter phone"
              />

            </div>

          </div>

          <div className="mt-6">

            <label className="mb-3 block text-sm text-slate-300">
              Language
            </label>

            <select
              value={
                settings.profile.language
              }

              onChange={(e) =>
                handleInput(
                  "profile",
                  "language",
                  e.target.value
                )
              }

              className="
              w-full rounded-2xl
              border border-white/10
              bg-slate-900/60
              px-5 py-4
              text-white
              outline-none
              transition-all
              duration-300
              focus:border-cyan-500
              focus:ring-4
              focus:ring-cyan-500/20
            "
            >

              <option>
                🇺🇸 English
              </option>

              <option>
                🇮🇳 Hindi
              </option>

              <option>
                🇮🇳 Odia
              </option>

              <option>
                🇪🇸 Spanish
              </option>

              <option>
                🇫🇷 French
              </option>

              <option>
                🇩🇪 German
              </option>

              <option>
                🇯🇵 Japanese
              </option>

            </select>

          </div>

          <button
            onClick={saveSettings}
            className="
            mt-8 w-full rounded-2xl
            bg-linear-to-r
            from-cyan-500
            to-blue-600
            py-4 font-bold
            shadow-xl shadow-cyan-500/20
            transition-all duration-300
            hover:scale-[1.02]
          "
          >
            Save Account Settings
          </button>

        </motion.div>
      )}

      {/* NOTIFICATIONS */}

      {activeTab ===
        "notifications" && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
          space-y-5
          rounded-4xl
          border border-white/10
          bg-white/[0.03]
          p-8
          backdrop-blur-3xl
        "
        >

          <h2 className="text-3xl font-black">
            Notifications
          </h2>

          {[
            "jobRecommendations",
            "applicationUpdates",
            "interviewReminders",
          ].map((item) => (
            <div
              key={item}
              className="
              flex items-center justify-between
              rounded-2xl
              border border-white/5
              bg-slate-900/40
              p-5
            "
            >

              <div>

                <h3 className="font-semibold capitalize">
                  {item.replace(
                    /([A-Z])/g,
                    " $1"
                  )}
                </h3>

              </div>

              <Toggle
                enabled={
                  settings
                    .notifications[item]
                }

                onClick={() =>
                  handleToggle(
                    "notifications",
                    item
                  )
                }
              />

            </div>
          ))}

        </motion.div>
      )}

      {/* PRIVACY */}

      {activeTab === "privacy" && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
          space-y-5
          rounded-4xl
          border border-white/10
          bg-white/[0.03]
          p-8
          backdrop-blur-3xl
        "
        >

          <h2 className="text-3xl font-black">
            Privacy
          </h2>

          {[
            "showEmail",
            "showPhone",
            "allowMessages",
          ].map((item) => (
            <div
              key={item}
              className="
              flex items-center justify-between
              rounded-2xl
              border border-white/5
              bg-slate-900/40
              p-5
            "
            >

              <h3 className="font-semibold capitalize">
                {item.replace(
                  /([A-Z])/g,
                  " $1"
                )}
              </h3>

              <Toggle
                enabled={
                  settings.privacy[item]
                }

                onClick={() =>
                  handleToggle(
                    "privacy",
                    item
                  )
                }
              />

            </div>
          ))}

        </motion.div>
      )}

    </div>
  );
};

export default Settings;