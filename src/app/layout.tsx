import { AuthUserProvider } from "@/provider/AuthUserProvider";
import "./globals.css";
import SessionProviderWrapper from "@/provider/SessionProviderWrapper";

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
        <div id="root"></div>

        <SessionProviderWrapper>
          <AuthUserProvider>{children}</AuthUserProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
