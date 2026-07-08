import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ChannelShowcase from "../components/ChannelShowcase";
import VideoDemos from "../components/VideoDemos";
import StatsGrid from "../components/StatsGrid";
import Footer from "../components/Footer";

export default function Landing() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div data-testid="landing-root" className="relative min-h-screen bg-phasor-bg text-white overflow-x-hidden">
      {/* Ambient background layers */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] radial-glow-green blur-3xl opacity-70" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[700px] h-[700px] radial-glow-cyan blur-3xl opacity-40" />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ChannelShowcase />
        <VideoDemos />
        <StatsGrid />
      </main>
      <Footer />
    </div>
  );
}
