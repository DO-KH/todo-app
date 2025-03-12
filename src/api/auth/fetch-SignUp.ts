// ✅ 회원가입 요청
export async function fetchSignUp(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "회원가입에 실패했습니다." };
    }

    return await response.json();
  } catch (error) {
    console.error("회원가입 실패:", error);
    return null;
  }
}
