import { UserProfile } from '@clerk/nextjs';
import React from 'react';

const page = () => {
  return (
    <div className="flex w-full justify-center">
      <UserProfile />
    </div>
  );
};

export default page;
