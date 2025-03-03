import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const session = await currentUser();
  const role = session?.publicMetadata.role as string;
  if (role) {
    redirect(`/${role}`);
  } else {
    redirect('/sign-in');
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );
};

export default page;
