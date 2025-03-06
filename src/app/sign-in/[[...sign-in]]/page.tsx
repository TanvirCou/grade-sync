'use client';
import { SignIn, useUser } from '@clerk/nextjs';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'grade-sync | sign-in',
  description: 'This is a school management webapp',
};

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;
    console.log(role);

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </div>
  );
}
