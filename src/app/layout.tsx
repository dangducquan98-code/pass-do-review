import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Góc Pass Đồ Review | Săn Đồ Giá Rẻ Như Mới",
  description: "Thanh lý đồ review công nghệ, gia dụng mới 99-100%, ảnh thực tế tự chụp, freeship nội thành, rẻ hơn sàn ít nhất 20%.",
  keywords: ["pass đồ review", "thanh lý đồ công nghệ", "đồ review giá rẻ", "thanh lý giá rẻ", "pass đồ"],
  authors: [{ name: "Góc Review" }],
  creator: "Góc Review",
  openGraph: {
    title: "Góc Pass Đồ Review | Săn Đồ Giá Rẻ Như Mới",
    description: "Thanh lý đồ review công nghệ, gia dụng mới 99-100%, ảnh thực tế tự chụp, rẻ hơn sàn ít nhất 20%.",
    type: "website",
    locale: "vi_VN",
    siteName: "Góc Pass Đồ Review",
  },
  twitter: {
    card: "summary_large_image",
    title: "Góc Pass Đồ Review",
    description: "Săn đồ review giá rẻ hơn sàn 20-50%, ảnh thật 100%.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        {children}
        <Toaster richColors position="top-right" duration={3000} />
      </body>
    </html>
  );
}
