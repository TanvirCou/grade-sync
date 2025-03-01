'use client';
import { createSubject, updateSubject } from '@/lib/actions/subject.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Teacher } from '@prisma/client';
import React, { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

type DataProps = {
  id: number;
  name: string;
  teachers: Teacher[];
};

type TeachersDataProps = {
  name: string;
  id: string;
  surname: string;
};

const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: 'Subject name is required' }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

const SubjectForm = ({
  data,
  type,
  setOpen,
  teachersData,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teachersData?: TeachersDataProps[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createSubject : updateSubject,
    { success: false, error: false }
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast.success(
        `Subject ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      setOpen(false);
      toast.error('Error creating subject!');
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
        {type === 'create' ? 'Create a new subject' : 'Update a subject'}
      </p>
      <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-evenly">
        {data && (
          <input
            className={`hidden w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.name?.message && 'border-red-600'}`}
            type="number"
            {...register('id')}
            defaultValue={data?.id}
          />
        )}

        <div className="flex flex-col gap-1 md:w-[40%]">
          <label className="block text-xs font-medium text-gray-700">
            Subject Name
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.name?.message && 'border-red-600'}`}
            type="text"
            {...register('name')}
            placeholder="Enter subject name"
            defaultValue={data?.name}
          />
          {errors.name && (
            <p className="text-[10px] text-red-500">
              {errors.name?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 md:w-[40%]">
          <label className="block text-xs font-medium text-gray-700">
            Teachers
          </label>
          <select
            multiple
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.teachers?.message && 'border-red-600'}`}
            {...register('teachers')}
            defaultValue={data && data?.teachers.map((i) => i.id)}
          >
            {teachersData &&
              teachersData.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name + ' ' + teacher.surname}
                </option>
              ))}
          </select>
          {errors.teachers && (
            <p className="text-[10px] text-red-500">
              {errors.teachers?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-2 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Subject
      </button>
    </form>
  );
};

export default SubjectForm;
