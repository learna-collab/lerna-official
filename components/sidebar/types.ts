import { LucideIcon } from "lucide-react";

export interface SidebarChild {
  label: string;
  href: string;
  exact?: boolean;
}

export interface SidebarItem {
  label: string;
  href?: string;
  exact?: boolean;
  icon: LucideIcon;
  children?: SidebarChild[];
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}
