import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';
import Button from '../common/Button';
import Input from '../common/Input';
import GlassCard from '../common/GlassCard';
import { jobService } from '../../services/jobService';
import { notificationService } from '../../services/notification_service';
import toast from 'react-hot-toast';

const CreateJobModal = ({ open, onClose, onCreated, recruiter }) => {
  const [form, setForm] = useState({
    title: '',
    company: recruiter?.company || '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experienceLevel: 'mid-level',
    description: '',
    skills: '',
    deadline: '',
    hiringCount: 1
  });

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.company) {
      toast.error('Please provide title and company');
      return;
    }

    if (form.hiringCount <= 0) {
      toast.error('Hiring count must be at least 1');
      return;
    }

    try {
      const recruiterId = recruiter?.id || recruiter?._id || null;

      const payload = {
        title: form.title,
        jobTitle: form.title,
        company: form.company,
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        type: form.jobType,
        experienceLevel: form.experienceLevel,
        experience: form.experienceLevel,
        description: form.description,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        postedBy: recruiterId,
        recruiterId,
        createdByRole: 'recruiter',
        status: 'Published',
        hiringCount: Number(form.hiringCount) || 1,
        createdAt: new Date().toISOString()
      };

      const res = await jobService.postJob(payload);

      if (res.success) {
        // notify global feed
        notificationService.createNotification({
          type: 'job',
          title: 'New job posted',
          message: `${res.data.title} at ${res.data.company} has been posted.`,
          relatedId: res.data._id,
          metadata: { postedBy: payload.postedBy }
        });

        toast.success('Job created');
        onCreated && onCreated(res.data);
        onClose && onClose();
      } else {
        toast.error(res.message || 'Failed to create job');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create job');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl mx-auto"
      >
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white">Create Job</h3>
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
              <Button type="submit">Create Job</Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default CreateJobModal;
