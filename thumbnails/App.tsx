import React, { useState, useEffect } from 'react';
import { ThumbnailStyle, ReferenceImage, GeneratedImage } from './types';
import { ImageUpload } from './components/ImageUpload';
import { StyleSelector } from './components/StyleSelector';
import { ResultsGallery } from './components/ResultsGallery';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateThumbnail } from './services/geminiService';

export default function App() {
  const [concept, setConcept] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<ThumbnailStyle>(ThumbnailStyle.REALISTIC);
  const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);

  // Check for API key on mount and before generation
  const checkApiKey = async () => {
    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      return hasKey;
    } catch (e) {
      console.error("Error checking API key state", e);
      return false;
    }
  };

  const handleConnectKey = async () => {
    setKeyLoading(true);
    try {
      await window.aistudio.openSelectKey();
      // Assume success if no error thrown
      setShowKeyModal(false);
    } catch (e) {
      console.error("Failed to select key", e);
      setError("Failed to select API Key. Please try again.");
    } finally {
      setKeyLoading(false);
    }
  };

  const handleGenerate = async () => {
    setError(null);

    if (!referenceImage) {
      setError("Please upload a reference image of yourself.");
      return;
    }
    if (!concept.trim()) {
      setError("Please describe the video concept.");
      return;
    }

    // API Key Check
    const hasKey = await checkApiKey();
    if (!hasKey) {
      setShowKeyModal(true);
      return;
    }

    setIsGenerating(true);

    try {
      const imageUrl = await generateThumbnail(concept, selectedStyle, referenceImage);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: `${concept} (${selectedStyle})`,
        timestamp: Date.now()
      };

      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      // Handle specifically the "Requested entity was not found" error which implies invalid/missing key session
      if (err.message && err.message.includes("Requested entity was not found")) {
        setShowKeyModal(true);
        setError("Session expired or invalid. Please select your API key again.");
      } else {
        setError(err.message || "Failed to generate thumbnail. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1a1a]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <i className="fa-solid fa-wand-magic-sparkles text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ThumbnailGen <span className="text-brand-500 font-extrabold">AI</span>
            </h1>
          </div>
          <a href="https://github.com/google-gemini/generative-ai-js" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <i className="fa-brands fa-github text-xl"></i>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 shadow-xl space-y-6">
              
              <ImageUpload 
                onImageSelected={setReferenceImage} 
                currentImage={referenceImage} 
              />

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <i className="fa-solid fa-lightbulb mr-2 text-brand-500"></i>
                  Video Concept
                </label>
                <textarea
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g., I built a secret gaming room under my bed! or Reviewing the worst rated pizza in NYC"
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none h-32"
                />
              </div>

              <StyleSelector 
                selectedStyle={selectedStyle} 
                onSelect={setSelectedStyle} 
              />

              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start">
                  <i className="fa-solid fa-circle-exclamation mt-0.5 mr-2"></i>
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-brand-900/20 transition-all transform hover:-translate-y-0.5
                  ${isGenerating 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white hover:shadow-brand-500/30'
                  }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-bolt"></i> Generate Thumbnail
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Results</h2>
              {generatedImages.length > 0 && (
                 <span className="text-gray-500 text-sm">{generatedImages.length} images generated</span>
              )}
            </div>
            
            <ResultsGallery images={generatedImages} isGenerating={isGenerating} />
          </div>
        </div>
      </main>

      {/* Modal for API Key */}
      {showKeyModal && (
        <ApiKeyModal 
          onSelect={handleConnectKey} 
          loading={keyLoading} 
        />
      )}
    </div>
  );
}