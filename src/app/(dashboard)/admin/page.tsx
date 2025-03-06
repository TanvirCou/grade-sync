import Announcements from '@/components/Announcements/Announcements';
import UserCard from '@/components/Card/UserCard';
import AttendanceChartContainer from '@/components/Chart/AttendanceChartContainer';
import CountChartContainer from '@/components/Chart/CountChartContainer';
import FinanceChart from '@/components/Chart/FinanceChart';
import EventContainer from '@/components/Event/EventContainer';
import { prisma } from '@/lib/prisma';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const AdminPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  const { date } = searchParams;

  const adminCount = await prisma.admin.count();
  const teacherCount = await prisma.teacher.count();
  const studentCount = await prisma.student.count();
  const parentCount = await prisma.parent.count();

  return (
    <div className="w-full py-1.5 lg:flex">
      <div className="flex w-full flex-col gap-2 p-1 px-2 lg:w-[67%]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <UserCard type="admin" count={adminCount} />
          <UserCard type="teacher" count={teacherCount} />
          <UserCard type="student" count={studentCount} />
          <UserCard type="parent" count={parentCount} />
        </div>
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="h-[350px] w-full rounded-xl bg-white lg:w-[35%]">
            <CountChartContainer />
          </div>
          <div className="h-[350px] w-full rounded-xl bg-white lg:w-[65%]">
            <AttendanceChartContainer />
          </div>
        </div>

        <div className="h-[400px] w-full">
          <FinanceChart />
        </div>
      </div>

      <div className="mt-2 flex w-full flex-col gap-2 px-1 lg:mt-0 lg:w-[33%]">
        <EventContainer dateParams={date} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
