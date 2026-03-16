'use client';
import { createClass, updateClass } from '@/lib/actions/class.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, {
  startTransition,
  useActionState,
  useEffect,
  useTransition,
} from 'react';
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
  name: z.string().min(1, { message: 'Class name is required' }),
  capacity: z.coerce.number().min(1, { message: 'Capacity is required' }),
  gradeId: z.coerce.number().min(1, { message: 'Grade is required' }),
  supervisorId: z.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

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
    defaultValues: data
      ? {
          id: data.id,
          name: data.name,
          capacity: data.capacity,
          gradeId: data.gradeId,
          supervisorId: String(data.supervisorId ?? ''),
        }
      : {},
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createClass : updateClass,
    { success: false, error: false }
  );

  const [isPending, startPendingTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Class ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error(
        `Error ${type === 'create' ? 'creating' : 'updating'} class!`
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
    <form onSubmit={onSubmit} className="px-1">
      <p className="mb-1 text-center text-lg font-bold text-gray-800">
        {type === 'create' ? 'New Class' : 'Update Class'}
      </p>
      <p className="mb-4 text-center text-[11px] text-gray-400">
        {type === 'create'
          ? 'Fill in the details below'
          : 'Edit the details below'}
      </p>

      {data && <input type="hidden" {...register('id')} />}

      {/* ── Class Details ── */}
      <SectionHeader label="Class Details" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label required>Class Name</Label>
          <input
            className={inputCls(!!errors.name)}
            type="text"
            {...register('name')}
            placeholder="e.g. Class 10-A"
          />
          <ErrorMsg msg={errors.name?.message} />
        </div>

        <div>
          <Label required>Capacity</Label>
          <input
            className={inputCls(!!errors.capacity)}
            type="number"
            {...register('capacity')}
            placeholder="e.g. 30"
          />
          <ErrorMsg msg={errors.capacity?.message} />
        </div>

        <div>
          <Label required>Grade</Label>
          <select
            className={inputCls(!!errors.gradeId)}
            {...register('gradeId')}
          >
            <option value="">Select a grade</option>
            {classGrades?.map((grade) => (
              <option key={grade.id} value={grade.id}>
                Grade {grade.level}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.gradeId?.message} />
        </div>

        <div className="sm:col-span-2">
          <Label>
            Supervisor Teacher{' '}
            <span className="font-normal normal-case text-gray-400">
              (optional)
            </span>
          </Label>
          <select
            className={inputCls(!!errors.supervisorId)}
            {...register('supervisorId')}
          >
            <option value="">Select a teacher</option>
            {teachersData?.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name + ' ' + teacher.surname}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.supervisorId?.message} />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 active:scale-[0.98] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {type === 'create' ? 'Creating…' : 'Updating…'}
          </>
        ) : type === 'create' ? (
          'Create Class'
        ) : (
          'Update Class'
        )}
      </button>
    </form>
  );
};

export default ClassForm;
