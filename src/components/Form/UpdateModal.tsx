'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';
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

type DataProps = {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: string;
  sex: string;
  img: string;
};

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

type UpdateModalProps = {
  table: TableProps;
  data?: DataProps;
  id?: number;
};

const UpdateModal = ({ table, data }: UpdateModalProps) => {
  const handleClick = () => {
    const btn = document.getElementById('my_modal_2') as HTMLDialogElement;
    btn.showModal();
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-sky-200`}
      >
        <Image src={`/update.png`} alt="" width={14} height={14} />
      </button>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          {
            table === 'teacher' && <TeacherForm data={data} />
            // Add more form components for other tables as needed...
          }
          {table === 'student' && <StudentForm data={data} />}
        </div>
      </dialog>
    </div>
  );
};

export default UpdateModal;
