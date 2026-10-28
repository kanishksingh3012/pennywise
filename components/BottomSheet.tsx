"use client";
import { useEffect, useRef, useState } from "react";
import { Portal } from "./Portal";
import styles from "./BottomSheet.module.css";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const CLOSE_DISTANCE = 120; // px dragged down
const CLOSE_VELOCITY = 0.6; // px/ms flick

/** Sheet for detail. Dimmed backdrop; drag the handle down (or flick) to dismiss, tap backdrop or press Esc to close. */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ y: 0, t: 0 });

  useEffect(() => {
    if (open) {
      setMounted(true);
      setDrag(0);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const id = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { y: e.clientY, t: performance.now() };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dy = e.clientY - start.current.y;
    setDrag(dy > 0 ? dy : dy * 0.15); // resist dragging upward
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const dy = e.clientY - start.current.y;
    const velocity = dy / Math.max(1, performance.now() - start.current.t);
    if (dy > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) onClose();
    else setDrag(0);
  };

  const offset = shown ? drag : 0;
  return (
    <Portal>
      <div className={styles.wrap}>
        <div
          className={styles.backdrop}
          style={{ opacity: shown ? Math.max(0, 1 - offset / 500) : 0 }}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          className={`${styles.sheet} ${dragging ? styles.dragging : ""}`}
          style={{ transform: shown ? `translateY(${offset}px)` : "translateY(100%)" }}
        >
          <div
            className={styles.grab}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className={styles.handle} />
            {title && <div className={`t-title-20 ${styles.title}`}>{title}</div>}
          </div>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </Portal>
  );
}
