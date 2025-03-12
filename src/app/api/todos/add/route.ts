import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
  try {
    const { text, date, category, priority, email } = await req.json();

    if (!email || !text || !date) {
      return NextResponse.json({ error: "필수 데이터가 없습니다." }, { status: 400 });
    }

    // ✅ 이메일을 기반으로 유저 찾기
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    // ✅ 새로운 TODO 생성 (userId 포함)
    const newTodo = await prisma.todos.create({
      data: {
        text,
        date,
        category,
        priority,
        email: user.email, //
      },
    });

    return NextResponse.json(newTodo);
  } catch (err) {
    console.error("❌ 서버 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
