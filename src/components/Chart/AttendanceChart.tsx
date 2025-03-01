'use client';

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

// const data = [
//   {
//     name: 'Mon',
//     present: 60,
//     absent: 40,
//   },
//   {
//     name: 'Tue',
//     present: 70,
//     absent: 60,
//   },
//   {
//     name: 'Wed',
//     present: 90,
//     absent: 75,
//   },
//   {
//     name: 'Thu',
//     present: 90,
//     absent: 75,
//   },
//   {
//     name: 'Fri',
//     present: 65,
//     absent: 55,
//   },
// ];

const AttendanceChart = ({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) => {
  return (
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
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
  );
};

export default AttendanceChart;
