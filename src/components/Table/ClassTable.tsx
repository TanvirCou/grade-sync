import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Class, Teacher } from '@prisma/client';

type ClassType = Class & { supervisor: Teacher | null };

type TeachersDataProps = {
  name: string;
  id: string;
  surname: string;
};

type ClassGradesProps = {
  id: number;
  level: number;
};

type ClassTableProps = {
  data: ClassType[];
  role?: string;
  teachersData: TeachersDataProps[];
  classGrades: ClassGradesProps[];
};

const ClassTable = ({
  data,
  role,
  teachersData,
  classGrades,
}: ClassTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Capacity</th>
            <th>Grade</th>
            <th>Supervisor</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ClassType) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.name}</td>
                <td className="text-xs">{i.capacity}</td>
                <td className="text-xs">{i.name[0]}</td>
                <td className="text-nowrap text-xs">
                  {i.supervisor &&
                    i.supervisor.name + ' ' + i.supervisor.surname}
                </td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal
                        table="class"
                        data={i}
                        teachersData={teachersData}
                        classGrades={classGrades}
                      />
                      <DeleteModal table="class" id={i.id} />
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

export default ClassTable;
