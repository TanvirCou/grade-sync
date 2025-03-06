import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Class, Event } from '@prisma/client';

type EventType = Event & { class: Class | null };

type ClassProps = { name: string; id: number };

type EventTableProps = {
  data: EventType[];
  role?: string;
  classes?: ClassProps[];
};

const EventTable = ({ data, role, classes }: EventTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: EventType) => (
              <tr key={i.id} className="hover">
                <td className="text-nowrap text-xs">{i.title}</td>
                <td className="text-xs">{i.class?.name || '-'}</td>
                <td className="text-xs">
                  {new Intl.DateTimeFormat('en-US').format(i.startTime)}
                </td>
                <td className="text-xs">
                  {i.startTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </td>
                <td className="text-xs">
                  {i.endTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal table="event" data={i} classes={classes} />
                      <DeleteModal table="event" id={i.id} />
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
