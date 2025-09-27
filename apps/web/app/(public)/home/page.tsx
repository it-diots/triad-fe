"use client";

import { motion } from "motion/react";

import { Header } from "./Header";

const DURATION = 1.2;

const LINES = [
  "The single workspace where",
  "developers ship,",
  "planners steer, and",
  "designers shine,",
  "as one.",
];

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-zinc-950 px-6 pt-[64px] sm:px-12 md:px-16">
      <Header />

      {/* 카피 영역 */}
      <section className="mt-20 select-none text-white md:mt-40">
        {/* 상단 서브헤드 살짝 페이드 */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.5, ease: "easeIn", delay: 0.15 }}
          className="text-sm tracking-wide text-zinc-300"
        >
          Built for product teams
        </motion.p>

        {/* 메인 헤드라인: 라인 스태거 + 블러 아웃 + 살짝 스케일 */}
        <div className="mt-4 font-semibold">
          {LINES.map((text, i) => (
            <motion.p
              key={text}
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(6px)",
                scale: 0.985,
                clipPath: "inset(0 100% 0 0)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                clipPath: "inset(0 0% 0 0)",
              }}
              transition={{
                duration: DURATION,
                ease: "easeIn",
                delay: 0.18 * i,
              }}
              className={`w-fit pb-[5px] text-4xl sm:text-5xl md:text-6xl ${
                i === LINES.length - 1 ? "text-white" : "text-white/95"
              }`}
            >
              {/* 단어별 살짝 딜레이(더 섬세한 리듬) */}
              <span className="inline-block [transform-origin:0_50%]">
                {text.split(" ").map((word, j) => (
                  <motion.span
                    key={`${word}-${j}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeIn",
                      delay: 0.18 * i + j * 0.04,
                    }}
                    className="mr-2 inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.p>
          ))}
        </div>

        {/* 하이라이트 라인 언더라인 와이프 */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0.7 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.7,
            ease: "easeIn",
            delay: 0.18 * (LINES.length - 1) + 0.4,
          }}
          className="mt-3 h-[3px] w-48 origin-left rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-fuchsia-300"
        />

        {/* 설명 텍스트: 아래에서 위로 살짝 */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeIn",
            delay: 0.18 * (LINES.length - 1) + 0.6,
          }}
          className="mt-6 max-w-xl text-zinc-400"
        >
          Work together, Collaborate faster
        </motion.p>

        {/* CTA: 마이크로 인터랙션 */}
        <div className="mt-8 flex gap-3">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{
              duration: 0.4,
              ease: "easeIn",
              delay: 0.18 * (LINES.length - 1) + 0.75,
            }}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-[0_6px_20px_rgba(255,255,255,0.06)]"
          >
            Get started
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            transition={{
              duration: 0.4,
              ease: "easeIn",
              delay: 0.18 * (LINES.length - 1) + 0.85,
            }}
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-normal text-white/90 backdrop-blur-md"
          >
            Watch demo
          </motion.button>
        </div>
      </section>

      {/* 그라디언트 텍스트 애니메이션 키프레임 (Tailwind 커스텀 없이 인라인) */}
      <style>{`
        @keyframes gradientShift { to { background-position: 200% 0; } }
        .gradient-text { 
          background: linear-gradient(90deg, #fafafa, #a5b4fc, #f0abfc, #fafafa);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          background-size: 200% 100%; animation: gradientShift 10s linear infinite;
        }
      `}</style>
    </main>
  );
}
