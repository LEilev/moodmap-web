"use client";

import { usePathname } from "next/navigation";
import SitePrivacy from "./SitePrivacy";

export default function AppSiteClient() {
  const pathname = usePathname();
  return <SitePrivacy path={pathname} />;
}
