"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Users,
  Lightbulb,
  Building2,
  Globe2,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-blue/[0.07] blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-orange/[0.07] blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.02]" />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          {/* EYEBROW */}
          <div className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand-orange" />

            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">
              Advancing Education
            </span>
          </div>

          {/* HEADING */}
          <h1 className="mt-7 max-w-2xl text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-brand-black sm:text-6xl lg:text-[72px]">
            Shaping the future{" "}
            <span className="italic text-brand-blue">through education.</span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-7 max-w-lg text-base leading-7 text-black/55 sm:text-lg">
            Connecting people, ideas, and opportunities to advance education.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/schoolportal"
              className="rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              School Portal
            </Link>

            <a
              href="https://lernabookshop.bumpa.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Visit Bookshop
            </a>
          </div>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto h-[500px] w-full max-w-[560px]"
        >
          {/* SOFT GLOW */}
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/[0.08] blur-3xl" />

          {/* OUTER RING */}
          <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.06]" />

          {/* INNER RING */}
          <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-blue/10" />

          {/* CONNECTION LINES */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 560 500"
            fill="none"
          >
            <path
              d="M280 250 L280 65"
              stroke="currentColor"
              className="text-brand-blue/10"
            />

            <path
              d="M280 250 L475 150"
              stroke="currentColor"
              className="text-brand-orange/10"
            />

            <path
              d="M280 250 L440 405"
              stroke="currentColor"
              className="text-brand-blue/10"
            />

            <path
              d="M280 250 L120 405"
              stroke="currentColor"
              className="text-brand-orange/10"
            />

            <path
              d="M280 250 L85 150"
              stroke="currentColor"
              className="text-brand-blue/10"
            />
          </svg>

          {/* CENTRAL HUB */}
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 z-20 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white shadow-[0_25px_70px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue">
              <GraduationCap
                className="h-12 w-12 text-white"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>

          {/* TOP */}
          <FloatingIcon
            icon={<BookOpen />}
            className="left-1/2 top-2 -translate-x-1/2"
            color="blue"
          />

          {/* TOP RIGHT */}
          <FloatingIcon
            icon={<Users />}
            className="right-5 top-[25%]"
            color="orange"
          />

          {/* BOTTOM RIGHT */}
          <FloatingIcon
            icon={<Lightbulb />}
            className="bottom-[8%] right-[15%]"
            color="blue"
          />

          {/* BOTTOM LEFT */}
          <FloatingIcon
            icon={<Building2 />}
            className="bottom-[8%] left-[15%]"
            color="orange"
          />

          {/* TOP LEFT */}
          <FloatingIcon
            icon={<Globe2 />}
            className="left-5 top-[25%]"
            color="blue"
          />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingIcon({
  icon,
  className,
  color,
}: {
  icon: React.ReactNode;
  className: string;
  color: "blue" | "orange";
}) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute z-10 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white/90 shadow-[0_15px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            color === "blue"
              ? "bg-brand-blue/10 text-brand-blue"
              : "bg-brand-orange/10 text-brand-orange"
          }`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
