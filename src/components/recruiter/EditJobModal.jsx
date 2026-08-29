import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';
import Button from '../common/Button';
import Input from '../common/Input';
import GlassCard from '../common/GlassCard';
import { jobService } from '../../services/jobService';
import { notificationService } from '../../services/notification_service';
import toast from 'react-hot-toast';

const EditJobModal = ({ open, onClose, job, onUpdated }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || job.jobTitle || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        jobType: job.jobType || 'full-time',
        experienceLevel: job.experienceLevel || 'mid-level',
        description: job.description || '',
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || ''),
        deadline: job.deadline || '',
        hiringCount: job.hiringCount || 1
      });
    } else {
      setForm(null);
    }
  }, [job]);

  if (!open || !form) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        title: form.title,
        jobTitle: form.title,
        company: form.company,
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        experienceLevel: form.experienceLevel,
        description: form.description,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        deadline: form.deadline || null,
        hiringCount: Number(form.hiringCount) || 1
      };

      const updated = jobService.updateJob(job._id || job.id, updates);

      try {
        notificationService.createNotification({
          type: 'job',
          title: 'Job updated',
          message: `${updated.title} was updated`,
          relatedId: updated._id
        });
      } catch (e) { console.warn(e); }

      toast.success('Job updated');
      onUpdated && onUpdated(updated);
      onClose && onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update job');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl mx-auto">
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white">Edit Job</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <HiOutlineXMark className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Input name="title" value={form.title} onChange={handleChange} placeholder="Job title" />
            <Input name="company" value={form.company} onChange={handleChange} placeholder="Company" />
            <div className="grid grid-cols-2 gap-3">
              <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
              <Input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select name="jobType" value={form.jobType} onChange={handleChange} className="rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white w-full">
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white w-full">
                <option value="entry">Entry</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white" placeholder="Job description" />

            <Input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" />

            <div className="flex justify-end gap-3 mt-2">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default EditJobModal;
