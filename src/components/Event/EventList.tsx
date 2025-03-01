import { prisma } from '@/lib/prisma';
import React from 'react';

const EventList = async ({
  dateParams,
}: {
  dateParams: string | undefined;
}) => {
  const date = dateParams ? new Date(dateParams) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  console.log(data.length === 0);

  return (
    <div>
      {data &&
        data.map((event) => (
          <div
            key={event.id}
            className="mt-2 rounded-md border-2 border-t-2 border-gray-100 px-1 py-3 odd:border-t-sky-400 even:border-t-purple-400"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{event.title}</p>
              <p className="text-xs text-gray-400">
                {event.startTime.toLocaleDateString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-600">{event.description}</p>
          </div>
        ))}
      {data.length === 0 && (
        <div className="flex h-[100px] w-full items-center justify-center">
          <p className="text-xs font-medium text-gray-600">
            No events found for this date.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;
