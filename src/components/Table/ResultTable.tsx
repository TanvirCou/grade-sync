import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Result } from '@prisma/client';

type ResultType = Result & { student: { name: string } } & {
  exam: {
    title: string;
    startTime: Date;
    lesson: { class: { name: string }; teacher: { name: string } };
  } | null;
} & {
  assignment: {
    title: string;
    startDate: Date;
    lesson: { class: { name: string }; teacher: { name: string } };
  } | null;
};

type ResultTableProps = {
  data: ResultType[];
  role?: string;
};

const ResultTable = ({ data, role }: ResultTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Title</th>
            <th>Student</th>
            <th>Score</th>
            <th>Teacher</th>
            <th>Class</th>
            <th>Date</th>
            {(role === 'admin' || role === 'teacher') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ResultType) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">
                  {i.exam?.title || i.assignment?.title}
                </td>
                <td className="text-xs">{i.student.name}</td>
                <td className="text-xs">{i.score}</td>
                <td className="text-xs">
                  {i.exam?.lesson.teacher.name ||
                    i.assignment?.lesson.teacher.name}
                </td>
                <td className="text-xs">
                  {i.exam?.lesson.class.name || i.assignment?.lesson.class.name}
                </td>
                <td className="text-xs">
                  {i.exam
                    ? new Intl.DateTimeFormat('en-US').format(i.exam.startTime)
                    : new Intl.DateTimeFormat('en-US').format(
                        i.assignment?.startDate
                      )}
                </td>
                {(role === 'admin' || role === 'teacher') && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal table="result" />
                      <DeleteModal table="result" />
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

export default ResultTable;
