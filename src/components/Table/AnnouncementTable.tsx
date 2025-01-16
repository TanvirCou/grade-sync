import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type AnnouncementProps = {
  id: number;
  title: string;
  class: string;
  date: string;
};

type AnnouncementTableProps = {
  data: AnnouncementProps[];
};

const AnnouncementTable = ({ data }: AnnouncementTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: AnnouncementProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.title}</td>
                <td className="text-xs">{i.class}</td>
                <td className="text-xs">{i.date}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="announcement" />
                    {role === 'admin' && <DeleteModal table="announcement" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementTable;
