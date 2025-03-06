import CreateModal from '@/components/Form/CreateModal';
import EventTable from '@/components/Table/EventTable';
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
  title: 'grade-sync | events',
  description: 'This is a school management webapp',
};

const ListPageOfEvents = async (props: { searchParams: SearchParams }) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = sessionClaims?.sub;

  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value, mode: 'insensitive' };
        }
      }
    }
  }

  switch (role) {
    case 'admin':
      break;

    case 'teacher':
      query.OR = [
        { classId: null },
        { class: { lessons: { some: { teacherId: currentUserId } } } },
      ];
      break;
    case 'student':
      query.OR = [
        { classId: null },
        { class: { students: { some: { id: currentUserId } } } },
      ];
      break;
    case 'parent':
      query.OR = [
        { classId: null },
        { class: { students: { some: { parentId: currentUserId } } } },
      ];
      break;
    default:
      break;
  }

  const [events, totalCount] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.event.count({
      where: query,
    }),
  ]);

  const classes = await prisma.class.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="hidden text-lg font-semibold md:block">All Events</p>
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
              <CreateModal table="event" classes={classes} />
            )}
          </div>
        </div>
      </div>

      <div>
        <EventTable data={events} role={role} classes={classes} />
      </div>

      <div>
        <Pagination page={p} count={totalCount} />
      </div>
    </div>
  );
};

export default ListPageOfEvents;
