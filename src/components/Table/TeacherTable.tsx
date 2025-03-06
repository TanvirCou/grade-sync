import Image from 'next/image';
import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import { Class, Subject, Teacher } from '@prisma/client';
import Link from 'next/link';

type TeacherType = Teacher & { subjects: Subject[] } & { classes: Class[] };

type subjectsProps = {
  id: number;
  name: string;
};

type TeacherTableProps = {
  data: TeacherType[];
  role?: string;
  subjects?: subjectsProps[];
};

const TeacherTable = ({ data, role }: TeacherTableProps) => {
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
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: TeacherType) => (
              <tr key={i.id} className="hover">
                <td className="flex items-center gap-2">
                  <Image
                    src={i.img || `/noAvatar.png`}
                    alt=""
                    width={25}
                    height={25}
                    className="hidden h-8 w-8 rounded-full object-cover md:block"
                  />
                  <div>
                    <p className="text-xs font-medium">{i.name}</p>
                    <p className="text-[10px] text-gray-500">{i.email}</p>
                  </div>
                </td>
                <td className="text-xs">{i.username}</td>
                <td className="text-xs">
                  {i.subjects.map((i) => i.name).join("'")}
                </td>
                <td className="text-xs">
                  {i.classes.map((i) => i.name).join(',')}
                </td>
                <td className="text-nowrap text-xs">{i.phone}</td>
                <td className="text-xs">{i.address}</td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/list/teachers/${i.id}`}
                        className={`flex h-6 w-6 items-center justify-center rounded-full bg-sky-200`}
                      >
                        <Image
                          src={`/view.png`}
                          alt=""
                          width={14}
                          height={14}
                        />
                      </Link>

                      <DeleteModal table="teacher" id={i.id} />
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

export default TeacherTable;
