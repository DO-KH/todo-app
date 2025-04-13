import { AuthUserProvider } from "@/provider/AuthUserProvider";
import "./globals.css";
import SessionProviderWrapper from "@/provider/SessionProviderWrapper";

// ✅ SEO 메타데이터 설정
export const metadata = {
  title: "TodoApp - 날짜별 할 일 관리",
  description: "Next.js 기반 싱글페이지 투두앱으로, 날짜별 할 일을 쉽게 관리할 수 있습니다.",
  keywords: ["투두리스트", "Next.js", "Zustand", "일정 관리", "로그인", "캘린더"],
  authors: [{ name: "DKH" }],
  icons: {
    icon: "/favicon.webp",
  },
  openGraph: {
    title: "TodoApp",
    description: "날짜별 할 일을 관리할 수 있는 Next.js 기반 투두앱",
    url: "https://your-app.vercel.app",
    siteName: "TodoApp",
    images: [
      {
        url: "/og-image.png",
        width: 800,
        height: 600,
        alt: "TodoApp Preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="m-0 p-0 bg-gradient-to-br from-sky-100 via-teal-100 to-lime-100 text-gray-800">
        {/* react-modal의 setAppElement용 DOM anchor */}
        <div id="root" />

        {/* 세션 관리 → 인증 유저 컨텍스트 → 콘텐츠 */}
        <SessionProviderWrapper>
          <AuthUserProvider>{children}</AuthUserProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
