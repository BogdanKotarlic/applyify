import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components//ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="p-4 max-w-3xl mx-auto w-full">
          <div className="block sm:hidden mb-4">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
