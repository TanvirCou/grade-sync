import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Subject, Teacher } from '@prisma/client';

type SubjectType = Subject & { teachers: Teacher[] };

type TeachersDataProps = {
  name: string;
  id: string;
  surname: string;
};

type SubjectTableProps = {
  data: SubjectType[];
  role?: string;
  teachersData: TeachersDataProps[];
};

const SubjectTable = ({ data, role, teachersData }: SubjectTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Teachers</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: SubjectType) => (
              <tr key={i.id} className="hover">
                <td className="text-nowrap text-xs">{i.name}</td>
                <td className="text-xs">
                  {i.teachers.map((t) => t.name).join(',')}
                </td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal
                        table="subject"
                        data={i}
                        teachersData={teachersData}
                      />
                      <DeleteModal table="subject" id={i.id} />
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

export default SubjectTable;
