'use client';

import { useState, useOptimistic, useTransition, useEffect } from 'react';
import { Project } from '@prisma/client';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import ProjectGrid from '@/components/ProjectGrid';
import ProjectModal from '@/components/ProjectModal';
import { createProject, updateProject, getProjects } from '@/actions/projectActions';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    projects,
    (state, newProject: Project) => {
      const exists = state.some(p => p.id === newProject.id);
      if (exists) {
        return state.map(p => p.id === newProject.id ? newProject : p);
      }
      return [newProject, ...state];
    }
  );

  useEffect(() => {
    // Initial fetch since it's a client component, or we can fetch in a server component wrapper.
    // For simplicity, we fetch on mount here.
    getProjects().then(setProjects);
  }, []);

  const filteredProjects = optimisticProjects.filter(p => 
    filter === 'All' ? true : p.status === filter
  );

  const handleSaveIdea = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const isEditing = !!editingProject;
    
    // Create an optimistic project object
    const optimisticData: Project = {
      ...data,
      id: isEditing ? editingProject.id : Math.random().toString(),
      createdAt: isEditing ? editingProject.createdAt : new Date(),
      updatedAt: new Date(),
    };

    startTransition(async () => {
      addOptimisticProject(optimisticData);
      try {
        if (isEditing) {
          const updated = await updateProject(editingProject.id, data);
          setProjects(current => current.map(p => p.id === updated.id ? updated : p));
        } else {
          const created = await createProject(data);
          setProjects(current => [created, ...current]);
        }
      } catch (error) {
        // Handle error (e.g., revert optimistic state by re-fetching or not updating real state)
        console.error(error);
        const fetched = await getProjects();
        setProjects(fetched);
      }
    });
  };

  return (
    <div className="min-h-screen bg-neo-bg">
      <Header onAddIdea={() => {
        setEditingProject(null);
        setIsModalOpen(true);
      }} />
      
      <main>
        <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        <ProjectGrid projects={filteredProjects} onEdit={(project) => {
          setEditingProject(project);
          setIsModalOpen(true);
        }} />
      </main>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIdea}
        initialData={editingProject}
      />
    </div>
  );
}
