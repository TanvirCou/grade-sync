import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type ClassProps = {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
};

type ClassTableProps = {
  data: ClassProps[];
};

const ClassTable = ({ data }: ClassTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Capacity</th>
            <th>Grade</th>
            <th>Supervisor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ClassProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.name}</td>
                <td className="text-xs">{i.capacity}</td>
                <td className="text-xs">{i.grade}</td>
                <td className="text-xs">{i.supervisor}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="class" />
                    {role === 'admin' && <DeleteModal table="class" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTable;
