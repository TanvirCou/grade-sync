import Image from 'next/image';
import React from 'react';

const TableSearch = () => {
  return (
    <div className="flex w-full items-center gap-x-1 rounded-2xl p-1.5 px-1 ring-1 ring-gray-300 md:w-auto">
      <Image src="/search.png" alt="search-logo" width={14} height={14} />
      <input
        type="search"
        name=""
        id=""
        placeholder="Search..."
        className="bg-transparent text-sm outline-none"
      />
    </div>
  );
};

export default TableSearch;
