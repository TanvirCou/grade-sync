import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type LessonProps = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
};

type LessonTableProps = {
  data: LessonProps[];
};

const LessonTable = ({ data }: LessonTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Class</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: LessonProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.subject}</td>
                <td className="text-xs">{i.class}</td>
                <td className="text-xs">{i.teacher}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="lesson" />
                    {role === 'admin' && <DeleteModal table="lesson" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LessonTable;
