import React from 'react';
import { role } from '@/lib/data';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type ExamProps = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: string;
};

type ExamTableProps = {
  data: ExamProps[];
};

const ExamTable = ({ data }: ExamTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Class</th>
            <th>Teacher</th>
            <th>Exam Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ExamProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.subject}</td>
                <td className="text-xs">{i.class}</td>
                <td className="text-xs">{i.teacher}</td>
                <td className="text-xs">{i.date}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="exam" />
                    {role === 'admin' && <DeleteModal table="exam" />}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamTable;
