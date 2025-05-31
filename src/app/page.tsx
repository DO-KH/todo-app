"use client";

import { useState, useEffect } from "react";
import TodoList from "@/components/todolist";
import Calendar from "@/components/calendar";
import LoginModal from "@/components/loginModal";
import { signOut, useSession } from "next-auth/react";
import { useTodoStore } from "@/store/todoStore"; // ✅ Zustand 스토어 가져오기
import { useAuthUserContext } from "@/provider/AuthUserProvider";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"signin" | "signup" | null>(null);
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState<string>(""); // 선택된 날짜 상태 추가
  const { fetchUserTodos } = useTodoStore();
  const { user } = useAuthUserContext();

  // 로그인 여부에 따라 할 일 목록 가져오기
  useEffect(() => {
    if (user) {
      fetchUserTodos();
    }
  }, [user, fetchUserTodos]);

  return (
    <>
      {/* 로그인 모달 */}
      <LoginModal modalType={modalType} setModalType={setModalType} />

      <div className="relative m-auto w-[1200px] h-screen text-gray-800 flex flex-col items-center justify-center">
        {/* 캘린더 버튼 + 로그인 버튼 */}
        <div className="absolute top-6 right-6 flex gap-4">
          {/* 캘린더 열기 버튼 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition shadow-md"
          >
            📅 캘린더 {isOpen ? "닫기" : "열기"}
          </button>

          {/* 🔹 로그인 상태 확인 */}
          {status === "loading" ? (
            // 아직 세션 판단 중 → 일단 아무것도 보여주지 않음 or 로딩 UI
            <div className="w-[180px] h-[42px] flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg animate-pulse shadow-sm">확인 중...</div>
          ) : session ? (
            // 로그인 완료 → 사용자 UI
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
              <span className="text-gray-800">{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 로그인 안됨
            <button
              onClick={() => setModalType("signin")}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition shadow-md"
            >
              로그인
            </button>
          )}
        </div>

        {/* 캘린더 (선택한 날짜 전달) */}
        <div className="w-full max-w-[900px] flex justify-center mt-4">
          <Calendar isOpen={isOpen} setSelectedDate={setSelectedDate} />
        </div>

        {/* 할 일 목록 (선택한 날짜 기반) */}
        <div className="w-full max-w-[900px] flex justify-center mt-10">
          <TodoList isOpen={isOpen} selectedDate={selectedDate} />
        </div>
      </div>
    </>
  );
}
