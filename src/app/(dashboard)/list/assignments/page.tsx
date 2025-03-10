import CreateModal from '@/components/Form/CreateModal';
import AssignmentTable from '@/components/Table/AssignmentTable';
import Pagination from '@/components/Table/Pagination';
import TableSearch from '@/components/Table/TableSearch';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export const metadata: Metadata = {
  title: 'GradeSync | Assignments',
  description: 'This is a school management webapp',
};

const ListPageOfAssignments = async (props: { searchParams: SearchParams }) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = sessionClaims?.sub;

  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.AssignmentWhereInput = {};

  query.lesson = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lesson.classId = parseInt(value);
            break;
          case 'teacherId':
            query.lesson.teacherId = value;
            break;
          case 'search':
            query.lesson.subject = {
              name: { contains: value, mode: 'insensitive' },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.lesson.teacherId = currentUserId;
      break;
    case 'student':
      query.lesson.class = { students: { some: { id: currentUserId } } };
      break;
    case 'parent':
      query.lesson.class = { students: { some: { parentId: currentUserId } } };
      break;
    default:
      break;
  }

  const [assignments, totalCount] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
            subject: { select: { name: true } },
          },
        },
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.assignment.count({
      where: query,
    }),
  ]);

  const lessons = await prisma.lesson.findMany({
    where: {
      ...(role === 'teacher' ? { teacherId: currentUserId } : {}),
    },
    select: { id: true, name: true },
  });

  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between md:gap-y-0">
        <p className="text-md font-semibold md:text-lg">All Assignments</p>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <TableSearch />
          <div className="flex items-center justify-end gap-2 md:justify-normal">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === 'admin' || role === 'teacher') && (
              <CreateModal table="assignment" lessons={lessons} />
            )}
          </div>
        </div>
      </div>

      <div>
        <AssignmentTable data={assignments} role={role} lessons={lessons} />
      </div>

      <div>
        <Pagination page={p} count={totalCount} />
      </div>
    </div>
  );
};

export default ListPageOfAssignments;
