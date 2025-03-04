'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Homepage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;
    console.log(role);

    if (role) {
      router.push(`/${role}`);
    } else {
      router.push('/sign-in');
    }
  }, [user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-bars loading-lg">Hey</span>
    </div>
  );
};

export default Homepage;
