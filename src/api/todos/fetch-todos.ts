import { getSession } from "next-auth/react";

export async function fetchTodos() {
  try {
    // ✅ 현재 로그인된 사용자의 세션 가져오기
    const session = await getSession();
    if (!session?.user?.email) throw new Error("로그인이 필요합니다.");

    const email = session.user.email; // ✅ 유저 이메일 추출

    // ✅ 이메일을 포함하여 서버에 요청 (쿼리 파라미터 방식)
    const res = await fetch(`/api/todos/list?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("TODO 목록을 불러오는 데 실패했습니다.");
    return await res.json();
  } catch (err) {
    console.error("❌ fetchTodos 오류:", err);
    return [];
  }
}
