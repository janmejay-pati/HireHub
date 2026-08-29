import { useEffect, useState } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AnimatedInput from './AnimatedInput';

const defaultState = {
  id: null,
  name: '',
  category: '',
  level: 75,
};

const SkillModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [skill, setSkill] = useState(defaultState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setSkill(initialData);
    } else {
      setSkill(defaultState);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!skill.name.trim()) {
      setError('Skill name is required.');
      return;
    }
    onSave({ ...skill, id: skill.id || `skill-${Date.now()}` });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={skill.id ? 'Edit Skill' : 'Add Skill'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{skill.id ? 'Update Skill' : 'Add Skill'}</Button>
        </>
      }
    >
      <div className="space-y-6">
        <AnimatedInput
          label="Skill Name"
          value={skill.name}
          onChange={(e) => setSkill({ ...skill, name: e.target.value })}
          placeholder="React, Figma, SQL"
        />

        <AnimatedInput
          label="Category"
          value={skill.category}
          onChange={(e) => setSkill({ ...skill, category: e.target.value })}
          placeholder="Frontend, Design, Cloud"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Proficiency</label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={skill.level}
            onChange={(e) => setSkill({ ...skill, level: Number(e.target.value) })}
            className="w-full cursor-pointer"
          />
          <p className="mt-2 text-sm text-slate-500">{skill.level}% proficient</p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
};

export default SkillModal;
