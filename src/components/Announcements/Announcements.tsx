import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';

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

      <div className="mt-2 flex flex-col gap-4">
        {data.map((announcement, index) => {
          const colors = ['bg-sky-100', 'bg-purple-100', 'bg-yellow-100'];
          const color = colors[index % colors.length];
          return (
            <div
              key={announcement.id}
              className={`rounded-md ${color} px-3 py-4`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {announcement.title}
                </p>
                <p className="text-xs italic text-gray-500">
                  {new Intl.DateTimeFormat('en-US').format(announcement.date)}
                </p>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
                {announcement.description}
              </p>
            </div>
          );
        })}
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
