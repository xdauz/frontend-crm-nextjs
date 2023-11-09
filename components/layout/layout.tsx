import { Inter } from 'next/font/google'
import Header from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`app-layout ${inter.className}`}>
      <div className="hidden flex-col md:flex">
        <Header />

        {children}
      </div>
    </div>
  );
}