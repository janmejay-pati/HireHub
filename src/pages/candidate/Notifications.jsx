import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services/notification_service";
import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineArrowRight,
  HiOutlineXMark,
  HiOutlineFire,
  HiOutlineClock,
} from "react-icons/hi2";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadNotifications = () => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    const data = notificationService.getAllNotifications(user.id) || [];

    const safeData = data.map((item) => {
      const safeCreatedAt =
        item.createdAt && !Number.isNaN(new Date(item.createdAt).getTime())
          ? item.createdAt
          : new Date().toISOString();

      return {
        ...item,
        createdAt: safeCreatedAt,
        date: safeCreatedAt,
        time:
          item.time && !String(item.time).includes("NaN")
            ? item.time
            : formatNotificationTime(safeCreatedAt),
        gradient: item.gradient || "from-cyan-500 to-blue-600",
      };
    });

    setNotifications(safeData);
  };

  useEffect(() => {
    loadNotifications();

    const handle = () => {
      loadNotifications();
    };

    window.addEventListener("storage", handle);

    return () => {
      window.removeEventListener("storage", handle);
    };
  }, [user?.id]);

  const formatNotificationTime = (value) => {
    if (!value) return "Just now";

    const textValue = String(value);

    if (textValue.includes("NaN")) {
      return "Just now";
    }

    if (textValue.toLowerCase().includes("ago")) {
      return textValue;
    }

    if (textValue.toLowerCase().includes("now")) {
      return textValue;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Just now";
    }

    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;

    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read || notification.unread
  ).length;

  const getIcon = (type) => {
    switch (type) {
      case "application":
        return HiOutlineBriefcase;
      case "interview":
        return HiOutlineChatBubbleLeftRight;
      case "job":
        return HiOutlineSparkles;
      case "event":
        return HiOutlineFire;
      default:
        return HiOutlineInformationCircle;
    }
  };

  const getGradient = (notification) => {
    return notification.gradient || "from-cyan-500 to-blue-600";
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "all") return true;

    if (filter === "unread") {
      return !item.read || item.unread;
    }

    return item.type === filter;
  });

  const markAllRead = () => {
    if (!user?.id) return;

    notificationService.markAllRead(user.id);
    loadNotifications();
  };

  const deleteNotification = (id) => {
    if (!id) return;

    if (notificationService.deleteNotification) {
      notificationService.deleteNotification(id);
    } else {
      notificationService.markAsRead(id);
    }

    loadNotifications();
  };

  const openNotification = (notification) => {
    setSelectedNotification(notification);

    notificationService.markAsRead(notification.id);
    loadNotifications();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-black p-4 sm:p-6">
      <div className="absolute left-0 top-0 h-75 w-75 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-75 w-75 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <HiOutlineBell className="h-5 w-5" />
              Notifications Center
            </div>

            <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">
              Stay Updated
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Instantly
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Manage all your alerts, applications, interviews and updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300">
              {unreadCount} Unread
            </div>

            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105"
            >
              <HiOutlineCheck className="h-5 w-5" />
              Mark All Read
            </button>
          </div>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-3">
          {[
            "all",
            "unread",
            "application",
            "interview",
            "job",
            "event",
            "system",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold capitalize transition-all ${
                filter === item
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const Icon = getIcon(notification.type);
              const gradient = getGradient(notification);

              return (
                <motion.div
                  key={notification.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${gradient} opacity-0 blur-3xl transition duration-500 group-hover:opacity-20`}
                  />

                  <div className="relative flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r ${gradient} text-white shadow-xl sm:h-16 sm:w-16`}
                      >
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white sm:text-xl">
                            {notification.title || "Notification"}
                          </h3>

                          {(!notification.read || notification.unread) && (
                            <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                          )}
                        </div>

                        <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                          {notification.message || "You have a new update."}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                          <HiOutlineClock className="h-4 w-4" />
                          {formatNotificationTime(
                            notification.createdAt ||
                              notification.date ||
                              notification.time
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openNotification(notification)}
                        className={`flex items-center gap-2 rounded-2xl bg-linear-to-r ${gradient} px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105`}
                      >
                        View
                        <HiOutlineArrowRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:scale-105"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
              <HiOutlineBell className="h-12 w-12 text-slate-500" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              No Notifications
            </h2>

            <p className="mt-2 text-slate-400">You're all caught up.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-4xl border border-white/10 bg-slate-900 shadow-2xl"
            >
              <div className={`h-40 bg-linear-to-r ${getGradient(selectedNotification)}`} />

              <button
                onClick={() => setSelectedNotification(null)}
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"
              >
                <HiOutlineXMark className="h-6 w-6" />
              </button>

              <div className="p-8">
                <h2 className="text-3xl font-black text-white">
                  {selectedNotification.title || "Notification"}
                </h2>

                <p className="mt-5 leading-8 text-slate-300">
                  {selectedNotification.message || "You have a new update."}
                </p>

                <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
                  <HiOutlineClock className="h-4 w-4" />
                  {formatNotificationTime(
                    selectedNotification.createdAt ||
                      selectedNotification.date ||
                      selectedNotification.time
                  )}
                </div>

                <button
                  className={`mt-8 flex items-center gap-2 rounded-2xl bg-linear-to-r ${getGradient(
                    selectedNotification
                  )} px-6 py-4 font-semibold text-white shadow-lg`}
                >
                  Open Related Page
                  <HiOutlineArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;