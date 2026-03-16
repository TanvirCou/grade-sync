'use client';
import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const demoAccounts = [
  {
    role: 'Admin',
    identifier: 'testingadmin',
    password: 'admin1234',
    color: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  {
    role: 'Teacher',
    identifier: 'testingteacher',
    password: 'teacher1234',
    color: 'bg-sky-100 text-sky-700 border-sky-200',
  },
  {
    role: 'Student',
    identifier: 'testingstudent',
    password: 'student1234',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    role: 'Parent',
    identifier: 'testingparent',
    password: 'parent1234',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 flex-shrink-0 rounded p-0.5 text-gray-400 transition hover:text-gray-700"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen w-full flex-col-reverse items-center justify-center gap-8 bg-gray-50 px-4 py-6 md:py-4 lg:flex-row lg:gap-12 lg:px-12">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Demo Accounts</h2>
            <p className="text-[11px] text-gray-400">
              Click the copy icon to copy credentials
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {demoAccounts.map((account) => (
            <div
              key={account.role}
              className={`rounded-xl border p-3 ${account.color}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide">
                  {account.role}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between rounded-lg bg-white/60 px-2 py-1">
                  <span className="font-mono text-[11px] text-gray-700">
                    {account.identifier}
                  </span>
                  <CopyButton text={account.identifier} />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/60 px-2 py-1">
                  <span className="font-mono text-[11px] text-gray-700">
                    {account.password}
                  </span>
                  <CopyButton text={account.password} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <p className="mt-4 text-center text-[10px] text-gray-400">
          This is a demo project ·{' '}
          <a
            href="https://github.com/TanvirCou/grade-sync"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            View on GitHub
          </a>
        </p> */}
      </div>

      <div>
        <SignIn />
      </div>
    </div>
  );
}
