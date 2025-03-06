import { UserProfile } from '@clerk/nextjs';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'grade-sync | profile',
  description: 'This is a school management webapp',
};

const UserProfilePage = () => {
  return (
    <div className="flex w-full justify-center">
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
