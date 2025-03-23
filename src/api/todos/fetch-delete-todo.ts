
export default async function fetchDeleteTodo(id: string, email: string) {
  try {
    
    const res = await fetch(`/api/todos/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // ✅ 유저 이메일 추가
    });

    if (!res.ok) throw new Error("TODO 삭제에 실패했습니다.");
    return await res.json();
  } catch (err) {
    console.error("❌ fetchDeleteTodo 오류:", err);
    return null;
  }
}
