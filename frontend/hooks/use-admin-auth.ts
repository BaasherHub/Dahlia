"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, adminLogout, verifyAdminSession } from "@/lib/api";

const LEGACY_KEY = "adminKey";

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const valid = await verifyAdminSession();
      setIsAuthenticated(valid);
      if (!valid && typeof window !== "undefined") {
        sessionStorage.removeItem(LEGACY_KEY);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(LEGACY_KEY);
    }
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated === false) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const login = useCallback(async (key: string): Promise<boolean> => {
    const ok = await adminLogin(key);
    if (ok) {
      sessionStorage.removeItem(LEGACY_KEY);
      setIsAuthenticated(true);
    }
    return ok;
  }, []);

  const logout = useCallback(async () => {
    await adminLogout();
    sessionStorage.removeItem(LEGACY_KEY);
    setIsAuthenticated(false);
    router.push("/admin/login");
  }, [router]);

  return { isAuthenticated, isLoading, login, logout };
}
