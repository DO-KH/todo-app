"use client";

import { useLocalTodos } from "@/hooks/useTodosLocal";
import { useTodoStore } from "@/store/todoStore";
import { useState } from "react";
import { Todo } from "@/types/todo";
import { useAuthUserContext } from "@/provider/AuthUserProvider";

const categories = ["Work", "Personal", "Health"];
const priorities = ["High", "Medium", "Low"];
const priorityLevels: { [key: string]: number } = {
  High: 1,
  Medium: 2,
  Low: 3,
};

// ✅ 오늘 날짜 구하는 함수
const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD 형식
};

export default function TodoList({
  isOpen,
  selectedDate,
}: {
  isOpen: boolean;
  selectedDate: string;
}) {
  const today = getToday();
  const [input, setInput] = useState("");
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[1]);
  const [filterCategory, setFilterCategory] = useState("All");

  // ✅ Zustand(Store) & 로컬 스토리지 Hook
  const { todos, addTodo, deleteTodo, } = useTodoStore();
  const { localTodos, localAddTodo, localDeleteTodo } = useLocalTodos();
  const { user } = useAuthUserContext();

  // ✅ 현재 로그인 상태에 따라 할 일 목록 가져오기
  const allTodos = !user ? localTodos : todos;

  // ✅ 선택된 날짜 & 카테고리 필터링
  const filteredTodos = allTodos
    .filter(
      (todo) =>
        (!selectedDate || todo.date === selectedDate) &&
        (filterCategory === "All" || todo.category === filterCategory)
    )
    .sort((a, b) => priorityLevels[a.priority] - priorityLevels[b.priority]);

  // ✅ 할 일 추가
  const handleAddTodo = () => {
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: crypto.randomUUID(), 
      text: input,
      date,
      category,
      priority,
    };

    if (!user) {
      localAddTodo(newTodo);
    } else {
      addTodo(user.email, newTodo);
    }

    setInput("");
    setCategory(categories[0]);
    setPriority(priorities[1]);
  };

  // ✅ 할 일 삭제
  const handleDeleteTodo = (id: string) => {
    // ✅ if 문으로 변경하여 ESLint 오류 해결
    if (!user) {
      localDeleteTodo(id);
    } else {
      deleteTodo(id);
    }
  };

  return (
    <div
      className={`absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] transition-all duration-600 bg-white p-6 rounded-xl shadow-md border border-teal-200 w-[450px] ${
        isOpen ? "translate-x-[175px]" : ""
      }`}
    >
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        📝 {selectedDate || today}의 할 일
      </h2>

      {/* ✅ 입력 필드 */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="p-2 border border-teal-300 rounded-md bg-teal-50 text-gray-800 focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border border-teal-300 rounded-md bg-teal-50 text-gray-800"
        />

        {/* ✅ 카테고리 선택 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-teal-300 rounded-md bg-teal-50 text-gray-800 focus:ring-2 focus:ring-teal-400"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* ✅ 우선순위 선택 */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border border-teal-300 rounded-md bg-teal-50 text-gray-800 focus:ring-2 focus:ring-teal-400"
        >
          {priorities.map((prio) => (
            <option key={prio} value={prio}>
              {prio}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddTodo}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition shadow-md"
        >
          추가
        </button>
      </div>

      {/* ✅ 카테고리 필터 */}
      <div className="mt-4">
        <label className="block font-bold text-gray-800">
          🏷️ 카테고리 필터:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border border-teal-300 rounded-md bg-teal-50 text-gray-800 focus:ring-2 focus:ring-teal-400"
        >
          <option value="All">모든 카테고리</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ 할 일 목록 */}
      <div className="mt-4 max-h-[300px] overflow-y-auto border border-teal-200 rounded-md p-2 bg-teal-50">
        <ul className="space-y-2">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center bg-white p-2 rounded-md shadow-md border border-teal-200"
              >
                <input type="checkbox" className="mr-2" />
                <span className="flex-1 text-gray-800">
                  {todo.text} ({todo.category} - {todo.priority})
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
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
    </div>
  );
}
