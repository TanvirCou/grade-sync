import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Exam } from '@prisma/client';

type ExamType = Exam & {
  lesson: {
    subject: { name: string };
    teacher: { name: string; surname: string };
    class: { name: string };
  };
};

type ExamTableProps = {
  data: ExamType[];
  role?: string;
};

const ExamTable = ({ data, role }: ExamTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Class</th>
            <th>Teacher</th>
            <th>Exam Date</th>
            {(role === 'admin' || role === 'teacher') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ExamType) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.lesson.subject.name}</td>
                <td className="text-xs">{i.lesson.class.name}</td>
                <td className="text-xs">{i.lesson.teacher.name}</td>
                <td className="text-xs">
                  {new Intl.DateTimeFormat('en-US').format(i.startTime)}
                </td>
                {(role === 'admin' || role === 'teacher') && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal table="exam" />
                      <DeleteModal table="exam" />
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

export default ExamTable;
