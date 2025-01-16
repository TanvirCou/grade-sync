import Image from 'next/image';
import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type TeacherProps = {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

type TeacherTableProps = {
  data: TeacherProps[];
};

const TeacherTable = ({ data }: TeacherTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Info</th>
            <th>Teacher ID</th>
            <th>Subjects</th>
            <th>Classes</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: TeacherProps) => (
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
                    <p className="text-[10px] text-gray-500">{i.email}</p>
                  </div>
                </td>
                <td className="text-xs">{i.teacherId}</td>
                <td className="text-xs">{i.subjects.join(',')}</td>
                <td className="text-xs">{i.classes.join(',')}</td>
                <td className="text-xs">{i.phone}</td>
                <td className="text-xs">{i.address}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="teacher" data={i} />
                    {role === 'admin' && <DeleteModal table="teacher" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
