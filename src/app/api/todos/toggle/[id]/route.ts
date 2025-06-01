import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { completed } = body;

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "completed 값이 boolean이어야 합니다." },
        { status: 400 }
      );
    }

    const updated = await prisma.todos.update({
      where: { id },
      data: { completed },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/todos/toggle/[id] 에러:", err);
    return NextResponse.json(
      {
        error: "할 일 완료 상태 변경 실패",
      },
      { status: 500 }
    );
  }
}
