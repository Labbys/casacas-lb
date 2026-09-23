import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeft,
  Settings,
  Tags,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";

const menuItems = [
  { icon: LayoutDashboard, label: "Resumen", path: "/admin" },
  { icon: Package, label: "Productos", path: "/admin/products" },
  { icon: Tags, label: "Categorías", path: "/admin/categories" },
  { icon: Settings, label: "Configuración", path: "/admin/settings" },
];

const SIDEBAR_WIDTH_KEY = "casacas-admin-sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 220;
const MAX_WIDTH = 390;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#eee9df] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-[#d9d1c5] bg-[#f8f5ef] p-8 text-center shadow-[0_24px_70px_rgba(40,34,27,.12)]">
          <p className="casacas-kicker">CASACAS LB / ADMIN</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-[#211f1c]">Panel privado.</h1>
          <p className="mt-4 text-sm leading-6 text-[#706a62]">Iniciá sesión para administrar productos, precios y publicaciones.</p>
          <Button onClick={() => startLogin()} className="mt-8 w-full bg-[#f33825] text-white hover:bg-[#d92c1c]">Ingresar al panel</Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location) ?? menuItems[0];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const width = event.clientX - left;
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div ref={sidebarRef} className="relative">
        <Sidebar collapsible="icon" className="border-r border-[#393633] bg-[#211f1c] text-[#f6f1e9]" disableTransition={isResizing}>
          <SidebarHeader className="h-20 justify-center border-b border-[#393633]">
            <div className="flex w-full items-center gap-3 px-2">
              <button onClick={toggleSidebar} aria-label="Contraer menú" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#514c45] text-[#f33825] transition hover:rotate-[-6deg] hover:bg-[#f33825] hover:text-white">
                <PanelLeft className="h-4 w-4" />
              </button>
              {!isCollapsed && <div><p className="font-display text-2xl leading-none">CASACAS <span className="text-[#f33825]">LB</span></p><p className="mt-1 text-[9px] font-bold uppercase tracking-[.22em] text-[#9b948a]">Panel de control</p></div>}
            </div>
          </SidebarHeader>
          <SidebarContent className="gap-0 px-2 py-4">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-[#8e887f] group-data-[collapsible=icon]:hidden">Administración</p>
            <SidebarMenu>
              {menuItems.map(item => {
                const active = location === item.path;
                return <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={active} onClick={() => setLocation(item.path)} tooltip={item.label} className={`h-11 rounded-xl transition ${active ? "bg-[#f33825] text-white hover:bg-[#f33825] hover:text-white" : "text-[#d9d2c7] hover:bg-[#302e2a] hover:text-white"}`}><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>;
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-[#393633] p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-[#302e2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f33825]"><Avatar className="h-9 w-9 border border-[#665e55]"><AvatarFallback className="bg-[#f33825] text-white">{user?.name?.charAt(0).toUpperCase() ?? "A"}</AvatarFallback></Avatar><div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"><p className="truncate text-sm font-semibold text-white">{user?.name || "Administrador"}</p><p className="mt-1 truncate text-[11px] text-[#a59d92]">{user?.email || "Sesión activa"}</p></div></button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52"><DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600"><LogOut className="mr-2 h-4 w-4" />Cerrar sesión</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        {!isCollapsed && <div className="absolute right-0 top-0 z-50 h-full w-1 cursor-col-resize hover:bg-[#f33825]/30" onMouseDown={() => setIsResizing(true)} />}
      </div>
      <SidebarInset className="bg-[#eee9df]">
        {isMobile && <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[#d9d1c5] bg-[#f8f5ef]/95 px-3 backdrop-blur"><SidebarTrigger className="h-9 w-9" /><span className="font-semibold text-[#211f1c]">{activeMenuItem.label}</span></div>}
        <main className="min-h-screen p-4 sm:p-6 lg:p-10">{children}</main>
      </SidebarInset>
    </>
  );
}
