import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GradeSync',
  description: 'This is a school management webapp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className} antialiased`}>
          <div>
            <ClerkLoading>
              <div className="flex h-screen items-center justify-center">
                <span className="loading loading-bars loading-lg"></span>
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <div>
                {children}{' '}
                <ToastContainer position="bottom-right" theme="dark" />
              </div>
            </ClerkLoaded>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
