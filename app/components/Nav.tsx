"use client";

import { useState, useEffect } from "react";
export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav id="nav">
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              <div className="nav-logo-icon">
                <svg viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="4" stroke="#c9a96e" strokeWidth="1.3" />
                  <line x1="7" y1="9" x2="7" y2="10" stroke="#c9a96e" strokeWidth="1.1" />
                  <line x1="11" y1="9" x2="11" y2="10" stroke="#c9a96e" strokeWidth="1.1" />
                  <line x1="7" y1="10" x2="11" y2="10" stroke="#c9a96e" strokeWidth="1.1" />
                  <rect x="8" y="10.5" width="2" height="1" rx="0.5" stroke="#c9a96e" strokeWidth="1" />
                  <path d="M3 16Q9 13 15 16" stroke="#c9a96e" strokeWidth="1.3" fill="none" />
                  <path d="M3 16L3 14Q9 11 15 14L15 16" stroke="#c9a96e" strokeWidth="1.3" fill="none" />
                  <line x1="9" y1="11.5" x2="9" y2="13" stroke="#c9a96e" strokeWidth="1.1" />
                </svg>
              </div>
              <span className="nav-brand">EduCreation</span>
            </a>
            <ul className="nav-links">
              <li><a href="#system">The System</a></li>
              <li><a href="#students">Students</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#parents">For Parents</a></li>
              <li><a href="/signup" className="nav-cta">Book free session</a></li>
            </ul>
            <button className="nav-hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
        <a href="#system"  onClick={() => setMobileOpen(false)}>The System</a>
        <a href="#students" onClick={() => setMobileOpen(false)}>Students</a>
        <a href="#pricing"  onClick={() => setMobileOpen(false)}>Pricing</a>
        <a href="#parents"  onClick={() => setMobileOpen(false)}>For Parents</a>
        <a href="/signup" onClick={() => setMobileOpen(false)} style={{ color: "var(--gold)" }}>
          Book free session →
        </a>
      </div>
    </>
  );
}
