import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame
} from "framer-motion";
import { Mail } from "lucide-react";
import profilePhotoUrl from "@/src/assets/profile-furkan.jpg";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/furkannacakci",
    icon: GithubIcon
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/furkan-nacakcı-05783a320?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    icon: LinkedinIcon
  },
  {
    label: "Mail",
    href: "mailto:furkan.nck@gmail.com",
    icon: Mail
  }
];

export const Component = () => {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background"
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-[-20%] top-[-20%] h-[40%] w-[40%] rounded-full bg-[var(--chart-1)] opacity-30 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] h-[20%] w-[20%] rounded-full bg-[var(--chart-3)] opacity-20 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--chart-5)] opacity-20 blur-[120px]" />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-16 lg:grid-cols-[1fr_0.82fr] lg:px-12">
        <div className="flex flex-col items-center space-y-6 text-center lg:items-start lg:text-left">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm md:text-6xl">
              Furkan Nacakcı
            </h1>
          </div>

          <div className="pointer-events-auto flex flex-wrap justify-center gap-4 lg:justify-start">
            <button
              onClick={() => setCount(count + 1)}
              className="rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-95"
            >
              Etkileşim ({count})
            </button>
            <a
              href="#projects"
              className="rounded-md bg-secondary px-8 py-3 font-semibold text-secondary-foreground transition-all hover:opacity-80 active:scale-95"
            >
              Projeleri Gör
            </a>
          </div>

          <div className="pointer-events-auto flex items-center justify-center gap-3 lg:justify-start">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground active:scale-95"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[320px] justify-self-center sm:max-w-[360px] lg:max-w-[430px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/10">
            <img
              src={profilePhotoUrl}
              alt="Furkan Nacakcı"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY }: { offsetX: any; offsetY: any }) => {
  return (
    <svg className="h-full w-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.86 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 6.96c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.95.68 1.91v2.8c0 .27.18.59.69.49A10.18 10.18 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.94 8.98H3.75v10.27h3.19V8.98ZM5.35 4a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7Zm13.9 9.36c0-3.08-1.65-4.51-3.85-4.51a3.32 3.32 0 0 0-3.01 1.66h-.04V8.98H9.29v10.27h3.19v-5.08c0-1.34.25-2.64 1.91-2.64 1.64 0 1.66 1.53 1.66 2.72v5h3.2v-5.89Z" />
    </svg>
  );
}
