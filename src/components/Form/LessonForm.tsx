'use client';
import { createLesson, updateLesson } from '@/lib/actions/lesson.actions';
import { formatDateTimeLocal } from '@/lib/utils';
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
  name: string;
  day: string;
  startTime: Date;
  endTime: Date;
  classId: number;
  subjectId: number;
  teacherId: string;
};

type ClassProps = { name: string; id: number };
type SubjectsProps = { id: number; name: string };
type TeachersDataProps = { name: string; id: string; surname: string };

const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: 'Lesson name is required' }),
  day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], {
    message: 'Day is required!',
  }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  subjectId: z.coerce.number({ message: 'Subject is required' }),
  classId: z.coerce.number({ message: 'Class is required' }),
  teacherId: z.string({ message: 'Teacher is required' }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

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

const LessonForm = ({
  data,
  type,
  setOpen,
  subjects,
  classes,
  teachersData,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  subjects?: SubjectsProps[];
  classes?: ClassProps[];
  teachersData?: TeachersDataProps[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: data
      ? {
          id: data.id,
          name: data.name,
          day: data.day as any,
          startTime: data.startTime
            ? formatDateTimeLocal(data.startTime)
            : ('' as any),
          endTime: data.endTime
            ? formatDateTimeLocal(data.endTime)
            : ('' as any),
          classId: data.classId,
          subjectId: data.subjectId,
          teacherId: data.teacherId,
        }
      : {},
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createLesson : updateLesson,
    { success: false, error: false }
  );

  const [isPending, startPendingTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Lesson has been ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error(
        `Error ${type === 'create' ? 'creating' : 'updating'} lesson!`
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
      <p className="mb-1 text-center text-lg font-bold text-gray-800">
        {type === 'create' ? 'New Lesson' : 'Update Lesson'}
      </p>
      <p className="mb-4 text-center text-[11px] text-gray-400">
        {type === 'create'
          ? 'Fill in the details below'
          : 'Edit the details below'}
      </p>

      {data && <input type="hidden" {...register('id')} />}

      {/* ── Lesson Details ── */}
      <SectionHeader label="Lesson Details" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label required>Lesson Name</Label>
          <input
            className={inputCls(!!errors.name)}
            type="text"
            {...register('name')}
            placeholder="e.g. Introduction to Algebra"
          />
          <ErrorMsg msg={errors.name?.message} />
        </div>

        <div>
          <Label required>Day</Label>
          <select className={inputCls(!!errors.day)} {...register('day')}>
            <option value="">Select a day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
          <ErrorMsg msg={errors.day?.message} />
        </div>

        <div>
          <Label required>Subject</Label>
          <select
            className={inputCls(!!errors.subjectId)}
            {...register('subjectId')}
          >
            <option value="">Select a subject</option>
            {subjects?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.subjectId?.message?.toString()} />
        </div>

        <div>
          <Label required>Start Date &amp; Time</Label>
          <input
            className={inputCls(!!errors.startTime)}
            type="datetime-local"
            {...register('startTime')}
          />
          <ErrorMsg msg={errors.startTime?.message?.toString()} />
        </div>

        <div>
          <Label required>End Date &amp; Time</Label>
          <input
            className={inputCls(!!errors.endTime)}
            type="datetime-local"
            {...register('endTime')}
          />
          <ErrorMsg msg={errors.endTime?.message?.toString()} />
        </div>

        <div>
          <Label required>Class</Label>
          <select
            className={inputCls(!!errors.classId)}
            {...register('classId')}
          >
            <option value="">Select a class</option>
            {classes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.classId?.message?.toString()} />
        </div>

        <div>
          <Label required>Teacher</Label>
          <select
            className={inputCls(!!errors.teacherId)}
            {...register('teacherId')}
          >
            <option value="">Select a teacher</option>
            {teachersData?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name + ' ' + t.surname}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.teacherId?.message?.toString()} />
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
            {type === 'create' ? 'Creating…' : 'Updating…'}
          </>
        ) : type === 'create' ? (
          'Create Lesson'
        ) : (
          'Update Lesson'
        )}
      </button>
    </form>
  );
};

export default LessonForm;
