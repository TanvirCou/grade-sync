import { UserProfile } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GradeSync | My Profile',
  description: 'This is a school management webapp',
};

const UserProfilePage = () => {
  return (
    <div className="flex w-full justify-center py-3">
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
