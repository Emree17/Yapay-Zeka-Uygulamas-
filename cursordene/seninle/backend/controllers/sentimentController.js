const { NlpManager } = require('node-nlp');
const { SentimentAnalyzer } = require('natural');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Journal = require('../models/Journal');

// NLP Manager kurulumu
const manager = new NlpManager({ languages: ['tr'] });

// Sentiment Analyzer kurulumu
const analyzer = new SentimentAnalyzer('tr', 'afinn');

/**
 * Metin içeriğinin duygu analizini yapar
 * @route POST /api/sentiment/analyze
 * @access Private
 */
exports.analyzeSentiment = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return next(new AppError('Analiz için metin gereklidir', 400));
  }

  try {
    // 1. Temel duygu analizi (pozitif/negatif)
    const sentiment = analyzer.getSentiment(text.split(' '));
    
    // 2. Daha detaylı duygu analizi
    await manager.train();
    const nlpResult = await manager.process('tr', text);
    
    // 3. Özel duygu kategorileri belirle
    const emotions = determineEmotions(text, sentiment, nlpResult);
    
    // 4. AI koç cevabı oluştur
    const coachResponse = generateCoachResponse(emotions, text);
    
    // 5. Öneriler oluştur
    const recommendations = generateRecommendations(emotions);
    
    // 6. Sonucu döndür
    res.status(200).json({
      status: 'success',
      data: {
        sentiment: sentiment,
        emotions: emotions,
        summary: generateSummary(emotions, text),
        coachResponse: coachResponse,
        recommendations: recommendations
      }
    });
    
    // 7. Analiz sonuçlarını veritabanına kaydet
    if (req.body.journalId) {
      await Journal.findByIdAndUpdate(req.body.journalId, {
        sentiment: sentiment,
        emotions: emotions,
        analysis: {
          summary: generateSummary(emotions, text),
          coachResponse: coachResponse,
          recommendations: recommendations
        }
      });
    }
    
  } catch (error) {
    return next(new AppError('Duygu analizi işlemi sırasında hata oluştu', 500));
  }
});

/**
 * Kullanıcının duygusal trendlerini analiz eder
 * @route GET /api/sentiment/trends
 * @access Private
 */
exports.getEmotionTrends = catchAsync(async (req, res, next) => {
  const timeframe = req.query.timeframe || 'week'; // week, month, year
  
  // Kullanıcının günlüklerini zaman dilimine göre al
  const journals = await Journal.find({
    user: req.user.id,
    createdAt: getTimeframeQuery(timeframe)
  }).select('sentiment emotions createdAt');
  
  if (!journals.length) {
    return next(new AppError('Belirtilen zaman diliminde günlük bulunamadı', 404));
  }
  
  // Duygusal trendleri hesapla
  const trends = calculateEmotionTrends(journals, timeframe);
  
  res.status(200).json({
    status: 'success',
    data: {
      trends
    }
  });
});

// YARDIMCI FONKSİYONLAR

/**
 * Metin ve NLP sonuçlarına göre duygu kategorilerini belirler
 */
function determineEmotions(text, sentimentScore, nlpResult) {
  const emotions = {
    happy: 0,
    sad: 0,
    anxious: 0,
    calm: 0,
    angry: 0,
    hopeful: 0
  };
  
  // Pozitif skorlar mutluluk ve umut duygularını artırır
  if (sentimentScore > 0) {
    emotions.happy = Math.min(sentimentScore * 20, 100);
    emotions.hopeful = Math.min(sentimentScore * 15, 80);
  } 
  // Negatif skorlar üzüntü ve öfke duygularını artırır
  else if (sentimentScore < 0) {
    emotions.sad = Math.min(Math.abs(sentimentScore) * 20, 100);
    emotions.angry = Math.min(Math.abs(sentimentScore) * 15, 80);
  }
  
  // Anahtar kelimelere dayalı analiz
  const anxietyWords = ['endişe', 'korku', 'stres', 'kaygı', 'panik'];
  const calmWords = ['sakin', 'huzur', 'barış', 'dingin', 'rahat'];
  
  // Metin içinde belirli duygu kelimeleri ara
  let anxietyCount = 0;
  let calmCount = 0;
  
  const words = text.toLowerCase().split(/\s+/);
  words.forEach(word => {
    if (anxietyWords.some(anxWord => word.includes(anxWord))) {
      anxietyCount++;
    }
    if (calmWords.some(calmWord => word.includes(calmWord))) {
      calmCount++;
    }
  });
  
  // Endişe skorunu hesapla
  emotions.anxious = Math.min((anxietyCount / words.length) * 100 * 5, 100);
  
  // Sakinlik skorunu hesapla
  emotions.calm = Math.min((calmCount / words.length) * 100 * 5, 100);
  
  // Değerleri normalleştir
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  if (total > 0) {
    Object.keys(emotions).forEach(key => {
      emotions[key] = Math.round((emotions[key] / total) * 100);
    });
  }
  
  return emotions;
}

/**
 * Duygu durumuna göre koç cevabı oluşturur
 */
function generateCoachResponse(emotions, text) {
  // En yüksek duygu durumunu bul
  const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
    emotions[a] > emotions[b] ? a : b
  );
  
  // Duygu durumuna göre kişiselleştirilmiş yanıtlar
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
 * Duygu durumuna göre öneriler oluşturur
 */
function generateRecommendations(emotions) {
  // En yüksek duygu durumunu bul
  const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
    emotions[a] > emotions[b] ? a : b
  );
  
  // Duygu durumuna göre kişiselleştirilmiş öneriler
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
 * Duygu analizi sonuçlarına göre günlük özeti oluşturur
 */
function generateSummary(emotions, text) {
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
  
  // Temel metin uzunluğu analizi
  const wordCount = text.split(/\s+/).length;
  let lengthComment = "";
  
  if (wordCount < 20) {
    lengthComment = "Kısa notlar tutuyorsun. ";
  } else if (wordCount > 100) {
    lengthComment = "Detaylı düşüncelerini paylaşıyorsun. ";
  }
  
  // Ana duyguları yansıtan bir özet oluştur
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
 * Belirtilen zaman dilimine göre sorgu parametresi oluşturur
 */
function getTimeframeQuery(timeframe) {
  const now = new Date();
  
  switch (timeframe) {
    case 'week':
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return { $gte: weekAgo };
    
    case 'month':
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return { $gte: monthAgo };
    
    case 'year':
      const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      return { $gte: yearAgo };
    
    default:
      const defaultTime = new Date(now.setDate(now.getDate() - 7));
      return { $gte: defaultTime };
  }
}

/**
 * Günlüklerdeki duygu verilerine göre trendleri hesaplar
 */
function calculateEmotionTrends(journals, timeframe) {
  // Zaman dilimini parçalara ayır
  const timePoints = [];
  let format = '';
  
  switch (timeframe) {
    case 'week':
      format = 'gün';
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        timePoints.push(date);
      }
      break;
    
    case 'month':
      format = 'hafta';
      for (let i = 4; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        timePoints.push(date);
      }
      break;
    
    case 'year':
      format = 'ay';
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        timePoints.push(date);
      }
      break;
  }
  
  // Her zaman noktası için duygu ortalamalarını hesapla
  const trends = timePoints.map((point, index) => {
    let nextPoint = null;
    
    if (index < timePoints.length - 1) {
      nextPoint = timePoints[index + 1];
    } else {
      nextPoint = new Date();
    }
    
    // Bu zaman aralığındaki günlükleri filtrele
    const periodJournals = journals.filter(journal => {
      const journalDate = new Date(journal.createdAt);
      return journalDate >= point && journalDate < nextPoint;
    });
    
    // Duygu ortalamalarını hesapla
    const averageEmotions = calculateAverageEmotions(periodJournals);
    
    // Tarih formatını ayarla
    let label = '';
    if (format === 'gün') {
      label = point.toLocaleDateString('tr-TR', { weekday: 'short' });
    } else if (format === 'hafta') {
      label = `Hafta ${index + 1}`;
    } else {
      label = point.toLocaleDateString('tr-TR', { month: 'short' });
    }
    
    return {
      label,
      emotions: averageEmotions
    };
  });
  
  return trends;
}

/**
 * Bir grup günlük için ortalama duygu değerlerini hesaplar
 */
function calculateAverageEmotions(journals) {
  if (!journals.length) {
    return {
      happy: 0,
      sad: 0,
      anxious: 0,
      calm: 0,
      angry: 0,
      hopeful: 0
    };
  }
  
  const emotionSums = {
    happy: 0,
    sad: 0,
    anxious: 0,
    calm: 0,
    angry: 0,
    hopeful: 0
  };
  
  journals.forEach(journal => {
    Object.keys(emotionSums).forEach(emotion => {
      emotionSums[emotion] += journal.emotions[emotion] || 0;
    });
  });
  
  // Ortalamaları hesapla
  Object.keys(emotionSums).forEach(emotion => {
    emotionSums[emotion] = Math.round(emotionSums[emotion] / journals.length);
  });
  
  return emotionSums;
}

module.exports = exports; 