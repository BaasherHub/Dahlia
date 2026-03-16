"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#FAF9F6",
          color: "#1A1A1A",
          border: "1px solid rgba(191,175,138,0.4)",
          fontFamily: "var(--font-inter)",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#BFAF8A",
            secondary: "#FAF9F6",
          },
        },
      }}
    />
  );
};
