import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Lesson } from '@prisma/client';

type LessonType = Lesson & { class: { name: string } } & {
  subject: { name: string };
} & { teacher: { name: string; surname: string } };

type LessonTableProps = {
  data: LessonType[];
  role?: string;
};
const LessonTable = ({ data, role }: LessonTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Class</th>
            <th>Teacher</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: LessonType) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.subject.name}</td>
                <td className="text-xs">{i.class.name}</td>
                <td className="text-xs">
                  {i.teacher.name + ' ' + i.teacher.surname}
                </td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal table="lesson" />
                      <DeleteModal table="lesson" />
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

export default LessonTable;
