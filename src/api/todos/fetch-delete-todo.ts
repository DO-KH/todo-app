import { getSession } from "next-auth/react";

export default async function fetchDeleteTodo(id: string) {
  try {
    const session = await getSession(); // ✅ 현재 로그인한 유저 정보 가져오기
    if (!session?.user?.email) throw new Error("로그인이 필요합니다.");

    const res = await fetch(`/api/todos/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session.user.email }), // ✅ 유저 이메일 추가
    });

    if (!res.ok) throw new Error("TODO 삭제에 실패했습니다.");
    return await res.json();
  } catch (err) {
    console.error("❌ fetchDeleteTodo 오류:", err);
    return null;
  }
}
