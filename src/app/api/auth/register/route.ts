import { hash } from "bcryptjs";
import { prisma } from "@/libs/prisma"; // Prisma 클라이언트 가져오기
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ 기존 사용자 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 400 });
    }

    // ✅ 비밀번호 해싱 후 저장
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "회원가입 성공!", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("회원가입 실패", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
