'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  console.log(value);

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value.toLocaleDateString('en-US')}`);
    }
  }, [value, router]);
  return (
    <Calendar onChange={onChange} value={value} className="mx-1 lg:mx-0" />
  );
};

export default EventCalendar;
