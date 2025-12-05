import React from 'react';
import { GeneratedImage } from '../types';

interface ResultsGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({ images, isGenerating }) => {
  if (images.length === 0 && !isGenerating) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl bg-dark-800/50">
        <i className="fa-regular fa-image text-5xl mb-4 opacity-50"></i>
        <p className="text-lg">No thumbnails yet</p>
        <p className="text-sm">Upload a photo and describe your video to start.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isGenerating && (
        <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-brand-400 font-medium tracking-wide animate-pulse">Designing Thumbnail...</p>
            <p className="text-xs text-gray-500 mt-2">Connecting to Gemini 3 Pro</p>
          </div>
        </div>
      )}

      {images.map((img) => (
        <div key={img.id} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-gray-500 transition-all">
          <div className="aspect-video w-full overflow-hidden bg-black">
            <img src={img.url} alt="Generated Thumbnail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          
          <div className="p-4 bg-dark-800">
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              <span className="text-brand-500 font-bold text-xs uppercase tracking-wider mr-2">Prompt</span>
              {img.prompt}
            </p>
            
            <div className="flex gap-3">
              <a 
                href={img.url} 
                download={`thumbnail-${img.id}.png`}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <i className="fa-solid fa-download"></i> Download
              </a>
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(img.prompt);
                   // Ideally show a toast here
                }}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-lg w-10 flex items-center justify-center transition-colors"
                title="Copy Prompt"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};