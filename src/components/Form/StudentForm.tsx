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
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useController, useForm } from 'react-hook-form';
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

type StudentGradesProps = { id: number; level: number };

type StudentClassesProps = Class & { _count: { students: number } };

type ParentOption = {
  id: string;
  username: string;
  name: string;
  surname: string;
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

const ParentSearchDropdown = ({
  control,
  defaultParentId,
  error,
}: {
  control: any;
  defaultParentId?: string;
  error?: string;
}) => {
  const { field } = useController({
    name: 'parentId',
    control,
    defaultValue: '',
  });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ParentOption[]>([]);
  const [selected, setSelected] = useState<ParentOption | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultParentId && !selected) {
      fetch(`/api/parents/search?id=${encodeURIComponent(defaultParentId)}`)
        .then((r) => r.json())
        .then((list: ParentOption[]) => {
          if (list.length > 0) {
            setSelected(list[0]);
            field.onChange(list[0].id);
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultParentId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = useCallback((val: string) => {
    setQuery(val);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!val.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/parents/search?q=${encodeURIComponent(val)}`
        );
        setResults(await res.json());
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleSelect = (p: ParentOption) => {
    setSelected(p);
    field.onChange(p.id);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const handleClear = () => {
    setSelected(null);
    field.onChange('');
    setQuery('');
    setResults([]);
  };

  return (
    <div className="flex flex-col gap-1" ref={wrapperRef}>
      <Label required>Parent</Label>
      <input type="hidden" {...field} />

      {selected ? (
        <div
          className={`flex items-center justify-between rounded-lg border px-3 py-2 ${error ? 'border-red-400 bg-red-50' : 'border-sky-200 bg-sky-50'}`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white">
              {selected.name.charAt(0).toUpperCase()}
            </span>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-gray-800">
                {selected.name} {selected.surname}
              </p>
              <p className="text-[10px] text-gray-400">@{selected.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition hover:bg-red-100 hover:text-red-500"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => query && setOpen(true)}
            placeholder="Search parent by username…"
            className={`${inputCls(!!error)} pl-8`}
          />
          <svg
            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {open && query.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-xl">
              {loading ? (
                <p className="py-4 text-center text-xs text-gray-400">
                  Searching…
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-3 text-xs text-gray-400">
                  No parents found. Create a parent first.
                </p>
              ) : (
                <ul className="max-h-48 divide-y divide-gray-50 overflow-y-auto">
                  {results.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      className="flex cursor-pointer items-center gap-2.5 px-3 py-2 transition hover:bg-sky-50"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="leading-tight">
                        <p className="text-xs font-semibold text-gray-800">
                          {p.name} {p.surname}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          @{p.username}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
      <ErrorMsg msg={error} />
    </div>
  );
};

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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
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
          gradeId: data.gradeId,
          classId: data.classId,
          parentId: data.parentId,
        }
      : { parentId: '' },
  });

  const [img, setImg] = useState<any>();
  const [isPending, startPendingTransition] = useTransition();

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
        `Student ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error(
        'Something went wrong! Please check all fields and try again.'
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
          {type === 'create' ? '➕ Create Student' : '✏️ Update Student'}
        </h2>
        <p className="mt-0.5 text-[11px] text-gray-400">
          Fields marked with <span className="text-red-500">*</span> are
          required
        </p>
      </div>

      {data && <input className="hidden" type="text" {...register('id')} />}

      {/* ── Auth ── */}
      <SectionHeader label="Authentication" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label required>Username</Label>
          <input
            className={inputCls(!!errors.username)}
            type="text"
            {...register('username')}
            placeholder="e.g. jane_smith"
          />
          <ErrorMsg msg={errors.username?.message} />
        </div>
        <div>
          <Label>Email</Label>
          <input
            className={inputCls(!!errors.email)}
            type="email"
            {...register('email')}
            placeholder="jane@school.edu"
          />
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div>
          <Label required={type === 'create'}>
            Password
            {type === 'update' && (
              <span className="ml-1 font-normal normal-case text-gray-400">
                (blank = keep)
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

      {/* ── Personal ── */}
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
          <Label required>Grade</Label>
          <select
            className={inputCls(!!errors.gradeId)}
            {...register('gradeId')}
          >
            <option value="">Select grade</option>
            {studentGrades?.map((g) => (
              <option key={g.id} value={g.id}>
                Grade {g.level}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.gradeId?.message} />
        </div>
        <div>
          <Label required>Class</Label>
          <select
            className={inputCls(!!errors.classId)}
            {...register('classId')}
          >
            <option value="">Select class</option>
            {studentClasses?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c._count.students}/{c.capacity}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.classId?.message} />
        </div>
      </div>

      {/* ── Parent & Photo ── */}
      <SectionHeader label="Parent & Photo" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ParentSearchDropdown
          control={control}
          defaultParentId={data?.parentId}
          error={errors.parentId?.message}
        />
        <div className="flex flex-col gap-1">
          <Label>Profile Photo</Label>
          <CldUploadWidget
            uploadPreset="grade-sync"
            onSuccess={(res) => setImg(res?.info)}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex w-fit items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2.5 text-xs font-medium text-gray-500 transition hover:border-sky-400 hover:text-sky-600"
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
            ❌ Something went wrong. Please check all required fields.
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
          <>{type === 'create' ? 'Create Student' : 'Update Student'}</>
        )}
      </button>
    </form>
  );
};

export default StudentForm;
