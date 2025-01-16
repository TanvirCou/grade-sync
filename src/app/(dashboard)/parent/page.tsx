import Announcements from '@/components/Announcements/Announcements';
import BigCalendar from '@/components/Calendar/BigCalendar';
import React from 'react';

const ParentPage = () => {
  return (
    <div className="w-full flex-1 gap-2 py-1.5 lg:flex lg:gap-0">
      <div className="mx-2 h-full w-full rounded-lg bg-white p-2 lg:w-[67%]">
        <p className="px-1 text-lg font-semibold">Schedule(John)</p>
        <BigCalendar />
      </div>

      <div className="flex w-full flex-col gap-4 px-1 lg:w-[33%]">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
