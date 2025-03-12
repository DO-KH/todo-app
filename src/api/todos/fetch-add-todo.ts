import { Todo } from "@/types/todo";

export async function fetchAddTodo(email: string,  newTodo: Omit<Todo, "id">) {
  const todoWithUser = { email, ...newTodo };
  try {
    const res = await fetch("/api/todos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoWithUser),
    });

    if (!res.ok) throw new Error("TODO 추가에 실패했습니다.");
    return await res.json();
  } catch (err) {
    console.error("❌ fetchAddTodo 오류:", err);
    return null;
  }
}
