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
import { useActionState, useEffect, useState } from 'react';
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="relative w-[90%] rounded-2xl bg-white shadow-2xl md:w-[420px]">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="px-8 py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <h2 className="mb-2 text-xl font-bold text-gray-800">
                Delete {table.charAt(0).toUpperCase() + table.slice(1)}?
              </h2>
              <p className="text-sm leading-relaxed text-gray-500">
                This action{' '}
                <span className="font-semibold text-gray-700">
                  cannot be undone
                </span>
                . All data associated with this {table} will be permanently
                removed.
              </p>

              <div className="my-6 h-px bg-gray-100" />

              <form
                action={formAction}
                className="flex items-center justify-center gap-3"
              >
                <input
                  type="text"
                  name="id"
                  hidden
                  defaultValue={id}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-red-600 active:scale-[0.98]"
                >
                  Yes, Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModal;
