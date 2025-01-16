'use client';
import Image from 'next/image';
import React from 'react';

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

type DeleteModalProps = {
  table: TableProps;
  id?: number;
};

const DeleteModal = ({ table, id }: DeleteModalProps) => {
  console.log(table, id);

  const handleClick = () => {
    const btn = document.getElementById('my_modal_1') as HTMLDialogElement;
    btn.showModal();
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-purple-200`}
      >
        <Image src={`/delete.png`} alt="" width={14} height={14} />
      </button>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>

          <form action="" className="flex flex-col gap-3 p-4">
            <p className="text-center font-medium">
              All data will be lost.Are you sure to delete this {table}?
            </p>
            <button className="w-fit self-center rounded-md bg-red-600 px-4 py-1 text-xs font-medium text-white">
              Delete
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default DeleteModal;
