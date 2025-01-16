import CreateModal from '@/components/Form/CreateModal';
import AnnouncementTable from '@/components/Table/AnnouncementTable';
import Pagination from '@/components/Table/Pagination';
import TableSearch from '@/components/Table/TableSearch';
import { announcementsData } from '@/lib/data';
import Image from 'next/image';
import React from 'react';

const ListPageOfAnnouncements = () => {
  const data = announcementsData ?? [];
  return (
    <div className="m-2 flex flex-1 flex-col gap-2 rounded-md bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="hidden text-lg font-semibold md:block">
          All Announcements
        </p>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <TableSearch />
          <div className="flex items-center justify-end gap-2 md:justify-normal">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <CreateModal table="announcement" />
          </div>
        </div>
      </div>

      <div>
        <AnnouncementTable data={data} />
      </div>

      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default ListPageOfAnnouncements;
