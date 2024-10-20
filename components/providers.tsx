"use client";

import { ThemeProvider } from "./theme-provider";
import { useTransitionRouter } from "next-view-transitions";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useTransitionRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useTransitionRouter();

  return (
    <RouterProvider navigate={router.push}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </RouterProvider>
  );
}
