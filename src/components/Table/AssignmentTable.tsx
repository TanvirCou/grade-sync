import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type AssignmentProps = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

type AssignmentTableProps = {
  data: AssignmentProps[];
};

const AssignmentTable = ({ data }: AssignmentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Class</th>
            <th>Teacher</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: AssignmentProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.subject}</td>
                <td className="text-xs">{i.class}</td>
                <td className="text-xs">{i.teacher}</td>
                <td className="text-xs">{i.dueDate}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="assignment" />
                    {role === 'admin' && <DeleteModal table="assignment" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
