import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '../../../public/logo.png';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <Link
          href="/"
          className="flex items-center justify-center gap-1 p-2 lg:justify-start"
        >
          <Image src={logo} alt="" width={25} height={25} />
          <p className="hidden font-[Poppins] text-lg font-semibold lg:block">
            GradeSync
          </p>
        </Link>
        <Sidebar />
      </div>
      <div className="flex w-[86%] flex-col overflow-y-scroll bg-gray-100 md:w-[92%] lg:w-[84%] xl:w-[86%]">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
