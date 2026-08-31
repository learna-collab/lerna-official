"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block transition text-sm relative ${
      pathname === path
        ? "text-white font-medium after:w-full"
        : "text-white/70 hover:text-white"
    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-brand-orange after:w-0 hover:after:w-full after:transition-all after:duration-300`;

  return (
    <footer id="contact" className="bg-brand-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-14">
          {/* Brand */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              LERNA EDUCATIONAL HUB
            </h2>

            <p className="mt-6 text-white/60 leading-8 max-w-md">
              Helping schools grow through structured systems, educational
              excellence, and modern learning solutions that improve learning
              outcomes and institutional growth.
            </p>

            {/* Socials */}
            <div className="mt-8">
              <p className="text-white/60 text-sm mb-4">
                Follow us for updates
              </p>

              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com/share/18mANDvABy/?mibextid=wwXlfr"
                  className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue transition"
                >
                  <FaFacebook size={18} />
                </a>

                <a
                  href="https://instagram.com/lerna.ng?igsh=OTlzaGp2NzM1cnU4&utm_source=qr"
                  className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-orange transition"
                >
                  <FaInstagram size={18} />
                </a>

                <a
                  href="https://linkedin.com/company/lerna-ng/"
                  className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue transition"
                >
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="uppercase tracking-[0.25em] text-brand-orange text-sm font-semibold mb-6">
              Quick Links
            </p>

            <div className="space-y-4">
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>

              <Link href="/offers" className={linkClass("/offers")}>
                Services
              </Link>

              <Link href="/about" className={linkClass("/about")}>
                About Us
              </Link>

              <Link href="/blogs" className={linkClass("/blogs")}>
                Blogs
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:text-right">
            <p className="uppercase tracking-[0.25em] text-brand-orange text-sm font-semibold">
              Contact
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex lg:justify-end items-center gap-3 text-white/80">
                <Phone size={18} />
                <span>0806 869 8329</span>
              </div>

              <div className="flex lg:justify-end items-center gap-3 text-white/80">
                <Mail size={18} />
                <span>info@lerna.ng</span>
              </div>
            </div>

            <a
              href="https://wa.me/2348068698329"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-orange px-8 py-4 font-medium text-white transition hover:opacity-90 hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Lerna Educational Hub. All rights
            reserved.
          </p>

          <p className="text-white/40 text-sm">Keeping Learners Learning.</p>
        </div>
      </div>
    </footer>
  );
}
