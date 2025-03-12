import { useState, useEffect } from "react";
import { Todo } from "@/types/todo";

// ✅ 로컬 TODO 관리 훅
export function useLocalTodos() {
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);

  // ✅ 로컬스토리지에서 불러오기
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setLocalTodos(JSON.parse(storedTodos));
    }
  }, []);

  // ✅ 할 일 추가
  const localAddTodo = (newTodo: Todo) => {
    const updatedTodos = [...localTodos, newTodo];
    setLocalTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  // ✅ 할 일 삭제 (id 기반으로 변경)
const localDeleteTodo = (id: string) => {
  const updatedTodos = localTodos.filter((todo) => todo.id !== id); // ✅ id로 필터링
  setLocalTodos(updatedTodos);
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
};

  return { localTodos, setLocalTodos, localAddTodo, localDeleteTodo };
}