export const dashboardRoutes = [
  "/student",
  "/teacher",
  "/parent",
  "/school-admin",
  "/admin",
];

export function isSidebarRouteActive(
  pathname: string,
  href: string,
  exact = false,
) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
