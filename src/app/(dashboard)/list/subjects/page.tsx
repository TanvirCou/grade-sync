import CreateModal from '@/components/Form/CreateModal';
import Pagination from '@/components/Table/Pagination';
import SubjectTable from '@/components/Table/SubjectTable';
import TableSearch from '@/components/Table/TableSearch';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export const metadata: Metadata = {
  title: 'GradeSync | Subjects',
  description: 'This is a school management webapp',
};

const ListPageOfSubjects = async (props: { searchParams: SearchParams }) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.name = { contains: value, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  const [subjects, totalCount] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.subject.count({
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

  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between md:gap-y-0">
        <p className="text-md font-semibold md:text-lg">All Subjects</p>
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
              <CreateModal table="subject" teachersData={teachersData} />
            )}
          </div>
        </div>
      </div>

      <div>
        <SubjectTable data={subjects} role={role} teachersData={teachersData} />
      </div>

      <div>
        <Pagination page={p} count={totalCount} />
      </div>
    </div>
  );
};

export default ListPageOfSubjects;
