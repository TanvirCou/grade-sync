'use client';
import { createParent, updateParent } from '@/lib/actions/parent.actions';
import { zodResolver } from '@hookform/resolvers/zod';
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
  students: { id: string; username: string; name: string; surname: string }[];
};

type StudentOption = {
  id: string;
  username: string;
  name: string;
  surname: string;
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
  studentsId: z.string().optional(),
});

export type ParentSchema = z.infer<typeof parentSchema>;

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

const StudentMultiSearchDropdown = ({
  register,
  defaultStudents,
}: {
  register: any;
  defaultStudents?: StudentOption[];
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StudentOption[]>([]);
  const [selected, setSelected] = useState<StudentOption[]>(
    defaultStudents ?? []
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = useCallback(
    (val: string) => {
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
            `/api/students/search?q=${encodeURIComponent(val)}`
          );
          const data: StudentOption[] = await res.json();
          setResults(
            data.filter((s) => !selected.find((sel) => sel.id === s.id))
          );
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [selected]
  );

  const handleSelect = (s: StudentOption) => {
    setSelected((prev) => [...prev, s]);
    setQuery('');
    setResults([]);
    setOpen(false);
  };
  const handleRemove = (id: string) =>
    setSelected((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="col-span-full flex flex-col gap-1" ref={wrapperRef}>
      <Label>
        Children (Students){' '}
        <span className="font-normal normal-case text-gray-400">
          — optional, link after creating students
        </span>
      </Label>
      <input
        type="hidden"
        {...register('studentsId')}
        value={selected.map((s) => s.id).join(',')}
      />

      {selected.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
                {s.name.charAt(0).toUpperCase()}
              </span>
              {s.name} {s.surname}
              <button
                type="button"
                onClick={() => handleRemove(s.id)}
                className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-emerald-400 transition hover:bg-red-100 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder={
            selected.length === 0
              ? 'Search students by username or name…'
              : 'Add more students…'
          }
          className={`${inputCls(false)} pl-8`}
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
                No students found matching &ldquo;{query}&rdquo;
              </p>
            ) : (
              <ul className="max-h-48 divide-y divide-gray-50 overflow-y-auto">
                {results.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className="flex cursor-pointer items-center gap-2.5 px-3 py-2 transition hover:bg-emerald-50"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="leading-tight">
                      <p className="text-xs font-semibold text-gray-800">
                        {s.name} {s.surname}
                      </p>
                      <p className="text-[10px] text-gray-400">@{s.username}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
    defaultValues: data
      ? {
          id: data.id,
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email || '',
          phone: data.phone,
          address: data.address,
          studentsId: data.students.map((s) => s.id).join(','),
        }
      : { studentsId: '' },
  });

  const [isPending, startPendingTransition] = useTransition();

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
      toast.error(
        'Something went wrong! Please check all fields and try again.'
      );
    }
  }, [state, setOpen, router, type]);

  const onSubmit = handleSubmit((formData) => {
    startPendingTransition(() => {
      startTransition(() => {
        formAction(formData);
      });
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-1">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold text-gray-800">
          {type === 'create' ? '➕ Create Parent' : '✏️ Update Parent'}
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
            placeholder="e.g. parent_doe"
          />
          <ErrorMsg msg={errors.username?.message} />
        </div>
        <div>
          <Label>Email</Label>
          <input
            className={inputCls(!!errors.email)}
            type="email"
            {...register('email')}
            placeholder="parent@email.com"
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
          <Label required>Phone</Label>
          <input
            className={inputCls(!!errors.phone)}
            type="text"
            {...register('phone')}
            placeholder="+1 234 567 8900"
          />
          <ErrorMsg msg={errors.phone?.message} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <Label>Address</Label>
          <input
            className={inputCls(!!errors.address)}
            type="text"
            {...register('address')}
            placeholder="Street, City"
          />
          <ErrorMsg msg={errors.address?.message} />
        </div>
      </div>

      {/* ── Children ── */}
      <SectionHeader label="Linked Children" />
      <div className="grid grid-cols-1 gap-3">
        <StudentMultiSearchDropdown
          register={register}
          defaultStudents={data?.students ?? []}
        />
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
          <>{type === 'create' ? 'Create Parent' : 'Update Parent'}</>
        )}
      </button>
    </form>
  );
};

export default ParentForm;
