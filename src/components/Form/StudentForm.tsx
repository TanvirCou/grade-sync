'use client';
import { createStudent, updateStudent } from '@/lib/actions/student.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Class } from '@prisma/client';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
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
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: Date;
  sex: string;
  img: string;
  classId: number;
  gradeId: number;
  parentId: string;
};

type StudentGradesProps = {
  id: number;
  level: number;
};

type StudentClassesProps = Class & {
  _count: {
    students: number;
  };
};

const studentSchema = z.object({
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
  phone: z.string().optional(),
  address: z.string().min(1, { message: 'Address is required!' }),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
  birthday: z.coerce.date({ message: 'Birthday is required!' }),
  sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required!' }),
  gradeId: z.coerce.number().min(1, { message: 'Grade is required!' }),
  classId: z.coerce.number().min(1, { message: 'Class is required!' }),
  parentId: z.string().min(1, { message: 'Parent is required!' }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

const StudentForm = ({
  data,
  type,
  setOpen,
  studentGrades,
  studentClasses,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  studentGrades?: StudentGradesProps[];
  studentClasses?: StudentClassesProps[];
}) => {
  console.log(data);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useActionState(
    type === 'create' ? createStudent : updateStudent,
    { success: false, error: false }
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Teacher ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error('Error creating teacher!');
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);

    startTransition(() => {
      formAction({ ...data, img: img?.secure_url });
    });
    // createSubject(data)
  });

  return (
    <form action="" onSubmit={onSubmit}>
      <p className="text-center text-lg font-semibold">
        {type === 'create' ? 'Create a new ' : 'Update the '}
      </p>
      <p className="my-2 text-xs text-gray-500">Authentication Information</p>
      <div className="flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center md:justify-between">
        {data && (
          <input
            className={`hidden w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.name?.message && 'border-red-600'}`}
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

        {/* Blood Type */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Blood Type
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.bloodType?.message && 'border-red-600'}`}
            type="text"
            {...register('bloodType')}
            placeholder="Enter blood type"
            defaultValue={data && data.bloodType}
          />
          {errors.bloodType && (
            <p className="text-[10px] text-red-500">
              {errors.bloodType?.message?.toString()}
            </p>
          )}
        </div>

        {/* Birthday */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Birthday
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.birthday?.message && 'border-red-600'}`}
            type="date"
            {...register('birthday')}
            placeholder="Enter birthday"
            defaultValue={data?.birthday.toISOString().split('T')[0]}
          />
          {errors.birthday && (
            <p className="text-[10px] text-red-500">
              {errors.birthday?.message?.toString()}
            </p>
          )}
        </div>

        {/* Sex */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Sex
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.sex?.message && 'border-red-600'}`}
            {...register('sex')}
            value={data && data.sex}
          >
            <option value="">Select your sex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex && (
            <p className="text-[10px] text-red-500">
              {errors.sex?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Student&apos;s Grade
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.gradeId?.message && 'border-red-600'}`}
            {...register('gradeId')}
            defaultValue={data && data?.gradeId}
          >
            <option value="">Select student&apos;s grade</option>
            {studentGrades &&
              studentGrades.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.level}
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
            Student&apos;s Class
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.classId?.message && 'border-red-600'}`}
            {...register('classId')}
            defaultValue={data && data.classId}
          >
            <option value="">Select student&apos;s class</option>
            {studentClasses &&
              studentClasses.map((i) => (
                <option key={i.id} value={i.id}>
                  ({i.name}) - {i._count.students + '/' + i.capacity} Capacity
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
          <label className="block text-[10px] font-medium text-gray-700">
            Parent Id
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.parentId?.message && 'border-red-600'}`}
            type="text"
            {...register('parentId')}
            placeholder="Enter your parent id"
            defaultValue={data && data.parentId}
          />
          {errors.parentId && (
            <p className="text-[10px] text-red-500">
              {errors.parentId?.message?.toString()}
            </p>
          )}
        </div>

        {/* Image */}
        <div className="mt-2 flex flex-col gap-1">
          <CldUploadWidget
            uploadPreset="grade-sync"
            onSuccess={(res) => setImg(res?.info)}
          >
            {({ open }) => {
              return (
                <div
                  onClick={() => open()}
                  className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700"
                >
                  <Image src="/upload.png" alt="" width={25} height={25} />
                  <p>Select a photo</p>
                </div>
              );
            }}
          </CldUploadWidget>

          {errors.img && (
            <p className="text-[10px] text-red-500">
              {errors.img?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="mt-2 text-xs text-red-500">Something went wrong!</span>
      )}

      <button className="mt-4 w-full rounded-md bg-sky-500 py-1.5 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Student
      </button>
    </form>
  );
};

export default StudentForm;
