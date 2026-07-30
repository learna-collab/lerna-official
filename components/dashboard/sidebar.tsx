"use client";

import { usePathname } from "next/navigation";

import { useAuthStore } from "@/app/store/auth-store";

import SidebarFooter from "../sidebar/SidebarFooter";
import SidebarGroup from "../sidebar/SidebarGroup";
import SidebarHeader from "../sidebar/SidebarHeader";
import SidebarMobileToggle from "../sidebar/SidebarMobileToggle";
import SidebarOverlay from "../sidebar/SidebarOverlay";

import { getSidebarNavigation } from "../sidebar/nav";
import { useSidebar } from "../sidebar/useSidebar";
import { useClassContext } from "../sidebar/ClassContext";

export default function Sidebar() {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const role = user?.role;

  /**
   * --------------------------------------------------
   * Get current class from URL
   *
   * Matches:
   * /school-admin/classes/:id
   * /school-admin/classes/:id/students
   * /school-admin/classes/:id/teachers
   * /school-admin/classes/:id/subjects
   * /school-admin/classes/:id/results
   * /school-admin/classes/:id/attendance
   * --------------------------------------------------
   */

  function getCurrentClassId(pathname: string): string | undefined {
    const patterns = [
      /^\/school-admin\/classes\/([^/]+)/,
      /^\/teacher\/results(?:\/edit)?\/([^/?]+)/,
      /^\/teacher\/attendance\/([^/?]+)/,
      /^\/teacher\/classes\/([^/?]+)/,
    ];

    for (const pattern of patterns) {
      const match = pathname.match(pattern);
      if (match) return match[1];
    }

    return undefined;
  }
  const classId = getCurrentClassId(pathname);

  /**
   * Keep using context only for displaying
   * the class name/level in the header.
   */

  const { className, classLevel } = useClassContext();

  /**
   * --------------------------------------------------
   * Build sidebar
   * --------------------------------------------------
   */

  const groups = role ? (getSidebarNavigation(classId)[role] ?? []) : [];

  /**
   * --------------------------------------------------
   * Sidebar state
   * --------------------------------------------------
   */

  const {
    collapsed,
    mobileOpen,

    expandedItems,

    toggleSidebar,
    toggleMobile,
    closeMobile,

    toggleItem,
  } = useSidebar();

  return (
    <>
      <SidebarMobileToggle
        mobileOpen={mobileOpen}
        toggleMobile={toggleMobile}
      />

      <SidebarOverlay mobileOpen={mobileOpen} closeMobile={closeMobile} />

      <aside
        className={`
fixed
md:sticky
top-[72px]
left-0
z-40

flex
h-[calc(100vh-72px)]
flex-col

border-r
border-border/60

bg-background/95
backdrop-blur-xl

shadow-sm

transition-all
duration-300
ease-in-out

${collapsed ? "w-24" : "w-72"}

${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
`}
      >
        <SidebarHeader
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          schoolName={user?.school_name}
          schoolLogo={user?.school_logo}
          role={role}
        />

        <nav
          className="
flex-1
overflow-y-auto

px-3
py-5

space-y-7

scrollbar-thin
scrollbar-thumb-border
scrollbar-track-transparent
"
        >
          {groups.map((group) => (
            <SidebarGroup
              key={group.title}
              group={group}
              collapsed={collapsed}
              expandedItems={expandedItems}
              toggleItem={toggleItem}
              closeMobile={closeMobile}
            />
          ))}
        </nav>

        <div className="border-t border-border/60 p-3">
          <SidebarFooter
            collapsed={collapsed}
            firstName={user?.first_name}
            lastName={user?.last_name}
            email={user?.email}
          />
        </div>
      </aside>
    </>
  );
}
