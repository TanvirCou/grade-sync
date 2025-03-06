import CreateModal from '@/components/Form/CreateModal';
import Pagination from '@/components/Table/Pagination';
import ResultTable from '@/components/Table/ResultTable';
import TableSearch from '@/components/Table/TableSearch';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export const metadata: Metadata = {
  title: 'GradeSync | Results',
  description: 'This is a school management webapp',
};

const ListPageOfResults = async (props: { searchParams: SearchParams }) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = sessionClaims?.sub;

  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.studentId = value;
            break;
          case 'search':
            query.OR = [
              { exam: { title: { contains: value, mode: 'insensitive' } } },
              { student: { name: { contains: value, mode: 'insensitive' } } },
            ];
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
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId } } },
        { assignment: { lesson: { teacherId: currentUserId } } },
      ];
      break;
    case 'student':
      query.studentId = currentUserId;
      break;
    case 'parent':
      query.student = { parentId: currentUserId };
      break;
    default:
      break;
  }

  const [results, totalCount] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true } },
              },
            },
          },
        },
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.result.count({
      where: query,
    }),
  ]);

  const exams = await prisma.exam.findMany({
    where: {
      ...(role === 'teacher' ? { lesson: { teacherId: currentUserId } } : {}),
    },
    select: { id: true, title: true },
  });

  const assignments = await prisma.assignment.findMany({
    where: {
      ...(role === 'teacher' ? { lesson: { teacherId: currentUserId } } : {}),
    },
    select: { id: true, title: true },
  });

  // const allres = [...exams, ...assignments];
  // // console.log(allres);

  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="hidden text-lg font-semibold md:block">All Results</p>
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
              <CreateModal
                table="result"
                exams={exams}
                assignments={assignments}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <ResultTable
          data={results}
          role={role}
          exams={exams}
          assignments={assignments}
        />
      </div>

      <div>
        <Pagination page={p} count={totalCount} />
      </div>
    </div>
  );
};

export default ListPageOfResults;
