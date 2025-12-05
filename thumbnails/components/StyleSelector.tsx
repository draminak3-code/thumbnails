import React from 'react';
import { ThumbnailStyle } from '../types';
import { STYLES_LIST } from '../constants';

interface StyleSelectorProps {
  selectedStyle: ThumbnailStyle;
  onSelect: (style: ThumbnailStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <i className="fa-solid fa-palette mr-2 text-brand-500"></i>
        Visual Style
      </label>
      <div className="grid grid-cols-2 gap-3">
        {STYLES_LIST.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex flex-col items-start p-3 rounded-lg border transition-all text-left
              ${selectedStyle === item.id 
                ? 'bg-brand-900/30 border-brand-500 ring-1 ring-brand-500/50' 
                : 'bg-dark-800 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
              }`}
          >
            <div className={`mb-2 text-lg ${selectedStyle === item.id ? 'text-brand-400' : 'text-gray-400'}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div className="font-semibold text-sm text-gray-200">{item.id}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};