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

type CreateModalProps = {
  table: TableProps;
};

const CreateModal = ({ table }: CreateModalProps) => {
  const handleClick = () => {
    const btn = document.getElementById('my_modal_3') as HTMLDialogElement;
    btn.showModal();
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300`}
      >
        <Image src={`/create.png`} alt="" width={14} height={14} />
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>

          {
            table === 'teacher' && <TeacherForm />
            // Add more form components for other tables as needed...
          }
          {table === 'student' && <StudentForm />}
        </div>
      </dialog>
    </div>
  );
};

export default CreateModal;
