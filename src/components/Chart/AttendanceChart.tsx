'use client';
import Image from 'next/image';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Mon',
    present: 60,
    absent: 40,
  },
  {
    name: 'Tue',
    present: 70,
    absent: 60,
  },
  {
    name: 'Wed',
    present: 90,
    absent: 75,
  },
  {
    name: 'Thu',
    present: 90,
    absent: 75,
  },
  {
    name: 'Fri',
    present: 65,
    absent: 55,
  },
];

const AttendanceChart = () => {
  return (
    <div className="h-full w-full p-2">
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

      <div className="mt-2 h-[90%] w-full">
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={data}
            barSize={20}
            margin={{
              top: 5,
              right: 20,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ddd"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: '12px', fill: 'gray' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: '12px', fill: 'gray' }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="present"
              fill="#C3EBFA"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="absent"
              fill="#FAE27C"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
