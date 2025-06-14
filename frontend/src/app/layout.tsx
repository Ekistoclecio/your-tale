import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YourTale",
  description: "Uma plataforma para seções de RPG de mesa online assistidas por IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
