'use client';
import {
  createAttendance,
  updateAttendance,
} from '@/lib/actions/attendance.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

type DataProps = {
  id: number;
  date: Date;
  present: boolean;
  lessonId: number;
  studentId: string;
};

type LessonsProps = {
  name: string;
  id: number;
};

const attendanceSchema = z.object({
  id: z.coerce.number().optional(),
  date: z.coerce.date({ message: 'Start time is required' }),
  attendanceStatus: z.enum(['PRESENT', 'ABSENT'], {
    message: 'Attendance Status is required!',
  }),
  lessonId: z.coerce.number({ message: 'Lesson is required' }),
  studentId: z.string({ message: 'Student is required' }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

const AttendanceForm = ({
  data,
  type,
  setOpen,
  lessons,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lessons?: LessonsProps[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createAttendance : updateAttendance,
    { success: false, error: false }
  );

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Attendance has been ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      setOpen(false);
      toast.error('Error creating attendance!');
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((data) => {
    console.log('Hey');

    startTransition(() => {
      formAction(data);
    });
  });

  // console.log(data);

  return (
    <form action="" onSubmit={onSubmit}>
      <p className="text-center text-lg font-semibold">
        {type === 'create' ? 'Create new Attendance' : 'Update Attendance'}
      </p>
      <div
        className={`flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center md:justify-between`}
      >
        {data && (
          <input
            className={`hidden w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400`}
            type="number"
            {...register('id')}
            defaultValue={data?.id}
          />
        )}

        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Date
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.date?.message && 'border-red-600'}`}
            type="date"
            {...register('date')}
            placeholder="Enter date"
            defaultValue={data?.date.toISOString().split('T')[0]}
          />
          {errors.date && (
            <p className="text-[10px] text-red-500">
              {errors.date?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Student Id
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.studentId?.message && 'border-red-600'}`}
            type="text"
            {...register('studentId')}
            placeholder="Enter student Id"
            defaultValue={data?.studentId}
          />
          {errors.studentId && (
            <p className="text-[10px] text-red-500">
              {errors.studentId?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Lessons
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.lessonId?.message && 'border-red-600'}`}
            {...register('lessonId')}
            defaultValue={data && data?.lessonId}
          >
            <option value="">Select a lesson</option>
            {lessons &&
              lessons.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
          </select>
          {errors.lessonId && (
            <p className="text-[10px] text-red-500">
              {errors.lessonId?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Attendance Status
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.attendanceStatus?.message && 'border-red-600'}`}
            {...register('attendanceStatus')}
            defaultValue={data && data.present ? 'PRESENT' : 'ABSENT'}
          >
            <option value="ABSENT">Absent</option>
            <option value="PRESENT">Present</option>
          </select>
          {errors.attendanceStatus && (
            <p className="text-[10px] text-red-500">
              {errors.attendanceStatus?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-2 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Attendance
      </button>
    </form>
  );
};

export default AttendanceForm;
