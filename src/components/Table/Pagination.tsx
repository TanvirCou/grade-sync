'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();

  const handleChangePage = (newPageIndex: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPageIndex.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const hasPrev = 5 * (page - 1) > 0;
  const hasNext = 5 * (page - 1) + 5 < count;

  return (
    <div className="flex items-center justify-between">
      <button
        disabled={!hasPrev}
        onClick={() => handleChangePage(page - 1)}
        className="rounded-sm bg-slate-200 px-4 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      <div className="flex items-center gap-2">
        {Array.from(
          { length: Math.ceil(count / 5) },
          (_, index) => index + 1
        ).map((pageIndex) => (
          <button
            onClick={() => handleChangePage(pageIndex)}
            key={pageIndex}
            className={`rounded-sm ${pageIndex === page ? 'bg-sky-200' : 'bg-slate-200'} px-4 py-1 text-xs font-medium`}
          >
            {pageIndex}
          </button>
        ))}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => handleChangePage(page + 1)}
        className="rounded-sm bg-slate-200 px-4 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
