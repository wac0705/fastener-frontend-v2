"use client";

import { ReactNode } from "react";
import useIdleLogout from "@/hooks/useIdleLogout";

export default function IdleLogoutProvider({ children }: { children: ReactNode }) {
  useIdleLogout();
  return <>{children}</>;
}
