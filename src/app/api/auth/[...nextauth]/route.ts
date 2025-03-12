import NextAuth, { Session, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/libs/prisma"; // Prisma 클라이언트 가져오기
import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        // ✅ 유저 조회 (Prisma 사용)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("이메일이 존재하지 않습니다.");
        }

        // ✅ 비밀번호 비교
        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return { id: user.id, email: user.email }; // 성공하면 유저 정보 반환
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session.user) {
        session.user.id = token.sub as string; // ✅ 타입 단언 추가
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // 로그인 페이지 커스텀 가능
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
