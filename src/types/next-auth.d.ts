import { DefaultSession } from "next-auth";

// ✅ `User` 타입 확장 (id 속성 추가)
declare module "next-auth" {
  interface Session {
    user: {
      id:string;
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    email: string;
  }
  
}