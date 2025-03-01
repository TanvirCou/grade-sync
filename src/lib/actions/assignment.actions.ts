'use server';

import { AssignmentSchema } from '@/components/Form/AssignmentForm';
import { prisma } from '../prisma';
import { auth } from '@clerk/nextjs/server';

type CurrentState = { success: boolean; error: boolean };

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.id,
        },
      });
      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startTime,
        dueDate: data.dueTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  try {
    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.id,
        },
      });
      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.startTime,
        dueDate: data.dueTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const id = data.get('id') as string;

  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
        ...(role === 'teacher' ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};
