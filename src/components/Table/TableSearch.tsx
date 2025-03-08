'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const TableSearch = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = (e.currentTarget[0] as HTMLInputElement).value;

    const params = new URLSearchParams(window.location.search);
    params.set('search', value);
    router.push(`${window.location.pathname}?${params}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-x-1 rounded-2xl p-1.5 px-1 ring-1 ring-gray-300 md:w-auto"
    >
      <Image src="/search.png" alt="search-logo" width={14} height={14} />
      <input
        type="search"
        name=""
        id=""
        placeholder="Search..."
        className="w-[95%] bg-transparent text-sm outline-none"
      />
    </form>
  );
};

export default TableSearch;
