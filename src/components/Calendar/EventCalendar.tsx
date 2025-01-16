'use client';
import Image from 'next/image';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// TEMPORARY
const events = [
  {
    id: 1,
    title: 'Lorem ipsum dolor',
    time: '12:00 PM - 2:00 PM',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor',
    time: '12:00 PM - 2:00 PM',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 3,
    title: 'Lorem ipsum dolor',
    time: '12:00 PM - 2:00 PM',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div className="flex flex-col gap-2">
      <Calendar onChange={onChange} value={value} className="mx-1 lg:mx-0" />

      <div className="rounded-xl bg-white p-2">
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

        <div>
          {events.map((event) => (
            <div
              key={event.id}
              className="mt-2 rounded-md border-2 border-t-2 border-gray-100 px-1 py-3 odd:border-t-sky-400 even:border-t-purple-400"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-gray-400">{event.time}</p>
              </div>
              <p className="mt-2 text-xs text-gray-600">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
