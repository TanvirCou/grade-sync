'use client';
import { createSubject, updateSubject } from '@/lib/actions/subject.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Teacher } from '@prisma/client';
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
    defaultValues: data
      ? {
          id: data.id,
          name: data.name,
          teachers: data.teachers.map((t) => t.id),
        }
      : {},
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createSubject : updateSubject,
    { success: false, error: false }
  );

  const [isPending, startPendingTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Subject ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error(
        `Error ${type === 'create' ? 'creating' : 'updating'} subject!`
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
        {type === 'create' ? 'New Subject' : 'Update Subject'}
      </p>
      <p className="mb-4 text-center text-[11px] text-gray-400">
        {type === 'create'
          ? 'Fill in the details below'
          : 'Edit the details below'}
      </p>

      {data && <input type="hidden" {...register('id')} />}

      {/* ── Subject Details ── */}
      <SectionHeader label="Subject Details" />
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label required>Subject Name</Label>
          <input
            className={inputCls(!!errors.name)}
            type="text"
            {...register('name')}
            placeholder="e.g. Mathematics"
          />
          <ErrorMsg msg={errors.name?.message} />
        </div>

        <div>
          <Label>
            Assigned Teachers{' '}
            <span className="font-normal normal-case text-gray-400">
              (hold Ctrl / Cmd to select multiple)
            </span>
          </Label>
          <select
            multiple
            className={`${inputCls(!!errors.teachers)} min-h-[120px]`}
            {...register('teachers')}
          >
            {teachersData?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name + ' ' + t.surname}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.teachers?.message?.toString()} />
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
          'Create Subject'
        ) : (
          'Update Subject'
        )}
      </button>
    </form>
  );
};

export default SubjectForm;
