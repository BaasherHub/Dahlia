"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminKey } from "@/lib/api";

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    if (typeof window === "undefined") return;
    const key = sessionStorage.getItem("adminKey");
    if (!key) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    try {
      const valid = await verifyAdminKey(key);
      setIsAuthenticated(valid);
      if (!valid) {
        sessionStorage.removeItem("adminKey");
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated === false) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const login = useCallback(
    async (key: string): Promise<boolean> => {
      const valid = await verifyAdminKey(key);
      if (valid) {
        sessionStorage.setItem("adminKey", key);
        setIsAuthenticated(true);
      }
      return valid;
    },
    []
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminKey");
    setIsAuthenticated(false);
    router.push("/admin/login");
  }, [router]);

  return { isAuthenticated, isLoading, login, logout };
}
