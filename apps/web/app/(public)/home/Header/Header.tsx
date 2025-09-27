"use client";

import { Button } from "@triad/ui";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // 열렸을 때 배경 스크롤 잠금
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add("overflow-hidden");
    else root.classList.remove("overflow-hidden");
    return () => root.classList.remove("overflow-hidden");
  }, [open]);

  // 오버레이 클릭으로 닫기 (사이드바 외부 클릭)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawerRef.current) return;
    if (!drawerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[64px] items-center justify-between bg-zinc-950 px-4 sm:px-8 md:px-16">
      {/* 로고 */}
      <div className="text-lg font-bold tracking-widest text-white">TRIAD</div>

      {/* 데스크톱 내비게이션 */}
      <nav className="hidden md:block">
        <ul className="flex items-center gap-4">
          <li>
            <Button variant="link" className="text-gray-200">
              Home
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-gray-200">
              About
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-gray-200">
              Contact
            </Button>
          </li>
        </ul>
      </nav>

      {/* 데스크톱 CTA */}
      <div className="hidden md:block">
        <Button variant="secondary" size="sm" className="text-xs font-semibold">
          Contact Us
        </Button>
      </div>

      {/* 모바일 햄버거 버튼 */}
      <div className="md:hidden">
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:bg-white/5 active:scale-95"
        >
          {/* 햄버거 아이콘 (inline svg) */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleOverlayClick}
      />

      {/* 오른쪽 사이드바 드로어 */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 flex h-full w-[78%] max-w-[320px] flex-col bg-zinc-900/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 드로어 헤더 */}
        <div className="flex h-[64px] items-center justify-between px-4">
          <span className="text-sm font-semibold tracking-widest text-white/90">
            MENU
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/5 active:scale-95"
          >
            {/* 닫기 아이콘 */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 드로어 내비 리스트 */}
        <nav className="px-2">
          <ul className="flex flex-col gap-1">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl px-3 py-3 text-base text-white/90 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                Home
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl px-3 py-3 text-base text-white/90 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                About
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl px-3 py-3 text-base text-white/90 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                Contact
              </Button>
            </li>
          </ul>
        </nav>

        {/* 드로어 푸터 CTA */}
        <div className="mt-auto border-t border-white/10 p-4">
          <Button
            variant="secondary"
            className="w-full justify-center text-sm font-semibold"
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </header>
  );
}
