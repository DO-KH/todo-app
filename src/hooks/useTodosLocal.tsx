import { useState, useEffect, useRef } from "react";
import { Todo } from "@/types/todo";

//  로컬 TODO 관리 훅
export function useLocalTodos() {
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);

  // 동시성 제어용 플래그
  const shouldUpdate = useRef(false);

  // ✅ 로컬스토리지에서 불러오기
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setLocalTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    if (shouldUpdate.current) {
      localStorage.setItem("todos", JSON.stringify(localTodos));
    } else {
      shouldUpdate.current = true;
    }
    
  }, [localTodos]);

  // ✅ 할 일 추가
  const localAddTodo = (newTodo: Todo) => {
    const updatedTodos = [...localTodos, newTodo];
    setLocalTodos(updatedTodos);
  };

  // ✅ 할 일 삭제 (id 기반으로 변경)
  const localDeleteTodo = (id: string) => {
    const updatedTodos = localTodos.filter((todo) => todo.id !== id); // ✅ id로 필터링
    setLocalTodos(updatedTodos);
  };

  return { localTodos, setLocalTodos, localAddTodo, localDeleteTodo };
}
