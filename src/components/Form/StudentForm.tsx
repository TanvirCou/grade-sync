'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type DataProps = {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: string;
  sex: string;
  img: string;
};

const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long!' })
    .max(20, { message: 'Username must be at most 20 characters long!' }),
  email: z.string().email({ message: 'Invalid email address!' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' }),
  firstName: z.string().min(1, { message: 'First name is required!' }),
  lastName: z.string().min(1, { message: 'Last name is required!' }),
  phone: z.string().min(1, { message: 'Phone is required!' }),
  address: z.string().min(1, { message: 'Address is required!' }),
  bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
  birthday: z.date({ message: 'Birthday is required!' }),
  sex: z.enum(['male', 'female'], { message: 'Sex is required!' }),
  img: z.instanceof(File, { message: 'Image is required' }),
});

const StudentForm = ({ data }: { data?: DataProps }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form action="" onSubmit={onSubmit}>
      <p className="text-center text-lg font-semibold">Create a new student</p>
      <p className="my-2 text-xs text-gray-500">Authentication Information</p>
      <div className="flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center md:justify-between">
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
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.firstName?.message && 'border-red-600'}`}
            type="text"
            {...register('firstName')}
            placeholder="Enter first name"
            defaultValue={data && data.firstName}
          />
          {errors.firstName && (
            <p className="text-[10px] text-red-500">
              {errors.firstName?.message?.toString()}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10px] font-medium text-gray-700">
            Last Name
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.lastName?.message && 'border-red-600'}`}
            type="text"
            {...register('lastName')}
            placeholder="Enter last name"
            defaultValue={data && data.lastName}
          />
          {errors.lastName && (
            <p className="text-[10px] text-red-500">
              {errors.lastName?.message?.toString()}
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
            defaultValue={data && data.birthday}
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
          >
            <option value="">Select your sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex && (
            <p className="text-[10px] text-red-500">
              {errors.sex?.message?.toString()}
            </p>
          )}
        </div>

        {/* Image */}
        <div className="mt-2 flex flex-col gap-1 md:mt-4">
          <label
            className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={25} height={25} />
            <p>Select a photo</p>
          </label>
          <input
            className={`hidden w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 md:w-[200px] ${errors.img?.message && 'border-red-600'}`}
            type="file"
            id="img"
            {...register('img')}
          />
          {errors.img && (
            <p className="text-[10px] text-red-500">
              {errors.img?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-1.5 text-xs font-medium text-white">
        Create Teacher
      </button>
    </form>
  );
};

export default StudentForm;
