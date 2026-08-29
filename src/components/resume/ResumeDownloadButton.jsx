import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { HiOutlineArrowDownTray } from 'react-icons/hi2';

const ResumeDownloadButton = ({ elementRef, fileName = 'resume.pdf', className = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!elementRef?.current) return;

    setIsDownloading(true);

    const options = {
      margin: [0.35, 0.35, 0.35, 0.35],
      filename: fileName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf()
      .set(options)
      .from(elementRef.current)
      .save()
      .finally(() => setIsDownloading(false));
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <HiOutlineArrowDownTray className="h-4 w-4" />
        {isDownloading ? 'Generating…' : 'Download PDF'}
      </div>
    </button>
  );
};

export default ResumeDownloadButton;
