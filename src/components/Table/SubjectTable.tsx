import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type SubjectProps = {
  id: number;
  name: string;
  teachers: string[];
};

type SubjectTableProps = {
  data: SubjectProps[];
};

const SubjectTable = ({ data }: SubjectTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Teachers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: SubjectProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.name}</td>
                <td className="text-xs">{i.teachers.join(',')}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="subject" />
                    {role === 'admin' && <DeleteModal table="subject" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectTable;
