import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import React from 'react';

const AttendanceCard = async ({ id }: { id: string }) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter((day) => day.present).length;
  const percentage = (presentDays / totalDays) * 100;

  return (
    <div className="flex w-full items-center justify-center gap-4 rounded-md bg-white py-3 md:flex-1">
      <Image
        src="/singleAttendance.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6"
      />
      <div>
        <h1 className="text-xl font-semibold">{percentage || '-'}%</h1>
        <span className="text-sm text-gray-400">Attendance</span>
      </div>
    </div>
  );
};

export default AttendanceCard;
