"use client"

import { getSession } from "next-auth/react";
import { Session } from "next-auth";
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
  const [user, setUser] = useState<Session["user"] | null>(null);

  useEffect(() => {
    const asyncFunc = async () => {
      const session = await getSession();
      if(!session) return;
      setUser(session.user)
    }
    asyncFunc()
  },[setUser])

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