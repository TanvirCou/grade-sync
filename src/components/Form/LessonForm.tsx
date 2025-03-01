'use client';
import { createLesson, updateLesson } from '@/lib/actions/lesson.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { startTransition, useActionState, useEffect } from 'react';
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

type SubjectsProps = {
  id: number;
  name: string;
};

type TeachersDataProps = {
  name: string;
  id: string;
  surname: string;
};

const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: 'name is required' }),
  day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], {
    message: 'Day is required!',
  }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  subjectId: z.coerce.number({ message: 'Subject is required' }),
  classId: z.coerce.number({ message: 'Class is required' }),
  teacherId: z.string({ message: 'Class is required' }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

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
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createLesson : updateLesson,
    { success: false, error: false }
  );

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
      setOpen(false);
      toast.error('Error creating Lesson!');
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
        {type === 'create' ? 'Create new Lesson' : 'Update Lesson'}
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
          <label className="block text-xs font-medium text-gray-700">
            Lesson name
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.name?.message && 'border-red-600'}`}
            type="text"
            {...register('name')}
            placeholder="Enter lesson name"
            defaultValue={data?.name}
          />
          {errors.name && (
            <p className="text-[10px] text-red-500">
              {errors.name?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Day
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.day?.message && 'border-red-600'}`}
            {...register('day')}
            value={data && data.day}
          >
            <option value="">Select a day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
          {errors.day && (
            <p className="text-[10px] text-red-500">
              {errors.day?.message?.toString()}
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
            Class
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.classId?.message && 'border-red-600'}`}
            {...register('classId')}
            defaultValue={data && data?.classId}
          >
            <option value="">Select a class</option>
            {classes &&
              classes.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
          </select>
          {errors.classId && (
            <p className="text-[10px] text-red-500">
              {errors.classId?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Subject
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.subjectId?.message && 'border-red-600'}`}
            {...register('subjectId')}
            defaultValue={data && data?.subjectId}
          >
            <option value="">Select a subject</option>
            {subjects &&
              subjects.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
          </select>
          {errors.subjectId && (
            <p className="text-[10px] text-red-500">
              {errors.subjectId?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Teacher
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.teacherId?.message && 'border-red-600'}`}
            {...register('teacherId')}
            defaultValue={data && data?.subjectId}
          >
            <option value="">Select a teacher</option>
            {teachersData &&
              teachersData.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name + ' ' + i.surname}
                </option>
              ))}
          </select>
          {errors.teacherId && (
            <p className="text-[10px] text-red-500">
              {errors.teacherId?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-2 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Lesson
      </button>
    </form>
  );
};

export default LessonForm;
