'use client';

import { useState, useOptimistic, useTransition, useEffect } from 'react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { Project } from '@prisma/client';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import ProjectGrid from '@/components/ProjectGrid';
import ProjectModal from '@/components/ProjectModal';
import { createProject, updateProject, getProjects } from '@/actions/projectActions';

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
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

  const handleSaveIdea = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const isEditing = !!editingProject;
    
    // Create an optimistic project object
    const optimisticData: Project = {
      ...data,
      id: isEditing ? editingProject.id : Math.random().toString(),
      createdAt: isEditing ? editingProject.createdAt : new Date(),
      updatedAt: new Date(),
      userId: isEditing ? editingProject.userId : 'optimistic-user',
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
        {!userId ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="bg-neo-panel p-8 neo-border neo-shadow-white max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl sm:text-6xl font-black mb-6 uppercase tracking-tighter">Your Ideas, Organized.</h2>
              <p className="text-lg sm:text-xl font-medium mb-8">
                Welcome to The Bench. A highly creative, private workspace to track your app ideas, target audiences, and tech stacks.
              </p>
              <div className="flex justify-center">
                <div className="neo-button-pink px-8 py-4 text-xl font-bold cursor-pointer transition-transform hover:-translate-y-1">
                  <SignInButton mode="modal" fallbackRedirectUrl="/" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <FilterBar currentFilter={filter} onFilterChange={setFilter} />
            <ProjectGrid projects={filteredProjects} onEdit={(project) => {
              setEditingProject(project);
              setIsModalOpen(true);
            }} />
          </>
        )}
      </main>

      {userId && (
        <ProjectModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveIdea}
          initialData={editingProject}
        />
      )}
    </div>
  );
}
