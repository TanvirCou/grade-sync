'use client';
import { Class } from '@prisma/client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useState } from 'react';
// import TeacherForm from './TeacherForm';
// import StudentForm from './StudentForm';

const TeacherForm = dynamic(() => import('./TeacherForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const StudentForm = dynamic(() => import('./StudentForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const SubjectForm = dynamic(() => import('./SubjectForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const ClassForm = dynamic(() => import('./ClassForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const ExamForm = dynamic(() => import('./ExamForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const AssignmentForm = dynamic(() => import('./AssignmentForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const AnnouncementForm = dynamic(() => import('./AnnouncementForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const ParentForm = dynamic(() => import('./ParentForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const LessonForm = dynamic(() => import('./LessonForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const EventForm = dynamic(() => import('./EventForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const ResultForm = dynamic(() => import('./ResultForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

const AttendanceForm = dynamic(() => import('./AttendanceForm'), {
  loading: () => (
    <p className="text-md py-12 text-center font-medium">Loading......</p>
  ),
});

// type DataProps = {
//   id: number;
//   username: string;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   address: string;
//   bloodType: string;
//   birthday: string;
//   sex: string;
//   img: string;
// };

type TableProps =
  | 'teacher'
  | 'student'
  | 'parent'
  | 'subject'
  | 'class'
  | 'lesson'
  | 'exam'
  | 'assignment'
  | 'result'
  | 'attendance'
  | 'event'
  | 'announcement';

type TeachersDataProps = {
  name: string;
  id: string;
  surname: string;
};

type ClassGradesProps = {
  id: number;
  level: number;
};

type SubjectsProps = {
  id: number;
  name: string;
};

type StudentGradesProps = {
  id: number;
  level: number;
};

type StudentClassesProps = Class & {
  _count: {
    students: number;
  };
};

type LessonsProps = {
  name: string;
  id: number;
};

type ClassProps = { name: string; id: number };

type ExamProps = {
  id: number;
  title: string;
};

type AssignmentProps = {
  id: number;
  title: string;
};

type UpdateModalProps = {
  table: TableProps;
  data?: any;
  id?: number;
  teachersData?: TeachersDataProps[];
  classGrades?: ClassGradesProps[];
  subjects?: SubjectsProps[];
  studentGrades?: StudentGradesProps[];
  studentClasses?: StudentClassesProps[];
  lessons?: LessonsProps[];
  classes?: ClassProps[];
  exams?: ExamProps[];
  assignments?: AssignmentProps[];
};

const UpdateModal = ({
  table,
  data,
  teachersData,
  classGrades,
  subjects,
  studentGrades,
  studentClasses,
  lessons,
  classes,
  exams,
  assignments,
}: UpdateModalProps) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-sky-200`}
      >
        <Image src={`/update.png`} alt="" width={14} height={14} />
      </button>

      {open && (
        <div className="fixed left-0 top-0 z-40 flex h-screen w-full items-center justify-center bg-[#00000030]">
          <div className="relative h-[90%] w-[90%] overflow-y-scroll rounded-md bg-white p-4 shadow-sm md:h-fit md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <div
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
            {
              table === 'teacher' && (
                <TeacherForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  subjects={subjects}
                />
              )
              // Add more form components for other tables as needed...
            }
            {table === 'student' && (
              <StudentForm
                type="update"
                data={data}
                setOpen={setOpen}
                studentGrades={studentGrades}
                studentClasses={studentClasses}
              />
            )}
            {table === 'subject' && (
              <SubjectForm
                type="update"
                data={data}
                setOpen={setOpen}
                teachersData={teachersData}
              />
            )}
            {table === 'class' && (
              <ClassForm
                type="update"
                data={data}
                setOpen={setOpen}
                teachersData={teachersData}
                classGrades={classGrades}
              />
            )}
            {
              table === 'exam' && (
                <ExamForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  lessons={lessons}
                />
              )
              // Add more form components for other tables as needed...
            }
            {
              table === 'assignment' && (
                <AssignmentForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  lessons={lessons}
                />
              )
              // Add more form components for other tables as needed...
            }
            {
              table === 'announcement' && (
                <AnnouncementForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  classes={classes}
                />
              )
              // Add more form components for other tables as needed...
            }
            {
              table === 'parent' && (
                <ParentForm type="update" data={data} setOpen={setOpen} />
              )
              // Add more form components for other tables as needed...
            }
            {
              table === 'lesson' && (
                <LessonForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  subjects={subjects}
                  classes={classes}
                  teachersData={teachersData}
                />
              )
              // Add more form components for other tables as needed...
            }
            {
              table === 'event' && (
                <EventForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  classes={classes}
                />
              )
              // Add more form components for other tables as needed...
            }
            {
              table === 'result' && (
                <ResultForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  exams={exams}
                  assignments={assignments}
                />
              )
              // Add more form components for other tables as needed...
            }
            {
              table === 'attendance' && (
                <AttendanceForm
                  type="update"
                  data={data}
                  setOpen={setOpen}
                  lessons={lessons}
                />
              )
              // Add more form components for other tables as needed...
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateModal;
