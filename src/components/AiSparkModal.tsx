'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { generateIdeaFromText } from '@/actions/aiActions';

interface AiSparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (generatedData: any) => void;
}

export default function AiSparkModal({ isOpen, onClose, onSuccess }: AiSparkModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSpark = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateIdeaFromText(prompt);
      onSuccess(result);
      setPrompt('');
    } catch (error) {
      console.error(error);
      alert('Failed to generate idea. Please ensure GOOGLE_GENERATIVE_AI_API_KEY is set in your environment.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-neo-panel w-full max-w-lg neo-border neo-shadow-pink rounded-t-xl sm:rounded-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b-2 border-neo-white bg-neo-bg">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-neo-pink" size={24} />
            AI Spark
          </h2>
          <button onClick={onClose} disabled={isGenerating} className="p-1 hover:bg-neo-pink hover:text-white neo-border transition-colors disabled:opacity-50">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="mb-4 text-sm font-medium text-gray-300">
            Dump your raw thoughts here. Tell Gemini what your app does, who it's for, and what needs to be built. We'll instantly structure it into a project.
          </p>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. I want to build a fitness app for dogs using React Native and Firebase. It needs GPS tracking and a premium subscription model. First task is to design the logo..."
            className="neo-input min-h-[150px] disabled:opacity-50"
          />
        </div>
        
        <div className="p-4 border-t-2 border-neo-white bg-neo-bg flex justify-end gap-2">
          <button onClick={onClose} disabled={isGenerating} className="neo-button bg-neo-panel text-white hover:bg-gray-800 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSpark} disabled={isGenerating || !prompt.trim()} className="neo-button neo-button-pink flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {isGenerating ? 'Generating...' : 'Spark Magic'}
          </button>
        </div>
      </div>
    </div>
  );
}
