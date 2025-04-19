# Seninle - AI Yaşam Koçu ve Günlük Terapist

"Seninle", yapay zeka destekli bir yaşam koçu ve günlük terapist uygulamasıdır. Kullanıcıların duygusal durumlarını anlamalarına, kendilerini daha iyi tanımalarına ve zihinsel sağlıklarını iyileştirmelerine yardımcı olur.

## Proje Hakkında

Bu proje, PRD.md dosyasında detaylandırılan ürün gereksinimleri doğrultusunda geliştirilmiştir. Modern web teknolojileri kullanılarak oluşturulmuş, duyarlı bir kullanıcı arayüzüne sahiptir.

## Özellikler

- **Günlük Yazma Alanı**: Kullanıcıların düşüncelerini ve duygularını paylaşabilecekleri minimal ve huzurlu bir yazma arayüzü.
- **Duygu Analizi**: Yapay zeka tarafından yazıların duygusal analizi ve görsel grafiklerle sunumu.
- **AI Koç Yorumları**: Kullanıcının duygusal durumuna göre kişiselleştirilmiş ve destekleyici geri bildirimler.
- **Farkındalık Egzersizleri**: Duygusal duruma özel meditasyon önerileri ve nefes egzersizleri.
- **Kişisel Gelişim Takibi**: Zaman içindeki duygusal değişimleri gösteren grafikler ve analizler.
- **Sesli Günlük Modu**: Konuşarak duygularını ifade edebilme özelliği.
- **Farklı Koç Seçenekleri**: Şefkatli, disiplinli, mizahi, spiritüel farklı karakterlerde koçlar.

## Proje Yapısı

```
seninle/
├── css/               # CSS stil dosyaları
│   ├── styles.css     # Ana stil dosyası
│   └── journal.css    # Günlük sayfası için stil dosyası
├── js/                # JavaScript dosyaları
│   ├── main.js        # Ana JavaScript dosyası
│   └── journal.js     # Günlük sayfası için JavaScript
├── images/            # Görsel dosyaları
├── index.html         # Ana sayfa
├── journal.html       # Günlük yazma sayfası
└── README.md          # Bu dosya
```

## Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için:

1. Bu repoyu klonlayın:
   ```
   git clone [repo-url]
   ```

2. Proje klasörüne gidin:
   ```
   cd seninle
   ```

3. Bir web sunucusu kullanarak projeyi çalıştırın. Örneğin, Python kullanarak:
   ```
   python -m http.server 8000
   ```

4. Tarayıcınızda `http://localhost:8000` adresini açın.

## Teknolojiler

- HTML5
- CSS3 (Responsive Design)
- JavaScript (ES6+)
- Web Speech API (Sesli Günlük için)
- LocalStorage (Veri Saklama)

## Gelecek Geliştirmeler

- Backend entegrasyonu ve gerçek bir API bağlantısı
- Daha gelişmiş duygu analizi algoritmaları
- Mobil uygulama versiyonu
- Gerçek zamanlı koçluk seansları
- Topluluk özellikleri ve grup terapisi
- Profesyonel terapistlerle bağlantı kurma imkanı

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## İletişim

Herhangi bir soru veya geri bildirim için lütfen [info@seninle.com](mailto:info@seninle.com) adresine e-posta gönderin. 