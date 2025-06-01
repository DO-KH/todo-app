import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Todo } from "@/types/todo";

interface LocalTodoStore {
  localTodos: Todo[];
  addLocalTodo: (newTodo: Todo) => void;
  deleteLocalTodo: (id: string) => void;
  setLocalTodos: (todos: Todo[]) => void;
  toggleLocalComplete: (id: string) => void;
}

export const useLocalTodoStore = create<LocalTodoStore>()(
  persist(
    (set, get) => ({
      localTodos: [],

      // 할 일 추가
      addLocalTodo: (newTodo) => {
        const updatedTodos = [...get().localTodos, newTodo];
        set({ localTodos: updatedTodos });
      },

      // 할 일 삭제
      deleteLocalTodo: (id) => {
        const updatedTodos = get().localTodos.filter((todo) => todo.id !== id);
        set({ localTodos: updatedTodos });
      },

      // 할 일 직접 설정 (필요할 경우)
      setLocalTodos: (todos) => set({ localTodos: todos }),

      toggleLocalComplete: (id) =>
        set((state) => ({
          localTodos: state.localTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
    }),
    {
      name: "todos", // localStorage 키
      // onRehydrateStorage: () => (state) => {
      //   console.log("상태 복원", state);
      // },
    }
  )
);
