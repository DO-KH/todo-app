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
    try {
      const newTodo = await fetchAddTodo(email, todo);
      if (newTodo) {
        set({ todos: [...get().todos, newTodo] });
      }
    } catch (error) {
      console.error("할 일을 추가하는 중 오류 발생:", error);
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
