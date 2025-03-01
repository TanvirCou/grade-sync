import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import React from 'react';

const Announcements = async () => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = sessionClaims?.sub;

  const query: Prisma.AnnouncementWhereInput = {};

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

  const data = await prisma.announcement.findMany({
    where: query,
    take: 3,
    orderBy: { date: 'desc' },
  });

  return (
    <div className="rounded-xl bg-white p-2">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Announcements</p>
        <span className="text-xs text-gray-500">View All</span>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        {data[0] && (
          <div className="rounded-md bg-sky-100 px-2 py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{data[0].title}</p>
              <p className="text-xs text-gray-400">
                {new Intl.DateTimeFormat('en-US').format(data[0].date)}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-600">{data[0].description}</p>
          </div>
        )}

        {data[1] && (
          <div className="rounded-md bg-purple-100 px-2 py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{data[1].title}</p>
              <p className="text-xs text-gray-400">
                {new Intl.DateTimeFormat('en-US').format(data[1].date)}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-600">{data[1].description}</p>
          </div>
        )}

        {data[0] && (
          <div className="rounded-md bg-yellow-100 px-2 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{data[2].title}</p>
              <p className="text-xs text-gray-400">
                {new Intl.DateTimeFormat('en-US').format(data[2].date)}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-600">{data[2].description}</p>
          </div>
        )}
      </div>

      {data.length === 0 && (
        <div className="flex h-[100px] w-full items-center justify-center">
          <p className="text-xs font-medium text-gray-600">
            No announcements found.
          </p>
        </div>
      )}
    </div>
  );
};

export default Announcements;
