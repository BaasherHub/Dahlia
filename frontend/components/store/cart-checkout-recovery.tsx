"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { releaseCheckoutHold } from "@/lib/api";

const PENDING_SESSION_KEY = "pendingCheckoutSession";

export function CartCheckoutRecovery() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const cancelled = searchParams.get("checkout") === "cancelled";
    const sessionId = sessionStorage.getItem(PENDING_SESSION_KEY);
    if (!cancelled || !sessionId) return;

    releaseCheckoutHold(sessionId)
      .catch(() => {})
      .finally(() => {
        sessionStorage.removeItem(PENDING_SESSION_KEY);
      });
  }, [searchParams]);

  return null;
}
