import Announcements from '@/components/Announcements/Announcements';
import BigCalendarContainer from '@/components/Calendar/BigCalendarContainer';
import AttendanceCard from '@/components/Card/AttendanceCard';
import PerformanceChart from '@/components/Chart/PerformanceChart';
import UpdateModal from '@/components/Form/UpdateModal';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;

  const studentData = await prisma.student.findUnique({
    where: { id },
  });

  return {
    title: `grade-sync |${studentData?.name}`,
  };
}

const SingleStudentPage = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const studentData = await prisma.student.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
  });

  const studentGrades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const studentClasses = await prisma.class.findMany({
    include: { _count: { select: { students: true } } },
  });

  if (!studentData) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-2 p-2 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex w-full items-center gap-2 rounded-md bg-sky-200 px-2 py-3 md:gap-0 lg:w-1/2 xl:gap-2">
            <div className="flex w-1/3 items-center justify-center">
              <Image
                src={studentData?.img || '/noAvatar.png'}
                alt=""
                width={50}
                height={50}
                className="h-28 w-28 rounded-full object-cover"
              />
            </div>
            <div className="flex w-2/3 flex-col gap-3">
              <div className="flex items-center gap-3">
                <p className="text-md font-medium">
                  {studentData?.name + ' ' + studentData?.surname}
                </p>
                {role === 'admin' && (
                  <UpdateModal
                    table="student"
                    data={studentData}
                    studentGrades={studentGrades}
                    studentClasses={studentClasses}
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
                    <p className="text-xs">{studentData?.bloodType}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image src="/date.png" alt="" width={12} height={12} />
                    <p className="text-xs">
                      {new Intl.DateTimeFormat('en-US').format(
                        studentData?.birthday
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Image src="/mail.png" alt="" width={12} height={12} />
                    <span className="text-xs">{studentData?.email}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Image src="/phone.png" alt="" width={12} height={12} />
                    <span className="text-xs">{studentData?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 lg:w-[49%]">
            <div className="flex flex-col items-center gap-1 md:flex-row">
              <Suspense fallback="Loading...">
                <AttendanceCard id={studentData?.id} />
              </Suspense>

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
                    {studentData?.class.name.charAt(0)}
                  </h1>
                  <span className="text-sm text-gray-400">Grade</span>
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
                    {studentData?.class._count.lessons}
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
                    {studentData?.class.name}
                  </h1>
                  <span className="text-sm text-gray-400">Class</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 h-[900px] rounded-md bg-white p-2">
          <p className="px-1 text-lg font-semibold">Student&apos;s Schedule</p>
          <BigCalendarContainer type="classId" id={studentData?.class.id} />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 xl:w-1/3">
        <div className="rounded-md bg-white px-4 py-3">
          <p className="text-lg font-medium">Shortcuts</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
            <Link
              href={`/list/teachers?classId=${studentData.class.id}`}
              className="cursor-pointer rounded-md bg-sky-100 p-2"
            >
              Student&apos;s Teachers
            </Link>
            <Link
              href={`/list/lessons?classId=${studentData.class.id}`}
              className="cursor-pointer rounded-md bg-yellow-100 p-2"
            >
              Student&apos;s Lessons
            </Link>
            <Link
              href={`/list/exams?classId=${studentData.class.id}`}
              className="cursor-pointer rounded-md bg-teal-100 p-2"
            >
              Student&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?classId=${studentData.class.id}`}
              className="cursor-pointer rounded-md bg-purple-100 p-2"
            >
              Student&apos;s Assignments
            </Link>
            <Link
              href={`/list/results?studentId=${studentData.id}`}
              className="cursor-pointer rounded-md bg-pink-100 p-2"
            >
              Student&apos;s Results
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

export default SingleStudentPage;
