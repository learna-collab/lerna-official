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
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-orange/10 blur-3xl" />
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
          <div className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand-orange" />
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">
              Advancing Education
            </span>
          </div>

          <h1 className="mt-7 max-w-2xl text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-brand-black sm:text-6xl lg:text-[72px]">
            Shaping the future{" "}
            <span className="italic text-brand-blue">through education.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-black/55 sm:text-lg">
            Connecting people, ideas, and opportunities to advance education.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/schoolportal"
              className="rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              School Portal
            </Link>

            <Link
              href="/marketplace"
              className="rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Visit Marketplace
            </Link>

            <Link
              href="/payments"
              className="rounded-full border border-brand-blue px-7 py-3.5 text-sm font-semibold text-brand-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-blue hover:text-white hover:shadow-lg"
            >
              Make Payments
            </Link>
          </div>
        </motion.div>

        {/* RIGHT ORBITAL NAVIGATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto h-[500px] w-full max-w-[560px]"
        >
          {/* Glow */}
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-3xl" />

          {/* Rings */}
          <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5" />
          <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-blue/10" />

          {/* Rotating Orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            {/* Connection Lines */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 560 500"
              fill="none"
            >
              <g transform="translate(280 250)">
                {[270, 342, 54, 126, 198].map((angle) => {
                  const r = 185;
                  const x = Math.cos((angle * Math.PI) / 180) * r;
                  const y = Math.sin((angle * Math.PI) / 180) * r;

                  return (
                    <line
                      key={angle}
                      x1="0"
                      y1="0"
                      x2={x}
                      y2={y}
                      stroke="currentColor"
                      className="text-brand-blue/10"
                    />
                  );
                })}
              </g>
            </svg>

            <OrbitLink
              angle={270}
              href="/"
              label="Home"
              icon={<BookOpen />}
              color="blue"
            />

            <OrbitLink
              angle={342}
              href="/about"
              label="About"
              icon={<Users />}
              color="orange"
            />

            <OrbitLink
              angle={54}
              href="/payments"
              label="Payments"
              icon={<Lightbulb />}
              color="blue"
            />

            <OrbitLink
              angle={126}
              href="/marketplace"
              label="Marketplace"
              icon={<Building2 />}
              color="orange"
            />

            <OrbitLink
              angle={198}
              href="/blogs"
              label="Blogs"
              icon={<Globe2 />}
              color="blue"
            />
          </motion.div>

          {/* Center Hub */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 z-20 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white shadow-[0_25px_70px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue">
              <GraduationCap
                className="h-12 w-12 text-white"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function OrbitLink({
  icon,
  href,
  label,
  angle,
  color,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
  angle: number;
  color: "blue" | "orange";
}) {
  const radius = 185;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        x,
        y,
      }}
      whileHover={{
        scale: 1.15,
      }}
      className="z-30"
    >
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Link href={href} aria-label={label}>
          <div className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white/95 shadow-[0_15px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all hover:shadow-[0_20px_45px_rgba(0,0,0,0.16)]">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                color === "blue"
                  ? "bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white"
                  : "bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white"
              }`}
            >
              {icon}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
