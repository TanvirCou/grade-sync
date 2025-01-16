import React from 'react';

const Announcements = () => {
  return (
    <div className="rounded-xl bg-white p-2">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Announcements</p>
        <span className="text-xs text-gray-500">View All</span>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <div className="rounded-md bg-sky-100 px-2 py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Lorem ipsum dolor</p>
            <p className="text-xs text-gray-400">24/6/2017</p>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="rounded-md bg-sky-100 px-2 py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Lorem ipsum dolor</p>
            <p className="text-xs text-gray-400">24/6/2017</p>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="rounded-md bg-sky-100 px-2 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Lorem ipsum dolor</p>
            <p className="text-xs text-gray-400">24/6/2017</p>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
