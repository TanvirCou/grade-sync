'use server';

import { prisma } from '../prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { ParentSchema } from '@/components/Form/ParentForm';

type CurrentState = { success: boolean; error: boolean };

export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    const childrens = data.studentsId.split(',');
    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'parent' },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        students: {
          connect: childrens.map((i) => ({ id: i })),
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

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) return { success: false, error: true };
  try {
    const childrens = data.studentsId.split(',');

    const client = await clerkClient();

    await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.parent.update({
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
        students: {
          set: childrens?.map((i) => ({ id: i })),
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

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  console.log(id);

  try {
    // const parent = await prisma.parent.findUnique({
    //     where: { id: id },
    //   });
    //   console.log(parent);
    await prisma.student.deleteMany({
      where: { parentId: id },
    });

    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(JSON.stringify(err));
    return { success: false, error: true };
  }
};
