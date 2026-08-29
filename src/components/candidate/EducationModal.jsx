import { useEffect, useState } from 'react';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AnimatedInput from './AnimatedInput';

const defaultState = {
  id: null,
  degree: '',
  institution: '',
  year: '',
  cgpa: '',
  location: '',
  description: '',
};

const EducationModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [education, setEducation] = useState(defaultState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setEducation(initialData);
    } else {
      setEducation(defaultState);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!education.degree.trim() || !education.institution.trim()) {
      setError('Degree and institution are required.');
      return;
    }
    onSave({ ...education, id: education.id || `edu-${Date.now()}` });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={education.id ? 'Edit Education' : 'Add Education'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{education.id ? 'Update' : 'Save'}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <AnimatedInput
          label="Degree"
          value={education.degree}
          onChange={(e) => setEducation({ ...education, degree: e.target.value })}
          placeholder="Bachelor of Science in Computer Science"
        />
        <AnimatedInput
          label="Institution"
          value={education.institution}
          onChange={(e) => setEducation({ ...education, institution: e.target.value })}
          placeholder="University of Technology"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedInput
            label="Location"
            value={education.location}
            onChange={(e) => setEducation({ ...education, location: e.target.value })}
            placeholder="San Francisco, CA"
          />
          <AnimatedInput
            label="Year"
            value={education.year}
            onChange={(e) => setEducation({ ...education, year: e.target.value })}
            placeholder="2024"
          />
        </div>
        <AnimatedInput
          label="CGPA / Score"
          value={education.cgpa}
          onChange={(e) => setEducation({ ...education, cgpa: e.target.value })}
          placeholder="3.8 / 4.0"
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={education.description}
            onChange={(e) => setEducation({ ...education, description: e.target.value })}
            rows={4}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            placeholder="Optional details about coursework, honors, or activities."
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
};

export default EducationModal;
