import { create } from "zustand";
import { Todo } from "@/types/todo";
import { fetchTodos } from "@/api/todos/fetch-todos";
import { fetchAddTodo } from "@/api/todos/fetch-add-todo";
import fetchDeleteTodo from "@/api/todos/fetch-delete-todo";

interface TodoState {
  todos: Todo[];
  fetchUserTodos: () => Promise<void>;
  addTodo: (email: string, todo: Todo) => Promise<void>;
  deleteTodo: (id: string, email: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],

  // todos 불러오기
  fetchUserTodos: async () => {
    try {
      const fetchedTodos = await fetchTodos();
      set({ todos: fetchedTodos });
    } catch (error) {
      console.error("할 일 목록을 불러오는 중 오류 발생:", error);
    }
  },

  // 할 일 추가
  addTodo: async (email, todo) => {
    // 1. 클라이언트 측에서 먼저 UI에 반영
    const tempId = crypto.randomUUID(); // 임시 ID
    const optimisticTodo = { ...todo, id: tempId };
    set({ todos: [...get().todos, optimisticTodo] });
  
    try {
      // 2. 실제 DB에 저장
      const newTodo = await fetchAddTodo(email, todo);
  
      // 3. 저장 성공했으면 실제 ID로 바꿔치기
      set({
        todos: get().todos.map((t) =>
          t.id === tempId ? newTodo : t
        ),
      });
    } catch (error) {
      console.error("할 일을 추가하는 중 오류 발생:", error);
  
      // 4. 실패 시 optimistic todo 롤백
      set({
        todos: get().todos.filter((t) => t.id !== tempId),
      });
    }
  },

  // 할 일 삭제
  deleteTodo: async (id, email) => {
    try {
      await fetchDeleteTodo(id, email);
      set({ todos: get().todos.filter((todo) => todo.id !== id) });
    } catch (error) {
      console.error("할 일을 삭제하는 중 오류 발생:", error);
    }
  },

}));
