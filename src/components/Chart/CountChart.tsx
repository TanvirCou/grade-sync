'use client';
import Image from 'next/image';
import React from 'react';
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const data = [
    {
      name: 'Total',
      count: boys + girls,
      fill: 'white',
    },
    {
      name: 'Girls',
      count: girls,
      fill: '#FAE27C',
    },
    {
      name: 'Boys',
      count: boys,
      fill: '#C3EBFA',
    },
  ];
  return (
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
  );
};

export default CountChart;
