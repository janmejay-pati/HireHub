import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';
import Button from '../common/Button';
import GlassCard from '../common/GlassCard';
import Input from '../common/Input';
import { interviewService } from '../../services/interview_service';
import { applicationService } from '../../services/application_service';
import { notificationService } from '../../services/notification_service';
import toast from 'react-hot-toast';

const ScheduleInterviewModal = ({ open, onClose, candidate, applicationId, recruiterId, onScheduled }) => {
  const [form, setForm] = useState({ date: '', time: '', mode: 'Video', link: '', notes: '' });

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      toast.error('Please select date and time');
      return;
    }

    const interviewDate = new Date(`${form.date}T${form.time}`).toISOString();

    const interview = interviewService.createInterview({
      applicationId,
      candidateId: candidate?.id || candidate?.candidateId || null,
      candidateName: candidate?.name || '',
      email: candidate?.email || '',
      role: candidate?.appliedRole || '',
      domain: candidate?.skills ? candidate.skills.join(', ') : '',
      interviewDate,
      mode: form.mode,
      notes: form.notes,
      recruiterId,
      createdAt: new Date().toISOString()
    });

    // update application status
    try {
      applicationService.updateApplicationStatus(applicationId, 'Interview', 'Interview scheduled');
    } catch (e) {}

    // notify candidate and recruiter
    try {
      notificationService.createNotification({
        type: 'interview',
        title: 'Interview scheduled',
        message: `Interview for ${interview.role} scheduled on ${new Date(interview.interviewDate).toLocaleString()}`,
        relatedId: interview.id,
        recipientId: candidate?.id || null,
      });

      notificationService.createNotification({
        type: 'interview',
        title: 'Interview scheduled',
        message: `Interview with ${candidate?.name || 'candidate'} scheduled`,
        relatedId: interview.id,
        recipientId: recruiterId || null,
      });
    } catch (e) {}

    toast.success('Interview scheduled');
    onScheduled && onScheduled(interview);
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-xl mx-auto">
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white">Schedule Interview</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><HiOutlineXMark className="h-6 w-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input name="date" type="date" value={form.date} onChange={handleChange} />
              <Input name="time" type="time" value={form.time} onChange={handleChange} />
            </div>

            <select name="mode" value={form.mode} onChange={handleChange} className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white">
              <option>Video</option>
              <option>Phone</option>
              <option>Onsite</option>
            </select>

            <Input name="link" value={form.link} onChange={handleChange} placeholder="Meeting link (optional)" />
            <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white" placeholder="Notes for interviewer" />

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit">Schedule</Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ScheduleInterviewModal;
