import React from 'react';

interface ApiKeyModalProps {
  onSelect: () => void;
  loading: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelect, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-gray-700 rounded-xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-6">
           <i className="fa-solid fa-key text-brand-500 text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
        <p className="text-gray-300 mb-6 leading-relaxed">
          To generate high-quality AI thumbnails using the <strong>Gemini 3 Pro</strong> model, you need to connect your Google Cloud project.
        </p>
        
        <div className="bg-gray-800/50 p-4 rounded-lg mb-6 text-sm text-gray-400 text-left">
           <p className="mb-2"><i className="fa-solid fa-info-circle mr-2 text-brand-500"></i> Note:</p>
           <ul className="list-disc pl-5 space-y-1">
             <li>Uses <code>gemini-3-pro-image-preview</code></li>
             <li>Requires a billed project in Google AI Studio</li>
           </ul>
        </div>

        <button
          onClick={onSelect}
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
             <><i className="fa-solid fa-spinner fa-spin"></i> Connecting...</>
          ) : (
             <><i className="fa-brands fa-google"></i> Select Project & Key</>
          )}
        </button>
        
        <p className="mt-4 text-xs text-gray-500">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 underline">
            Learn more about billing and API keys
          </a>
        </p>
      </div>
    </div>
  );
};