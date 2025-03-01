import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Parent, Student } from '@prisma/client';

type ParentType = Parent & { students: Student[] };

type ParentTableProps = {
  data: ParentType[];
  role?: string;
};

const ParentTable = ({ data, role }: ParentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Info</th>
            <th>Student Name</th>
            <th>Phone</th>
            <th>Address</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ParentType) => (
              <tr key={i.id} className="hover">
                <td>
                  <p className="text-xs font-medium">{i.name}</p>
                  <p className="text-[10px] text-gray-500">{i.email}</p>
                </td>
                <td className="text-xs">
                  {i.students.map((s) => s.name).join(',')}
                </td>
                <td className="text-xs">{i.phone}</td>
                <td className="text-xs">{i.address}</td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal table="parent" data={i} />
                      <DeleteModal table="parent" id={i.id} />
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

export default ParentTable;
