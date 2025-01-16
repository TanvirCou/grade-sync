'use client';
import Image from 'next/image';
import React from 'react';
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Total',
    count: 106,
    fill: 'white',
  },
  {
    name: 'Girls',
    count: 53,
    fill: '#FAE27C',
  },
  {
    name: 'Boys',
    count: 53,
    fill: '#C3EBFA',
  },
];

const CountChart = () => {
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
      <div className="relative h-[75%] w-full">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="40%"
            outerRadius="100%"
            barSize={20}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="flex justify-center gap-8">
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-3 w-3 rounded-full bg-[#FAE27C]" />
          <p className="font-bold">512</p>
          <p className="text-xs text-gray-500">Girls(55%)</p>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <div className="h-3 w-3 rounded-full bg-[#C3EBFA]" />
          <p className="font-bold">512</p>
          <p className="text-xs text-gray-500">Boys(55%)</p>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
