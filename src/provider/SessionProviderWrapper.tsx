"use client"; // ✅ 클라이언트 컴포넌트로 선언

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderWrapperProps {
  children: ReactNode;
}

export default function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  return <SessionProvider>{children}</SessionProvider>;
}