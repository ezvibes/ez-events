"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const NEXT_TOAST_KEY = "ez-events-next-toast";

type QueuedToast = {
  message: string;
  type: ToastType;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, [dismissToast]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(NEXT_TOAST_KEY);
    if (!raw) return;

    window.sessionStorage.removeItem(NEXT_TOAST_KEY);

    try {
      const parsed = JSON.parse(raw) as QueuedToast;
      if (!parsed?.message) return;
      window.setTimeout(() => {
        showToast(parsed.message, parsed.type ?? "info");
      }, 0);
    } catch {
      // Ignore malformed session data.
    }
  }, [showToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[
              "pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-md",
              toast.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : toast.type === "error"
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-zinc-300 bg-white text-zinc-800",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded px-1 text-xs opacity-80 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
}

export function queueToastForNextRoute(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") return;
  const payload: QueuedToast = { message, type };
  window.sessionStorage.setItem(NEXT_TOAST_KEY, JSON.stringify(payload));
}
