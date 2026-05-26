'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Project } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

export async function getProjects() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const newProject = await prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath('/');
    return newProject;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw new Error('Failed to create project');
  }
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Verify ownership
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) throw new Error('Unauthorized');

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
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
