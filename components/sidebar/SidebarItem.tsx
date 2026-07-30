"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { SidebarItem as SidebarItemType } from "./types";
import { isSidebarRouteActive } from "./sidebar-utils";

interface SidebarItemProps {
  item: SidebarItemType;

  collapsed: boolean;

  expanded: boolean;

  onToggle: () => void;

  closeMobile: () => void;
}

export default function SidebarItem({
  item,
  collapsed,
  expanded,
  onToggle,
  closeMobile,
}: SidebarItemProps) {
  const pathname = usePathname();

  const hasChildren = !!item.children?.length;

  const parentActive =
    (item.href && isSidebarRouteActive(pathname, item.href, item.exact)) ||
    item.children?.some((child) =>
      isSidebarRouteActive(pathname, child.href, child.exact),
    );

  const Icon = item.icon;

  const baseClasses =
    "group flex items-center rounded-xl transition-all duration-200";

  const activeClasses =
    "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600";

  const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <div
          className={`
            ${baseClasses}
            ${parentActive ? activeClasses : inactiveClasses}
            px-3
            py-2.5
          `}
        >
          <Link
            href={item.href ?? "#"}
            onClick={closeMobile}
            className="flex flex-1 items-center"
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />

            {!collapsed && (
              <span className="ml-3 flex-1 text-sm">{item.label}</span>
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={onToggle}
              className="
                ml-2
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                hover:bg-gray-200
                transition
              "
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-300 ${
                  expanded ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </div>

        {!collapsed && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-6 space-y-1 border-l border-gray-200 pl-4">
              {item.children!.map((child) => {
                const active = isSidebarRouteActive(
                  pathname,
                  child.href,
                  child.exact,
                );

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={closeMobile}
                    className={`block rounded-lg px-3 py-2 text-sm transition-all ${
                      active
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      onClick={closeMobile}
      className={`
        ${baseClasses}
        ${parentActive ? activeClasses : inactiveClasses}
        px-3
        py-2.5
      `}
      title={collapsed ? item.label : ""}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />

      {!collapsed && <span className="ml-3 text-sm">{item.label}</span>}
    </Link>
  );
}
