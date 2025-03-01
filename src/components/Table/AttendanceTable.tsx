import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Attendance } from '@prisma/client';

type AttendanceType = Attendance & { lesson: { id: number; name: string } } & {
  student: { id: string; name: string };
};

type LessonsProps = {
  name: string;
  id: number;
};

type AttendanceTableProps = {
  data: AttendanceType[];
  role?: string;
  lessons?: LessonsProps[];
};

const AttendanceTable = ({ data, role, lessons }: AttendanceTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Student</th>
            <th>Lesson</th>
            <th>Activities</th>
            {(role === 'admin' || role === 'teacher') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: AttendanceType) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">
                  {new Intl.DateTimeFormat('en-US').format(i.date)}
                </td>
                <td className="text-xs">{i.student.name}</td>
                <td className="text-xs">{i.lesson.name}</td>
                <td className="text-xs">{i.present ? 'present' : 'Absent'}</td>
                {(role === 'admin' || role === 'teacher') && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal
                        table="attendance"
                        data={i}
                        lessons={lessons}
                      />
                      <DeleteModal table="attendance" id={i.id} />
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

export default AttendanceTable;
