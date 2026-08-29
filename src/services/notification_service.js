import {
  getNotifications,
  setNotifications,
} from "./storage_service";

const DEFAULT_GRADIENT =
  "from-cyan-500 to-blue-600";

const createId = () => {
  return `notif-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

const isValidDate = (value) => {
  if (!value) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

const getSafeDate = (value) => {
  if (isValidDate(value)) {
    return new Date(value).toISOString();
  }

  return new Date().toISOString();
};

const formatTimeAgo = (value) => {
  if (!value) return "Just now";

  const text = String(value);

  if (text.includes("NaN")) {
    return "Just now";
  }

  if (text.toLowerCase().includes("ago")) {
    return text;
  }

  if (text.toLowerCase().includes("now")) {
    return "Just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) {
    return "Just now";
  }

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const dispatchStorageEvent = () => {
  try {
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error(
      "Notification storage sync failed",
      error
    );
  }
};

const formatNotification = ({
  id,
  _id,
  type,
  category,
  title,
  message,
  relatedId,
  createdAt,
  timestamp,
  date,
  time,
  recipientId,
  userId,
  recipient,
  metadata,
  meta,
  read,
  gradient,
  link,
  path,
}) => {
  const normalizedRecipient =
    recipientId ?? userId ?? recipient ?? null;

  const normalizedType =
    type || category || "info";

  const safeCreatedAt = getSafeDate(
    createdAt || timestamp || date
  );

  const isRead =
    typeof read === "boolean" ? read : false;

  return {
    id: id || _id || createId(),

    type: normalizedType,
    category: normalizedType,

    title: title || "Notification",
    message: message || "You have a new update.",

    relatedId: relatedId || null,

    recipientId: normalizedRecipient,
    userId: normalizedRecipient,

    metadata: metadata || meta || {},

    createdAt: safeCreatedAt,
    timestamp: safeCreatedAt,
    date: safeCreatedAt,

    time: time && !String(time).includes("NaN")
      ? formatTimeAgo(time)
      : formatTimeAgo(safeCreatedAt),

    read: isRead,
    unread: !isRead,

    gradient: gradient || DEFAULT_GRADIENT,

    link: link || path || "",
  };
};

const normalizeNotificationRecord = (
  notification = {}
) => {
  const safeCreatedAt = getSafeDate(
    notification.createdAt ||
      notification.timestamp ||
      notification.date
  );

  const normalizedRecipient =
    notification.recipientId ??
    notification.userId ??
    notification.recipient ??
    null;

  const normalizedType =
    notification.type ||
    notification.category ||
    "info";

  const isRead =
    typeof notification.read === "boolean"
      ? notification.read
      : false;

  return {
    ...notification,

    id:
      notification.id ||
      notification._id ||
      createId(),

    type: normalizedType,
    category: normalizedType,

    title:
      notification.title ||
      "Notification",

    message:
      notification.message ||
      notification.description ||
      "You have a new update.",

    recipientId: normalizedRecipient,
    userId: normalizedRecipient,

    createdAt: safeCreatedAt,
    timestamp: safeCreatedAt,
    date: safeCreatedAt,

    time: formatTimeAgo(safeCreatedAt),

    read: isRead,
    unread: !isRead,

    gradient:
      notification.gradient ||
      DEFAULT_GRADIENT,

    metadata:
      notification.metadata ||
      notification.meta ||
      {},

    link:
      notification.link ||
      notification.path ||
      "",
  };
};

export const notificationService = {
  getAllNotifications: (recipientId = null) => {
    const all = (getNotifications() || []).map(
      normalizeNotificationRecord
    );

    let filtered;

    if (recipientId) {
      filtered = all.filter(
        (notification) =>
          notification.recipientId === recipientId ||
          notification.recipientId === null ||
          notification.recipientId === undefined
      );
    } else {
      filtered = all;
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  },

  createNotification: (payload = {}) => {
    const notifications =
      getNotifications() || [];

    const newNotification =
      formatNotification({
        ...payload,
        createdAt:
          payload.createdAt ||
          new Date().toISOString(),
        read: false,
      });

    const next = [
      newNotification,
      ...notifications,
    ];

    setNotifications(next);
    dispatchStorageEvent();

    return newNotification;
  },

  addNotification: (payload = {}) => {
    return notificationService.createNotification(
      payload
    );
  },

  markAllRead: (recipientId = null) => {
    const notifications =
      getNotifications() || [];

    const updated =
      notifications.map((notification) => {
        const normalized =
          normalizeNotificationRecord(
            notification
          );

        if (
          recipientId &&
          normalized.recipientId &&
          normalized.recipientId !==
            recipientId
        ) {
          return normalized;
        }

        return {
          ...normalized,
          read: true,
          unread: false,
        };
      });

    setNotifications(updated);
    dispatchStorageEvent();

    return updated;
  },

  markAsRead: (id) => {
    const notifications =
      getNotifications() || [];

    const updated =
      notifications.map((notification) => {
        const normalized =
          normalizeNotificationRecord(
            notification
          );

        return normalized.id === id ||
          normalized._id === id
          ? {
              ...normalized,
              read: true,
              unread: false,
            }
          : normalized;
      });

    setNotifications(updated);
    dispatchStorageEvent();

    return updated;
  },

  deleteNotification: (id) => {
    const notifications =
      getNotifications() || [];

    const filtered =
      notifications
        .map(normalizeNotificationRecord)
        .filter(
          (notification) =>
            notification.id !== id &&
            notification._id !== id
        );

    setNotifications(filtered);
    dispatchStorageEvent();

    return filtered;
  },

  clearNotifications: (recipientId = null) => {
    const notifications =
      getNotifications() || [];

    const filtered = recipientId
      ? notifications
          .map(normalizeNotificationRecord)
          .filter(
            (notification) =>
              notification.recipientId !==
              recipientId
          )
      : [];

    setNotifications(filtered);
    dispatchStorageEvent();

    return filtered;
  },
};