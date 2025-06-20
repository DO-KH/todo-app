"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTodoStore } from "@/store/todoStore"; // ✅ Zustand에서 todos 가져오기
import { useAuthUserContext } from "@/provider/AuthUserProvider";
import { useLocalTodoStore } from "@/store/useLocalTodoStore";

interface CalendarProps {
  isOpen: boolean;
  setSelectedDate: (date: string) => void;
}

export default function Calendar({ isOpen, setSelectedDate }: CalendarProps) {
  const { todos } = useTodoStore(); // ✅ Zustand에서 todos 가져오기
  const { localTodos } = useLocalTodoStore();
  const { user } = useAuthUserContext();
  const data = user ? todos : localTodos;

  return (
    <div
      className={`absolute top-[50%] left-[-100%] transform -translate-y-[50%] transition-transform duration-[600ms] ${
        isOpen ? "translate-x-[175%]" : ""
      }`}
    >
      <div className="p-6 w-[700px] bg-white rounded-xl shadow-md border border-teal-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          📅 캘린더
        </h2>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="650px"
          aspectRatio={1.8}
          dayMaxEventRows={2}
          moreLinkClick="popover"
          events={data.map((todo) => ({
            title: todo.text,
            date: todo.date,
            backgroundColor: todo.completed ? "#d4d4d8" : "#86efac", // 연한 초록색 (Tailwind `teal-300`)
            borderColor: todo.completed ? "#a1a1aa" :  "#0d9488", // 테두리 색 (Tailwind `teal-600`)
            textColor: todo.completed ? "#71717a" :  "#065f46", // 글자 색상 (Tailwind `teal-900`)
            classNames: todo.completed ? ["line-through", "opacity-60"] : [],
          }))}
          eventClassNames={(arg) => ["text-xs", "font-semibold", ...arg.event.classNames]} // Tailwind 스타일 적용
          dayCellClassNames={() => ["bg-teal-50", "hover:bg-teal-100"]} // 날짜 칸 스타일 적용
          dateClick={(info) => setSelectedDate(info.dateStr)} // 날짜 클릭 시 선택
        />
      </div>
    </div>
  );
}
