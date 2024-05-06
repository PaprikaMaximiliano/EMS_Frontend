import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import StoreProvider from "@/app/StoreProvider";
import { CookiesProvider } from "next-client-cookies/server";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "EMS",
  description: "Created by Maksym Paprotskyi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // @eslint-disable
  // @ts-ignore
  return (
    <html lang="en">
    <body>
    <CookiesProvider>
      <StoreProvider>
        <AppRouterCacheProvider>
          {children}
          <Toaster position="top-left"/>
        </AppRouterCacheProvider>
      </StoreProvider>
    </CookiesProvider>
    </body>
    </html>
  );
}
