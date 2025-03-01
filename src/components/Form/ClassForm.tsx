'use client';
import { createClass, updateClass } from '@/lib/actions/class.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

type DataProps = {
  id: number;
  name: string;
  capacity: number;
  gradeId: number;
  supervisorId: number;
};

type TeachersDataProps = {
  name: string;
  id: string;
  surname: string;
};

type ClassGradesProps = {
  id: number;
  level: number;
};

const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: 'Subject name is required' }),
  capacity: z.coerce.number().min(1, { message: 'Capacity is required' }),
  gradeId: z.coerce.number().min(1, { message: 'Grade is required' }),
  supervisorId: z.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

const ClassForm = ({
  data,
  type,
  setOpen,
  teachersData,
  classGrades,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teachersData?: TeachersDataProps[];
  classGrades?: ClassGradesProps[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createClass : updateClass,
    { success: false, error: false }
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast.success(
        `Class ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      setOpen(false);
      toast.error('Error creating class!');
    }
  }, [state, setOpen, type]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);

    startTransition(() => {
      formAction(data);
    });
    // createSubject(data)
  });

  return (
    <form action="" onSubmit={onSubmit}>
      <p className="text-center text-lg font-semibold">
        {type === 'create' ? 'Create a new class' : 'Update the class'}
      </p>
      <div className="mt-3 flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center md:justify-between">
        {data && (
          <input
            className={`hidden w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.name?.message && 'border-red-600'}`}
            type="number"
            {...register('id')}
            defaultValue={data?.id}
          />
        )}

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Class Name
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.name?.message && 'border-red-600'}`}
            type="text"
            {...register('name')}
            placeholder="Enter class name"
            defaultValue={data?.name}
          />
          {errors.name && (
            <p className="text-[10px] text-red-500">
              {errors.name?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Class Capacity
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.capacity?.message && 'border-red-600'}`}
            type="number"
            {...register('capacity')}
            placeholder="Enter class capacity"
            defaultValue={data?.capacity}
          />
          {errors.capacity && (
            <p className="text-[10px] text-red-500">
              {errors.capacity?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Class Grade
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.gradeId?.message && 'border-red-600'}`}
            {...register('gradeId')}
            defaultValue={data && data?.gradeId}
          >
            <option value="">Select a class grade</option>
            {classGrades &&
              classGrades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.level}
                </option>
              ))}
          </select>
          {errors.gradeId && (
            <p className="text-[10px] text-red-500">
              {errors.gradeId?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Class Teacher
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.supervisorId?.message && 'border-red-600'}`}
            {...register('supervisorId')}
            defaultValue={data && data?.supervisorId}
          >
            <option value="">Select a class teacher</option>
            {teachersData &&
              teachersData.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name + ' ' + teacher.surname}
                </option>
              ))}
          </select>
          {errors.supervisorId && (
            <p className="text-[10px] text-red-500">
              {errors.supervisorId?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-2 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Class
      </button>
    </form>
  );
};

export default ClassForm;
