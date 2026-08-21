import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial AI Dashboard",
  description: "Document processing and chat for industrial procurement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}