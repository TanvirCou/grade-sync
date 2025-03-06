import { UserProfile } from '@clerk/nextjs';
import React from 'react';

const UserProfilePage = () => {
  return (
    <div className="flex w-full justify-center">
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
