SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS project_tech;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS profile;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE profile (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  title VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  summary TEXT NOT NULL,
  availability VARCHAR(190) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE skills (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(120) NOT NULL,
  `level` TINYINT UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE projects (
  id VARCHAR(96) NOT NULL PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  type VARCHAR(160) NOT NULL,
  status VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  source_path VARCHAR(500) DEFAULT NULL,
  repository VARCHAR(500) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE project_tech (
  project_id VARCHAR(96) NOT NULL,
  tech VARCHAR(120) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, tech),
  CONSTRAINT fk_project_tech_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE messages (
  id VARCHAR(96) NOT NULL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO profile (id, name, title, location, email, summary, availability) VALUES
(1, 'Furkan Nacakcı', 'Full Stack Geliştirici', 'İstanbul, Türkiye', 'furkan.nck@gmail.com', 'Temiz, kullanışlı ve responsive web uygulamaları geliştiriyorum. Arayüz tasarımı, backend API yapısı ve gerçek problemlere çözüm üreten projeler üzerinde çalışmayı seviyorum.', 'Staj ve junior geliştirici fırsatlarına açık');

INSERT INTO skills (id, name, category, `level`) VALUES
('skill-html', 'HTML', 'Frontend', 88),
('skill-css', 'CSS', 'Frontend', 84),
('skill-js', 'JavaScript', 'Frontend', 78),
('skill-node', 'Node.js', 'Backend', 72),
('skill-api', 'REST API', 'Backend', 76),
('skill-db', 'SQL / Veritabanı Mantığı', 'Veri', 70);

INSERT INTO projects (id, title, type, status, description, featured, source_path, repository, sort_order) VALUES
('project-campus', 'Kampüs Görev Panosu', 'Web Uygulaması', 'Tamamlandı', 'Öğrencilerin ödevlerini, teslim tarihlerini ve proje adımlarını düzenleyebilmesi için tasarlanmış görev paneli konsepti.', 1, NULL, NULL, 0),
('project-clinic', 'Klinik Sıra Simülatörü', 'Prototip', 'Devam Ediyor', 'Küçük bir klinikte hasta akışını ve oda geliştirmelerini modelleyen simülasyon prototipi.', 1, NULL, NULL, 1),
('project-portfolio', 'Portfolio Hub', 'Full Stack Web Sitesi', 'Tamamlandı', 'Bu internet sitesi: düzenlenebilir profil verileri, yetenekler, projeler ve iletişim mesajları içeren full stack portfolio uygulaması.', 1, NULL, NULL, 2),
('auto-myhospitaltaycoon', 'MyHospitalTycoon', 'Oyun / Simülasyon Projesi', 'Geliştiriliyor', 'MyHospitalTycoon, oyuncunun kendi hastanesini yönetip büyüttüğü bir tycoon simülasyonu olarak tasarlanıyor. Klinik akışı, hasta kabulü, oda geliştirmeleri ve gelir yönetimi gibi sistemlerle hastaneyi adım adım geliştirmeye odaklanıyor.', 1, '/Users/furkannacakci/myHospitalTaycoon', NULL, 3),
('auto-pitlane', 'Pitlane', 'Web Projesi', 'Geliştiriliyor', 'Pitlane, motor ve araba toplulukları için geliştirilen bir sürüş uygulaması fikridir. Kullanıcılar rota planlayabilir, sohbet odalarında buluşabilir ve sürüş sırasında gruptaki diğer kullanıcıları harita üzerinde canlı takip edebilir.', 1, '/Users/furkannacakci/Desktop/pitlane', 'git@github.com:Ayazaga-Boys/pitlane.git', 4),
('auto-urbantransit-recovery', 'Begum Midwife Clinic', 'Oyun / Simülasyon Projesi', 'Geliştiriliyor', 'Begum Midwife Clinic, Unity ile geliştirilen oynanabilir bir klinik simülasyonu prototipidir. Oyuncu klinikte hastaları karşılar, şikayetlerine göre doğru odaya yönlendirir, işlemleri tamamlar ve kazandığı gelirle çalışan, makine ve oda geliştirmeleri yapar.', 1, '/Users/furkannacakci/Documents/Playground/urbantransit-recovery', NULL, 5),
('auto-task-management-api', 'Task Management Api', 'Backend API', 'Geliştiriliyor', 'Task Management API, Express ile geliştirilen basit bir görev yönetimi servisidir. Görev oluşturma, listeleme, güncelleme ve silme endpointleriyle temel CRUD mantığını backend tarafında göstermeyi amaçlar.', 1, '/Users/furkannacakci/Documents/task-management-api', 'git@github.com:furkannacakci/task-management-api.git', 6);

INSERT INTO project_tech (project_id, tech, sort_order) VALUES
('project-campus', 'HTML', 0),
('project-campus', 'CSS', 1),
('project-campus', 'JavaScript', 2),
('project-campus', 'Node.js', 3),
('project-clinic', 'C#', 0),
('project-clinic', 'Unity', 1),
('project-clinic', 'Oyun Mantığı', 2),
('project-portfolio', 'Node.js', 0),
('project-portfolio', 'REST API', 1),
('project-portfolio', 'Vanilla JS', 2),
('project-portfolio', 'CSS', 3),
('auto-myhospitaltaycoon', 'C#', 0),
('auto-myhospitaltaycoon', 'Unity', 1),
('auto-pitlane', 'Node.js', 0),
('auto-pitlane', 'JavaScript', 1),
('auto-urbantransit-recovery', 'C#', 0),
('auto-urbantransit-recovery', 'Unity', 1),
('auto-task-management-api', 'Node.js', 0),
('auto-task-management-api', 'Express', 1),
('auto-task-management-api', 'JavaScript', 2);

INSERT INTO messages (id, name, email, message, created_at) VALUES
('msg-sample', 'Demo Ziyaretçi', 'demo@ornekmail.com', 'Güzel portfolio. Projelerin hakkında daha fazla bilgi almak isterim.', '2026-05-14 09:00:00');
