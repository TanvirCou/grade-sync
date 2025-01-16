import Image from 'next/image';
import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type StudentProps = {
  id: number;
  studentId: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  grade: number;
  class: string;
  address: string;
};

type StudentTableProps = {
  data: StudentProps[];
};

const StudentTable = ({ data }: StudentTableProps) => {
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: StudentProps) => (
              <tr key={i.id} className="hover">
                <td className="flex items-center gap-2">
                  <Image
                    src={i.photo}
                    alt=""
                    width={25}
                    height={25}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-medium">{i.name}</p>
                    <p className="text-[10px] text-gray-500">{i.class}</p>
                  </div>
                </td>
                <td className="text-xs">{i.studentId}</td>
                <td className="text-xs">{i.grade}</td>
                <td className="text-xs">{i.phone}</td>
                <td className="text-xs">{i.address}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="student" />
                    {role === 'admin' && <DeleteModal table="student" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
