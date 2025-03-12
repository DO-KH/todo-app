import { signIn } from "next-auth/react";

// ✅ 로그인 요청
export async function fetchSignIn(email: string, password: string) {
  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false, // 리디렉트 방지
    });

    console.log("🔍 로그인 응답:", response);

    if (!response || response.error) {
      return { error: response?.error || "로그인에 실패했습니다." };
    }

    return response;
  } catch (error) {
    console.error("로그인 실패:", error);
    return null;
  }
}
