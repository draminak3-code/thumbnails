import React, { useRef, useState } from 'react';
import { ReferenceImage } from '../types';

interface ImageUploadProps {
  onImageSelected: (image: ReferenceImage | null) => void;
  currentImage: ReferenceImage | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Extract base64 part (remove data:image/png;base64,)
      const base64Data = result.split(',')[1];
      
      onImageSelected({
        base64: base64Data,
        mimeType: file.type,
        previewUrl: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <i className="fa-solid fa-user-circle mr-2 text-brand-500"></i>
        Your Face Reference
      </label>
      
      {!currentImage ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group
            ${dragActive ? 'border-brand-500 bg-brand-900/20' : 'border-gray-600 hover:border-gray-500 bg-dark-800'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center space-y-3">
             <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
               <i className="fa-solid fa-cloud-arrow-up text-xl text-gray-300"></i>
             </div>
             <div className="text-gray-400 text-sm">
               <span className="font-semibold text-brand-400">Click to upload</span> or drag and drop
             </div>
             <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-gray-600 group">
          <img 
            src={currentImage.previewUrl} 
            alt="Reference" 
            className="w-full h-48 object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
             <p className="text-white text-sm font-medium truncate">Reference Loaded</p>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onImageSelected(null);
               }}
               className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center transition-colors backdrop-blur-sm"
             >
               <i className="fa-solid fa-times text-xs"></i>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};