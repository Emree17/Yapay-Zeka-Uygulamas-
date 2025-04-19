/**
 * Demo JS - Seninle Demo Sayfası için JavaScript
 * Bu dosya, kullanıcı hesabı gerektirmeden temel demo deneyimini sağlar
 */

// Demo sayfası zamanlayıcı süresi (dakika olarak)
const DEMO_DURATION_MINUTES = 10;

// Demo global nesneleri
let demoTimer = null;
let remainingTime = DEMO_DURATION_MINUTES * 60; // saniye cinsinden
let selectedCoach = 'compassionate'; // varsayılan koç tipi

// Demo servis sınıfı - Sentiment API'yi simüle eder
class DemoSentimentService {
    constructor() {
        console.log('Demo Sentiment servisi oluşturuldu');
    }

    async analyzeText(text) {
        console.log('Demo duygu analizi yapılıyor:', text.substring(0, 30) + '...');
        
        // API çağrısını simüle etmek için 1 saniye beklet
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Basit bir duygu analizi simülasyonu
        const lowercasedText = text.toLowerCase();

        // Pozitif kelimeler
        const positiveWords = ['mutlu', 'sevinç', 'huzur', 'neşe', 'keyif', 'güzel', 'harika', 'başarı'];
        // Negatif kelimeler
        const negativeWords = ['üzgün', 'mutsuz', 'kızgın', 'sinirli', 'endişe', 'kaygı', 'korku', 'stres'];

        // Metin uzunluğu kontrolü
        if (text.length < 20) {
            return this._getDemoResults('short');
        }

        // Kelime eşleşmeleri
        let positiveCount = 0;
        let negativeCount = 0;

        positiveWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            const matches = lowercasedText.match(regex);
            if (matches) {
                positiveCount += matches.length;
            }
        });

        negativeWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            const matches = lowercasedText.match(regex);
            if (matches) {
                negativeCount += matches.length;
            }
        });

        // Sonuçları belirle
        let emotionType;
        if (positiveCount > negativeCount) {
            emotionType = 'positive';
        } else if (negativeCount > positiveCount) {
            emotionType = 'negative';
        } else {
            emotionType = 'neutral';
        }

        return this._getDemoResults(emotionType);
    }

    _getDemoResults(type) {
        // Örnek duygu analizleri
        const results = {
            // Çok kısa metin için
            short: {
                emotions: {
                    happy: 20,
                    anxious: 20,
                    sad: 20,
                    calm: 20,
                    angry: 10,
                    hopeful: 10
                },
                summary: "Daha detaylı bir analiz için biraz daha uzun bir metin yazmalısın.",
                coachResponse: "Düşüncelerini biraz daha detaylandırırsan sana daha iyi geri bildirim verebilirim.",
                recommendations: {
                    exercise: "Düşüncelerini derinleştirmek için 5 dakika sessizce otur ve hislerini dinle.",
                    mindfulness: "Şu an hissettiğin duyguları tanımlamaya çalış."
                }
            },
            // Pozitif duygular için
            positive: {
                emotions: {
                    happy: 40,
                    calm: 25,
                    hopeful: 20,
                    anxious: 5,
                    sad: 5,
                    angry: 5
                },
                summary: "Bugün oldukça olumlu hissediyorsun. Yazından mutluluk ve umut duyguların öne çıkıyor.",
                coachResponse: "Pozitif bakış açını görmek harika! Bu olumlu enerjiyi başka alanlara da yayabilirsin. Kendini ödüllendirmeyi unutma.",
                recommendations: {
                    exercise: "Açık havada 15 dakikalık yürüyüş",
                    mindfulness: "Şükran günlüğü yaz - Bugün için minnettarlık duyduğun 3 şeyi not et."
                }
            },
            // Negatif duygular için
            negative: {
                emotions: {
                    anxious: 35,
                    sad: 25,
                    angry: 15,
                    happy: 10,
                    calm: 10,
                    hopeful: 5
                },
                summary: "Bugün biraz zorlanıyor gibisin. Yazından endişe ve üzüntü duyguların öne çıkıyor.",
                coachResponse: "Zor duygular yaşamak tamamen normal. Kendine nazik davranmayı unutma. Bu duyguları kabul etmek ve ifade etmek, onlarla başa çıkmanın ilk adımıdır.",
                recommendations: {
                    exercise: "5 dakikalık derin nefes egzersizi",
                    mindfulness: "Kendine şefkat meditasyonu - Zorlu duygular yaşarken kendine bir arkadaşına davranır gibi davran."
                }
            },
            // Nötr duygular için
            neutral: {
                emotions: {
                    calm: 30,
                    happy: 20,
                    anxious: 20,
                    sad: 10,
                    hopeful: 15,
                    angry: 5
                },
                summary: "Bugün duygusal olarak dengeli görünüyorsun. Yazında sakinlik duygusu öne çıkıyor.",
                coachResponse: "Dengeli bir ruh halinde olman güzel. Bu anın farkında olarak, şu an için neler yapmak istediğini düşünebilirsin.",
                recommendations: {
                    exercise: "Yaratıcı bir aktivite dene - çizim, boyama veya yazı yazma",
                    mindfulness: "Farkındalık yürüyüşü - çevrende gördüklerine, duyduklarına ve hissettiklerine odaklan."
                }
            }
        };

        return results[type] || results.neutral;
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    console.log('Demo sayfası yüklendi');
    
    // Demo timer'ı 
    initializeDemoTimer();
    
    // Koç seçimi
    setupCoachSelection();
    
    // Giriş modu geçişi (yazma/konuşma)
    setupInputModeToggle();
    
    // Ses kayıt işlemleri
    setupVoiceRecording();
    
    // Analiz butonu
    document.getElementById('analyzeButton').addEventListener('click', analyzeJournal);
    
    // Demo sonu modal işlemleri
    setupDemoEndModal();
});

// Demo süresi için timer başlat (10 dakika)
function initializeDemoTimer() {
    let timeLeft = 10 * 60; // 10 dakika (saniye cinsinden)
    const timerElement = document.getElementById('timer');
    
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showDemoEndModal();
        } else {
            timeLeft--;
        }
    }, 1000);
    
    // Temizleme işlevi döndür
    return () => clearInterval(timerInterval);
}

// Koç seçimi işlemleri
function setupCoachSelection() {
    const coachOptions = document.querySelectorAll('.coach-option');
    const coachAvatar = document.getElementById('coachAvatar');
    
    coachOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Aktif sınıfını mevcut seçiliden kaldır
            document.querySelector('.coach-option.active').classList.remove('active');
            
            // Yeni seçilene aktif sınıfını ekle
            option.classList.add('active');
            
            // Koç avatarını güncelle
            const coachType = option.getAttribute('data-coach');
            coachAvatar.src = `images/coach-${coachType}.png`;
            
            // Koç tipini sessionStorage'a kaydet
            sessionStorage.setItem('selectedCoach', coachType);
        });
    });
}

// Yazma/Konuşma modu geçişi
function setupInputModeToggle() {
    const writeButton = document.getElementById('writeButton');
    const speakButton = document.getElementById('speakButton');
    const writingMode = document.getElementById('writingMode');
    const speakingMode = document.getElementById('speakingMode');
    
    writeButton.addEventListener('click', () => {
        writeButton.classList.add('active');
        speakButton.classList.remove('active');
        writingMode.classList.add('active');
        speakingMode.classList.remove('active');
    });
    
    speakButton.addEventListener('click', () => {
        speakButton.classList.add('active');
        writeButton.classList.remove('active');
        speakingMode.classList.add('active');
        writingMode.classList.remove('active');
        
        // Mikrofon erişimini kontrol et
        checkMicrophoneAccess();
    });
}

// Mikrofon erişimi kontrolü
function checkMicrophoneAccess() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Başarılı, stream'i durdur ve hazır ol
            stream.getTracks().forEach(track => track.stop());
            document.getElementById('recordingStatus').textContent = 'Hazır';
        })
        .catch(error => {
            // Erişim reddedildi veya başka bir hata
            alert('Mikrofon erişimi reddedildi veya bir hata oluştu. Ses kayıt özelliğini kullanmak için lütfen mikrofon iznini verin.');
            // Yazma moduna geri dön
            document.getElementById('writeButton').click();
        });
}

// Ses kayıt işlemleri
function setupVoiceRecording() {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const retryButton = document.getElementById('retryRecording');
    const statusElement = document.getElementById('recordingStatus');
    const timeElement = document.getElementById('recordingTime');
    
    let mediaRecorder;
    let recordedChunks = [];
    let startTime;
    let timerInterval;
    
    // Kaydı başlat
    startButton.addEventListener('click', () => {
        recordedChunks = [];
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) recordedChunks.push(e.data);
                };
                
                mediaRecorder.onstop = () => {
                    // Kayıt tamamlandı, işlem yapılabilir
                    statusElement.textContent = 'Kaydedildi';
                    processAudioRecording();
                };
                
                mediaRecorder.start();
                startTime = Date.now();
                
                // Kayıt süresini takip et
                timerInterval = setInterval(updateRecordingTime, 1000);
                
                // Butonları güncelle
                startButton.disabled = true;
                stopButton.disabled = false;
                retryButton.disabled = true;
                statusElement.textContent = 'Kaydediliyor...';
            })
            .catch(error => {
                alert('Ses kaydı başlatılırken bir hata oluştu: ' + error.message);
            });
    });
    
    // Kaydı durdur
    stopButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            clearInterval(timerInterval);
            
            // Bütün track'leri durdur
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            // Butonları güncelle
            startButton.disabled = false;
            stopButton.disabled = true;
            retryButton.disabled = false;
        }
    });
    
    // Kaydı yeniden dene
    retryButton.addEventListener('click', () => {
        startButton.disabled = false;
        stopButton.disabled = true;
        retryButton.disabled = true;
        statusElement.textContent = 'Hazır';
        timeElement.textContent = '00:00';
    });
    
    // Kayıt süresini güncelle
    function updateRecordingTime() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Ses kaydını işle (demo için sadece simülasyon)
    function processAudioRecording() {
        // Gerçek bir uygulamada, ses kaydını sunucuya gönderip text'e dönüştürme işlemi yapılır
        // Demo için rastgele cümleler kullanacağız
        
        const demoTexts = [
            "Bugün çok güzel bir gün geçirdim. Arkadaşlarımla buluşup kahve içtik ve uzun zamandır konuşamadığımız konular hakkında sohbet ettik.",
            "İş yerinde stresli bir gündü. Üst üste gelen toplantılar ve bitmeyen e-postalar nedeniyle kendimi bunalmış hissediyorum.",
            "Yeni bir hobi edinmeye karar verdim. Belki de resim yapmayı veya müzik aleti çalmayı denemek bana iyi gelecektir.",
            "Bugün kendimi biraz yalnız hissettim. Aile üyelerimle konuşmak istiyorum ama onlar çok meşgul gibiler.",
            "Sabah erken kalkıp koşuya çıktım. Fiziksel aktivite yapmak ruh halimi gerçekten olumlu yönde etkiliyor."
        ];
        
        // Rastgele bir metin seç
        const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
        
        // Metni günlük alanına ekle
        document.getElementById('journalText').value = randomText;
        
        // Yazma moduna geç
        document.getElementById('writeButton').click();
    }
}

// Günlük analizi
function analyzeJournal() {
    const journalText = document.getElementById('journalText').value.trim();
    
    if (!journalText) {
        alert('Lütfen analiz için bir günlük yazısı girin veya ses kaydı yapın.');
        return;
    }
    
    // Analiz sonuçlarını göster (demo için sabit veriler)
    showAnalysisResults();
}

// Analiz sonuçlarını göster
function showAnalysisResults() {
    // Demo için örnek sonuç verileri
    const demoAnalysisData = {
        emotions: {
            mutluluk: Math.random() * 0.5 + 0.2, // 0.2 - 0.7 arası
            üzüntü: Math.random() * 0.3,
            öfke: Math.random() * 0.2,
            korku: Math.random() * 0.2,
            şaşkınlık: Math.random() * 0.2,
            iğrenme: Math.random() * 0.1
        },
        dominantEmotion: 'mutluluk',
        feedback: [
            "Yazınızda pozitif duygular ön planda. Bu olumlu bakış açısı sizi ileriye taşıyacak.",
            "Kendini daha çok ifade etme konusunda iyi bir iş çıkarıyorsun. Duygularını paylaşmaya devam et.",
            "Yaşadığın deneyimlere karşı minnettarlık hissin olumlu bir gelişme işareti."
        ],
        suggestions: [
            "5 dakikalık bir minnettarlık meditasyonu yapın",
            "Sevdiğiniz bir kişiye teşekkür mesajı yazın",
            "Bugün sizi mutlu eden üç şeyi not edin",
            "Kendinize küçük bir ödül verin"
        ]
    };
    
    // Sonuçları göster
    createAnalysisResults(demoAnalysisData);
    
    // Sonuç bölümünü görünür yap
    document.getElementById('analysisResults').style.display = 'block';
    
    // Sayfayı sonuçlara kaydır
    document.getElementById('analysisResults').scrollIntoView({
        behavior: 'smooth'
    });
}

// Analiz sonuçlarını oluştur
function createAnalysisResults(data) {
    // 1. Duygu grafiğini oluştur
    createEmotionsChart(data.emotions);
    
    // 2. Koç geri bildirimini ekle
    const selectedCoach = sessionStorage.getItem('selectedCoach') || 'compassionate';
    document.getElementById('coachAvatar').src = `images/coach-${selectedCoach}.png`;
    
    // Rastgele bir geri bildirim seç
    const randomFeedback = data.feedback[Math.floor(Math.random() * data.feedback.length)];
    document.getElementById('coachFeedback').textContent = randomFeedback;
    
    // 3. Aktivite önerilerini ekle
    const suggestionsContainer = document.getElementById('actionSuggestions');
    suggestionsContainer.innerHTML = '';
    
    data.suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');
        listItem.textContent = suggestion;
        suggestionsContainer.appendChild(listItem);
    });
}

// Duygu grafiği oluştur
function createEmotionsChart(emotions) {
    const ctx = document.getElementById('emotionsChart').getContext('2d');
    
    // Eğer önceden bir grafik varsa temizle
    if (window.emotionsChart) {
        window.emotionsChart.destroy();
    }
    
    // Yeni grafik oluştur
    window.emotionsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(emotions),
            datasets: [{
                data: Object.values(emotions),
                backgroundColor: [
                    '#FFD700', // mutluluk (altın)
                    '#4169E1', // üzüntü (mavi)
                    '#FF4500', // öfke (kırmızı-turuncu)
                    '#800080', // korku (mor)
                    '#32CD32', // şaşkınlık (yeşil)
                    '#8B4513'  // iğrenme (kahverengi)
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Demo bitiminde modal göster
function showDemoEndModal() {
    document.getElementById('demoEndModal').style.display = 'flex';
}

// Demo sonu modal butonları
function setupDemoEndModal() {
    // Üye ol butonu
    document.getElementById('demoSignupBtn').addEventListener('click', () => {
        document.getElementById('demoEndModal').style.display = 'none';
        document.getElementById('signupBtn').click(); // Ana sayfadaki kayıt ol butonunu tetikle
    });
    
    // Demo'yu yeniden başlat butonu
    document.getElementById('restartDemoBtn').addEventListener('click', () => {
        document.getElementById('demoEndModal').style.display = 'none';
        location.reload(); // Sayfayı yenile
    });
} 