'use client';
import { createExam, updateExam } from '@/lib/actions/exam.actions';
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
  title: string;
  startTime: Date;
  endTime: Date;
  lessonId: number;
};

type LessonsProps = {
  name: string;
  id: number;
};

const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Exam title is required' }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  lessonId: z.coerce.number({ message: 'Lesson is required' }),
});

export type ExamSchema = z.infer<typeof examSchema>;

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

const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: data
      ? {
          id: data.id,
          title: data.title,
          startTime: data.startTime
            ? formatDateTimeLocal(data.startTime)
            : ('' as any),
          endTime: data.endTime
            ? formatDateTimeLocal(data.endTime)
            : ('' as any),
          lessonId: data.lessonId,
        }
      : {},
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createExam : updateExam,
    { success: false, error: false }
  );

  const [isPending, startPendingTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Exam has been ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error(`Error ${type === 'create' ? 'creating' : 'updating'} exam!`);
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
        {type === 'create' ? 'New Exam' : 'Update Exam'}
      </p>
      <p className="mb-4 text-center text-[11px] text-gray-400">
        {type === 'create'
          ? 'Fill in the details below'
          : 'Edit the details below'}
      </p>

      {data && <input type="hidden" {...register('id')} />}

      {/* ── Exam Details ── */}
      <SectionHeader label="Exam Details" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label required>Title</Label>
          <input
            className={inputCls(!!errors.title)}
            type="text"
            {...register('title')}
            placeholder="e.g. Mid-Term Mathematics"
          />
          <ErrorMsg msg={errors.title?.message} />
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

        <div className="sm:col-span-2">
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
            {type === 'create' ? 'Creating…' : 'Updating…'}
          </>
        ) : type === 'create' ? (
          'Create Exam'
        ) : (
          'Update Exam'
        )}
      </button>
    </form>
  );
};

export default ExamForm;
