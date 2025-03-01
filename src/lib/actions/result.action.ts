'use server';

import { ResultSchema } from '@/components/Form/ResultForm';
import { prisma } from '../prisma';

type CurrentState = { success: boolean; error: boolean };

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        resultType: data.resultType,
        examId: data.examId,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
      },
    });

    // await prisma.result.create({
    //     data: {
    //         title: data.title,
    //         startTime: data.startTime,
    //         endTime: data.endTime,
    //         lessonId: data.lessonId,
    //     }
    // })

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    if (data.examId) {
      await prisma.result.update({
        where: {
          id: data.id,
        },
        data: {
          score: data.score,
          resultType: data.resultType,
          examId: data.examId,
          assignmentId: null,
          studentId: data.studentId,
        },
      });
    } else {
      await prisma.result.update({
        where: {
          id: data.id,
        },
        data: {
          score: data.score,
          resultType: data.resultType,
          examId: null,
          assignmentId: data.assignmentId,
          studentId: data.studentId,
        },
      });
    }

    // await prisma.exam.update({
    // where: {
    //     id: data.id
    // },
    //     data: {
    //         title: data.title,
    //         startTime: data.startTime,
    //         endTime: data.endTime,
    //         lessonId: data.lessonId,
    //     }
    // })

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;

  try {
    await prisma.result.delete({
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
