import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type ParentProps = {
  id: number;
  name: string;
  students: string[];
  email: string;
  phone: string;
  address: string;
};

type ParentTableProps = {
  data: ParentProps[];
};

const ParentTable = ({ data }: ParentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Info</th>
            <th>Student Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ParentProps) => (
              <tr key={i.id} className="hover">
                <td>
                  <p className="text-xs font-medium">{i.name}</p>
                  <p className="text-[10px] text-gray-500">{i.email}</p>
                </td>
                <td className="text-xs">{i.students.join(',')}</td>
                <td className="text-xs">{i.phone}</td>
                <td className="text-xs">{i.address}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="parent" />
                    {role === 'admin' && <DeleteModal table="parent" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParentTable;
