import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// ✅ GET: 특정 유저의 TODO 목록 가져오기
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
    }

    // ✅ 유저의 TODO 목록 조회
    const todos = await prisma.todos.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    // ✅ 데이터가 없으면 빈 배열 반환 (404 X)
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/todos 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
