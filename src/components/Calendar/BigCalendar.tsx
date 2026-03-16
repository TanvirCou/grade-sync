'use client';
import moment from 'moment';
import { useState } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  console.log(data);

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      views={['work_week', 'day']}
      view={view}
      onView={handleOnChangeView}
      style={{ height: '98%' }}
      min={new Date(2026, 1, 0, 8, 0)}
      max={new Date(2026, 11, 0, 17, 0)}
    />
  );
};

export default BigCalendar;
