import './globals.css';
// import { Inter } from '@next/font/google';
import { GrowthBookProviderClient } from './growthbookprovider-client';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: `TypeScript starter for Next.js`,
//   description: `TypeScript starter for Next.js that includes all you need to build amazing apps`,
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <GrowthBookProviderClient>{children}</GrowthBookProviderClient>
      </body>
    </html>
  );
}
