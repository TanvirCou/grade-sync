import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Assignment } from '@prisma/client';

type AssignmentType = Assignment & {
  lesson: {
    subject: { name: string };
    teacher: { name: string; surname: string };
    class: { name: string };
  };
};

type AssignmentTableProps = {
  data: AssignmentType[];
  role?: string;
};

const AssignmentTable = ({ data, role }: AssignmentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Class</th>
            <th>Teacher</th>
            <th>Due Date</th>
            {(role === 'admin' || role === 'teacher') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: AssignmentType) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.lesson.subject.name}</td>
                <td className="text-xs">{i.lesson.class.name}</td>
                <td className="text-xs">{i.lesson.teacher.name}</td>
                <td className="text-xs">
                  {new Intl.DateTimeFormat('en-US').format(i.dueDate)}
                </td>
                {(role === 'admin' || role === 'teacher') && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal table="assignment" />
                      <DeleteModal table="assignment" />
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

export default AssignmentTable;
