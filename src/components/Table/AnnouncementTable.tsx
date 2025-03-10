import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Announcement, Class } from '@prisma/client';

type AnnouncementType = Announcement & { class: Class | null };

type ClassProps = { name: string; id: number };

type AnnouncementTableProps = {
  data: AnnouncementType[];
  role?: string;
  classes?: ClassProps[];
};

const AnnouncementTable = ({ data, role, classes }: AnnouncementTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Date</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: AnnouncementType) => (
              <tr key={i.id} className="hover">
                <td className="text-nowrap text-xs">{i.title}</td>
                <td className="text-xs">{i.class?.name || '-'}</td>
                <td className="text-xs">
                  {new Intl.DateTimeFormat('en-US').format(i.date)}
                </td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal
                        table="announcement"
                        data={i}
                        classes={classes}
                      />
                      <DeleteModal table="announcement" id={i.id} />
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

export default AnnouncementTable;
