import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      <AppSidebar />{" "}
      <div className="flex-1 flex flex-col overflow-hidden">
        {" "}
        <AppHeader />{" "}
        <main className="flex-1 overflow-y-auto p-6"> {children} </main>{" "}
      </div>{" "}
    </div>
  );
}
