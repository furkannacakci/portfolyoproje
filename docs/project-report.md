# Proje Raporu: Portfolio Hub

## Proje Özeti

Portfolio Hub, İnternet Web Programlama dersi için geliştirilmiş full stack kişisel portfolio sitesidir. Projenin amacı geliştirici profilini, teknik yetenekleri, seçilmiş projeleri ve çalışan bir iletişim formunu tek bir web sitesi üzerinde sunmaktır. Sitede ayrıca yeni proje kayıtlarının eklenebildiği ve mevcut proje kayıtlarının silinebildiği küçük bir yönetim bölümü vardır.

## Kullanılan Teknolojiler

Frontend tarafı React, TypeScript ve Tailwind CSS ile geliştirilmiştir. Arayüz desktop ve mobil ekranlara uyumlu olacak şekilde responsive tasarlanmıştır. Projede shadcn yapısına uygun `components/ui` klasörü ve class birleştirme için `lib/utils.ts` yardımcı fonksiyonu kullanılmıştır. Ana sayfada framer-motion ile animasyonlu infinite grid hero component’i yer alır. Backend tarafı Node.js ile, yerleşik HTTP modülü kullanılarak yazılmıştır. Uygulama portfolio verilerini yüklemek, proje oluşturmak, proje silmek ve iletişim mesajlarını kaydetmek için REST tarzı API endpointleri sunar. Yerel kalıcılık için SQLite tabanlı SQL database kullanılmıştır. Veriler `data/portfolio.db` dosyasında tutulur ve tablo yapısı `data/schema.sql` dosyasında tanımlıdır.

## Geliştirme Süreci

Proje full stack bir uygulama olacak şekilde planlandı. İlk olarak veri modeli profil, yetenekler, projeler ve mesajlar olmak üzere dört ana kaynak etrafında tasarlandı. Ardından backend API, SQLite SQL database üzerinden veri okuyup yazacak şekilde geliştirildi. `profile`, `skills`, `projects`, `project_tech` ve `messages` tabloları oluşturuldu. Daha sonra Vite, React, TypeScript ve Tailwind CSS kurulumu yapılarak frontend modern bir component mimarisine taşındı. API hazırlandıktan sonra frontend, backend üzerinden canlı veri çekip tarayıcıda dinamik olarak gösterecek şekilde oluşturuldu.

İletişim formu, frontend tarafındaki kullanıcı girdisinin backend API’ye gönderilip kaydedilmesini gösterir. Proje yöneticisi bölümü ise proje oluşturma ve silme işlemleriyle CRUD mantığını gösterir. Arayüz; okunabilir bölümler, erişilebilir form etiketleri, responsive grid yapıları ve öğrenci portfoliosuna uygun profesyonel bir renk paleti ile tasarlanmıştır.

## Sonuç

Portfolio Hub; çalışan frontend, backend API, kalıcı veri saklama ve deploy edilebilir Node.js server yapısını bir araya getirerek ödev gereksinimlerini karşılar. Proje GitHub’a public repository olarak yüklenebilir ve live demo bağlantısı için Render veya Railway gibi Node.js hosting platformlarında yayınlanabilir.
