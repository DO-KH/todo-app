import Modal from "react-modal";
import { useEffect, useState } from "react";
import { fetchSignUp } from "@/api/auth/fetch-SignUp";
import { fetchSignIn } from "@/api/auth/fetch-SignIn";

interface LoginModalProps {
  modalType: "signin" | "signup" | null;
  setModalType: (type: "signin" | "signup" | null) => void;
}

export default function LoginModal({
  modalType,
  setModalType,
}: LoginModalProps) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      Modal.setAppElement("body");
    }
  }, []);

  return modalType ? (
    <AuthModal modalType={modalType} setModalType={setModalType} />
  ) : null;
}

interface AuthModalProps {
  modalType: "signin" | "signup";
  setModalType: (type: "signin" | "signup" | null) => void;
}

function AuthModal({ modalType, setModalType }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      let res;
      if (modalType === "signin") {
        res = await fetchSignIn(email, password);
      } else if (modalType === "signup") {
        res = await fetchSignUp(email, password);
      }

      if (!res || res.error) {
        setErrorMessage(res?.error || "오류가 발생했습니다.");
        return;
      }

      if (modalType === "signup") {
        alert("회원가입 되었습니다! 로그인 해주세요");
        setModalType("signin");
      } else if (modalType === "signin") {
        setModalType(null);
        window.location.reload(); // 로그인 성공 시 새로고침
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("서버 요청 실패:", err);
      setErrorMessage(err instanceof Error ? err.message : "서버 에러 발생");
    }
  };

  if (!modalType) return null; // 모달이 있어야 렌더링

  return (
    <Modal
      isOpen={modalType !== null}
      onRequestClose={() => setModalType(null)}
      className="flex items-center justify-center fixed inset-0 z-50 outline-none"
      overlayClassName="fixed inset-0 bg-[rgba(255,255,255,0.2)] backdrop-blur-md"
    >
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg border relative
    ${
      modalType === "signin"
        ? "bg-teal-50 border-teal-300"
        : "bg-purple-50 border-purple-300"
    }`}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500"
          onClick={() => setModalType(null)}
        >
          ✖
        </button>

        {/* 제목 */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {modalType === "signin" ? "로그인" : "회원가입"}
        </h2>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border rounded-lg text-gray-800 focus:ring-2 ${modalType === "signin" ? "bg-teal-50 border-teal-300 focus:ring-teal-400" : "bg-purple-50 border-purple-300 focus:ring-purple-400"}`}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-teal-400 ${modalType === "signin" ? "bg-teal-50 border-teal-300 focus:ring-teal-400" : "bg-purple-50 border-purple-300 focus:ring-purple-400"}`}
          />

          {/* 버튼 */}
          <button
            type="submit"
            className={`w-full py-3 text-white rounded-lg ${modalType === "signin" ? "bg-teal-500 hover:bg-teal-600" : "bg-purple-500 hover:bg--600" }`}
          >
            {modalType === "signin" ? "로그인" : "회원가입"}
          </button>
        </form>

        {/* 회원가입/로그인 전환 버튼 */}
        <button
          className={`w-full mt-4 py-3 transition text-center ${modalType === "signin" ? " text-teal-500 hover:text-teal-600" : " text-purple-500 hover:text-purple-600" }`}
          type="button"
          onClick={() =>
            setModalType(modalType === "signin" ? "signup" : "signin")
          }
        >
          {modalType === "signin" ? "회원가입" : "로그인"} 하러 가기
        </button>

        {/* 에러 메시지 */}
        {errorMessage && (
          <p className="text-red-500 text-center mt-2">{errorMessage}</p>
        )}
      </div>
    </Modal>
  );
}
