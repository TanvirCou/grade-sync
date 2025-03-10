import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '../../../public/logo.png';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import { currentUser } from '@clerk/nextjs/server';

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await currentUser();
  const role = session?.publicMetadata.role as string;

  return (
    <div className="flex h-screen w-full overflow-y-hidden">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <Link
          href={`/${role}`}
          className="flex items-center justify-center gap-1 p-2 lg:justify-start"
        >
          <Image src={logo} alt="" width={25} height={25} />
          <p className="hidden font-[Poppins] text-lg font-semibold lg:block">
            GradeSync
          </p>
        </Link>
        <Sidebar />
      </div>
      <div className="flex w-[86%] flex-col overflow-x-hidden overflow-y-scroll bg-gray-100 md:w-[92%] lg:w-[84%] xl:w-[86%]">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
