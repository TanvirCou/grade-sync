'use server';

import { TeacherSchema } from '@/components/Form/TeacherForm';
import { prisma } from '../prisma';
import { clerkClient } from '@clerk/nextjs/server';

type CurrentState = { success: boolean; error: boolean };

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'teacher' },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data?.subjects?.map((i) => ({ id: parseInt(i!) })),
        },
      },
    });

    // revalidatePath("/list/teachers")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };

    // const errorMessage = err && err?.errors?.map((e: any) => e.message)
    // console.log(err?.errors?.map((e: any) => e.message));
    // return {success: false, error: true, message: errorMessage && errorMessage}
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) return { success: false, error: true };
  try {
    const client = await clerkClient();

    await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== '' && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data?.subjects?.map((i) => ({ id: parseInt(i!) })),
        },
      },
    });

    // revalidatePath("/list/teachers")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  console.log(id);

  try {
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err)); //same name error problem
    return { success: false, error: true };
  }
};
