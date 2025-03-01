import Announcements from '@/components/Announcements/Announcements';
import BigCalendarContainer from '@/components/Calendar/BigCalendarContainer';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const TeacherPage = async () => {
  const { sessionClaims } = await auth();
  const currentUserId = sessionClaims?.sub;

  return (
    <div className="w-full flex-1 gap-2 py-1.5 lg:flex lg:gap-0">
      <div className="mx-2 h-full w-full rounded-lg bg-white p-2 lg:w-[67%]">
        <p className="px-1 text-lg font-semibold">Schedule</p>
        <BigCalendarContainer type="teacherId" id={currentUserId} />
      </div>

      <div className="flex w-full flex-col gap-4 px-1 lg:w-[33%]">
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
