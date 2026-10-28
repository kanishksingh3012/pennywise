"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Renders into #overlay-root, which sits inside the phone frame (so sheets and toasts stay in the phone on desktop). */
export function Portal({ children }: { children: React.ReactNode }) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => setRoot(document.getElementById("overlay-root")), []);
  return root ? createPortal(children, root) : null;
}
