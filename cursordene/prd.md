# "Seninle" - AI Yaşam Koçu ve Günlük Terapist
## Ürün Gereksinim Dokümanı (PRD)

## İçindekiler
1. [Giriş](#giriş)
2. [Ürün Vizyonu](#ürün-vizyonu)
3. [Kullanıcı Hedef Kitlesi](#kullanıcı-hedef-kitlesi)
4. [Ana Özellikler](#ana-özellikler)
5. [Kullanıcı Yolculuğu](#kullanıcı-yolculuğu)
6. [Teknik Gereksinimler](#teknik-gereksinimler)
7. [Gizlilik ve Güvenlik](#gizlilik-ve-güvenlik)
8. [MVP Geliştirme Süreci](#mvp-geliştirme-süreci)
9. [Yapıldı ve Yapılacaklar Listesi](#yapıldı-ve-yapılacaklar-listesi)
10. [Rekabet Analizi](#rekabet-analizi)
11. [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

## Giriş
"Seninle" uygulaması, yapay zeka destekli bir yaşam koçu ve günlük terapist olarak kullanıcılara duygusal destek, kişisel gelişim fırsatları ve zihinsel sağlık rehberliği sunan bir web uygulamasıdır. Uygulama, kullanıcıların düşüncelerini yazabilecekleri veya sesli olarak paylaşabilecekleri güvenli bir alan sağlayarak, yapay zeka aracılığıyla kişiselleştirilmiş geri bildirimler, duygusal analizler ve zihinsel sağlık önerileri sunar.

## Ürün Vizyonu
"Seninle" uygulaması, profesyonel terapi hizmetlerine erişimi olmayan veya günlük duygusal desteğe ihtiyaç duyan herkes için erişilebilir bir zihinsel sağlık yardımcısı olmayı hedeflemektedir. Yapay zeka teknolojisiyle güçlendirilmiş uygulama, kullanıcıların duygusal durumlarını anlamalarına, kendilerini daha iyi tanımalarına ve zihinsel sağlıklarını iyileştirmelerine yardımcı olacaktır.

## Kullanıcı Hedef Kitlesi
- Günlük yazma alışkanlığı olan veya edinmek isteyen kişiler
- Kendini daha iyi tanımak ve anlamak isteyenler
- Duygusal destek arayan ancak profesyonel terapi hizmetlerine erişimi kısıtlı olanlar
- Kişisel gelişim ve farkındalık konusunda ilerleme kaydetmek isteyenler
- 18-45 yaş arası, teknoloji kullanımına açık kullanıcılar

## Ana Özellikler

### 1. Günlük Yazma Alanı
- Minimalist, huzur veren kullanıcı arayüzü
- Karanlık ve aydınlık mod seçenekleri
- Sınırsız metin girişi imkanı
- Otomatik kaydetme özelliği
- Tarih ve zaman damgası

### 2. Duygu Analizi ve Özet
- Yapay zeka tarafından yazının duygusal analizi
- Duygu etiketleri (örn: stresli, umutlu, endişeli)
- Duyguların yüzdesel dağılımı ve görsel grafikleri
- Günlük yazının özeti ve ana temaların belirlenmesi

### 3. Yapay Zeka Koçundan Yorumlar ve Destekleyici Mesajlar
- Kullanıcının duygusal durumuna göre kişiselleştirilmiş geri bildirimler
- Motivasyon sağlayan ve destekleyici mesajlar
- Farklı koç karakterleri seçme imkanı (şefkatli, disiplinli, mizahi, spiritüel)
- Kullanıcının tercihine göre mizahi veya ciddi tonlar

### 4. Farkındalık Egzersizleri ve Öneriler
- Duygusal duruma özel meditasyon önerileri
- Nefes egzersizleri
- Günlük mini görevler ve meydan okumalar
- Tamamlanan egzersizlerin takibi

### 5. Kişisel Gelişim Takibi
- Zaman içindeki duygusal değişimleri gösteren grafikler (haftalık, aylık, yıllık)
- Sık kullanılan kelimeler ve temaların takibi
- İlerleme raporu ve içgörüler
- Alışkanlık oluşturma ve sürdürme desteği

### 6. Sesli "Günlük Sohbet" Modu
- Mikrofonla konuşarak ses kayıtlarını metne dönüştürme
- Konuşma temelli duygu analizi
- Sesli yanıt seçeneği

### 7. Anlık Destek Modu
- Acil durumlarda hızlı duygusal destek
- Sakinleştirici egzersizler ve teknikler
- Kriz anlarında yönlendirme

## Kullanıcı Yolculuğu

### 1. Giriş / Kayıt
- Google ile hızlı giriş
- E-posta ile Magic Link (şifresiz giriş)
- Gizlilik ve güven vurgusu
- Kısa bir karşılama turu

### 2. Günlük Yazma Deneyimi
- Tarih bilgisinin otomatik eklenmesi
- "Bugün nasıl hissediyorsun?" şeklinde başlangıç cümlesi
- Sade ve dikkat dağıtmayan yazma arayüzü
- Yazıyı kaydetme ve paylaşma seçenekleri

### 3. Duygu Analizi ve Geri Bildirim
- Yazı tamamlandıktan sonra duygu analizi sonuçlarının gösterilmesi
- Duygu dağılımı grafiği 
- Seçilen yapay zeka koçundan kişiselleştirilmiş yorumlar
- Günün motivasyon cümlesi veya alıntısı

### 4. Kişiselleştirilmiş Egzersiz Önerisi
- Duygusal duruma göre uyarlanmış farkındalık egzersizi
- Egzersizi "Yaptım" olarak işaretleme imkanı
- Egzersiz kütüphanesine erişim

### 5. İlerleme Takibi ve Geçmiş Kayıtlar
- Takvim görünümü (renkli duygusal durum göstergeleriyle)
- Geçmiş günlük yazılarına erişim
- Zaman içindeki değişim grafikleri ve içgörüler

## Teknik Gereksinimler

### Frontend
- React veya Vue.js ile modern bir SPA (Single Page Application)
- Responsive tasarım (mobil, tablet ve masaüstü uyumluluğu)
- Progressive Web App (PWA) özellikleri
- Offline kullanım imkanı

### Backend
- Node.js veya Python tabanlı API
- GPT-3/GPT-4 veya benzer NLP modelleri entegrasyonu
- MongoDB veya PostgreSQL veritabanı
- JWT tabanlı kimlik doğrulama

### AI ve Veri İşleme
- Duygu analizi modelleri
- Metin özetleme algoritmaları
- Metin-konuşma ve konuşma-metin dönüştürme hizmetleri
- Kişiselleştirilmiş içerik önerme algoritmaları

## Gizlilik ve Güvenlik
- Uçtan uca şifreleme
- GDPR ve KVKK uyumluluğu
- Kullanıcı verilerinin yerel depolama seçeneği
- İsteğe bağlı bulut yedekleme
- Veri silme ve dışa aktarma hakları
- İki faktörlü kimlik doğrulama

## MVP Geliştirme Süreci
MVP (Minimum Viable Product) aşağıdaki temel özellikleri içerecektir:

1. Temel kullanıcı kimlik doğrulama sistemi
2. Günlük yazma alanı
3. Basit duygu analizi ve özet
4. Yapay zeka koçundan temel yorumlar
5. Basit farkındalık egzersizi önerileri
6. Geçmiş günlükleri görüntüleme

Geliştirme süreci 3 aylık bir zaman diliminde tamamlanacak şekilde planlanmıştır:

- Ay 1: UI/UX tasarımı ve frontend geliştirme
- Ay 2: Backend ve AI entegrasyonu
- Ay 3: Test, hata ayıklama ve lansman hazırlıkları

## Yapıldı ve Yapılacaklar Listesi

### Yapıldı ✅
- Ürün fikrinin tanımlanması ve kapsamı
- Kullanıcı personalarının oluşturulması
- Ana özelliklerin belirlenmesi
- MVP kapsamının tanımlanması
- PRD dokümanının hazırlanması

### Yapılacaklar 📋
- [ ] Wireframe ve UI/UX tasarımların hazırlanması
- [ ] Teknoloji yığını seçimi
- [ ] Veritabanı şemasının oluşturulması
- [ ] Kullanıcı kimlik doğrulama sisteminin geliştirilmesi
- [ ] Günlük yazma arayüzünün geliştirilmesi
- [ ] Duygu analizi modelinin entegrasyonu
- [ ] Koç yorumları için AI modelinin entegrasyonu
- [ ] Farkındalık egzersizi önerileri veritabanının oluşturulması
- [ ] İlerleme takibi ve grafikler için analitik modülünün geliştirilmesi
- [ ] Sesli günlük özelliğinin geliştirilmesi
- [ ] Test senaryolarının oluşturulması ve uygulanması
- [ ] Alpha ve beta testlerinin gerçekleştirilmesi
- [ ] Kullanıcı geri bildirimleri doğrultusunda iyileştirmeler
- [ ] MVP lansmanı
- [ ] Pazarlama ve kullanıcı edinme stratejilerinin uygulanması

## Rekabet Analizi
"Seninle" uygulaması pazardaki diğer zihinsel sağlık ve günlük uygulamalarından şu yönleriyle farklılaşmaktadır:

1. AI destekli kişiselleştirilmiş koçluk yaklaşımı
2. Farklı koç karakterleri seçme imkanı
3. Kapsamlı duygu analizi ve görselleştirme
4. Sesli günlük tutma seçeneği
5. Acil durum desteği
6. Yüksek düzeyde veri gizliliği ve güvenliği

## Gelecek Geliştirmeler
MVP sonrası planlanan geliştirmeler şunlardır:

1. Topluluk özellikleri (anonim paylaşım seçeneği ile)
2. Profesyonel terapistlerle bağlantı kurma imkanı
3. Premium abonelik modeli ve ek özellikler
4. Mobil uygulama versiyonu (iOS ve Android)
5. Akıllı saat ve giyilebilir cihaz entegrasyonları
6. Grup terapisi ve destek grupları
7. Uzmanlaşmış modüller (anksiyete, depresyon, stres yönetimi vb.)
8. Çoklu dil desteği 