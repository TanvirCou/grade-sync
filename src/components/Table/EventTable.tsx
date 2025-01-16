import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type EventProps = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
};

type EventTableProps = {
  data: EventProps[];
};

const EventTable = ({ data }: EventTableProps) => {
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: EventProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.title}</td>
                <td className="text-xs">{i.class}</td>
                <td className="text-xs">{i.date}</td>
                <td className="text-xs">{i.startTime}</td>
                <td className="text-xs">{i.endTime}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="event" />
                    {role === 'admin' && <DeleteModal table="event" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
