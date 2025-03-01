'use client';
import { createParent, updateParent } from '@/lib/actions/parent.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

type DataProps = {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  students: { id: string }[];
};

const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long!' })
    .max(20, { message: 'Username must be at most 20 characters long!' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' })
    .optional()
    .or(z.literal('')),
  name: z.string().min(1, { message: 'First name is required!' }),
  surname: z.string().min(1, { message: 'Last name is required!' }),
  email: z
    .string()
    .email({ message: 'Invalid email address!' })
    .optional()
    .or(z.literal('')),
  phone: z.string({ message: 'Phone number is required!' }),
  address: z.string(),
  studentsId: z.string(),
});

export type ParentSchema = z.infer<typeof parentSchema>;

const ParentForm = ({
  data,
  type,
  setOpen,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createParent : updateParent,
    { success: false, error: false }
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Parent ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error('Error creating parent!');
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);

    startTransition(() => {
      formAction(data);
    });
    // createSubject(data)
  });

  console.log(data);

  return (
    <form action="" onSubmit={onSubmit}>
      <p className="text-center text-lg font-semibold">
        {type === 'create' ? 'Create a new parent' : 'Update the parent'}
      </p>
      <p className="my-2 text-xs text-gray-500">Authentication Information</p>
      <div className="flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center md:justify-between">
        {data && (
          <input
            className={`hidden w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400`}
            type="text"
            {...register('id')}
            defaultValue={data?.id}
          />
        )}
        <div className="flex flex-col gap-1">
          {/* Username */}
          <label className="block text-[10px] font-medium text-gray-700">
            Username
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.username?.message && 'border-red-600'}`}
            type="text"
            {...register('username')}
            placeholder="Enter username"
            defaultValue={data && data.username}
          />
          {errors.username && (
            <p className="text-[10px] text-red-500">
              {errors.username?.message?.toString()}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Email
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.email?.message && 'border-red-600'}`}
            type="email"
            {...register('email')}
            placeholder="Enter email"
            defaultValue={data && data.email}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500">
              {errors.email?.message?.toString()}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Password
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.password?.message && 'border-red-600'}`}
            type="password"
            {...register('password')}
            placeholder="Enter password"
            defaultValue={data && data.password}
          />
          {errors.password && (
            <p className="text-[10px] text-red-500">
              {errors.password?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <p className="mb-2 mt-5 text-xs text-gray-500">Personal Information</p>

      <div className="flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center md:justify-between">
        {/* First Name */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            First Name
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.name?.message && 'border-red-600'}`}
            type="text"
            {...register('name')}
            placeholder="Enter first name"
            defaultValue={data && data.name}
          />
          {errors.name && (
            <p className="text-[10px] text-red-500">
              {errors.name?.message?.toString()}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Last Name
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.surname?.message && 'border-red-600'}`}
            type="text"
            {...register('surname')}
            placeholder="Enter last name"
            defaultValue={data && data.surname}
          />
          {errors.surname && (
            <p className="text-[10px] text-red-500">
              {errors.surname?.message?.toString()}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Phone
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.phone?.message && 'border-red-600'}`}
            type="text"
            {...register('phone')}
            placeholder="Enter phone"
            defaultValue={data && data.phone}
          />
          {errors.phone && (
            <p className="text-[10px] text-red-500">
              {errors.phone?.message?.toString()}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Address
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.address?.message && 'border-red-600'}`}
            type="text"
            {...register('address')}
            placeholder="Enter address"
            defaultValue={data && data.address}
          />
          {errors.address && (
            <p className="text-[10px] text-red-500">
              {errors.address?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Your children&apos;s student Id
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.studentsId?.message && 'border-red-600'}`}
            type="text"
            {...register('studentsId')}
            placeholder="Enter your children id"
            defaultValue={data && data.students.map((i) => i.id)}
          />
          {errors.studentsId && (
            <p className="text-[10px] text-red-500">
              {errors.studentsId?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* {state.error && !state.success && (
        <div className='mt-2'>
          {state.error && state?.message?.map((i: string, index: number) => (
            <p key={index} className='text-xs text-red-600'>{i}</p>
          ))}
        </div>
      )} */}

      {state.error && (
        <span className="mt-2 text-xs text-red-500">Something went wrong!</span>
      )}

      <button className="mt-4 w-full rounded-md bg-sky-500 py-1.5 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Teacher
      </button>
    </form>
  );
};

export default ParentForm;
