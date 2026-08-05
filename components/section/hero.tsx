"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {/* BLUE GLOW */}
        <div className="absolute top-0 left-0 h-[420px] w-[420px] rounded-full bg-brand-blue/10 blur-3xl md:h-[550px] md:w-[550px]" />

        {/* ORANGE GLOW */}
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-brand-orange/10 blur-3xl md:h-[450px] md:w-[450px]" />

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* EYEBROW */}
          <div className="inline-flex items-center rounded-full border border-brand-blue/10 bg-brand-blue/[0.04] px-5 py-2.5 backdrop-blur-xl">
            <div className="mr-3 h-2 w-2 rounded-full bg-brand-orange animate-pulse" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-blue">
              Keeping Learners Learning
            </p>
          </div>

          {/* HEADING */}
          <div className="mt-8">
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-brand-black sm:text-6xl lg:text-7xl">
              The complete system your school needs to{" "}
              <span className="text-brand-blue italic">grow, lead,</span> and
              never look back.
            </h1>
          </div>

          {/* ACCENT */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-[3px] w-24 rounded-full bg-brand-orange" />

            <div className="h-[3px] w-10 rounded-full bg-brand-blue/20" />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10 space-y-5">
            <p className="max-w-2xl text-[17px] leading-9 text-black/60">
              Running a school is one of the hardest jobs in the world.
              You&apos;re managing staff who need training, parents who want
              assurance, pupils who need consistent engagement — and a school
              brand that needs to tell its story.
            </p>

            <p className="max-w-2xl text-[17px] leading-9 text-black/70">
              <span className="font-semibold text-brand-black">
                Lerna Educational Hub
              </span>{" "}
              was built to help schools operate with structure, visibility,
              consistency, and confidence.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 space-y-6">
            {/*
             */}
            {/* School Portal CTA */}
            <div className="max-w-xl rounded-3xl border border-brand-blue/10 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-brand-black">
                    Lerna School Portal
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-black/60">
                    Access your school management dashboard, results,
                    attendance, lesson notes, and administrative tools in one
                    secure portal.
                  </p>
                </div>

                <Link
                  href="/schoolportal"
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-lg"
                >
                  Open Portal
                </Link>
              </div>
            </div>
          </div>

          {/* PAIN POINTS */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              "My teachers are doing their best but lesson delivery is inconsistent.",
              "Nobody knows we exist — our social media is a ghost town.",
              "When a teacher calls in sick, the whole day collapses.",
              "Parents don't really understand what we do for their children.",
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/10 hover:shadow-xl"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.03] to-brand-orange/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <p className="text-[15px] italic leading-7 text-black/60">
                    &quot;{item}&quot;
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange/10">
                      <div className="h-2 w-2 rounded-full bg-brand-orange" />
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-orange">
                      We fix that
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          {/* SOFT GLOW */}
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-orange/10 blur-2xl" />

          {/* CARD */}
          <div className="relative overflow-hidden rounded-[36px] border border-white/40 bg-white/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-8">
            {/* Decorative Glow */}
            <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-brand-blue/10 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              {/* CARD 1 */}
              <div className="overflow-hidden rounded-3xl bg-brand-blue p-6 text-white shadow-lg">
                <p className="text-sm font-medium text-white/80">
                  Books & Materials Distributed
                </p>

                <h3 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  7,000+
                </h3>

                <div className="mt-6 h-1.5 w-16 rounded-full bg-white/30" />
              </div>

              {/* CARD 2 */}
              <div className="overflow-hidden rounded-3xl bg-brand-orange p-6 text-white shadow-lg">
                <p className="text-sm font-medium text-white/80">
                  Teacher Effectiveness
                </p>

                <h3 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  85%
                </h3>

                <div className="mt-6 h-1.5 w-16 rounded-full bg-white/30" />
              </div>

              {/* BOTTOM PANEL */}
              <div className="col-span-1 rounded-3xl border border-black/5 bg-white/80 p-6 backdrop-blur-xl sm:col-span-2 sm:p-8">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-black/50">
                    Learning Impact Report
                  </p>

                  <p className="text-sm font-semibold text-brand-blue">85%</p>
                </div>

                {/* PROGRESS BAR (ADDED BACK) */}
                <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-black/5">
                  <div className="h-full w-[85%] rounded-full bg-brand-blue" />
                </div>

                {/* DESCRIPTION */}
                <p className="mt-6 text-[15px] leading-8 text-black/60 sm:text-base">
                  7,000+ books and instructional materials have been distributed
                  to learners in schools and communities across Africa. Teachers
                  using our structured lesson plans report:
                </p>

                {/* BULLETS */}
                <div className="mt-6 space-y-3 text-black/70 leading-7">
                  <div>✓ Improved understanding among learners</div>
                  <div>✓ Increased classroom participation</div>
                  <div>✓ Increased confidence in classroom discussions</div>
                  <div>
                    ✓ More active questioning and engagement from students
                  </div>
                </div>

                {/* MINI STATS */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-black/3 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                      Reach
                    </p>

                    <h4 className="mt-2 text-2xl font-bold text-brand-black">
                      Africa-wide
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-black/3 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                      Engagement
                    </p>

                    <h4 className="mt-2 text-2xl font-bold text-brand-black">
                      High
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
