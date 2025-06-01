export default async function fetchToggleComplete(
  id: string,
  completed: boolean
) {
  try {
    const res = await fetch(`/api/todos/toggle/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "applicateion/json",
      },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) throw new Error("완료 상태 변경 실패");
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
