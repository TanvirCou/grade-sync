'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-red-600">
        Something went wrong!
      </h2>
      <button
        className="text-md mt-3 rounded-sm border border-green-600 px-2 py-2 font-medium text-green-700"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
