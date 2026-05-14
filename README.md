# Portfolio Hub

Portfolio Hub, İnternet Web Programlama dersi için hazırlanmış full stack kişisel portfolio sitesidir. Projede React tabanlı bir portfolio arayüzü, shadcn uyumlu component yapısı, Tailwind CSS tasarım sistemi, proje vitrini, yetenekler bölümü, iletişim formu ve proje ekleme/silme işlemleri için küçük bir yönetim alanı bulunur.

## Özellikler

- React + TypeScript tabanlı responsive portfolio ana sayfası
- `components/ui/the-infinite-grid.tsx` içinde framer-motion ile animasyonlu infinite grid hero
- shadcn uyumlu `components/ui` ve `lib/utils` klasör yapısı
- Profil, proje, yetenek ve mesaj verilerini backend API üzerinden yükleme
- Mesajları kaydeden iletişim formu
- Proje ekleme ve silme işlemleri
- Basit kalıcı veri için JSON dosya tabanı
- Node.js backend ile statik React build servis etme

## Kullanılan Teknolojiler

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js HTTP server
- Veri: JSON dosya veritabanı
- API yapısı: REST
- UI yardımcıları: shadcn uyumlu yapı, `clsx`, `tailwind-merge`
- Animasyon: framer-motion

## Yerelde Çalıştırma

```bash
npm install
npm run build
npm start
```

Sonra tarayıcıdan aç:

```text
http://localhost:3000
```

## API Endpointleri

```text
GET    /api/portfolio
POST   /api/projects
DELETE /api/projects/:id
POST   /api/messages
```

## Component ve Stil Yolları

- shadcn component yolu: `components/ui`
- Eklenen component: `components/ui/the-infinite-grid.tsx`
- Yardımcı class birleştirme fonksiyonu: `lib/utils.ts`
- Tailwind global stil dosyası: `src/index.css`
- shadcn ayar dosyası: `components.json`

## Deploy Notları

Bu proje Node.js destekleyen Render veya Railway gibi platformlara deploy edilebilir.

Önerilen Render ayarları:

- Derleme komutu: `npm install && npm run build`
- Başlatma komutu: `npm start`
- Ortam değişkeni: `PORT` Render tarafından otomatik verilir

## Teslim Kontrol Listesi

- Kaynak kod bu klasörden zip dosyası yapılabilir.
- Proje raporu `docs/project-report.md` içinde hazırdır.
- Live demo için proje Render veya Railway üzerinde yayınlanabilir.
- GitHub reposu teslimden önce Public yapılmalıdır.
