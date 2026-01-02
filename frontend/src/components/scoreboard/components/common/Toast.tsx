"use client";

import clsx from "clsx";
import React, { useEffect, useState } from "react";

export type ToastSeverity = "success" | "error" | "info";

export type ToastInput = {
  message: string;
  severity: ToastSeverity;
};

type ToastItem = {
  id: string;
  message: string;
  severity: ToastSeverity;
};

type Listener = (toast: ToastItem) => void;

const listeners = new Set<Listener>();

const emit = (toast: ToastItem) => {
  listeners.forEach((fn) => fn(toast));
}

export const showToast = (input: ToastInput) => {
  if (typeof window === "undefined") return;
  const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
  emit({ id, message: input.message, severity: input.severity });
}

export const ToastProvider = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const DURATION_MS = 2500;

  useEffect(() => {
    const onToast: Listener = (toast) => {
      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, DURATION_MS);
    };

    listeners.add(onToast);
    return () => {
      listeners.delete(onToast);
    };
  }, []);

  return (
    <div className="fixed z-200 right-6 top-6 space-y-3">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} durationMs={DURATION_MS} />
      ))}
    </div>
  );
}

function ToastCard({ toast, durationMs }: { toast: ToastItem; durationMs: number }) {
    const title =
    toast.severity === "success" ? "SUCCESS" : toast.severity === "error" ? "ERROR" : "INFO";

  const cardClass = clsx(
    "min-w-[320px] max-w-[520px] overflow-hidden rounded-xl border text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)]",
    toast.severity === "success" && "bg-green-600 border-green-700/30",
    toast.severity === "error" && "bg-[#C00000] border-[#A00000]/40",
    toast.severity === "info" && "bg-[#B3995D] border-[#9B8248]/40"
  );
  return (
        <div className={cardClass}>
      <div className="px-4 py-3">
        <div className="text-[12px] font-extrabold tracking-[0.18em] uppercase text-white/90">
          {title}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-white">{toast.message}</div>
      </div>

      <div className="h-1 w-full bg-white/25">
        <div
          className="h-full bg-white/90"
          style={{
            width: "100%",
            animation: `toast-shrink ${durationMs}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
