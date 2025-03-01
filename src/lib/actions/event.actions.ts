'use server';

import { EventSchema } from '@/components/Form/EventForm';
import { prisma } from '../prisma';

type CurrentState = { success: boolean; error: boolean };

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};
