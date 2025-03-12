"use client"

import { Session } from "next-auth";
import { useSession } from "next-auth/react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthUserContextType {
  user: Session["user"] | null;
  setUser: (user: Session["user"] | null) => void;
}

// Context
export const AuthUserContext = createContext<AuthUserContextType>({
  user: null,
  setUser: () => {}
})

// Provider

export function AuthUserProvider({children}: {children: React.ReactNode} ) {
  const {data: session, status } = useSession();
  const [user, setUser] = useState<Session["user"] | null>(null);

  useEffect(() => {
    console.log("🔹 현재 세션 상태:", status);
    console.log("🔹 현재 세션 값:", session);

    if (status === "authenticated" && session?.user) {
      setUser(session.user); // ✅ 세션 정보를 user 상태에 저장
    } else if (status === "unauthenticated") {
      setUser(null); // ✅ 로그아웃 상태일 때 user를 null로 설정
    }

  }, [session, status]);


  return(
    <AuthUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthUserContext.Provider>
  )
}

// Hook
export function useAuthUserContext() {
  return useContext(AuthUserContext);
}