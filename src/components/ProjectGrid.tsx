import { Project } from '@prisma/client';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
}

export default function ProjectGrid({ projects, onEdit }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-neo-panel neo-border p-8 sticker-rotate-2 max-w-md">
          <h3 className="text-2xl font-black mb-2 text-neo-pink">No Ideas Yet?</h3>
          <p className="text-gray-400">Click the "Add Idea" button to start building your log.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto pb-24">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} />
      ))}
    </div>
  );
}
