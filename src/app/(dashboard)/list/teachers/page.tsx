import CreateModal from '@/components/Form/CreateModal';
import Pagination from '@/components/Table/Pagination';
import TableSearch from '@/components/Table/TableSearch';
import TeacherTable from '@/components/Table/TeacherTable';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const ListPageOfTeachers = async (props: { searchParams: SearchParams }) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // const teachers = await prisma.teacher.findMany({
  //   include: {
  //     subjects: true,
  //     classes: true
  //   },
  //   take: 10,
  //   skip: 10 * (p - 1)
  // });

  // const totalCount = await prisma.teacher.count();
  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lessons = {
              some: { classId: parseInt(value) },
            };
            break;
          case 'search':
            query.name = { contains: value, mode: 'insensitive' };
        }
      }
    }
  }

  const [teachers, totalCount] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.teacher.count({
      where: query,
    }),
  ]);

  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="hidden text-lg font-semibold md:block">All Teachers</p>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <TableSearch />
          <div className="flex items-center justify-end gap-2 md:justify-normal">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === 'admin' && <CreateModal table="teacher" />}
          </div>
        </div>
      </div>

      <div>
        <TeacherTable data={teachers} role={role} />
      </div>

      <div>
        <Pagination page={p} count={totalCount} />
      </div>
    </div>
  );
};

export default ListPageOfTeachers;
