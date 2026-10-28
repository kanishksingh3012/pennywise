"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Portal } from "./Portal";
import styles from "./Toast.module.css";

export interface ToastOptions {
  message: string;
  actionLabel?: string; // usually "Undo"
  onAction?: () => void;
  duration?: number; // ms, default 4000
}

/** Presentational toast. Use directly inside a sheet (e.g. Penny) so it shows where the action happened. */
export function Toast({ message, actionLabel, onAction, visible = true, inline }: ToastOptions & { visible?: boolean; inline?: boolean }) {
  return (
    <div role="status" aria-live="polite" className={`${styles.toast} ${inline ? styles.inline : ""} ${visible ? styles.visible : ""}`}>
      <span className={`t-body-14 ${styles.message}`}>{message}</span>
      {actionLabel && (
        <button type="button" className={`t-label c-copper ${styles.action}`} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const ToastContext = createContext<(t: ToastOptions) => void>(() => {});

/** `const toast = useToast(); toast({ message: "Cap set", actionLabel: "Undo", onAction: undo })` */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hide = useCallback(() => {
    setVisible(false);
    clearTimeout(timer.current);
  }, []);

  const show = useCallback((t: ToastOptions) => {
    clearTimeout(timer.current);
    setCurrent(t);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), t.duration ?? 4000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {current && (
        <Portal>
          <Toast
            {...current}
            visible={visible}
            onAction={() => {
              current.onAction?.();
              hide();
            }}
          />
        </Portal>
      )}
    </ToastContext.Provider>
  );
}
