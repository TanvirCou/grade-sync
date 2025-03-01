import Image from 'next/image';
import React from 'react';
import EventCalendar from '../Calendar/EventCalendar';
import EventList from './EventList';

const EventContainer = ({ dateParams }: { dateParams: string | undefined }) => {
  return (
    <div className="flex flex-col gap-2">
      <EventCalendar />
      <div className="rounded-xl bg-white p-2">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Events</p>
          <Image
            src="/moreDark.png"
            width={18}
            height={18}
            alt=""
            className="cursor-pointer"
          />
        </div>
        <EventList dateParams={dateParams} />
      </div>
    </div>
  );
};

export default EventContainer;
