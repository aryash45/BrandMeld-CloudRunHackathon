import React from 'react';

interface ImagePreviewProps {
  imageDataUrl: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageDataUrl }) => {
  const downloadImage = () => {
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = 'brand-image.png';
    a.click();
  };

  return (
    <div className="neon-panel-soft px-4 py-4 sm:px-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Generated image
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-white">Visual preview</h3>
        </div>
        <button
          onClick={downloadImage}
          className="neon-ghost-button rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
        >
          Download
        </button>
      </div>
      <div className="overflow-hidden rounded-[22px] border border-white/5 bg-slate-950/40 p-2">
        <img src={imageDataUrl} alt="Generated brand image" className="h-auto w-full rounded-[18px]" />
      </div>
    </div>
  );
};

export default ImagePreview;
