import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import React from 'react';

const Navbar = async () => {
  const session = await currentUser();
  const role = session?.publicMetadata.role as string;

  return (
    <div className="flex items-center justify-between px-4 py-2 shadow-sm">
      <div className="hidden w-fit items-center gap-x-1 rounded-2xl p-1.5 px-1 ring-1 ring-gray-300 md:flex">
        <Image src="/search.png" alt="search-logo" width={14} height={14} />
        <input
          type="search"
          name=""
          id=""
          placeholder="Search..."
          className="w-[300px] bg-transparent text-sm outline-none"
        />
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <div className="cursor-pointer rounded-full bg-white p-1">
          <Image src="/message.png" alt="message-logo" width={18} height={18} />
        </div>
        <div className="relative cursor-pointer rounded-full bg-white p-1">
          <Image src="/announcement.png" alt="" width={18} height={18} />
          <p className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
            1
          </p>
        </div>
        <div>
          <p className="text-xs font-medium leading-3">{session?.username}</p>
          <p className="text-right text-[10px] first-letter:uppercase">
            {role}
          </p>
        </div>
        {/* <div className="cursor-pointer rounded-full">
          <Image
            src="/avatar.png"
            alt="avatar"
            width={27}
            height={27}
            className="rounded-full"
          />
        </div> */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
