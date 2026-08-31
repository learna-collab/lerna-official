"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const gallery = {
  hero: { src: "/annie-spratt-OIuCXxx08yg-unsplash.jpg", title: "Students" },
  top: { src: "/fatima-yusuf-FMk_-rH3zjg-unsplash.jpg", title: "Learning" },
  middle: {
    src: "/emmanuel-ikwuegbu-VC6MGt9ZoBA-unsplash.jpg",
    title: "Educators",
  },
  bottom: { src: "/IMG-20260730-WA0019.jpg", title: "Communities" },
  card1: {
    src: "/IMG-20260730-WA0018.jpg",
    title: "Parents",
  },
  card2: { src: "/IMG-20260730-WA0020.jpg", title: "Opportunity" },
  card3: { src: "/pexels-seyhmuskino-28593048.jpg", title: "Impact" },
};

function ImageCard({
  image,
  aspect,
  hero = false,
}: {
  image: { src: string; title: string };
  aspect: string;
  hero?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[30px]">
      <div className={`relative ${aspect}`}>
        <Image
          src={image.src}
          alt={image.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Editorial Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

        {/* Title */}
        <div className="absolute bottom-6 left-6">
          {hero && (
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
              Lerna
            </p>
          )}

          <h3
            className={`font-semibold text-white ${
              hero ? "text-3xl md:text-4xl" : "text-xl"
            }`}
          >
            {image.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function EducationShowcase() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue">
            Advancing Education
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-black md:text-6xl">
            One ecosystem.
          </h2>
        </motion.div>

        {/* Main Editorial Grid */}
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <ImageCard image={gallery.hero} aspect="aspect-[4/5]" hero />
          </motion.div>

          {/* Right Stack */}
          <div className="grid gap-6 lg:col-span-5">
            {[gallery.top, gallery.middle, gallery.bottom].map(
              (item, index) => (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  <ImageCard image={item} aspect="aspect-[16/9]" />
                </motion.div>
              ),
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[gallery.card1, gallery.card2, gallery.card3].map((item, index) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <ImageCard image={item} aspect="aspect-[5/4]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
