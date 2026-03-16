'use client';
import { createResult, updateResult } from '@/lib/actions/result.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

type DataProps = {
  id: number;
  score: number;
  resultType: 'EXAM' | 'ASSIGNMENT';
  examId: number;
  assignmentId: number;
  studentId: string;
};

type ExamProps = { id: number; title: string };
type AssignmentProps = { id: number; title: string };

const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number({ message: 'Score is required' }),
  resultType: z.enum(['EXAM', 'ASSIGNMENT'], { message: 'Type is required' }),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  studentId: z.string({ message: 'Student is required' }),
});

export type ResultSchema = z.infer<typeof resultSchema>;

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

const ResultForm = ({
  data,
  type,
  setOpen,
  exams,
  assignments,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exams?: ExamProps[];
  assignments?: AssignmentProps[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: data
      ? {
          id: data.id,
          score: data.score,
          resultType: data.resultType,
          examId: data.examId,
          assignmentId: data.assignmentId,
          studentId: data.studentId,
        }
      : {},
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createResult : updateResult,
    { success: false, error: false }
  );

  const [resType, setResType] = useState<string>(data ? data.resultType : '');
  const [isPending, startPendingTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Result has been ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error(
        `Error ${type === 'create' ? 'creating' : 'updating'} result!`
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
        {type === 'create' ? 'New Result' : 'Update Result'}
      </p>
      <p className="mb-4 text-center text-[11px] text-gray-400">
        {type === 'create'
          ? 'Fill in the details below'
          : 'Edit the details below'}
      </p>

      {data && <input type="hidden" {...register('id')} />}

      {/* ── Result Details ── */}
      <SectionHeader label="Result Details" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          <Label required>Score</Label>
          <input
            className={inputCls(!!errors.score)}
            type="number"
            {...register('score')}
            placeholder="e.g. 85"
          />
          <ErrorMsg msg={errors.score?.message?.toString()} />
        </div>

        <div className="sm:col-span-2">
          <Label required>Result Type</Label>
          <select
            className={inputCls(!!errors.resultType)}
            {...register('resultType')}
            value={resType}
            onChange={(e) => setResType(e.target.value)}
          >
            <option value="">Select a type</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="EXAM">Exam</option>
          </select>
          <ErrorMsg msg={errors.resultType?.message?.toString()} />
        </div>

        {resType === 'ASSIGNMENT' && (
          <div className="sm:col-span-2">
            <Label required>Assignment</Label>
            <select
              className={inputCls(!!errors.assignmentId)}
              {...register('assignmentId')}
            >
              <option value="">Select assignment</option>
              {assignments?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <ErrorMsg msg={errors.assignmentId?.message?.toString()} />
          </div>
        )}

        {resType === 'EXAM' && (
          <div className="sm:col-span-2">
            <Label required>Exam</Label>
            <select
              className={inputCls(!!errors.examId)}
              {...register('examId')}
            >
              <option value="">Select exam</option>
              {exams?.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
            <ErrorMsg msg={errors.examId?.message?.toString()} />
          </div>
        )}
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
          'Create Result'
        ) : (
          'Update Result'
        )}
      </button>
    </form>
  );
};

export default ResultForm;
