import React from 'react';
import BigCalendar from './BigCalendar';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { adjustScheduleToCurrentWeek } from '@/lib/utils';

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: 'teacherId' | 'classId';
  id?: string | number;
}) => {
  const query: Prisma.LessonWhereInput = {};

  if (type === 'teacherId') {
    query.teacherId = id as string;
  } else if (type === 'classId') {
    query.classId = id as number;
  }

  const dataRes = await prisma.lesson.findMany({
    where: query,
  });

  const data = dataRes.map((i) => ({
    title: i.name,
    start: i.startTime,
    end: i.endTime,
  }));

  const adjustedData = adjustScheduleToCurrentWeek(data);

  // console.log(adjustedData);

  return <BigCalendar data={adjustedData} />;
};

export default BigCalendarContainer;
