'use client';
import Image from 'next/image';
import React from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 88, fill: '#C3EBFA' },
  { name: 'Group B', value: 12, fill: '#FAE27C' },
];

const PerformanceChart = () => {
  return (
    <div className="relative h-full w-full rounded-md bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Attendance</p>
        <Image
          src="/moreDark.png"
          width={18}
          height={18}
          alt=""
          className="cursor-pointer"
        />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-2xl font-semibold">9.2</p>
        <p className="text-[10px] text-gray-400">of 10 max TS</p>
      </div>
      <p className="absolute bottom-16 left-0 right-0 text-center text-sm font-medium">
        1st Semester - 2nd Semester
      </p>
    </div>
  );
};

export default PerformanceChart;
