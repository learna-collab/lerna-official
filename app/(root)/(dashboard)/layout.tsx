import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/layout/TopNavbar";
import { ClassProvider } from "@/components/sidebar/ClassContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClassProvider>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <TopNavbar />

        {/* Main Content */}
        <div className="flex pt-[72px]">
          <Sidebar />

          <main className="flex-1 min-w-0 transition-all duration-300">
            <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ClassProvider>
  );
}
