import CreateModal from '@/components/Form/CreateModal';
import ExamTable from '@/components/Table/ExamTable';
import Pagination from '@/components/Table/Pagination';
import TableSearch from '@/components/Table/TableSearch';
import { examsData } from '@/lib/data';
import Image from 'next/image';
import React from 'react';

const ListPageOfExams = () => {
  const data = examsData ?? [];
  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="hidden text-lg font-semibold md:block">All Exams</p>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <TableSearch />
          <div className="flex items-center justify-end gap-2 md:justify-normal">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <CreateModal table="exam" />
          </div>
        </div>
      </div>

      <div>
        <ExamTable data={data} />
      </div>

      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default ListPageOfExams;
