'use client';
import {
  createAttendance,
  updateAttendance,
} from '@/lib/actions/attendance.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, {
  startTransition,
  useActionState,
  useEffect,
  useTransition,
} from 'react';
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
  date: z.coerce.date({ message: 'Date is required' }),
  attendanceStatus: z.enum(['PRESENT', 'ABSENT'], {
    message: 'Attendance Status is required!',
  }),
  lessonId: z.coerce.number({ message: 'Lesson is required' }),
  studentId: z.string({ message: 'Student is required' }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

const inputCls = (hasError?: boolean) =>
  `block w-full rounded-lg border ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
  } px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 placeholder:text-gray-400`;

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-0.5 text-[10px] text-red-500">{msg}</p> : null;

const SectionHeader = ({ label }: { label: string }) => (
  <div className="mb-3 mt-5 flex items-center gap-2">
    <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">
      {label}
    </span>
    <div className="h-px flex-1 bg-sky-100" />
  </div>
);

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
    defaultValues: data
      ? {
          id: data.id,
          date: data.date.toISOString().split('T')[0] as any,
          attendanceStatus: data.present ? 'PRESENT' : 'ABSENT',
          lessonId: data.lessonId,
          studentId: data.studentId,
        }
      : {},
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createAttendance : updateAttendance,
    { success: false, error: false }
  );

  const [isPending, startPendingTransition] = useTransition();
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
      toast.error(
        `Error ${type === 'create' ? 'creating' : 'updating'} attendance!`
      );
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((formData) => {
    startPendingTransition(() => {
      startTransition(() => {
        formAction(formData);
      });
    });
  });

  return (
    <form onSubmit={onSubmit} className="px-1">
      {/* Title */}
      <p className="mb-1 text-center text-lg font-bold text-gray-800">
        {type === 'create' ? 'Record Attendance' : 'Update Attendance'}
      </p>
      <p className="mb-4 text-center text-[11px] text-gray-400">
        {type === 'create'
          ? 'Fill in the details below'
          : 'Edit the details below'}
      </p>

      {/* Hidden id for update */}
      {data && <input type="hidden" {...register('id')} />}

      {/* ── Details ── */}
      <SectionHeader label="Attendance Details" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label required>Date</Label>
          <input
            className={inputCls(!!errors.date)}
            type="date"
            {...register('date')}
          />
          <ErrorMsg msg={errors.date?.message?.toString()} />
        </div>

        <div>
          <Label required>Attendance Status</Label>
          <select
            className={inputCls(!!errors.attendanceStatus)}
            {...register('attendanceStatus')}
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
          <ErrorMsg msg={errors.attendanceStatus?.message?.toString()} />
        </div>

        <div>
          <Label required>Student ID</Label>
          <input
            className={inputCls(!!errors.studentId)}
            type="text"
            {...register('studentId')}
            placeholder="Enter student ID"
          />
          <ErrorMsg msg={errors.studentId?.message?.toString()} />
        </div>

        <div>
          <Label required>Lesson</Label>
          <select
            className={inputCls(!!errors.lessonId)}
            {...register('lessonId')}
          >
            <option value="">Select a lesson</option>
            {lessons?.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.lessonId?.message?.toString()} />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 active:scale-[0.98] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {type === 'create' ? 'Saving…' : 'Updating…'}
          </>
        ) : type === 'create' ? (
          'Save Attendance'
        ) : (
          'Update Attendance'
        )}
      </button>
    </form>
  );
};

export default AttendanceForm;
