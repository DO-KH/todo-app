import { useAuthUserContext } from "@/provider/AuthUserProvider";
import { useTodoStore } from "@/store/todoStore";
import { useLocalTodoStore } from "@/store/useLocalTodoStore";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todos: Todo[];
  userEmail: string;
  onDelete: (id: string, email: string) => void;
}

export default function TodoItem({
  todos,
  userEmail,
  onDelete,
}: TodoItemProps) {
  const { user } = useAuthUserContext();
  const { toggleComplete } = useTodoStore();
  const { toggleLocalComplete } = useLocalTodoStore();

  const handleToggle = (id: string) => {
    if (!user) {
      toggleLocalComplete(id);
    } else {
      toggleComplete(id);
    }
  };

  return (
    <div className="mt-4 max-h-[210px] overflow-y-auto border border-teal-200 rounded-md p-2 bg-teal-50">
      <ul className="space-y-2">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center bg-white p-2 rounded-md shadow-md border border-teal-200"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={todo.completed ?? false}
                onChange={() => handleToggle(todo.id)}
              />
              <span
                className={`flex-1 transition-all duration-200 ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {todo.text} ({todo.category} - {todo.priority})
              </span>
              <button
                onClick={() => onDelete(todo.id, userEmail)}
                className="text-red-400 hover:text-red-500"
              >
                ❌
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">할 일이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
