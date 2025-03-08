'use client';
import { createEvent, updateEvent } from '@/lib/actions/event.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { startTransition, useActionState, useEffect } from 'react';
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
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createEvent : updateEvent,
    { success: false, error: false }
  );

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
      setOpen(false);
      toast.error('Error creating event!');
    }
  }, [state, setOpen, router, type]);

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
        {type === 'create' ? 'Create new Event' : 'Update Event'}
      </p>
      <div
        className={`flex flex-col flex-wrap gap-y-2 md:flex-row md:items-center md:justify-between`}
      >
        {data && (
          <input
            className={`hidden w-full appearance-none rounded-md border border-gray-300 px-3 py-1 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400`}
            type="number"
            {...register('id')}
            defaultValue={data?.id}
          />
        )}

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Event title
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.title?.message && 'border-red-600'}`}
            type="text"
            {...register('title')}
            placeholder="Enter event title"
            defaultValue={data?.title}
          />
          {errors.title && (
            <p className="text-[10px] text-red-500">
              {errors.title?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Class
          </label>
          <select
            className={`block w-full appearance-none rounded-md border border-gray-300 px-4 py-1 text-sm outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 md:w-[200px] ${errors.classId?.message && 'border-red-600'}`}
            {...register('classId')}
            defaultValue={data && data?.classId}
          >
            <option value="">General</option>
            {classes &&
              classes.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
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
          <label className="block text-xs font-medium text-gray-700">
            Start Date
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.startTime?.message && 'border-red-600'}`}
            type="datetime-local"
            {...register('startTime')}
            placeholder="Enter start date & time"
            // defaultValue={data?.startTime.toISOString()}
          />
          {errors.startTime && (
            <p className="text-[10px] text-red-500">
              {errors.startTime?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            End Date
          </label>
          <input
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.endTime?.message && 'border-red-600'}`}
            type="datetime-local"
            {...register('endTime')}
            placeholder="Enter end date & time"
            // defaultValue={data?.startTime.toLocaleString()}
          />
          {errors.endTime && (
            <p className="text-[10px] text-red-500">
              {errors.endTime?.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-gray-700">
            Event description
          </label>
          <textarea
            className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 outline-1 outline-sky-200 placeholder:text-xs placeholder:text-gray-400 ${errors.description?.message && 'border-red-600'}`}
            {...register('description')}
            placeholder="Enter announcement description"
            defaultValue={data?.description}
          />
          {errors.description && (
            <p className="text-[10px] text-red-500">
              {errors.description?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-sky-500 py-2 text-xs font-medium text-white">
        {type === 'create' ? 'Create' : 'Update'} Event
      </button>
    </form>
  );
};

export default EventForm;
