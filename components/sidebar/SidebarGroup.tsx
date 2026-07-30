"use client";

import { usePathname } from "next/navigation";

import SidebarItem from "./SidebarItem";
import { SidebarGroup as SidebarGroupType } from "./types";
import { isSidebarRouteActive } from "./sidebar-utils";

interface SidebarGroupProps {
  group: SidebarGroupType;

  collapsed: boolean;

  expandedItems: Record<string, boolean>;

  toggleItem: (key: string) => void;

  closeMobile: () => void;
}

export default function SidebarGroup({
  group,
  collapsed,
  expandedItems,
  toggleItem,
  closeMobile,
}: SidebarGroupProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {group.items.map((item) => {
        const itemExpanded =
          expandedItems[item.label] ??
          item.children?.some((child) =>
            isSidebarRouteActive(pathname, child.href, child.exact),
          ) ??
          false;

        return (
          <SidebarItem
            key={item.label}
            item={item}
            collapsed={collapsed}
            expanded={itemExpanded}
            onToggle={() => toggleItem(item.label)}
            closeMobile={closeMobile}
          />
        );
      })}
    </div>
  );
}
