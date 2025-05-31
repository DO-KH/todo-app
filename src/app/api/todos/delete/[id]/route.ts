import { prisma } from "@/libs/prisma";
import { NextRequest ,NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { email } = await req.json();
    const { id } = await context.params;

    console.log(id)
  
    if (!email) {
      return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
    }

    // 해당 유저의 todo인지 확인
    const todo = await prisma.todos.findUnique({
      where: { id: id },
    });

    if (!todo) {
      return NextResponse.json({ error: "TODO가 존재하지 않습니다." }, { status: 404 });
    }

    if (todo.email !== email) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 삭제 진행
    await prisma.todos.delete({ where: { id: id } });

    return NextResponse.json({ message: "TODO 삭제 성공" });
  } catch (err) {
    console.error("❌ DELETE 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
