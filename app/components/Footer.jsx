"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8zm5.7-7.6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

const YoutubeBrandIcon = ({ size = 22, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z" />
  </svg>
);

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#1a0b33] text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="ACK Diocese of Maseno North Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm">ACK MASENO NORTH</div>
              <div className="text-[0.6rem] text-white/50 tracking-widest">
                DIOCESE OF MASENO NORTH
              </div>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed mb-5">
            A Christ centered family of believers dedicated to spreading the
            Gospel, nurturing spiritual growth, and serving the community with
            love and compassion.
          </p>

          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/share/1Dz94DFouE/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#9333ea] flex items-center justify-center transition"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
              </svg>
            </a>

            <a
              href="https://www.youtube.com/@ackdioceseofmasenonorth"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#9333ea] flex items-center justify-center transition"
              aria-label="YouTube"
            >
              <YoutubeBrandIcon size={18} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h5 className="font-bold mb-4 text-sm uppercase tracking-wider">
            Quick Links
          </h5>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { name: "Home", href: "/" },
              { name: "About Us", href: "/about" },
              { name: "Events", href: "/events" },
              { name: "Contact", href: "/contact" },
            ].map((i) => (
              <li key={i.name}>
                <a href={i.href} className="hover:text-white transition">
                  {i.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h5 className="font-bold mb-4 text-sm uppercase tracking-wider">
            Service Times
          </h5>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <Clock
                size={16}
                className="text-[#9333ea] flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="text-white font-medium">Sunday Service</div>
                <div>9:00 AM &amp; 11:00 AM</div>
              </div>
            </li>

            <li className="flex gap-3">
              <Clock
                size={16}
                className="text-[#9333ea] flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="text-white font-medium">Wednesday Prayer</div>
                <div>6:00 PM</div>
              </div>
            </li>

            <li className="flex gap-3">
              <Clock
                size={16}
                className="text-[#9333ea] flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="text-white font-medium">Friday Fellowship</div>
                <div>5:30 PM</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h5 className="font-bold mb-4 text-sm uppercase tracking-wider">
            Get In Touch
          </h5>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin
                size={16}
                className="text-[#9333ea] flex-shrink-0 mt-0.5"
              />
              <span>Kakamega, Western Region, Kenya</span>
            </li>

            <li className="flex gap-3">
              <Phone
                size={16}
                className="text-[#9333ea] flex-shrink-0 mt-0.5"
              />
              <a href="tel:+254202103103" className="hover:text-white">
                020 2103 103
              </a>
            </li>

            <li className="flex gap-3">
              <Mail size={16} className="text-[#9333ea] flex-shrink-0 mt-0.5" />
              <a
                href="mailto:info@ackdioceseofmasenonorth.org"
                className="hover:text-white"
              >
                info@ackdioceseofmasenonorth.org
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50 px-4">
        &copy; {year ?? " "} ACK Diocese of Maseno North. All rights reserved.
        Built with care.
      </div>
    </footer>
  );
}
