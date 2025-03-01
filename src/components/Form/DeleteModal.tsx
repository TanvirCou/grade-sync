'use client';
import { deleteAnnouncement } from '@/lib/actions/announcement.actions';
import { deleteAssignment } from '@/lib/actions/assignment.actions';
import { deleteAttendance } from '@/lib/actions/attendance.actions';
import { deleteClass } from '@/lib/actions/class.actions';
import { deleteEvent } from '@/lib/actions/event.actions';
import { deleteExam } from '@/lib/actions/exam.actions';
import { deleteLesson } from '@/lib/actions/lesson.actions';
import { deleteParent } from '@/lib/actions/parent.actions';
import { deleteResult } from '@/lib/actions/result.action';
import { deleteStudent } from '@/lib/actions/student.actions';
import { deleteSubject } from '@/lib/actions/subject.actions';
import { deleteTeacher } from '@/lib/actions/teacher.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
  id?: number | string;
};

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  assignment: deleteAssignment,
  announcement: deleteAnnouncement,
  parent: deleteParent,
  lesson: deleteLesson,
  event: deleteEvent,
  result: deleteResult,
  attendance: deleteAttendance,
};

const DeleteModal = ({ table, id }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const [state, formAction] = useActionState(deleteActionMap[table], {
    success: false,
    error: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(`${table} deleted successfully!`);
    }
    if (state.error) {
      toast.error(`Error in deleting ${table}!`);
    }
  }, [state, setOpen, router, table]);

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-purple-200`}
      >
        <Image src={`/delete.png`} alt="" width={14} height={14} />
      </button>

      {open && (
        <div className="fixed left-0 top-0 z-40 flex h-screen w-full items-center justify-center bg-[#00000030]">
          <div className="relative w-[90%] overflow-y-scroll rounded-md bg-white p-4 shadow-sm md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <div
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>

            <form action={formAction} className="flex flex-col gap-3 p-4">
              <p className="text-center text-[14px] font-medium">
                All data will be lost.Are you sure to delete this {table}?
              </p>
              <input type="text | number" name="id" hidden defaultValue={id} />
              <button className="w-fit self-center rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white">
                Delete
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModal;
