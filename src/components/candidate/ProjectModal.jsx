import { useEffect, useState } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AnimatedInput from './AnimatedInput';

const defaultState = {
  id: null,
  title: '',
  description: '',
  techStack: '',
  projectLink: '',
};

const ProjectModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [project, setProject] = useState(defaultState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setProject(initialData);
    } else {
      setProject(defaultState);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!project.title.trim()) {
      setError('Project title is required.');
      return;
    }
    onSave({ ...project, id: project.id || `project-${Date.now()}` });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.id ? 'Edit Project' : 'Add Project'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{project.id ? 'Update' : 'Save'}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <AnimatedInput
          label="Project Title"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          placeholder="Landing page redesign"
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            rows={4}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            placeholder="Summarize the project scope and impact."
          />
        </div>
        <AnimatedInput
          label="Tech Stack"
          value={project.techStack}
          onChange={(e) => setProject({ ...project, techStack: e.target.value })}
          placeholder="React, Tailwind, Node.js"
        />
        <AnimatedInput
          label="Project Link"
          type="url"
          value={project.projectLink}
          onChange={(e) => setProject({ ...project, projectLink: e.target.value })}
          placeholder="https://portfolio.example.com"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
};

export default ProjectModal;
