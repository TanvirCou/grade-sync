'use server';

import { AttendanceSchema } from '@/components/Form/AttendanceForm';
import { prisma } from '../prisma';

type CurrentState = { success: boolean; error: boolean };

export const createAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {
  try {
    await prisma.attendance.create({
      data: {
        date: data.date,
        present: data.attendanceStatus === 'PRESENT' ? true : false,
        studentId: data.studentId,
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

export const updateAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {
  try {
    await prisma.attendance.update({
      where: {
        id: data.id,
      },
      data: {
        date: data.date,
        present: data.attendanceStatus === 'PRESENT' ? true : false,
        studentId: data.studentId,
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

export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;

  try {
    await prisma.attendance.delete({
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
