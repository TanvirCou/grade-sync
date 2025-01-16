import React from 'react';

const Pagination = () => {
  return (
    <div className="flex items-center justify-between">
      <button
        disabled
        className="rounded-sm bg-slate-200 px-4 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      <div className="flex items-center gap-2">
        <p className="w-fit rounded-sm bg-sky-200 p-1 px-2 text-xs font-medium">
          1
        </p>
        <p className="w-fit rounded-sm bg-slate-200 p-1 px-2 text-xs font-medium">
          2
        </p>
        <p className="w-fit rounded-sm bg-slate-200 p-1 px-2 text-xs font-medium">
          3
        </p>
        ...
        <p className="w-fit rounded-sm bg-slate-200 p-1 px-2 text-xs font-medium">
          10
        </p>
      </div>
      <button className="rounded-sm bg-slate-200 px-4 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default Pagination;
