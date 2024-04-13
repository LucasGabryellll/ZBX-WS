import type { Metadata } from "next";

import "./globals.css";

import { poppinsCss } from "./fonts";
import { QueryClientComponent, ToastNotify } from "../components";

export const metadata: Metadata = {
  title: "WS API",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={poppinsCss.variable}>
        <QueryClientComponent>
       
            {children}

            <ToastNotify />
      
        </QueryClientComponent>
      </body>
    </html>
  );
}