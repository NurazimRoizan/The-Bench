import { Project } from '@prisma/client';
import { Edit2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const statusColors: Record<string, string> = {
  'Idea': 'bg-neo-pink text-white',
  'In Progress': 'bg-neo-cyan text-white',
  'Shipped': 'bg-neo-white text-neo-black',
  'Paused': 'bg-gray-500 text-white',
};

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const badgeColor = statusColors[project.status] || 'bg-neo-panel';

  return (
    <div className="neo-card flex flex-col h-full bg-neo-panel relative group">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold pr-8">{project.name}</h2>
        <span className={`px-2 py-1 text-xs font-bold neo-border rounded-sm uppercase ${badgeColor}`}>
          {project.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-grow">
        {project.concept}
      </p>
      
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-xs bg-neo-bg px-2 py-1 neo-border">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{project.category}</span>
          <button 
            onClick={() => onEdit(project)}
            className="p-2 neo-border bg-neo-black text-white hover:bg-neo-pink hover:text-white transition-colors"
            aria-label="Edit project"
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
