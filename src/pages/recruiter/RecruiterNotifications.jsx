import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineEnvelope, HiOutlineFunnel, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import TableComponent from '../../components/common/TableComponent';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { notificationService } from '../../services/notification_service';
import { userService } from '../../services/user_service';

const RecruiterNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'info', targetUsers: 'all' });

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
      setNewNotification({ title: '', message: '', type: 'info', targetUsers: 'all' });
      loadNotifications();
      toast.success('Notification sent');
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
    const matchesSearch = search === '' || notif.title.toLowerCase().includes(search.toLowerCase()) || notif.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || notif.type === filterType;
    const matchesStatus = filterStatus === 'All' || (filterStatus === 'Unread' ? !notif.read : notif.read);
    return matchesSearch && matchesType && matchesStatus;
  });

  const notificationColumns = [
    { key: 'title', label: 'Title', render: (value) => <div className="font-medium text-slate-900">{value}</div> },
    { key: 'message', label: 'Message', render: (value) => <div className="text-slate-600 max-w-xs truncate">{value}</div> },
    { key: 'type', label: 'Type', render: (value) => <div className="text-sm text-slate-700">{value}</div> },
    { key: 'recipientId', label: 'Recipient', render: (value) => {
        const user = userService.getUserById(value); return user ? user.name : 'All';
      }
    },
    { key: 'read', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 text-xs rounded-full ${value ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{value ? 'Read' : 'Unread'}</span>
    ) },
    { key: 'createdAt', label: 'Created', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: (_, notification) => (
      <div className="flex gap-2">
        <button onClick={() => handleDeleteNotification(notification.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete notification"><HiOutlineTrash className="h-4 w-4" /></button>
      </div>
    ) }
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recruiter Notifications</h1>
          <p className="text-slate-600 mt-2">Create notifications to reach candidates or other recruiters.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2"><HiOutlinePlus className="h-5 w-5"/>Create Notification</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input type="text" placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/10 bg-slate-950/90 text-white outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2"><HiOutlineFunnel className="h-5 w-5 text-slate-500" /><select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 rounded-2xl border border-white/10 bg-slate-950/90 text-white"><option value="All">All Types</option><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option></select></div>
          <div className="flex items-center gap-2"><HiOutlineEnvelope className="h-5 w-5 text-slate-500" /><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-2xl border border-white/10 bg-slate-950/90 text-white"><option value="All">All Statuses</option><option value="Unread">Unread</option><option value="Read">Read</option></select></div>
        </div>
      </div>

      <div className="overflow-hidden rounded-4xl border border-white/10 bg-slate-950/90 shadow-2xl">
        <TableComponent columns={notificationColumns} data={filteredNotifications} pageSize={10} emptyMessage="No notifications found" />
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Notification">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Title</label><input type="text" value={newNotification.title} onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Notification title" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Message</label><textarea value={newNotification.message} onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Notification message" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Type</label><select value={newNotification.type} onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Target Users</label><select value={newNotification.targetUsers} onChange={(e) => setNewNotification(prev => ({ ...prev, targetUsers: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"><option value="all">All Users</option><option value="candidates">Candidates Only</option><option value="recruiters">Recruiters Only</option></select></div>
          <div className="flex gap-3 pt-4"><Button onClick={handleCreateNotification} disabled={!newNotification.title || !newNotification.message} className="flex-1">Send Notification</Button><Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button></div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default RecruiterNotifications;
