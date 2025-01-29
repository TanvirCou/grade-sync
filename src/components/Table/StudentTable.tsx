import Image from 'next/image';
import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Class, Student } from '@prisma/client';

type StudentType = Student & { class: Class };

type StudentTableProps = {
  data: StudentType[];
  role?: string;
};

const StudentTable = ({ data, role }: StudentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Info</th>
            <th>Student ID</th>
            <th>Grade</th>
            <th>Phone</th>
            <th>Address</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: StudentType) => (
              <tr key={i.id} className="hover">
                <td className="flex items-center gap-2">
                  <Image
                    src={i.img || `/noAvatar.png`}
                    alt=""
                    width={25}
                    height={25}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-medium">{i.name}</p>
                    <p className="text-[10px] text-gray-500">{i.class.name}</p>
                  </div>
                </td>
                <td className="text-xs">{i.username}</td>
                <td className="text-xs">{i.class.name[0]}</td>
                <td className="text-xs">{i.phone}</td>
                <td className="text-xs">{i.address}</td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal table="student" />
                      <DeleteModal table="student" />
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

export default StudentTable;
