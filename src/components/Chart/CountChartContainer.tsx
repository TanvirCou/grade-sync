import Image from 'next/image';
import React from 'react';
import CountChart from './CountChart';
import { prisma } from '@/lib/prisma';

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ['sex'],
    _count: true,
  });

  const boys = data.find((i) => i.sex === 'MALE')?._count || 0;
  const girls = data.find((i) => i.sex === 'FEMALE')?._count || 0;

  return (
    <div className="h-full w-full p-2">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Students</p>
        <Image
          src="/moreDark.png"
          width={18}
          height={18}
          alt=""
          className="cursor-pointer"
        />
      </div>
      <CountChart boys={boys} girls={girls} />
      <div className="flex justify-center gap-8">
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-3 w-3 rounded-full bg-[#FAE27C]" />
          <p className="font-bold">{girls}</p>
          <p className="text-xs text-gray-500">
            Girls({Math.round((girls / (boys + girls)) * 100)}%)
          </p>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <div className="h-3 w-3 rounded-full bg-[#C3EBFA]" />
          <p className="font-bold">{boys}</p>
          <p className="text-xs text-gray-500">
            Boys({Math.round((girls / (boys + girls)) * 100)}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
