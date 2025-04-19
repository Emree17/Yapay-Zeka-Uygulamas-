/**
 * Duygu Analizi Servisi
 * Günlük içeriğini API'ye gönderir ve sonuçları alır
 */
class SentimentService {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api';
    // AuthService'ten token bilgisini al
    this.token = localStorage.getItem('token');
  }

  /**
   * API için header oluştur
   */
  getHeaders() {
    // AuthService'ten güncel token'ı al
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Token güncelle (kullanıcı giriş yaptığında)
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Metin gönder ve analiz et
   * @param {string} text - Analiz edilecek metin
   * @param {string} journalId - Günlük ID (opsiyonel)
   * @returns {Promise} Analiz sonuçları
   */
  async analyzeText(text, journalId = null) {
    try {
      // Token kontrolü
      if (!this.token) {
        console.warn('Token bulunamadı, giriş yapılmamış olabilir');
        return this.getMockAnalysis(text);
      }

      const response = await fetch(`${this.baseUrl}/sentiment/analyze`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          text,
          journalId
        })
      });

      // 401 hatası durumunda token yenile
      if (response.status === 401) {
        try {
          // Token yenileme başarısız olursa mock veriler kullan
          await authService.refreshAccessToken();
          // Yeni token ile tekrar dene
          return this.analyzeText(text, journalId);
        } catch (refreshError) {
          console.error('Token yenileme hatası:', refreshError);
          return this.getMockAnalysis(text);
        }
      }

      if (!response.ok) {
        throw new Error('Analiz isteği başarısız oldu');
      }

      const data = await response.json();
      
      if (!data || !data.data) {
        console.warn('API yanıtı geçersiz, mock veriler kullanılıyor');
        return this.getMockAnalysis(text);
      }
      
      return data.data;
    } catch (error) {
      console.error('Duygu analizi hatası:', error);
      // API hatası durumunda mock veriler kullanılır
      return this.getMockAnalysis(text);
    }
  }

  /**
   * Duygusal trendleri getir
   * @param {string} timeframe - Zaman aralığı (week, month, year)
   * @returns {Promise} Trend verileri
   */
  async getEmotionTrends(timeframe = 'week') {
    try {
      // Token kontrolü
      if (!this.token) {
        console.warn('Token bulunamadı, giriş yapılmamış olabilir');
        return this.getMockTrends(timeframe);
      }

      const response = await fetch(`${this.baseUrl}/sentiment/trends?timeframe=${timeframe}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      // 401 hatası durumunda token yenile
      if (response.status === 401) {
        try {
          await authService.refreshAccessToken();
          // Yeni token ile tekrar dene
          return this.getEmotionTrends(timeframe);
        } catch (refreshError) {
          console.error('Token yenileme hatası:', refreshError);
          return this.getMockTrends(timeframe);
        }
      }

      if (!response.ok) {
        throw new Error('Trend verileri alınamadı');
      }

      const data = await response.json();
      
      if (!data || !data.data) {
        console.warn('API yanıtı geçersiz, mock veriler kullanılıyor');
        return this.getMockTrends(timeframe);
      }
      
      return data.data.trends;
    } catch (error) {
      console.error('Trend verileri alma hatası:', error);
      // API hatası durumunda mock veriler kullanılır
      return this.getMockTrends(timeframe);
    }
  }

  /**
   * Mock analiz sonuçları oluştur (API hazır değilse)
   * @param {string} text - Analiz edilecek metin
   * @returns {Object} Mock analiz sonuçları
   */
  getMockAnalysis(text) {
    // Metin içeriğine göre basit bir analiz
    let mockSentiment = 0;
    const lowerText = text.toLowerCase();
    
    // Pozitif kelimeler
    const positiveWords = ['mutlu', 'güzel', 'harika', 'sevgi', 'keyif', 'başarı', 'huzur'];
    // Negatif kelimeler
    const negativeWords = ['üzgün', 'kötü', 'stres', 'endişe', 'korku', 'mutsuz', 'öfke'];
    
    // Kelime sayılarını hesapla
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        positiveCount += matches.length;
      }
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        negativeCount += matches.length;
      }
    });
    
    // Sentiment skorunu belirle
    mockSentiment = (positiveCount - negativeCount) / (positiveCount + negativeCount + 1);
    
    // Duygu dağılımını belirle
    const emotions = {
      happy: 0,
      sad: 0,
      anxious: 0,
      calm: 0,
      angry: 0,
      hopeful: 0
    };
    
    // Pozitif skor yüksekse mutluluk ve umut duygularını artır
    if (mockSentiment > 0) {
      emotions.happy = Math.min(Math.round(positiveCount * 15), 70);
      emotions.hopeful = Math.min(Math.round(positiveCount * 10), 50);
      emotions.calm = Math.max(30 - negativeCount * 5, 0);
    } 
    // Negatif skor yüksekse üzüntü, endişe ve öfke duygularını artır
    else if (mockSentiment < 0) {
      emotions.sad = Math.min(Math.round(negativeCount * 15), 70);
      emotions.anxious = Math.min(Math.round(negativeCount * 10), 60);
      emotions.angry = Math.min(Math.round(negativeCount * 5), 40);
    }
    
    // Değerleri normalleştir
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(emotions).forEach(key => {
        emotions[key] = Math.round((emotions[key] / total) * 100);
      });
    } else {
      // Varsayılan değerler
      emotions.happy = 25;
      emotions.anxious = 40;
      emotions.sad = 10;
      emotions.calm = 20;
      emotions.angry = 5;
    }
    
    // Demo özet ve koç yanıtı oluştur
    const summary = this.generateMockSummary(emotions, text);
    const coachResponse = this.generateMockCoachResponse(emotions);
    const recommendations = this.generateMockRecommendations(emotions);
    
    return {
      emotions: emotions,
      sentiment: mockSentiment,
      summary: summary,
      coachResponse: coachResponse,
      recommendations: recommendations
    };
  }

  /**
   * Mock özet oluştur
   */
  generateMockSummary(emotions, text) {
    const sortedEmotions = Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])
      .filter(([, value]) => value > 0)
      .slice(0, 2);
    
    if (sortedEmotions.length === 0) {
      return "Duygularını analiz edemedik. Lütfen daha uzun bir metin yaz.";
    }
    
    const emotionNames = {
      happy: "mutlu",
      sad: "üzgün",
      anxious: "endişeli",
      calm: "sakin",
      angry: "öfkeli",
      hopeful: "umutlu"
    };
    
    // Metin uzunluğu analizi
    const wordCount = text.split(/\s+/).length;
    let lengthComment = "";
    
    if (wordCount < 20) {
      lengthComment = "Kısa notlar tutuyorsun. ";
    } else if (wordCount > 100) {
      lengthComment = "Detaylı düşüncelerini paylaşıyorsun. ";
    }
    
    // Ana duyguları yansıtan özet
    if (sortedEmotions.length === 1) {
      const [emotion, value] = sortedEmotions[0];
      return `${lengthComment}Bugün ağırlıklı olarak ${emotionNames[emotion]} hissediyorsun.`;
    } else {
      const [emotion1, value1] = sortedEmotions[0];
      const [emotion2, value2] = sortedEmotions[1];
      
      return `${lengthComment}Bugün ${emotionNames[emotion1]} ve biraz da ${emotionNames[emotion2]} hissediyorsun.`;
    }
  }

  /**
   * Mock koç yanıtı oluştur
   */
  generateMockCoachResponse(emotions) {
    // En yüksek duygu
    const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
      emotions[a] > emotions[b] ? a : b
    );
    
    // Duyguya göre yanıt seçenekleri
    const responses = {
      happy: [
        "Mutlu olduğunu görmek harika! Bu pozitif enerjiyi günün geri kalanında da sürdürmeye çalış.",
        "Mutluluğun çok değerli. Bugün seni mutlu eden şeyleri not etmek, ileride zor günlerde sana ilham verebilir."
      ],
      sad: [
        "Üzgün hissetmen tamamen normal. Duygularını bastırmak yerine onları kabul etmen çok değerli.",
        "Bugün zor bir gün geçirdiğini görüyorum. Kendine nazik davranmayı ve küçük şeylerden keyif almayı dene."
      ],
      anxious: [
        "Endişeli görünüyorsun. Derin nefes alıp vermeye çalış ve anın içinde kalmaya odaklan.",
        "Kaygılarının seni zorladığını görüyorum. Bugün kendine küçük bir mola vermek iyi gelebilir."
      ],
      calm: [
        "Sakin ve dengeli bir ruh halinde olman harika. Bu huzurlu anın tadını çıkar.",
        "İç huzurunu koruduğunu görmek çok güzel. Bu dengeyi sürdürebilmek için neler yaptığını düşün."
      ],
      angry: [
        "Öfkeni hissetmende hiçbir sorun yok. Bu duyguyu bir enerji olarak yapıcı bir kanala yönlendirmeyi dene.",
        "Sinirli olduğunu görüyorum. Duygularını ifade etmek için sağlıklı bir yol bulmak önemli."
      ],
      hopeful: [
        "Umutlu oluşun geleceğe dair olumlu bir bakış açısına sahip olduğunu gösteriyor. Bu enerjiyle neler yapabileceğini düşün.",
        "İçindeki umut ışığını görmek harika. Bu pozitif enerjiyi yeni projelere yönlendirmeyi düşünebilirsin."
      ]
    };
    
    // Rastgele bir yanıt seç
    const responseArray = responses[dominantEmotion];
    const randomIndex = Math.floor(Math.random() * responseArray.length);
    
    return responseArray[randomIndex];
  }

  /**
   * Mock öneriler oluştur
   */
  generateMockRecommendations(emotions) {
    // En yüksek duygu
    const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
      emotions[a] > emotions[b] ? a : b
    );
    
    // Duyguya göre öneriler
    const recommendations = {
      happy: {
        exercise: "Mutlu enerjini dans ederek veya sevdiğin bir sporla pekiştir.",
        mindfulness: "Şükran günlüğü tutarak, bugün seni mutlu eden 3 şeyi not et."
      },
      sad: {
        exercise: "Hafif bir yürüyüş yapmak ruh halini iyileştirebilir.",
        mindfulness: "5 dakikalık bir nefes meditasyonu, zihnini sakinleştirebilir."
      },
      anxious: {
        exercise: "4-7-8 nefes tekniğini dene: 4 saniye nefes al, 7 saniye tut, 8 saniye ver.",
        mindfulness: "Şu an etrafında gördüğün 5 şey, duyduğun 4 şey, dokunduğun 3 şey, kokladığın 2 şey ve tadını aldığın 1 şeyi fark et."
      },
      calm: {
        exercise: "Bu sakin ruh halinde yoga veya tai chi gibi bir aktivite deneyimleyebilirsin.",
        mindfulness: "Günün geri kalanında bu huzurlu anı hatırlamak için bir hatırlatıcı belirle."
      },
      angry: {
        exercise: "Fiziksel aktivite öfkeni sağlıklı bir şekilde dışa vurmana yardımcı olabilir.",
        mindfulness: "Duygularını yargılamadan gözlemleyerek bir nefes meditasyonu yap."
      },
      hopeful: {
        exercise: "Bu pozitif enerjiyi yaratıcı bir aktiviteye yönlendir.",
        mindfulness: "Gelecek için bir dilek panosu oluştur, umutlarını ve hayallerini görselleştir."
      }
    };
    
    return recommendations[dominantEmotion];
  }

  /**
   * Mock trend verileri oluştur
   */
  getMockTrends(timeframe) {
    const trends = [];
    let labels = [];
    
    // Zaman dilimlerine göre etiketler oluştur
    switch (timeframe) {
      case 'week':
        labels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        break;
      case 'month':
        labels = ['Hafta 1', 'Hafta 2', 'Hafta 3', 'Hafta 4'];
        break;
      case 'year':
        labels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        break;
    }
    
    // Her zaman dilimi için duygu değerleri oluştur
    labels.forEach(label => {
      // Rastgele duygu değerleri oluştur, toplam 100 olacak şekilde
      const happy = Math.floor(Math.random() * 40) + 10;
      const sad = Math.floor(Math.random() * 20);
      const anxious = Math.floor(Math.random() * 30);
      const calm = Math.floor(Math.random() * 30);
      const angry = Math.floor(Math.random() * 15);
      const hopeful = 100 - (happy + sad + anxious + calm + angry);
      
      trends.push({
        label,
        emotions: {
          happy,
          sad,
          anxious,
          calm,
          angry,
          hopeful
        }
      });
    });
    
    return trends;
  }
}

// Global SentimentService örneği oluştur
if (typeof window !== 'undefined' && !window.sentimentService) {
  try {
    console.log('sentimentService global örneği oluşturuluyor...');
    window.sentimentService = new SentimentService();
    console.log('sentimentService global örneği başarıyla oluşturuldu');
  } catch (error) {
    console.error('sentimentService oluşturulurken hata:', error);
  }
} 