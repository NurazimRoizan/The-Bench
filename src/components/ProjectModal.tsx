'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project } from '@prisma/client';
import { ProjectFormData } from '@/actions/projectActions';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectFormData) => void;
  initialData?: any;
}

const defaultData = {
  name: '',
  category: '',
  concept: '',
  targetAudience: '',
  status: 'Idea',
  techStack: '',
  features: '',
  monetization: '',
  competitors: '',
  tasks: '',
};

export default function ProjectModal({ isOpen, onClose, onSave, initialData }: ProjectModalProps) {
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        targetAudience: initialData.targetAudience || '',
        techStack: initialData.techStack.join(', '),
        features: initialData.features?.join(', ') || '',
        monetization: initialData.monetization || '',
        competitors: initialData.competitors?.join(', ') || '',
        tasks: initialData.tasks?.map((t: any) => t.title).join(', ') || '',
      });
    } else {
      setFormData(defaultData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      competitors: formData.competitors.split(',').map(c => c.trim()).filter(Boolean),
      tasks: formData.tasks.split(',').map(t => ({ title: t.trim(), completed: false })).filter(t => t.title),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-neo-panel w-full max-w-lg neo-border neo-shadow-white rounded-t-xl sm:rounded-sm overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b-2 border-neo-white bg-neo-bg">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Idea' : 'New Idea'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-neo-pink hover:text-white neo-border transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="neo-input" placeholder="Project Name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="neo-input" placeholder="e.g. SaaS, Tool" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="neo-input bg-neo-bg text-white">
                  <option>Idea</option>
                  <option>In Progress</option>
                  <option>Shipped</option>
                  <option>Paused</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Concept</label>
              <textarea required value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} className="neo-input min-h-[100px]" placeholder="What is this idea about?" />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Target Audience</label>
              <input required value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className="neo-input" placeholder="Who is it for?" />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Tech Stack (comma separated)</label>
              <input value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className="neo-input" placeholder="Next.js, Tailwind, Prisma" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Features (comma separated)</label>
              <input value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="neo-input" placeholder="Auth, Database, Payments" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Monetization</label>
                <input value={formData.monetization} onChange={e => setFormData({...formData, monetization: e.target.value})} className="neo-input" placeholder="e.g. SaaS, Ads, Freemium" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Competitors (comma separated)</label>
                <input value={formData.competitors} onChange={e => setFormData({...formData, competitors: e.target.value})} className="neo-input" placeholder="Competitor A, Competitor B" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Tasks (comma separated)</label>
              <textarea value={formData.tasks} onChange={e => setFormData({...formData, tasks: e.target.value})} className="neo-input min-h-[80px]" placeholder="Setup project, Design DB schema, Implement Auth" />
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t-2 border-neo-white bg-neo-bg flex justify-end gap-2">
          <button type="button" onClick={onClose} className="neo-button bg-neo-panel text-white hover:bg-gray-800">
            Cancel
          </button>
          <button type="submit" form="project-form" className="neo-button neo-button-cyan">
            Save Idea
          </button>
        </div>
      </div>
    </div>
  );
}
