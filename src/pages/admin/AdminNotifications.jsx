import { motion } from 'framer-motion';
import {
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiOutlineBell,
  HiOutlineEnvelope,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
} from "react-icons/hi2";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import TableComponent from '../../components/common/TableComponent';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { notificationService } from '../../services/notification_service';
import { userService } from '../../services/user_service';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    targetUsers: 'all'
  });

  useEffect(() => {
    loadNotifications();
    const handleStorageUpdate = () => loadNotifications();
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  const loadNotifications = () => {
    try {
      const notifs = notificationService.getAllNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = () => {
    notificationService.markAllRead();
    loadNotifications();
    toast.success('All notifications marked read');
  };

  const handleCreateNotification = () => {
    try {
      const users = userService.getAllUsers();
      let targetUserIds = [];

      if (newNotification.targetUsers === 'all') {
        targetUserIds = users.map((u) => u.id);
      } else if (newNotification.targetUsers === 'candidates') {
        targetUserIds = users.filter((u) => u.role === 'candidate').map((u) => u.id);
      } else if (newNotification.targetUsers === 'recruiters') {
        targetUserIds = users.filter((u) => u.role === 'recruiter').map((u) => u.id);
      }

      for (const userId of targetUserIds) {
        notificationService.createNotification({
          recipientId: userId,
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          read: false,
        });
      }

      setShowCreateModal(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        targetUsers: 'all',
      });
      loadNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleDeleteNotification = (notificationId) => {
    try {
      notificationService.deleteNotification(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = search === '' ||
      notif.title.toLowerCase().includes(search.toLowerCase()) ||
      notif.message.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'All' || notif.type === filterType;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Unread' ? !notif.read : notif.read);

    return matchesSearch && matchesType && matchesStatus;
  });

  const notificationColumns = [
    {
      key: 'title',
      label: 'Title',
      render: (value) => (
        <div className="font-medium text-slate-900">{value}</div>
      )
    },
    {
      key: 'message',
      label: 'Message',
      render: (value) => (
        <div className="text-slate-600 max-w-xs truncate">{value}</div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const typeConfig = {
          info: { icon: HiOutlineInformationCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
          success: { icon: HiOutlineCheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
          warning: { icon: HiOutlineExclamationTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          error: { icon: HiOutlineXCircle, color: 'text-red-600', bg: 'bg-red-100' }
        };
        const config = typeConfig[value] || typeConfig.info;
        const Icon = config.icon;

        return (
          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            <Icon className="h-3 w-3" />
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </div>
        );
      }
    },
    {
      key: 'recipientId',
      label: 'Recipient',
      render: (value) => {
        const user = userService.getUserById(value);
        return user ? user.name : 'Unknown';
      }
    },
    {
      key: 'read',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {value ? 'Read' : 'Unread'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, notification) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleDeleteNotification(notification.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete notification"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = [
    {
      title: 'Total Notifications',
      value: notifications.length,
      icon: HiOutlineBell,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Unread Notifications',
      value: notifications.filter(n => !n.read).length,
      icon: HiOutlineEnvelope,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Info Messages',
      value: notifications.filter(n => n.type === 'info').length,
      icon: HiOutlineInformationCircle,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Success Messages',
      value: notifications.filter(n => n.type === 'success').length,
      icon: HiOutlineCheckCircle,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications Management</h1>
          <p className="text-slate-600 mt-2">Send and manage platform-wide notifications</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleMarkAllRead}
            variant="secondary"
            className="flex items-center gap-2"
            disabled={!notifications.some((n) => !n.read)}
          >
            <HiOutlineCheckCircle className="h-5 w-5" />
            Mark all read
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <HiOutlinePlus className="h-5 w-5" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-4xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/10 bg-slate-950/90 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <HiOutlineFunnel className="h-5 w-5 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-2xl border border-white/10 bg-slate-950/90 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="All">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <HiOutlineEnvelope className="h-5 w-5 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-2xl border border-white/10 bg-slate-950/90 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="overflow-hidden rounded-4xl border border-white/10 bg-slate-950/90 shadow-2xl">
        <TableComponent
          columns={notificationColumns}
          data={filteredNotifications}
          pageSize={10}
          emptyMessage="No notifications found"
        />
      </div>

      {/* Create Notification Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Notification"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={newNotification.title}
              onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Notification title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Notification message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select
              value={newNotification.type}
              onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Users</label>
            <select
              value={newNotification.targetUsers}
              onChange={(e) => setNewNotification(prev => ({ ...prev, targetUsers: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Users</option>
              <option value="candidates">Candidates Only</option>
              <option value="recruiters">Recruiters Only</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreateNotification}
              disabled={!newNotification.title || !newNotification.message}
              className="flex-1"
            >
              Send Notification
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AdminNotifications;