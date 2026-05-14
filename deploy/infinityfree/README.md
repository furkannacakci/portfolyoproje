# InfinityFree Deploy

InfinityFree Node.js calistirmadigi icin `server/index.js` domaine yuklenmez. Domain icin `dist` icindeki React dosyalari ve bu klasordeki PHP API dosyalari kullanilir.

## Kurulum

1. InfinityFree phpMyAdmin ekraninda `data/mysql-schema.sql` dosyasini import et.
2. `deploy/infinityfree/api/config.php` dosyasindaki MySQL bilgilerini InfinityFree panelindeki bilgilerle doldur.
3. Projeyi build et:

```bash
npm run build
```

4. Upload paketini hazirla:

```bash
npm run build:infinityfree
```

5. Olusan `deploy/infinityfree-public-html.zip` dosyasinin icindekileri InfinityFree `htdocs` veya `public_html` klasorune yukle.

## Beyaz Sayfa Kontrolu

- Domain ana sayfasinda `index.html` acilmali.
- `/assets/...js` dosyalari 404 vermemeli.
- `/api/check.php` tarayicida `ok: true` ve tablo sayilarini gostermeli.
- `/api/portfolio` tarayicida JSON donmeli.
- `/api/portfolio` database hatasi verirse `api/config.php` bilgileri yanlistir veya MySQL import eksiktir.
