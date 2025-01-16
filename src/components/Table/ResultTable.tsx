import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';

type ResultProps = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  student: string;
  date: string;
  type: string;
  score: number;
};

type ResultTableProps = {
  data: ResultProps[];
};

const ResultTable = ({ data }: ResultTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Student</th>
            <th>Score</th>
            <th>Teacher</th>
            <th>Class</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: ResultProps) => (
              <tr key={i.id} className="hover">
                <td className="text-xs">{i.subject}</td>
                <td className="text-xs">{i.student}</td>
                <td className="text-xs">{i.score}</td>
                <td className="text-xs">{i.teacher}</td>
                <td className="text-xs">{i.class}</td>
                <td className="text-xs">{i.date}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <UpdateModal table="result" />
                    <DeleteModal table="result" />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
