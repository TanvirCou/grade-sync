import CreateModal from '@/components/Form/CreateModal';
import Pagination from '@/components/Table/Pagination';
import StudentTable from '@/components/Table/StudentTable';
import TableSearch from '@/components/Table/TableSearch';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export const metadata: Metadata = {
  title: 'GradeSync | Students',
  description: 'This is a school management webapp',
};

const ListPageOfStudents = async (props: { searchParams: SearchParams }) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'teacherId':
            query.class = {
              lessons: {
                some: { classId: parseInt(value) }, //need to check
              },
            };
            break;
          case 'search':
            query.name = { contains: value, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  const [students, totalCount] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.student.count({
      where: query,
    }),
  ]);

  const studentGrades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const studentClasses = await prisma.class.findMany({
    include: { _count: { select: { students: true } } },
  });

  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between md:gap-y-0">
        <p className="text-md font-semibold md:text-lg">All Students</p>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <TableSearch />
          <div className="flex items-center justify-end gap-2 md:justify-normal">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === 'admin' && (
              <CreateModal
                table="student"
                studentGrades={studentGrades}
                studentClasses={studentClasses}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <StudentTable data={students} role={role} />
      </div>

      <div>
        <Pagination page={p} count={totalCount} />
      </div>
    </div>
  );
};

export default ListPageOfStudents;
