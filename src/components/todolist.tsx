"use client";

import { useTodoStore } from "@/store/todoStore";
import { useState } from "react";
import { Todo } from "@/types/todo";
import { useAuthUserContext } from "@/provider/AuthUserProvider";
import { useLocalTodoStore } from "@/store/useLocalTodoStore";
import TodoItem from "./TodoItem";

const categories = ["Work", "Personal", "Health"];
const priorities = ["High", "Medium", "Low"];
const priorityLevels: { [key: string]: number } = {
  High: 1,
  Medium: 2,
  Low: 3,
};

// 오늘 날짜 구하는 함수
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

  // 인증 유저
  const { todos, addTodo, deleteTodo } = useTodoStore();

  // 게스트
  const { localTodos, addLocalTodo, deleteLocalTodo } = useLocalTodoStore();

  // 현재 유저 상태
  const { user } = useAuthUserContext();

  // 유저 상태에 따른 데이터 불러오기
  const allTodos = !user ? localTodos : todos;

  // 선택된 날짜 & 카테고리 필터링
  const filteredTodos = allTodos
    .filter(
      (todo) =>
        (!selectedDate || todo.date === selectedDate) &&
        (filterCategory === "All" || todo.category === filterCategory)
    )
    .sort((a, b) => priorityLevels[a.priority] - priorityLevels[b.priority]);

  // 할 일 추가
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
      addLocalTodo(newTodo);
    } else {
      addTodo(user.email, newTodo);
    }

    setInput("");
    setCategory(categories[0]);
    setPriority(priorities[1]);
  };

  // 할 일 삭제
  const handleDeleteTodo = (id: string, email: string) => {
    if (!user) {
      deleteLocalTodo(id);
    } else {
      deleteTodo(id, email);
    }
  };

  return (
    <div
      className={`absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] transition-all duration-[600ms] bg-white p-6 rounded-xl shadow-md border border-teal-200 w-[450px] ${
        isOpen ? "translate-x-[140px]" : ""
      }`}
    >
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        📝 {selectedDate || today}의 할 일
      </h2>

      {/* 입력 필드 */}
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

        {/* 카테고리 선택 */}
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

        {/* 우선순위 선택 */}
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

      {/* 카테고리 필터 */}
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

      {/* 할 일 목록 */}
      <TodoItem
        todos={filteredTodos}
        onDelete={handleDeleteTodo}
        userEmail={user ? user.email : ""}
      />
    </div>
  );
}
