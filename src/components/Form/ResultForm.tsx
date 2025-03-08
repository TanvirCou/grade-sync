'use client';
import { createResult, updateResult } from '@/lib/actions/result.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
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

type ExamProps = {
  id: number;
  title: string;
};

type AssignmentProps = {
  id: number;
  title: string;
};

const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number({ message: 'Results score is required' }),
  resultType: z.enum(['EXAM', 'ASSIGNMENT'], {
    message: 'This selection is required',
  }),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  studentId: z.string({ message: 'Student is required' }),
});

export type ResultSchema = z.infer<typeof resultSchema>;

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
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createResult : updateResult,
    { success: false, error: false }
  );
  const [resType, setResType] = useState(data ? data.resultType : '');
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
      setOpen(false);
      toast.error('Error creating result!');
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);

    startTransition(() => {
      formAction(data);
    });
    // createSubject(data)
  });

  console.log(resType);

  return (
    <form action="" onSubmit={onSubmit}>
      <p className="text-center text-lg font-semibold">
        {type === 'create' ? 'Create new Result' : 'Update Result'}
      </p>
      <div
        className={`flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center ${type === 'update' ? 'md:justify-between' : 'md:justify-evenly'} `}
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
          <label className="block text-[10px] font-medium text-gray-700">
            Result Type
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.resultType?.message && 'border-red-600'}`}
            {...register('resultType')}
            value={resType}
            onChange={(e) => setResType(e.target.value)}
            // value={data && data.examId ? "exam" : "assignment"}
          >
            <option value="">Select a type</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="EXAM">Exam</option>
          </select>
          {errors.resultType && (
            <p className="text-[10px] text-red-500">
              {errors.resultType?.message?.toString()}
            </p>
          )}
        </div>

        {resType === 'ASSIGNMENT' && (
          <div className="flex flex-col gap-1">
            <label className="block text-xs font-medium text-gray-700">
              Assignment
            </label>
            <select
              className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.assignmentId?.message && 'border-red-600'}`}
              {...register('assignmentId')}
              // defaultValue={data && data?.assignmentId}
            >
              <option value="">Select assignment</option>
              {assignments &&
                assignments.map((i, index) => (
                  <option key={index} value={i?.id}>
                    {i?.title}
                  </option>
                ))}
            </select>
            {errors.assignmentId && (
              <p className="text-[10px] text-red-500">
                {errors.assignmentId?.message?.toString()}
              </p>
            )}
          </div>
        )}

        {resType === 'EXAM' && (
          <div className="flex flex-col gap-1">
            <label className="block text-xs font-medium text-gray-700">
              Exam
            </label>
            <select
              className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.examId?.message && 'border-red-600'}`}
              {...register('examId')}
              // defaultValue={data && data?.examId}
            >
              <option value="">Select exam</option>
              {exams &&
                exams.map((i, index) => (
                  <option key={index} value={i?.id}>
                    {i?.title}
                  </option>
                ))}
            </select>
            {errors.examId && (
              <p className="text-[10px] text-red-500">
                {errors.examId?.message?.toString()}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Result Score
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.score?.message && 'border-red-600'}`}
            type="number"
            {...register('score')}
            placeholder="Enter result score"
            defaultValue={data?.score}
          />
          {errors.score && (
            <p className="text-[10px] text-red-500">
              {errors.score?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-2 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Result
      </button>
    </form>
  );
};

export default ResultForm;
