import { FormEvent, useEffect, useState } from "react";
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
  const [projectStatus, setProjectStatus] = useState("");

  const loadPortfolio = async () => {
    setPortfolio(await api<Portfolio>("/api/portfolio"));
  };

  useEffect(() => {
    loadPortfolio().catch(error => setContactStatus(error.message));
  }, []);

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

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProjectStatus("Proje kaydediliyor...");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      ...Object.fromEntries(formData),
      featured: formData.has("featured")
    };
    try {
      await api<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      setProjectStatus("Proje eklendi.");
      await loadPortfolio();
    } catch (error) {
      setProjectStatus(error instanceof Error ? error.message : "Proje eklenemedi.");
    }
  };

  const deleteProject = async (projectId: string) => {
    await api<{ ok: boolean }>(`/api/projects/${projectId}`, { method: "DELETE" });
    await loadPortfolio();
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
          <a href="#admin" className="hover:text-foreground">Admin Paneli</a>
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

      <section id="admin" className="bg-background px-5 py-16 md:px-12">
        <SectionHeader eyebrow="Yönetim" title="Admin Paneli" />
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
          <form onSubmit={handleProjectSubmit} className="grid gap-4 rounded-lg border border-border bg-card p-6 shadow-sm md:grid-cols-2">
            <label className="grid gap-2 font-bold">Proje başlığı<input name="title" required className="input" /></label>
            <label className="grid gap-2 font-bold">Tür<input name="type" required placeholder="Web Uygulaması" className="input" /></label>
            <label className="grid gap-2 font-bold">Durum<select name="status" required className="input"><option>Tamamlandı</option><option>Devam Ediyor</option><option>Planlanıyor</option></select></label>
            <label className="grid gap-2 font-bold">Teknolojiler<input name="tech" required placeholder="Node.js, React, Tailwind" className="input" /></label>
            <label className="grid gap-2 font-bold md:col-span-2">Açıklama<textarea name="description" rows={4} required className="input" /></label>
            <label className="flex items-center gap-2 font-bold md:col-span-2"><input name="featured" type="checkbox" defaultChecked /> Öne çıkan proje</label>
            <button className="rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground md:col-span-2">Proje Ekle</button>
            <p className="min-h-6 font-bold text-primary md:col-span-2">{projectStatus}</p>
          </form>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-black">Proje Listesi</h3>
            <div className="mt-5 grid gap-3">
              {portfolio?.projects.map(project => (
                <article key={project.id} className="rounded-md border border-border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong>{project.title}</strong>
                      <p className="mt-1 text-sm text-muted-foreground">{project.status}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="rounded-md bg-destructive px-3 py-2 text-xs font-bold text-destructive-foreground transition hover:opacity-90"
                    >
                      Sil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
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
