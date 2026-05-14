# Portfolio Hub
http://furkannacakci.infinityfree.me live
Portfolio Hub, İnternet Web Programlama dersi için hazırlanmış full stack kişisel portfolio sitesidir. Projede React tabanlı bir portfolio arayüzü, shadcn uyumlu component yapısı, Tailwind CSS tasarım sistemi, proje vitrini, yetenekler bölümü, iletişim formu ve proje ekleme/silme işlemleri için küçük bir yönetim alanı bulunur.

## Özellikler

- React + TypeScript tabanlı responsive portfolio ana sayfası
- `components/ui/the-infinite-grid.tsx` içinde framer-motion ile animasyonlu infinite grid hero
- shadcn uyumlu `components/ui` ve `lib/utils` klasör yapısı
- Profil, proje, yetenek ve mesaj verilerini SQL database üzerinden backend API ile yükleme
- Mesajları kaydeden iletişim formu
- Proje ekleme ve silme işlemleri
- Kalıcı veri için SQLite SQL database
- Node.js backend ile statik React build servis etme

## Kullanılan Teknolojiler

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js HTTP server
- Veri: SQLite SQL database (`data/portfolio.db`)
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

## SQL Database

Proje SQL database olarak SQLite kullanır:

```text
data/portfolio.db
```

SQL tablo şeması:

```text
data/schema.sql
```

`data/db.json` sadece ilk çalıştırmada SQLite dosyasını seed etmek için tutulur. Uygulama çalışırken profil, yetenekler, projeler ve mesajlar `data/portfolio.db` içindeki SQL tablolarından okunur/yazılır.

InfinityFree/phpMyAdmin gibi MySQL kullanan paneller için SQLite dosyası yerine şu dosya import edilmelidir:

```text
data/mysql-schema.sql
```

`data/schema.sql` SQLite içindir; MySQL tarafında `TEXT PRIMARY KEY` ve `CHECK` gibi ifadeler hata verebilir.

## API Endpointleri

```text
GET    /api/portfolio
POST   /api/admin/login
POST   /api/projects
DELETE /api/projects/:id
POST   /api/messages
```

## Admin Paneli

Admin paneli public menüde görünmez. Yerelde şu adresten açılır:

```text
http://localhost:3000/admin
```

Varsayılan lokal admin şifresi:

```text
admin123
```

Deploy ortamında şifreyi değiştirmek için `ADMIN_PASSWORD` environment variable değeri verilmelidir. Admin panelinde proje listesi AJAX ile 5 saniyede bir otomatik yenilenir; proje ekleme ve silme işlemleri sayfa yenilemeden yapılır.

## Component ve Stil Yolları

- shadcn component yolu: `components/ui`
- Eklenen component: `components/ui/the-infinite-grid.tsx`
- Yardımcı class birleştirme fonksiyonu: `lib/utils.ts`
- Tailwind global stil dosyası: `src/index.css`
- shadcn ayar dosyası: `components.json`

## Deploy Notları

Bu proje Node.js destekleyen Render veya Railway gibi platformlara deploy edilebilir.

SQLite için Node.js `node:sqlite` modülü kullanıldığı için Node.js 24 veya üzeri önerilir.

InfinityFree gibi PHP/MySQL hostinglerde Node.js backend çalışmaz. Bu durumda `deploy/infinityfree` klasöründeki PHP API dosyaları kullanılmalıdır:

```bash
npm run build
npm run build:infinityfree
```

Oluşan `deploy/infinityfree-public-html` klasörünün içeriği hostingdeki `htdocs` veya `public_html` klasörüne yüklenir. MySQL tabloları için `data/mysql-schema.sql` import edilmeli ve `api/config.php` içindeki database bilgileri doldurulmalıdır.

Önerilen Render ayarları:

- Derleme komutu: `npm install && npm run build`
- Başlatma komutu: `npm start`
- Ortam değişkeni: `PORT` Render tarafından otomatik verilir

## Teslim Kontrol Listesi

- Kaynak kod bu klasörden zip dosyası yapılabilir.
- Proje raporu `docs/project-report.md` içinde hazırdır.
- Live demo için proje Render veya Railway üzerinde yayınlanabilir.
- GitHub reposu teslimden önce Public yapılmalıdır.
