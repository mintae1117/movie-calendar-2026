import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry";
import StoreProvider from "./lib/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TMDB Moive Calendar",
  description: "개봉 예정인 영화들을 캘린더로 확인해 보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${notoSansKR.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <StoreProvider>{children}</StoreProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
