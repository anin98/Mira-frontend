// app/layout.tsx - Fix the CSS import path
import './global.css'; // Changed from './globals.css' to './global.css'
import { Inter } from 'next/font/google';
import ReactQueryProviders from './components/providers';
import { NavigationProvider } from './contexts/NavigationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MIRA AI',
  description: 'Solutions on a scale',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProviders>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}

