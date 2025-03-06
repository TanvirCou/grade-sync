import CreateModal from '@/components/Form/CreateModal';
import ClassTable from '@/components/Table/ClassTable';
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
  title: 'GradeSync | Classes',
  description: 'This is a school management webapp',
};

const ListPageOfClasses = async (props: { searchParams: SearchParams }) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.ClassWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'supervisorId':
            query.supervisorId = value;
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

  const [classes, totalCount] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.class.count({
      where: query,
    }),
  ]);

  const teachersData = await prisma.teacher.findMany({
    select: {
      id: true,
      name: true,
      surname: true,
    },
  });

  const classGrades = await prisma.grade.findMany({
    select: {
      id: true,
      level: true,
    },
  });

  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="hidden text-lg font-semibold md:block">All Classes</p>
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
                table="class"
                teachersData={teachersData}
                classGrades={classGrades}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <ClassTable
          data={classes}
          role={role}
          teachersData={teachersData}
          classGrades={classGrades}
        />
      </div>

      <div>
        <Pagination page={p} count={totalCount} />
      </div>
    </div>
  );
};

export default ListPageOfClasses;
