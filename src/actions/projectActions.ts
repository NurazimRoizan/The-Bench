'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Project, Task } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

export type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & {
  tasks?: { id?: string; title: string; completed: boolean }[];
};

export async function getProjects() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { tasks: true },
    });
    return projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function createProject(data: ProjectFormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const { tasks, ...projectData } = data;

    const newProject = await prisma.project.create({
      data: {
        ...projectData,
        userId,
        tasks: {
          create: tasks?.map(t => ({ title: t.title, completed: t.completed })) || [],
        },
      },
      include: { tasks: true },
    });
    revalidatePath('/');
    return newProject;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw new Error('Failed to create project');
  }
}

export async function updateProject(id: string, data: Partial<ProjectFormData>) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Verify ownership
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) throw new Error('Unauthorized');

    const { tasks, ...projectData } = data;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        // Simplest approach: Delete existing tasks and recreate them if tasks array is provided
        ...(tasks && {
          tasks: {
            deleteMany: {},
            create: tasks.map(t => ({ title: t.title, completed: t.completed })),
          }
        })
      },
      include: { tasks: true },
    });
    revalidatePath('/');
    return updatedProject;
  } catch (error) {
    console.error('Failed to update project:', error);
    throw new Error('Failed to update project');
  }
}

export async function deleteProject(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Verify ownership
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) throw new Error('Unauthorized');

    await prisma.project.delete({
      where: { id },
    });
    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw new Error('Failed to delete project');
  }
}
