import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Sidebar />
      <div className="md:ml-60">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
