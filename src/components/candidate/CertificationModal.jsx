import { useEffect, useState } from 'react';
import { HiOutlineTrophy, HiOutlineCloudArrowUp } from 'react-icons/hi2';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AnimatedInput from './AnimatedInput';

const defaultState = {
  id: null,
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  fileName: '',
  fileUrl: '',
  fileSize: 0,
  fileType: '',
};

const CertificationModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [certification, setCertification] = useState(defaultState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCertification(initialData);
    } else {
      setCertification(defaultState);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCertification((prev) => ({
        ...prev,
        fileName: file.name,
        fileUrl: reader.result,
        fileSize: file.size,
        fileType: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!certification.name.trim() || !certification.issuer.trim()) {
      setError('Certification name and issuer are required.');
      return;
    }
    onSave({ ...certification, id: certification.id || `cert-${Date.now()}` });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certification.id ? 'Edit Certification' : 'Add Certification'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{certification.id ? 'Update' : 'Save'}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <AnimatedInput
          label="Certification Name"
          value={certification.name}
          onChange={(e) => setCertification({ ...certification, name: e.target.value })}
          placeholder="AWS Certified Solutions Architect"
        />
        <AnimatedInput
          label="Issuer"
          value={certification.issuer}
          onChange={(e) => setCertification({ ...certification, issuer: e.target.value })}
          placeholder="Amazon Web Services"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedInput
            label="Issue Date"
            type="month"
            value={certification.issueDate}
            onChange={(e) => setCertification({ ...certification, issueDate: e.target.value })}
          />
          <AnimatedInput
            label="Expiry Date"
            type="month"
            value={certification.expiryDate}
            onChange={(e) => setCertification({ ...certification, expiryDate: e.target.value })}
          />
        </div>

        <AnimatedInput
          label="Credential ID"
          value={certification.credentialId}
          onChange={(e) => setCertification({ ...certification, credentialId: e.target.value })}
          placeholder="ABC-123456"
        />

        <div className="space-y-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Upload Certificate</label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            <HiOutlineCloudArrowUp className="h-4 w-4" />
            Select File
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={handleFileChange} />
          </label>
          {certification.fileName && <p className="text-sm text-slate-500">Uploaded: {certification.fileName}</p>}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
};

export default CertificationModal;
