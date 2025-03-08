import React from 'react';
import DeleteModal from '../Form/DeleteModal';
import UpdateModal from '../Form/UpdateModal';
import { Lesson } from '@prisma/client';

type LessonType = Lesson & { class: { name: string } } & {
  subject: { name: string };
} & { teacher: { name: string; surname: string } };

type TeachersDataProps = {
  name: string;
  id: string;
  surname: string;
};

type ClassProps = { name: string; id: number };

type SubjectsProps = {
  id: number;
  name: string;
};

type LessonTableProps = {
  data: LessonType[];
  role?: string;
  teachersData?: TeachersDataProps[];
  classes?: ClassProps[];
  subjects?: SubjectsProps[];
};
const LessonTable = ({
  data,
  role,
  teachersData,
  classes,
  subjects,
}: LessonTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Class</th>
            <th>Teacher</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((i: LessonType) => (
              <tr key={i.id} className="hover">
                <td className="text-nowrap text-xs">{i.subject.name}</td>
                <td className="text-xs">{i.class.name}</td>
                <td className="text-nowrap text-xs">
                  {i.teacher.name + ' ' + i.teacher.surname}
                </td>
                {role === 'admin' && (
                  <td>
                    <div className="flex items-center gap-2">
                      <UpdateModal
                        table="lesson"
                        data={i}
                        teachersData={teachersData}
                        classes={classes}
                        subjects={subjects}
                      />
                      <DeleteModal table="lesson" id={i.id} />
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

export default LessonTable;
