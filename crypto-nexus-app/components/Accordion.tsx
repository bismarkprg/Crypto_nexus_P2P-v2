"use client";
import { useState } from "react";

export default function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={`accordion ${open ? "active" : ""}`} onClick={() => setOpen((s) => !s)}>
        {title}
      </button>
      <div className="panel" style={{ maxHeight: open ? "500px" : undefined }} aria-hidden={!open}>
        {children}
      </div>
    </>
  );
}
