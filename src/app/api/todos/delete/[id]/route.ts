import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { email } = await req.json(); // ✅ 클라이언트에서 보낸 email 받기
    const todoId = params.id;
    console.log(params.id)
    console.log("아니오")

    if (!email) {
      return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
    }

    // ✅ 해당 유저의 할 일인지 확인
    const todo = await prisma.todos.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return NextResponse.json({ error: "TODO가 존재하지 않습니다." }, { status: 404 });
    }

    if (todo.email !== email) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // ✅ 삭제 진행
    await prisma.todos.delete({ where: { id: todoId } });

    return NextResponse.json({ message: "TODO 삭제 성공" });
  } catch (err) {
    console.error("❌ DELETE 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
