import Announcements from '@/components/Announcements/Announcements';
import EventCalendar from '@/components/Calendar/EventCalendar';
import UserCard from '@/components/Card/UserCard';
import AttendanceChart from '@/components/Chart/AttendanceChart';
import CountChart from '@/components/Chart/CountChart';
import FinanceChart from '@/components/Chart/FinanceChart';
import React from 'react';

const AdminPage = () => {
  return (
    <div className="w-full py-1.5 lg:flex">
      <div className="flex w-full flex-col gap-2 p-1 px-2 lg:w-[67%]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <UserCard type="student" />
          <UserCard type="parent" />
          <UserCard type="teacher" />
          <UserCard type="staff" />
        </div>
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="h-[350px] w-full rounded-xl bg-white lg:w-[35%]">
            <CountChart />
          </div>
          <div className="h-[350px] w-full rounded-xl bg-white lg:w-[65%]">
            <AttendanceChart />
          </div>
        </div>

        <div className="h-[400px] w-full">
          <FinanceChart />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 px-1 lg:w-[33%]">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
