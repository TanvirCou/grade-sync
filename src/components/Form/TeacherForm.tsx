'use client';
import { createTeacher, updateTeacher } from '@/lib/actions/teacher.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Subject } from '@prisma/client';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
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

type subjectsProps = { id: number; name: string };

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
  subjects: Subject[];
};

const teacherSchema = z.object({
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
  bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
  birthday: z.coerce.date({ message: 'Birthday is required!' }),
  sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required!' }),
  img: z.string().optional(),
  subjects: z.array(z.string().optional()),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

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

const TeacherForm = ({
  data,
  type,
  setOpen,
  subjects,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  subjects?: subjectsProps[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: data
      ? {
          id: data.id,
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address,
          bloodType: data.bloodType,
          sex: data.sex as 'MALE' | 'FEMALE',
          birthday: data.birthday.toISOString().split('T')[0] as any,
          subjects: data.subjects.map((s) => String(s.id)),
        }
      : { subjects: [] },
  });

  const [img, setImg] = useState<any>();
  const [isPending, startPendingTransition] = useTransition();

  const [state, formAction] = useActionState(
    type === 'create' ? createTeacher : updateTeacher,
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
      toast.error(
        'Something went wrong! Please check the fields and try again.'
      );
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((formData) => {
    startPendingTransition(() => {
      startTransition(() => {
        formAction({ ...formData, img: img?.secure_url });
      });
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-1">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold text-gray-800">
          {type === 'create' ? '➕ Create Teacher' : '✏️ Update Teacher'}
        </h2>
        <p className="mt-0.5 text-[11px] text-gray-400">
          Fields marked with <span className="text-red-500">*</span> are
          required
        </p>
      </div>

      {data && <input className="hidden" type="text" {...register('id')} />}

      {/* ── Auth Section ── */}
      <SectionHeader label="Authentication" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label required>Username</Label>
          <input
            className={inputCls(!!errors.username)}
            type="text"
            {...register('username')}
            placeholder="e.g. john_doe"
          />
          <ErrorMsg msg={errors.username?.message} />
        </div>

        <div>
          <Label>Email</Label>
          <input
            className={inputCls(!!errors.email)}
            type="email"
            {...register('email')}
            placeholder="john@school.edu"
          />
          <ErrorMsg msg={errors.email?.message} />
        </div>

        <div>
          <Label required={type === 'create'}>
            Password
            {type === 'update' && (
              <span className="ml-1 font-normal normal-case text-gray-400">
                (leave blank to keep)
              </span>
            )}
          </Label>
          <input
            className={inputCls(!!errors.password)}
            type="password"
            {...register('password')}
            placeholder={
              type === 'update' ? 'Leave blank to keep' : 'Min. 8 characters'
            }
          />
          <ErrorMsg msg={errors.password?.message} />
        </div>
      </div>

      {/* ── Personal Section ── */}
      <SectionHeader label="Personal Information" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label required>First Name</Label>
          <input
            className={inputCls(!!errors.name)}
            type="text"
            {...register('name')}
            placeholder="First name"
          />
          <ErrorMsg msg={errors.name?.message} />
        </div>

        <div>
          <Label required>Last Name</Label>
          <input
            className={inputCls(!!errors.surname)}
            type="text"
            {...register('surname')}
            placeholder="Last name"
          />
          <ErrorMsg msg={errors.surname?.message} />
        </div>

        <div>
          <Label>Phone</Label>
          <input
            className={inputCls(!!errors.phone)}
            type="text"
            {...register('phone')}
            placeholder="+1 234 567 8900"
          />
          <ErrorMsg msg={errors.phone?.message} />
        </div>

        <div>
          <Label required>Address</Label>
          <input
            className={inputCls(!!errors.address)}
            type="text"
            {...register('address')}
            placeholder="Street, City"
          />
          <ErrorMsg msg={errors.address?.message} />
        </div>

        <div>
          <Label required>Blood Type</Label>
          <input
            className={inputCls(!!errors.bloodType)}
            type="text"
            {...register('bloodType')}
            placeholder="e.g. A+, O-"
          />
          <ErrorMsg msg={errors.bloodType?.message} />
        </div>

        <div>
          <Label required>Birthday</Label>
          <input
            className={inputCls(!!errors.birthday)}
            type="date"
            {...register('birthday')}
            defaultValue={data?.birthday.toISOString().split('T')[0]}
          />
          <ErrorMsg msg={errors.birthday?.message?.toString()} />
        </div>

        <div>
          <Label required>Sex</Label>
          <select className={inputCls(!!errors.sex)} {...register('sex')}>
            <option value="">Select sex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <ErrorMsg msg={errors.sex?.message} />
        </div>

        <div>
          <Label>Subjects (hold Ctrl to multi-select)</Label>
          <select
            multiple
            className={`${inputCls(false)} min-h-[80px]`}
            {...register('subjects')}
          >
            {subjects?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Photo Upload */}
        <div className="flex items-end">
          <CldUploadWidget
            uploadPreset="grade-sync"
            onSuccess={(res) => setImg(res?.info)}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2.5 text-xs font-medium text-gray-500 transition hover:border-sky-400 hover:text-sky-600"
              >
                <Image src="/upload.png" alt="" width={18} height={18} />
                {img ? '✅ Photo selected' : 'Upload Photo'}
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {state.error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
          <p className="text-xs font-medium text-red-600">
            ❌ Something went wrong. Please check all required fields and try
            again.
          </p>
        </div>
      )}

      <button
        disabled={isPending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            {type === 'create' ? 'Creating…' : 'Updating…'}
          </>
        ) : (
          <>{type === 'create' ? 'Create Teacher' : 'Update Teacher'}</>
        )}
      </button>
    </form>
  );
};

export default TeacherForm;
