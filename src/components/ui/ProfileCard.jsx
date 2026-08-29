import { useEffect, useState } from 'react';
import Card from './Card';
import { HiOutlineCamera } from 'react-icons/hi2';

const ProfileCard = ({ user, onUpload }) => {
  const [preview, setPreview] = useState(user?.profileImage || user?.avatar || '');

  useEffect(() => {
    setPreview(user?.profileImage || user?.avatar || '');
  }, [user]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onUpload && onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="flex items-center gap-4">
      <div className="relative">
        <img src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}`} alt="avatar" className="h-20 w-20 rounded-2xl object-cover" />
        <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-cyan-500 p-2 text-white">
          <HiOutlineCamera className="h-4 w-4" />
          <input type="file" accept="image/*" hidden onChange={handleFile} />
        </label>
      </div>

      <div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{user?.name}</h3>
        <p className="text-sm text-(--muted)">{user?.email}</p>
      </div>
    </Card>
  );
};

export default ProfileCard;
