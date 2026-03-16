'use client';
import { createEvent, updateEvent } from '@/lib/actions/event.actions';
import { formatDateTimeLocal } from '@/lib/utils';
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
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  classId: number;
};

type ClassProps = { name: string; id: number };

const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Event title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  classId: z.coerce.number({ message: 'Class is required' }),
});

export type EventSchema = z.infer<typeof eventSchema>;

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

const EventForm = ({
  data,
  type,
  setOpen,
  classes,
}: {
  data?: DataProps;
  type: 'create' | 'update';
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  classes?: ClassProps[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: data
      ? {
          id: data.id,
          title: data.title,
          description: data.description,
          startTime: data.startTime
            ? formatDateTimeLocal(data.startTime)
            : ('' as any),
          endTime: data.endTime
            ? formatDateTimeLocal(data.endTime)
            : ('' as any),
          classId: data.classId,
        }
      : {},
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createEvent : updateEvent,
    { success: false, error: false }
  );

  const [isPending, startPendingTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
      toast.success(
        `Event has been ${type === 'create' ? 'created' : 'updated'} successfully!`
      );
    }
    if (state.error) {
      toast.error(
        `Error ${type === 'create' ? 'creating' : 'updating'} event!`
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
        {type === 'create' ? 'New Event' : 'Update Event'}
      </p>
      <p className="mb-4 text-center text-[11px] text-gray-400">
        {type === 'create'
          ? 'Fill in the details below'
          : 'Edit the details below'}
      </p>

      {data && <input type="hidden" {...register('id')} />}

      {/* ── Event Details ── */}
      <SectionHeader label="Event Details" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label required>Title</Label>
          <input
            className={inputCls(!!errors.title)}
            type="text"
            {...register('title')}
            placeholder="e.g. Sports Day"
          />
          <ErrorMsg msg={errors.title?.message} />
        </div>

        <div>
          <Label required>Start Date &amp; Time</Label>
          <input
            className={inputCls(!!errors.startTime)}
            type="datetime-local"
            {...register('startTime')}
          />
          <ErrorMsg msg={errors.startTime?.message?.toString()} />
        </div>

        <div>
          <Label required>End Date &amp; Time</Label>
          <input
            className={inputCls(!!errors.endTime)}
            type="datetime-local"
            {...register('endTime')}
          />
          <ErrorMsg msg={errors.endTime?.message?.toString()} />
        </div>

        <div className="sm:col-span-2">
          <Label>
            Class{' '}
            <span className="font-normal normal-case text-gray-400">
              (optional — blank = all)
            </span>
          </Label>
          <select
            className={inputCls(!!errors.classId)}
            {...register('classId')}
          >
            <option value="">General (All Classes)</option>
            {classes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.classId?.message?.toString()} />
        </div>

        <div className="sm:col-span-2">
          <Label required>Description</Label>
          <textarea
            className={`${inputCls(!!errors.description)} resize-none`}
            rows={4}
            {...register('description')}
            placeholder="Enter event description…"
          />
          <ErrorMsg msg={errors.description?.message} />
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
          'Create Event'
        ) : (
          'Update Event'
        )}
      </button>
    </form>
  );
};

export default EventForm;
