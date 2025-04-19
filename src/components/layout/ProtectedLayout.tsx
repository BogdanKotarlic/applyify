import Sidebar from "@/components/layout/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 shrink-0 border-r">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
