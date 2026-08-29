import { useEffect, useState } from 'react';
import { HiOutlineBriefcase } from 'react-icons/hi2';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AnimatedInput from './AnimatedInput';

const defaultState = {
  id: null,
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  description: '',
};

const ExperienceModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [experience, setExperience] = useState(defaultState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setExperience(initialData);
    } else {
      setExperience(defaultState);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!experience.title.trim() || !experience.company.trim()) {
      setError('Job title and company are required.');
      return;
    }
    onSave({ ...experience, id: experience.id || `exp-${Date.now()}` });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={experience.id ? 'Edit Experience' : 'Add Experience'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{experience.id ? 'Update' : 'Save'}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <AnimatedInput
          label="Job Title"
          value={experience.title}
          onChange={(e) => setExperience({ ...experience, title: e.target.value })}
          placeholder="Senior Frontend Developer"
        />
        <AnimatedInput
          label="Company"
          value={experience.company}
          onChange={(e) => setExperience({ ...experience, company: e.target.value })}
          placeholder="Acme Inc."
        />
        <AnimatedInput
          label="Location"
          value={experience.location}
          onChange={(e) => setExperience({ ...experience, location: e.target.value })}
          placeholder="Remote / San Francisco"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedInput
            label="Start Date"
            type="month"
            value={experience.startDate}
            onChange={(e) => setExperience({ ...experience, startDate: e.target.value })}
          />
          <AnimatedInput
            label="End Date"
            type="month"
            value={experience.endDate}
            onChange={(e) => setExperience({ ...experience, endDate: e.target.value })}
            disabled={experience.currentlyWorking}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={experience.currentlyWorking}
            onChange={(e) => setExperience({ ...experience, currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : experience.endDate })}
            className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
          />
          <span className="text-sm text-slate-600">Currently working here</span>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={experience.description}
            onChange={(e) => setExperience({ ...experience, description: e.target.value })}
            rows={4}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            placeholder="Describe your key responsibilities and achievements."
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
};

export default ExperienceModal;
