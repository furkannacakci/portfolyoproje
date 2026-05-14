import { FormEvent, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Component as InfiniteGrid } from "@/components/ui/the-infinite-grid";

type Profile = {
  name: string;
  title: string;
  location: string;
  email: string;
  summary: string;
  availability: string;
};

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
};

type Project = {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  tech: string[];
  featured: boolean;
};

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type Portfolio = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  messages: Message[];
};

const api = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "İstek başarısız oldu.");
  }
  return data;
};

export default function App() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [contactStatus, setContactStatus] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const loadPortfolio = async () => {
    setPortfolio(await api<Portfolio>("/api/portfolio"));
  };

  useEffect(() => {
    loadPortfolio().catch(error => setContactStatus(error.message));
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const profile = portfolio?.profile;

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("Gönderiliyor...");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    try {
      await api<Message>("/api/messages", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      setContactStatus("Mesaj başarıyla kaydedildi.");
      await loadPortfolio();
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : "Mesaj gönderilemedi.");
    }
  };

  return (
    <main>
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-border bg-background px-5 py-4 shadow-sm md:px-12">
        <a href="#home" className="flex items-center gap-3 font-extrabold">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-foreground text-background">FN</span>
          Portfolio Hub
        </a>
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm font-semibold text-muted-foreground">
          <a href="#projects" className="hover:text-foreground">Projeler</a>
          <a href="#skills" className="hover:text-foreground">Yetenekler</a>
          <a href="#contact" className="hover:text-foreground">İletişim</a>
          <button
            type="button"
            onClick={() => setTheme(current => current === "dark" ? "light" : "dark")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:bg-accent"
            aria-label={theme === "dark" ? "Light mode aç" : "Dark mode aç"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <section id="home">
        <InfiniteGrid />
      </section>

      <section className="bg-background px-5 py-16 md:px-12" aria-label="Profil">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-primary">Hakkımda</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">{profile?.title || "Full Stack Geliştirici"}</h2>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{profile?.summary || "Portfolio yükleniyor..."}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            <Info label="İsim" value={profile?.name || "Furkan Nacakcı"} />
            <Info label="Konum" value={profile?.location || "İstanbul, Türkiye"} />
            <Info label="Durum" value={profile?.availability || "Staj ve junior geliştirici fırsatlarına açık"} />
          </div>
        </div>
      </section>

      <section id="projects" className="bg-muted px-5 py-16 md:px-12">
        <SectionHeader eyebrow="Çalışmalar" title="Öne çıkan projeler" />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {portfolio?.projects.map(project => (
            <article key={project.id} className="flex min-h-80 flex-col rounded-lg border border-border bg-background p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black">{project.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">{project.type}</p>
                </div>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{project.status}</span>
              </div>
              <p className="mt-5 text-muted-foreground">{project.description}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {project.tech.map(item => (
                  <span key={item} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="bg-background px-5 py-16 md:px-12">
        <SectionHeader eyebrow="Teknoloji" title="Yetenekler ve teknolojiler" />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {portfolio?.skills.map(skill => (
            <article key={skill.id} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <strong>{skill.name}</strong>
                <span className="text-sm text-muted-foreground">{skill.category} - {skill.level}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${skill.level}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="grid gap-8 bg-muted px-5 py-16 md:grid-cols-[0.8fr_1fr] md:px-12">
        <SectionHeader eyebrow="İletişim" title="Mesaj gönder" />
        <form onSubmit={handleContactSubmit} className="grid gap-4 rounded-lg border border-border bg-background p-6 shadow-sm">
          <label className="grid gap-2 font-bold">Ad Soyad<input name="name" required className="input" /></label>
          <label className="grid gap-2 font-bold">E-posta<input name="email" type="email" required className="input" /></label>
          <label className="grid gap-2 font-bold">Mesaj<textarea name="message" rows={5} required className="input" /></label>
          <button className="rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground">Mesaj Gönder</button>
          <p className="min-h-6 font-bold text-primary">{contactStatus}</p>
        </form>
      </section>

    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <strong className="mt-2 block">{value}</strong>
    </article>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mx-auto mb-9 max-w-6xl">
      <p className="text-sm font-extrabold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p> : null}
    </div>
  );
}
