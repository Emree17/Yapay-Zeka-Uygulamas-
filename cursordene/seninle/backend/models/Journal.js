const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    trim: true,
    default: function() {
      const today = new Date();
      return today.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  },
  content: {
    type: String,
    required: [true, 'Günlük içeriği gereklidir'],
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  tags: [String],
  // Duygu analizi verileri
  sentiment: {
    type: Number,
    default: 0 // -1 ile 1 arasında değer (negatif, nötr, pozitif)
  },
  emotions: {
    happy: {
      type: Number,
      default: 0
    },
    sad: {
      type: Number,
      default: 0
    },
    anxious: {
      type: Number,
      default: 0
    },
    calm: {
      type: Number,
      default: 0
    },
    angry: {
      type: Number,
      default: 0
    },
    hopeful: {
      type: Number,
      default: 0
    }
  },
  analysis: {
    summary: String,
    coachResponse: String,
    recommendations: {
      exercise: String,
      mindfulness: String
    }
  },
  // AI Koç bilgileri
  coachType: {
    type: String,
    enum: ['supportive', 'motivational', 'analytical', 'spiritual'],
    default: 'supportive'
  },
  // İstatistikler
  wordCount: {
    type: Number,
    default: function() {
      if (this.content) {
        return this.content.split(/\s+/).length;
      }
      return 0;
    }
  },
  // Ses kayıt yolu (sesli günlük için)
  audioUrl: String,
  // İlişkili egzersizler
  completedExercises: [{
    type: {
      type: String,
      enum: ['breathing', 'meditation', 'gratitude', 'reflection'],
      required: true
    },
    notes: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dominant duygu hesaplama
journalSchema.virtual('dominantEmotion').get(function() {
  if (!this.emotions) return null;
  
  let maxEmotion = null;
  let maxValue = -1;
  
  Object.keys(this.emotions).forEach(emotion => {
    if (this.emotions[emotion] > maxValue) {
      maxValue = this.emotions[emotion];
      maxEmotion = emotion;
    }
  });
  
  return maxEmotion;
});

// Günlüğün özet başlığını oluştur
journalSchema.virtual('summaryTitle').get(function() {
  if (!this.content) return '';
  
  // İlk 50 karakteri al, boşlukta kes ve '...' ekle
  const shortContent = this.content.slice(0, 50);
  const endIndex = shortContent.lastIndexOf(' ');
  
  if (endIndex === -1) {
    return shortContent + (this.content.length > 50 ? '...' : '');
  }
  
  return shortContent.slice(0, endIndex) + (this.content.length > 50 ? '...' : '');
});

// İçeriğe göre otomatik etiketler oluştur
journalSchema.pre('save', function(next) {
  // Eğer etiketler zaten varsa veya içerik yoksa işlemi atla
  if (this.tags.length > 0 || !this.content) {
    return next();
  }
  
  // Sık kullanılan kelimeler için etiket oluştur
  const commonTags = {
    'aile': ['aile', 'anne', 'baba', 'kardeş', 'ebeveyn'],
    'iş': ['iş', 'çalışma', 'proje', 'toplantı', 'patron', 'müdür', 'mesai'],
    'okul': ['okul', 'ders', 'sınav', 'ödev', 'hoca', 'öğretmen', 'öğrenci'],
    'sağlık': ['sağlık', 'hastalık', 'doktor', 'hastane', 'ilaç', 'egzersiz'],
    'ilişki': ['ilişki', 'sevgili', 'aşk', 'evlilik', 'eş', 'partner'],
    'stres': ['stres', 'endişe', 'kaygı', 'gergin', 'baskı', 'zorluk'],
    'mutluluk': ['mutlu', 'neşe', 'keyif', 'sevinç', 'huzur', 'tatmin']
  };
  
  const content = this.content.toLowerCase();
  const newTags = [];
  
  Object.keys(commonTags).forEach(tag => {
    const keywords = commonTags[tag];
    if (keywords.some(keyword => content.includes(keyword))) {
      newTags.push(tag);
    }
  });
  
  this.tags = newTags;
  next();
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal; 