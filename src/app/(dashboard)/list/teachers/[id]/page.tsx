import Announcements from '@/components/Announcements/Announcements';
import BigCalendarContainer from '@/components/Calendar/BigCalendarContainer';
import PerformanceChart from '@/components/Chart/PerformanceChart';
import UpdateModal from '@/components/Form/UpdateModal';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;

  const teacherData = await prisma.teacher.findUnique({
    where: { id },
  });

  return {
    title: `grade-sync |${teacherData?.name}`,
  };
}

const SingleTeacherPage = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const teacherData = await prisma.teacher.findUnique({
    where: { id },
    include: {
      subjects: true,
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  if (!teacherData) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-2 p-2 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex w-full items-center gap-2 rounded-md bg-sky-200 px-2 py-3 md:gap-0 lg:w-1/2 xl:gap-2">
            <div className="flex w-1/3 items-center justify-center">
              <Image
                src={teacherData?.img || '/noAvatar.png'}
                alt=""
                width={50}
                height={50}
                className="h-28 w-28 rounded-full object-cover"
              />
            </div>
            <div className="flex w-2/3 flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-md font-medium">
                  {teacherData?.name + ' ' + teacherData?.surname}
                </p>
                {role === 'admin' && (
                  <UpdateModal
                    table="teacher"
                    subjects={subjects}
                    data={teacherData}
                  />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>

              <div className="flex flex-col md:flex-row md:gap-x-20 lg:flex-col lg:gap-x-0 xl:flex-row xl:items-center xl:justify-between xl:gap-x-0">
                <div>
                  <div className="flex items-center gap-1">
                    <Image src="/blood.png" alt="" width={12} height={12} />
                    <p className="text-xs">{teacherData?.bloodType}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image src="/date.png" alt="" width={12} height={12} />
                    <p className="text-xs">
                      {new Intl.DateTimeFormat('en-US').format(
                        teacherData?.birthday
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Image src="/mail.png" alt="" width={12} height={12} />
                    <span className="text-xs">{teacherData?.email || '-'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image src="/phone.png" alt="" width={12} height={12} />
                    <span className="text-xs">{teacherData?.phone || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 lg:w-[49%]">
            <div className="flex flex-col items-center gap-1 md:flex-row">
              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleAttendance.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">90%</h1>
                  <span className="text-sm text-gray-400">Attendance</span>
                </div>
              </div>

              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleBranch.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">
                    {teacherData?._count.subjects}
                  </h1>
                  <span className="text-sm text-gray-400">Branches</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 md:flex-row">
              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleLesson.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">
                    {teacherData?._count.lessons}
                  </h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>

              <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
                <Image
                  src="/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <div>
                  <h1 className="text-xl font-semibold">
                    {teacherData?._count.classes}
                  </h1>
                  <span className="text-sm text-gray-400">Classes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 h-[900px] rounded-md bg-white p-2">
          <p className="px-1 text-lg font-semibold">Teacher&apos;s Schedule</p>
          <BigCalendarContainer type="teacherId" id={teacherData?.id} />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 xl:w-1/3">
        <div className="rounded-md bg-white px-4 py-3">
          <p className="text-lg font-medium">Shortcuts</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
            <Link
              href={`/list/classes?supervisorId=${teacherData.id}`}
              className="cursor-pointer rounded-md bg-sky-100 p-2"
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              href={`/list/students?teacherId=${teacherData.id}`}
              className="cursor-pointer rounded-md bg-purple-100 p-2"
            >
              Teacher&apos;s Students
            </Link>
            <Link
              href={`/list/lessons?teacherId=${teacherData.id}`}
              className="cursor-pointer rounded-md bg-yellow-100 p-2"
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              href={`/list/assignments?teacherId=${teacherData.id}`}
              className="cursor-pointer rounded-md bg-pink-100 p-2"
            >
              Teacher&apos;s Assignments
            </Link>
            <Link
              href={`/list/exams?teacherId=${teacherData.id}`}
              className="cursor-pointer rounded-md bg-teal-100 p-2"
            >
              Teacher&apos;s Exams
            </Link>
          </div>
        </div>

        <div className="h-[300px]">
          <PerformanceChart />
        </div>

        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
