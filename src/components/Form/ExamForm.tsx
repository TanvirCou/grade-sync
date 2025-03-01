'use client';
import { createExam, updateExam } from '@/lib/actions/exam.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { startTransition, useActionState, useEffect } from 'react';
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
  title: z.string().min(1, { message: 'Examtitle is required' }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  lessonId: z.coerce.number({ message: 'Lesson is required' }),
});

export type ExamSchema = z.infer<typeof examSchema>;

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
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createExam : updateExam,
    { success: false, error: false }
  );

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
      setOpen(false);
      toast.error('Error creating exam!');
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((data) => {
    // console.log(data);

    startTransition(() => {
      formAction(data);
    });
    // createSubject(data)
  });

  return (
    <form action="" onSubmit={onSubmit}>
      <p className="text-center text-lg font-semibold">
        {type === 'create' ? 'Create new exam' : 'Update exam'}
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
            Exam title
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.title?.message && 'border-red-600'}`}
            type="text"
            {...register('title')}
            placeholder="Enter exam title"
            defaultValue={data?.title}
          />
          {errors.title && (
            <p className="text-[10px] text-red-500">
              {errors.title?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Start Date
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.startTime?.message && 'border-red-600'}`}
            type="datetime-local"
            {...register('startTime')}
            placeholder="Enter start date & time"
            // defaultValue={data?.startTime.toISOString()}
          />
          {errors.startTime && (
            <p className="text-[10px] text-red-500">
              {errors.startTime?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            End Date
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.endTime?.message && 'border-red-600'}`}
            type="datetime-local"
            {...register('endTime')}
            placeholder="Enter end date & time"
            // defaultValue={data?.startTime.toLocaleString()}
          />
          {errors.endTime && (
            <p className="text-[10px] text-red-500">
              {errors.endTime?.message?.toString()}
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
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-2 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Exam
      </button>
    </form>
  );
};

export default ExamForm;
