// Günlük sayfası için JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sayfa yüklendi, scriptler çalışmaya başlıyor...');
    
    // Auth servisinin varlığını kontrol et
    if (typeof authService === 'undefined') {
        console.error('Auth servisi yüklenemedi! auth.js dosyasını kontrol edin!');
        // Auth servisini simüle et
        window.authService = {
            isLoggedIn: () => true,
            getUser: () => ({ firstName: 'Demo', lastName: 'Kullanıcı', email: 'demo@example.com' })
        };
        console.info('Demo auth servisi oluşturuldu.');
    } else {
        console.log('Auth servisi bulundu:', typeof authService);
    }
    
    // SentimentService varlığını kontrol et
    if (typeof sentimentService === 'undefined') {
        console.error('Sentiment servisi yüklenemedi! sentimentService.js dosyasını kontrol edin!');
        // SentimentService sınıfının kendisinin var olup olmadığını kontrol et
        if (typeof SentimentService !== 'undefined') {
            console.log('SentimentService sınıfı bulundu, ancak örneği oluşturulmamış');
            try {
                // SentimentService örneği oluşturmayı dene
                window.sentimentService = new SentimentService();
                console.info('sentimentService örneği oluşturuldu.');
            } catch (error) {
                console.error('SentimentService örneği oluşturulurken hata:', error);
            }
        } else {
            // Sentiment servisini simüle et
            window.sentimentService = {
                analyzeText: async (text) => {
                    console.log('Demo sentiment analiz:', text.substring(0, 30) + '...');
                    return {
                        emotions: {
                            happy: 25,
                            anxious: 40,
                            sad: 10,
                            calm: 20,
                            angry: 5
                        },
                        summary: "Bugün biraz karmaşık duygular içerisindesin. Hem endişe hem de umut taşıyorsun.",
                        coachResponse: "Bugün yaşadığın karmaşık duygular gayet normal. Kendine biraz zaman tanı ve yoluna devam et.",
                        recommendations: {
                            exercise: "5 Dakikalık Nefes Egzersizi",
                            mindfulness: "Sakinleşmek için 5 dakika boyunca derin nefes al ve ver."
                        }
                    };
                }
            };
            console.info('Demo sentiment servisi oluşturuldu.');
        }
    } else {
        console.log('Sentiment servisi bulundu:', typeof sentimentService);
    }
    
    // AUTH KONTROLÜ
    try {
        checkAuthBeforeAccess();
    } catch (error) {
        console.error('Auth kontrolü sırasında hata:', error);
    }
    
    // TEMEL SAYFA FONKSİYONLARI
    try {
        // Güncel tarihi ayarla
        setCurrentDate();
        console.log('Güncel tarih ayarlandı');
        
        // Kelime sayacını ayarla
        setupWordCounter();
        console.log('Kelime sayacı ayarlandı');
        
        // Koç seçimini ayarla
        setupCoachSelection();
        console.log('Koç seçimi ayarlandı');
        
        // Yazma/Konuşma modları arasında geçiş
        setupInputModeToggle();
        console.log('Giriş modu geçişi ayarlandı');
    } catch (error) {
        console.error('Temel sayfa fonksiyonlarını ayarlarken hata:', error.message);
        console.error('Hata detayı:', error.stack);
    }
    
    // ANA FONKSİYONLAR
    try {
        // Yazı analiz formunu ayarla - En kritik kısım burası
        console.log('Gönder butonları aranıyor...');
        const submitJournalBtn = document.getElementById('submit-journal');
        if (submitJournalBtn) {
            console.log('Gönder butonu bulundu:', submitJournalBtn);
        } else {
            console.error('Gönder butonu bulunamadı!');
            // DOM içerisindeki tüm butonları kontrol et
            const allButtons = document.querySelectorAll('button');
            console.log('Sayfadaki tüm butonlar:');
            allButtons.forEach((btn, index) => {
                console.log(`[${index}] ID: ${btn.id}, Class: ${btn.className}, Text: ${btn.innerText || btn.textContent}`);
            });
        }
        
        setupJournalSubmit();
        console.log('Günlük gönderme formu ayarlandı');
        
        // Ses kaydı ayarla
        setupVoiceRecording();
        console.log('Ses kayıt özellikleri ayarlandı');
        
        // Analiz sonuçları kontrolleri
        setupAnalysisResults();
        console.log('Analiz sonuçları kontrolleri ayarlandı');
        
        // Egzersiz butonu
        setupExerciseButton();
        console.log('Egzersiz butonu ayarlandı');
        
        // Geçmiş günlükler
        setupHistoryEntries();
        console.log('Geçmiş günlük girişleri ayarlandı');
    } catch (error) {
        console.error('Ana fonksiyonları ayarlarken hata:', error.message);
        console.error('Hata detayı:', error.stack);
    }
    
    console.log('Tüm sayfa fonksiyonları yüklendi ve hazır');
    
    // Test: Analizi doğrudan çalıştırma fonksiyonu ekleyin
    window.testAnalysis = function() {
        const journalText = document.getElementById('journal-text');
        if (journalText && journalText.value.trim() === '') {
            journalText.value = "Bugün kendimi biraz karışık hissediyorum. Bir yandan yeni projelerim için heyecanlıyım, diğer yandan da zamanımı nasıl yöneteceğim konusunda endişeliyim. Bu sabah erken kalktım ve güzel bir kahvaltı yaptım, bu beni mutlu etti. Akşam arkadaşlarımla buluşacağım için de heyecanlıyım.";
            console.log('Test metni eklendi');
        }
        
        const submitButton = document.getElementById('submit-journal');
        if (submitButton) {
            submitButton.click();
            console.log('Gönder butonu otomatik tıklandı');
        } else {
            console.error('Gönder butonu bulunamadı, test başarısız!');
        }
    };
    
    // DOM yüklendikten 1 saniye sonra otomatik test yap
    setTimeout(() => {
        console.log('Otomatik test başlatılıyor...');
        try {
            testAnalysis();
        } catch (error) {
            console.error('Test sırasında hata:', error.message);
            console.error('Hata detayı:', error.stack);
        }
    }, 1000);
});

// Auth kontrolü - giriş yapılmamışsa anasayfaya yönlendir
function checkAuthBeforeAccess() {
    // Auth servis var mı kontrol et
    if (typeof authService === 'undefined') {
        console.warn('Auth service bulunamadı');
        return;
    }
    
    // Kullanıcı giriş yapmış mı?
    if (!authService.isLoggedIn()) {
        console.log('Kullanıcı giriş yapmamış, anasayfaya yönlendiriliyor');
        // Login sayfasına yönlendir
        // window.location.href = 'index.html'; // Test için yoruma alındı
        return;
    }
    
    // Kullanıcı bilgilerini görüntüle
    const user = authService.getUser();
    updateUserInfo(user);
}

// Kullanıcı bilgilerini güncelle
function updateUserInfo(user) {
    if (!user) return;
    
    const userProfileName = document.querySelector('.user-profile span');
    if (userProfileName) {
        userProfileName.textContent = `Merhaba, ${user.firstName || 'Kullanıcı'}`;
    }
    
    const userProfileImage = document.querySelector('.user-profile img');
    if (userProfileImage && user.profilePicture) {
        userProfileImage.src = user.profilePicture;
    }
}

// Geçerli tarihi ayarla
function setCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    if (!currentDateElement) return;
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    };
    
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('tr-TR', options);
}

// Kelime sayacını ayarla
function setupWordCounter() {
    const journalEditor = document.getElementById('journal-text');
    const wordCount = document.querySelector('.word-count');
    
    if (!journalEditor) {
        console.error('Kelime sayacı için metin alanı bulunamadı');
        return;
    }
    
    // Kelime sayacı elementi yoksa oluştur
    let wordCountElement = wordCount;
    if (!wordCountElement) {
        wordCountElement = document.createElement('div');
        wordCountElement.className = 'word-count';
        const textareaWrapper = document.querySelector('.journal-textarea-wrapper');
        if (textareaWrapper) {
            textareaWrapper.appendChild(wordCountElement);
        }
    }
    
    // İlk kelime sayısını ayarla
    const initialText = journalEditor.value.trim();
    const initialWords = initialText ? initialText.split(/\s+/).length : 0;
    if (wordCountElement) {
        wordCountElement.textContent = `${initialWords} kelime`;
    }
    
    // Metin değiştiğinde kelime sayısını güncelle
    journalEditor.addEventListener('input', function() {
        const text = this.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        if (wordCountElement) {
            wordCountElement.textContent = `${words} kelime`;
        }
    });
    
    console.log('Kelime sayacı kuruldu');
}

// Günlük yazıyı işle ve API'ye gönder
function setupJournalSubmit() {
    console.log('setupJournalSubmit başlıyor...');
    
    // HTML'deki ID'ler ile eşleştirme yapıyorum
    let analyzeButton = document.getElementById('submit-journal');
    let saveButton = document.getElementById('save-draft');
    let journalEditor = document.getElementById('journal-text');
    
    if (!analyzeButton) {
        console.error('Gönder butonu bulunamadı (submit-journal ID)');
        // DOM'u tarayarak butonu bulmaya çalış
        const allButtons = document.querySelectorAll('button');
        console.log('Tüm butonlar taranıyor...');
        allButtons.forEach(btn => {
            console.log('Bulunan buton:', btn.id, btn.textContent);
            if (btn.textContent.includes('Gönder ve Analiz Et')) {
                console.log('İçeriğe göre gönder butonu bulundu:', btn);
                analyzeButton = btn;
            }
        });
    } else {
        console.log('Gönder butonu bulundu:', analyzeButton);
    }
    
    if (!journalEditor) {
        console.error('Günlük metin alanı bulunamadı (journal-text ID)');
        // DOM'u tarayarak metin alanını bulmaya çalış
        const allTextareas = document.querySelectorAll('textarea');
        console.log(`${allTextareas.length} adet textarea bulundu`);
        if (allTextareas.length > 0) {
            console.log('İlk textarea bulundu:', allTextareas[0]);
            journalEditor = allTextareas[0];
        }
    } else {
        console.log('Günlük metin alanı bulundu:', journalEditor);
    }
    
    if (!analyzeButton || !journalEditor) {
        console.error('Günlük gönderme için gerekli elementler bulunamadı:', { 
            analyzeButton: !!analyzeButton, 
            journalEditor: !!journalEditor 
        });
        
        // Dokumentasyonu inceleyerek neden elementlerin bulunamadığını anlamaya çalış
        console.log('DOM Yapısı:');
        document.querySelectorAll('.journal-actions').forEach((el, i) => {
            console.log(`Journal actions ${i}:`, el.innerHTML);
        });
        
        return;
    }
    
    console.log('Günlük analiz butonu ayarlanıyor...');
    
    // Analiz et butonuna tıklama olayı
    analyzeButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Form gönderimini engelle
        console.log('Gönder ve Analiz Et butonuna tıklandı');
        
        const text = journalEditor.value.trim();
        
        if (!text) {
            alert('Lütfen analiz için bir şeyler yazın.');
            return;
        }
        
        // Loading durumunu göster
        showLoading();
        console.log('Yükleniyor göstergesi gösteriliyor');
        
        try {
            // Sentiment service var mı kontrol et
            if (typeof sentimentService === 'undefined') {
                console.error('Sentiment servisi bulunamadı!');
                // Sentiment servisi oluşturmayı dene
                if (typeof SentimentService !== 'undefined') {
                    console.log('SentimentService sınıfı var, örnek oluşturulmaya çalışılıyor...');
                    window.sentimentService = new SentimentService();
                } else {
                    throw new Error('Sentiment service bulunamadı ve oluşturulamadı');
                }
            }
            
            console.log('Metin analiz için gönderiliyor:', text.substring(0, 50) + '...');
            
            // Analiz için API'ye gönder
            const analysisResult = await sentimentService.analyzeText(text);
            console.log('Analiz sonucu alındı:', analysisResult);
            
            // Analiz sonuçlarını göster
            showAnalysisResults(analysisResult);
        } catch (error) {
            console.error('Analiz hatası:', error);
            alert('Analiz sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            hideLoading();
        }
    });
    
    console.log('Gönder butonuna olay dinleyicisi eklendi');
    
    // Taslak olarak kaydet butonuna tıklama olayı
    if (saveButton) {
        saveButton.addEventListener('click', function(event) {
            event.preventDefault(); // Form gönderimini engelle
            console.log('Taslak Kaydet butonuna tıklandı');
            
            const text = journalEditor.value.trim();
            
            if (!text) {
                alert('Kaydedilecek bir şey yazmadınız.');
                return;
            }
            
            // LocalStorage'a kaydet
            saveJournalDraft(text);
            
            alert('Günlüğünüz taslak olarak kaydedildi.');
        });
        
        console.log('Taslak kaydet butonuna olay dinleyicisi eklendi');
    } else {
        console.warn('Taslak kaydet butonu bulunamadı');
    }
    
    // Sayfa yüklendiğinde taslağı yükle
    loadJournalDraft();
    
    console.log('setupJournalSubmit tamamlandı.');
}

// Taslak günlüğü kaydet
function saveJournalDraft(text) {
    localStorage.setItem('journal_draft', text);
    localStorage.setItem('journal_draft_date', new Date().toISOString());
    console.log('Günlük taslağı kaydedildi');
}

// Taslak günlüğü yükle
function loadJournalDraft() {
    const journalEditor = document.getElementById('journal-text');
    if (!journalEditor) {
        console.error('Günlük metin alanı bulunamadı');
        return;
    }
    
    const draft = localStorage.getItem('journal_draft');
    const draftDate = localStorage.getItem('journal_draft_date');
    
    if (draft && draftDate) {
        // Son 24 saat içinde kaydedilmiş mi kontrol et
        const savedDate = new Date(draftDate);
        const now = new Date();
        const hoursDiff = Math.abs(now - savedDate) / 36e5; // ms to hours
        
        if (hoursDiff < 24) {
            journalEditor.value = draft;
            console.log('Kaydedilmiş taslak yüklendi');
            
            // Kelime sayısını güncelle
            const wordCount = document.querySelector('.word-count');
            if (wordCount) {
                const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
                wordCount.textContent = `${words} kelime`;
            }
        }
    }
}

// Koç seçimi işlemi
function setupCoachSelection() {
    const coachOptions = document.querySelectorAll('.coach-option');
    
    if (!coachOptions || coachOptions.length === 0) {
        console.error('Koç seçim elementleri bulunamadı');
        return;
    }
    
    console.log('Koç seçim işlemi kuruluyor');
    
    coachOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Zaten seçili ise bir şey yapma
            if (this.classList.contains('active')) return;
            
            // Diğer tüm seçeneklerin active sınıfını kaldır
            coachOptions.forEach(opt => opt.classList.remove('active'));
            
            // Bu seçeneği aktif yap
            this.classList.add('active');
            
            // Seçilen koç tipini al
            const selectedCoach = this.querySelector('span').textContent.toLowerCase();
            console.log('Koç seçildi:', selectedCoach);
            
            // Eğer analiz sonuçları görünüyorsa, koç yorumunu da güncelle
            const analysisResults = document.querySelector('.analysis-results');
            if (analysisResults && window.getComputedStyle(analysisResults).display !== 'none') {
                // Saklanan analiz verilerini al
                const analysisData = JSON.parse(sessionStorage.getItem('currentAnalysis') || 'null');
                if (analysisData) {
                    // Sadece koç avatarını ve yorumunu güncelle
                    updateCoachUI(selectedCoach, analysisData);
                }
            }
        });
    });
}

// Koç görünümünü güncelle
function updateCoachUI(coachType, analysisData) {
    console.log('Koç görünümü güncelleniyor:', coachType);
    
    // Koç avatarını güncelle
    const coachAvatar = document.querySelector('.coach-avatar img');
    if (coachAvatar) {
        const coachImageMapping = {
            'şefkatli': 'images/coach-1.jpg',
            'disiplinli': 'images/coach-2.jpg',
            'mizahi': 'images/coach-3.jpg',
            'spiritüel': 'images/coach-4.jpg'
        };
        
        const imagePath = coachImageMapping[coachType] || 'images/coach-1.jpg';
        coachAvatar.src = imagePath;
        console.log('Koç avatarı güncellendi:', imagePath);
    }
    
    // Koç mesajını güncelle - farklı koç tipleri için farklı mesajlar
    const coachMessage = document.getElementById('coach-message');
    if (coachMessage && analysisData) {
        let message = '';
        
        // Duygulara göre koç tipine özgü mesajlar
        const emotions = analysisData.emotions || {};
        const dominantEmotion = Object.entries(emotions)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
        
        switch(coachType) {
            case 'şefkatli':
                if (dominantEmotion === 'happy') {
                    message = "Bugün kendini mutlu ve pozitif hissetmen harika! Bu enerjiyi korumaya çalış ve etrafındakilere de yansıtmayı dene.";
                } else if (dominantEmotion === 'sad' || dominantEmotion === 'anxious') {
                    message = "Bugün zorlu duygular yaşıyorsun ve bunu paylaşman çok değerli. Kendine nazik davranmayı unutma, bu duygular da geçici.";
                } else {
                    message = "Duygularını bu şekilde paylaşman çok güzel. Kendine biraz daha şefkat göstermeyi ve ihtiyaçlarını önceliklendirmeyi dene.";
                }
                break;
                
            case 'disiplinli':
                if (dominantEmotion === 'happy') {
                    message = "Olumlu duygularını eyleme dönüştürme zamanı. Bu enerjiyi hedeflerine ulaşmak için nasıl kullanabilirsin?";
                } else if (dominantEmotion === 'sad' || dominantEmotion === 'anxious') {
                    message = "Zorluklar güçlenmenin bir parçası. Bugün küçük bir adım atarak kontrolü geri almayı dene. Planın nedir?";
                } else {
                    message = "Her duygu, kendimizi geliştirmek için bir fırsattır. Bugün hangi alışkanlığı geliştirebilirsin?";
                }
                break;
                
            case 'mizahi':
                if (dominantEmotion === 'happy') {
                    message = "Harika bir ruh halindesin! Gülümsemenin bulaşıcı olduğunu unutma, bugün kaç kişiyi güldürdün?";
                } else if (dominantEmotion === 'sad' || dominantEmotion === 'anxious') {
                    message = "Hayat bazen iniş çıkışlarla dolu bir lunapark gibi. Şimdi bir mola verip komik bir video izlemeye ne dersin?";
                } else {
                    message = "Hayatı fazla ciddiye almamak da bir sanattır. Bugün kendine gülmeyi dene, her şey geçici sonuçta!";
                }
                break;
                
            case 'spiritüel':
                if (dominantEmotion === 'happy') {
                    message = "Şükran ve farkındalık içinde anın güzelliğini hissetmek, ruhuna derinlik katar. Bu hissi nasıl besliyorsun?";
                } else if (dominantEmotion === 'sad' || dominantEmotion === 'anxious') {
                    message = "Zorluklar ruhsal gelişimin basamaklarıdır. Sessizlik içinde nefes alıp, iç sesine kulak vermeyi dene.";
                } else {
                    message = "Her duygu bilgelik öğretir. Bugün içindeki sessizliği keşfederek, evrenle bağlantını güçlendirmeyi dene.";
                }
                break;
                
            default:
                message = "Duygularını paylaşman çok değerli. Daha fazla içgörü için günlük yazma pratiğini sürdürmeye devam et.";
        }
        
        coachMessage.textContent = message;
        console.log('Koç mesajı güncellendi');
    }
}

// Yazma/Konuşma modu geçişi
function setupInputModeToggle() {
    console.log('Giriş modu geçişi ayarlanıyor...');
    
    const writeModeBtn = document.querySelector('.input-mode-btn[data-mode="write"]');
    const speakModeBtn = document.querySelector('.input-mode-btn[data-mode="speak"]');
    
    // Butonları bul
    if (!writeModeBtn) {
        console.error('Yazma modu butonu bulunamadı (.input-mode-btn[data-mode="write"])');
    } else {
        console.log('Yazma modu butonu bulundu');
    }
    
    if (!speakModeBtn) {
        console.error('Konuşma modu butonu bulunamadı (.input-mode-btn[data-mode="speak"])');
    } else {
        console.log('Konuşma modu butonu bulundu');
    }
    
    // Mod containerlerini bul
    const writeMode = document.querySelector('.write-mode');
    const speakMode = document.querySelector('.speak-mode');
    
    if (!writeMode) {
        console.error('Yazma modu container\'ı bulunamadı (.write-mode)');
    }
    
    if (!speakMode) {
        console.error('Konuşma modu container\'ı bulunamadı (.speak-mode)');
    }
    
    // Gerekli elementler yoksa erken çık
    if (!writeModeBtn || !speakModeBtn || !writeMode || !speakMode) {
        console.error('Giriş modu geçişi için tüm gerekli elementler bulunamadı');
        return;
    }
    
    // Yazma modu butonu
    writeModeBtn.addEventListener('click', function() {
        console.log('Yazma modu butonuna tıklandı');
        
        if (this.classList.contains('active')) {
            console.log('Yazma modu zaten aktif');
            return;
        }
        
        // Butonları güncelle
        this.classList.add('active');
        speakModeBtn.classList.remove('active');
        
        // Görünümü değiştir
        writeMode.style.display = 'block';
        speakMode.style.display = 'none';
        
        console.log('Yazma moduna geçildi');
    });
    
    // Konuşma modu butonu
    speakModeBtn.addEventListener('click', function() {
        console.log('Konuşma modu butonuna tıklandı');
        
        if (this.classList.contains('active')) {
            console.log('Konuşma modu zaten aktif');
            return;
        }
        
        // Butonları güncelle
        this.classList.add('active');
        writeModeBtn.classList.remove('active');
        
        // Görünümü değiştir
        writeMode.style.display = 'none';
        speakMode.style.display = 'block';
        
        console.log('Konuşma moduna geçildi');
        
        // Mikrofon erişimini kontrol et
        checkMicrophoneAccess();
    });
    
    console.log('Giriş modu geçişi başarıyla ayarlandı');
}

// Mikrofon erişimini kontrol et
function checkMicrophoneAccess() {
    console.log('Mikrofon erişimi kontrol ediliyor...');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                console.log('Mikrofon erişimi onaylandı');
                // Başarılı erişim durumunda stream'i durdur
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(function(err) {
                console.error('Mikrofon erişimi reddedildi veya kullanılamıyor:', err);
                // Kullanıcıya bildir
                alert('Sesli giriş için mikrofon izni vermeniz gerekmektedir. Lütfen tarayıcı izinlerini kontrol edin.');
                
                // Yazma moduna geri dön
                const writeModeBtn = document.querySelector('.input-mode-btn[data-mode="write"]');
                if (writeModeBtn) {
                    writeModeBtn.click();
                }
            });
    } else {
        console.error('Tarayıcınız getUserMedia API\'sini desteklemiyor');
        alert('Maalesef tarayıcınız ses kaydını desteklemiyor. Lütfen güncel bir tarayıcı kullanın.');
        
        // Yazma moduna geri dön
        const writeModeBtn = document.querySelector('.input-mode-btn[data-mode="write"]');
        if (writeModeBtn) {
            writeModeBtn.click();
        }
    }
}

// Ses kayıt özelliğini ayarla
function setupVoiceRecording() {
    console.log('Ses kayıt özellikleri ayarlanıyor...');
    
    // DOM elementlerini bul
    const startRecordingBtn = document.getElementById('start-recording');
    const recordStatus = document.querySelector('.record-status');
    const voiceTextPreview = document.getElementById('voice-text-preview');
    const submitVoiceBtn = document.getElementById('submit-voice-journal');
    const retryRecordingBtn = document.getElementById('retry-recording');
    
    // Gerekli elementlerin varlığını kontrol et
    if (!startRecordingBtn) {
        console.error('Kayıt başlatma butonu bulunamadı (#start-recording)');
        return;
    }
    
    if (!recordStatus) {
        console.error('Kayıt durumu elementi bulunamadı (.record-status)');
    }
    
    if (!voiceTextPreview) {
        console.error('Ses metin önizleme elementi bulunamadı (#voice-text-preview)');
    }
    
    if (!submitVoiceBtn) {
        console.error('Sesli günlük gönderme butonu bulunamadı (#submit-voice-journal)');
    }
    
    if (!retryRecordingBtn) {
        console.error('Yeniden kaydet butonu bulunamadı (#retry-recording)');
    }
    
    // Değişkenler
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let recordingStream = null;
    
    // Kayıt başlatma butonu
    startRecordingBtn.addEventListener('click', function() {
        console.log('Kayıt başlatma butonuna tıklandı');
        
        if (isRecording) {
            // Kaydı durdur
            console.log('Kayıt durduruluyor...');
            stopRecording();
        } else {
            // Kayda başla
            console.log('Kayıt başlatılıyor...');
            startRecording();
        }
    });
    
    // Yeniden kaydet butonu
    if (retryRecordingBtn) {
        retryRecordingBtn.addEventListener('click', function() {
            console.log('Yeniden kaydet butonuna tıklandı');
            resetRecording();
            
            // Kayıt önizlemesini temizle
            if (voiceTextPreview) {
                voiceTextPreview.textContent = '';
            }
        });
    }
    
    // Sesli günlük gönderme butonu
    if (submitVoiceBtn) {
        submitVoiceBtn.addEventListener('click', function() {
            console.log('Sesli günlük gönderme butonuna tıklandı');
            
            const text = voiceTextPreview ? voiceTextPreview.textContent : '';
            
            if (!text || text.trim() === '') {
                alert('Lütfen önce bir ses kaydı yapın.');
                return;
            }
            
            // Ses metnini yazı alanına aktar
            processAudioToText(text);
            
            // Analiz için gönder
            const submitButton = document.getElementById('submit-journal');
            if (submitButton) {
                submitButton.click();
            } else {
                console.error('Analiz butonu bulunamadı, sesli günlük analiz edilemiyor');
            }
        });
    }
    
    // Kayıt başlat
    function startRecording() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Mikrofon erişimi iste
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function(stream) {
                    console.log('Mikrofon erişimi sağlandı, kayıt başlıyor');
                    recordingStream = stream;
                    
                    // MediaRecorder kur
                    audioChunks = [];
                    mediaRecorder = new MediaRecorder(stream);
                    
                    // Veri geldiğinde
                    mediaRecorder.addEventListener('dataavailable', function(e) {
                        audioChunks.push(e.data);
                    });
                    
                    // Kayıt durduğunda
                    mediaRecorder.addEventListener('stop', function() {
                        console.log('Kayıt durduruldu, ses işleniyor');
                        
                        // Kayıt durumunu güncelle
                        isRecording = false;
                        if (startRecordingBtn) {
                            startRecordingBtn.classList.remove('recording');
                            startRecordingBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                        }
                        
                        // Ses verisi oluştur
                        if (audioChunks.length > 0) {
                            // Gerçek bir API kullanımında, burada ses verisini API'ye gönderip
                            // metne çevrilmiş halini alırdık. Şimdi sadece simüle ediyoruz.
                            simulateTranscription();
                        }
                    });
                    
                    // Kayda başla
                    mediaRecorder.start();
                    isRecording = true;
                    
                    // UI güncelle
                    if (startRecordingBtn) {
                        startRecordingBtn.classList.add('recording');
                        startRecordingBtn.innerHTML = '<i class="fas fa-stop"></i>';
                    }
                    
                    if (recordStatus) {
                        recordStatus.textContent = 'Kaydediliyor...';
                    }
                })
                .catch(function(err) {
                    console.error('Mikrofon erişimi hatası:', err);
                    alert('Mikrofon erişimi sağlanamadı. Lütfen izinleri kontrol edin.');
                });
        } else {
            console.error('Tarayıcınız ses kaydetmeyi desteklemiyor');
            alert('Maalesef tarayıcınız ses kaydını desteklemiyor.');
        }
    }
    
    // Kaydı durdur
    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            
            // Stream'i durdur
            if (recordingStream) {
                recordingStream.getTracks().forEach(track => track.stop());
                recordingStream = null;
            }
            
            // UI güncelle
            if (recordStatus) {
                recordStatus.textContent = 'Ses işleniyor...';
            }
        }
    }
    
    // Kaydı sıfırla
    function resetRecording() {
        stopRecording();
        audioChunks = [];
        
        // UI güncelle
        if (startRecordingBtn) {
            startRecordingBtn.classList.remove('recording');
            startRecordingBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
        
        if (recordStatus) {
            recordStatus.textContent = 'Kayıt için butona tıklayın';
        }
    }
    
    // Ses-metin dönüşümünü simüle et
    function simulateTranscription() {
        console.log('Ses-metin dönüşümü simüle ediliyor');
        
        // Yükleniyor göster
        if (recordStatus) {
            recordStatus.textContent = 'Ses metne dönüştürülüyor...';
        }
        
        // Gerçek API yerine simüle edilmiş bir metin
        setTimeout(() => {
            const simulatedText = "Bu bir sesli günlük örneğidir. Gerçek bir uygulamada, bu ses yapay zeka tarafından metne dönüştürülecektir. Sesli günlük tutmak, düşüncelerinizi hızlıca ifade etmenizi sağlar ve yazarken düşünmeye vakit ayırmak zorunda kalmazsınız.";
            
            // Metni göster
            if (voiceTextPreview) {
                voiceTextPreview.textContent = simulatedText;
            }
            
            // Kayıt durumunu güncelle
            if (recordStatus) {
                recordStatus.textContent = 'Metin oluşturuldu';
            }
            
            console.log('Ses metne dönüştürüldü (simülasyon)');
        }, 1500);
    }
    
    console.log('Ses kayıt özellikleri başarıyla ayarlandı');
}

// Ses metnini yazı alanına aktar
function processAudioToText(text) {
    console.log('Ses metni işleniyor');
    
    // Eğer parametre olarak metin gelmediyse, elementten al
    if (!text) {
        const voiceTextPreview = document.getElementById('voice-text-preview');
        if (voiceTextPreview) {
            text = voiceTextPreview.textContent || '';
        } else {
            console.error('Ses metin önizleme elementi bulunamadı');
            text = "Ses metne çevrilemedi, lütfen manuel olarak yazın.";
        }
    }
    
    // Metin alanını bul ve değeri ata
    const journalEditor = document.getElementById('journal-text');
    if (journalEditor) {
        journalEditor.value = text;
        console.log('Ses metni yazı alanına aktarıldı');
        
        // Kelime sayacını güncelle
        const wordCount = document.querySelector('.word-count');
        if (wordCount) {
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            wordCount.textContent = `${words} kelime`;
        }
        
        // Yazı moduna geç
        const writeModeBtn = document.querySelector('.input-mode-btn[data-mode="write"]');
        if (writeModeBtn) {
            writeModeBtn.click();
        }
    } else {
        console.error('Metin alanı bulunamadı');
        alert('Ses metni yazı alanına aktarılamadı.');
    }
}

// Analiz sonuçlarını göster
function showAnalysisResults(analysisData = null) {
    console.log('Analiz sonuçları gösteriliyor:', analysisData);
    
    // Veri yoksa, son analiz verilerini kullan
    if (!analysisData) {
        analysisData = JSON.parse(sessionStorage.getItem('currentAnalysis') || 'null');
        
        if (!analysisData) {
            console.error('Analiz verileri bulunamadı');
            hideLoading();
            
            // Demo veri oluştur
            analysisData = {
                emotions: {
                    happy: 25,
                    anxious: 40,
                    sad: 10,
                    calm: 20,
                    angry: 5
                },
                summary: "Bugün biraz karmaşık duygular içerisindesin. Hem endişe hem de umut taşıyorsun.",
                coachResponse: "Bugün yaşadığın karmaşık duygular gayet normal. Kendine biraz zaman tanı ve yoluna devam et."
            };
            console.log('Demo analiz verileri oluşturuldu');
        }
    } else {
        // Verileri sakla
        try {
            sessionStorage.setItem('currentAnalysis', JSON.stringify(analysisData));
            console.log('Analiz verileri session storage\'a kaydedildi');
        } catch (e) {
            console.error('Session storage\'a kaydetme hatası:', e);
        }
    }
    
    // UI'ı güncelle
    updateAnalysisUI(analysisData);
    
    // Loading durumunu gizle
    hideLoading();
    
    // Analiz bölümünü göster
    const analysisResults = document.querySelector('.analysis-results');
    
    if (analysisResults) {
        // Görünürlüğü kontrol et ve göster
        const currentDisplay = window.getComputedStyle(analysisResults).display;
        if (currentDisplay === 'none') {
            analysisResults.style.display = 'block';
            console.log('Analiz sonuçları görünür hale getirildi');
        }
        
        // Sonuçlara doğru kaydır
        try {
            analysisResults.scrollIntoView({ behavior: 'smooth' });
            console.log('Analiz sonuçlarına kaydırıldı');
        } catch (e) {
            console.error('Kaydırma hatası:', e);
            // Alternatif kaydırma yöntemi
            window.scrollTo({
                top: analysisResults.offsetTop,
                behavior: 'smooth'
            });
        }
    } else {
        console.error('Analiz sonuçları container\'ı bulunamadı');
        
        // Container bulunamadıysa yeni oluşturmayı dene
        createAnalysisResultsContainer(analysisData);
    }
}

// Analiz sonuçları containeri oluştur (eğer sayfada yoksa)
function createAnalysisResultsContainer(data) {
    console.log('Analiz sonuçları container\'ı oluşturuluyor...');
    
    const container = document.createElement('div');
    container.className = 'analysis-results';
    
    // Header
    const header = document.createElement('div');
    header.className = 'analysis-header';
    header.innerHTML = `
        <h2>Duygu Analizi</h2>
        <button class="close-analysis">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Content
    const content = document.createElement('div');
    content.className = 'analysis-content';
    
    // Duygu grafiği
    const emotionsChart = document.createElement('div');
    emotionsChart.className = 'emotions-chart';
    emotionsChart.innerHTML = `
        <h3>Duygu Dağılımı</h3>
        <div class="chart-container">
            <div class="placeholder-chart"></div>
        </div>
    `;
    
    // Özet
    const summary = document.createElement('div');
    summary.className = 'analysis-summary';
    summary.innerHTML = `
        <h3>Özet</h3>
        <p id="emotion-summary">${data.summary || 'Analiz sonuçları alınıyor...'}</p>
    `;
    
    // Koç geri bildirimi
    const coach = document.createElement('div');
    coach.className = 'coach-response';
    coach.innerHTML = `
        <div class="coach-avatar">
            <img src="images/coach-1.jpg" alt="Şefkatli Koç">
        </div>
        <div class="coach-message">
            <h3>Koçundan</h3>
            <p id="coach-message">${data.coachResponse || 'Koçundan mesaj alınıyor...'}</p>
        </div>
    `;
    
    // Komponenleri bir araya getir
    content.appendChild(emotionsChart);
    content.appendChild(summary);
    content.appendChild(coach);
    
    container.appendChild(header);
    container.appendChild(content);
    
    // Sayfaya ekle
    const journalContainer = document.querySelector('.journal-container');
    if (journalContainer) {
        journalContainer.parentNode.insertBefore(container, journalContainer.nextSibling);
        console.log('Analiz sonuçları container\'ı oluşturuldu ve eklendi');
        
        // Duygu çubuklarını güncelle
        updateEmotionBars(data.emotions);
        
        // Kapatma butonuna olay dinleyicisi ekle
        const closeBtn = container.querySelector('.close-analysis');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                container.style.display = 'none';
            });
        }
        
        // Görünür hale getir
        container.style.display = 'block';
        
        // Sonuçlara kaydır
        container.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('Analiz sonuçları container\'ını eklemek için uygun yer bulunamadı');
        document.body.appendChild(container);
    }
}

// Analiz UI'ını güncelle
function updateAnalysisUI(data) {
    console.log('UI güncelleniyor:', data);
    
    // Veri kontrolü
    if (!data) {
        console.error('Güncellenecek veri yok!');
        return;
    }
    
    // Eksik verileri tamamla
    if (!data.emotions) {
        data.emotions = {
            happy: 25,
            anxious: 40,
            sad: 10,
            calm: 20,
            angry: 5
        };
        console.warn('Emotions verisi eksik, varsayılan değerler kullanılıyor');
    }
    
    if (!data.summary) {
        data.summary = "Günlüğünüz analiz edildi. Duygularınızı daha iyi anlamak için düzenli olarak yazı yazmaya devam edin.";
        console.warn('Summary verisi eksik, varsayılan değer kullanılıyor');
    }
    
    if (!data.coachResponse) {
        data.coachResponse = "Duygularınızı paylaşmanız çok değerli. Her gün biraz daha ilerlediğinizi göreceksiniz.";
        console.warn('CoachResponse verisi eksik, varsayılan değer kullanılıyor');
    }
    
    // Duygu özeti
    const emotionSummary = document.getElementById('emotion-summary');
    if (emotionSummary) {
        emotionSummary.textContent = data.summary;
        console.log('Duygu özeti güncellendi');
    } else {
        console.error('Duygu özeti elementi bulunamadı (emotion-summary ID)');
    }
    
    // Koç mesajı güncelle
    const coachMessage = document.getElementById('coach-message');
    if (coachMessage) {
        coachMessage.textContent = data.coachResponse;
        console.log('Koç mesajı güncellendi');
    } else {
        console.error('Koç mesajı elementi bulunamadı (coach-message ID)');
    }
    
    // Seçili koç tipine göre avatar güncelle
    // Önce seçili koç tipini al
    let selectedCoach = 'şefkatli';
    const activeCoachOption = document.querySelector('.coach-option.active');
    if (activeCoachOption) {
        selectedCoach = activeCoachOption.querySelector('span').textContent.toLowerCase();
        console.log('Aktif koç tipini bulundu:', selectedCoach);
    } else {
        console.warn('Aktif koç tipi bulunamadı, varsayılan olarak şefkatli koç kullanılıyor');
    }
    
    // Koç avatarını güncelle
    const coachAvatar = document.querySelector('.coach-avatar img');
    if (coachAvatar) {
        const coachImageMapping = {
            'şefkatli': 'images/coach-1.jpg',
            'disiplinli': 'images/coach-2.jpg',
            'mizahi': 'images/coach-3.jpg',
            'spiritüel': 'images/coach-4.jpg'
        };
        
        if (coachImageMapping[selectedCoach]) {
            coachAvatar.src = coachImageMapping[selectedCoach];
            console.log('Koç avatarı güncellendi:', coachImageMapping[selectedCoach]);
        } else {
            console.warn('Seçilen koç tipi için görsel bulunamadı:', selectedCoach);
        }
    } else {
        console.error('Koç avatar görseli bulunamadı (.coach-avatar img)');
    }
    
    // Duygu çubuklarını güncelle
    if (data.emotions) {
        updateEmotionBars(data.emotions);
    } else {
        console.error('Duygu verileri bulunamadı, çubuklar güncellenemedi');
    }
}

// Duygu çubuklarını güncelle
function updateEmotionBars(emotions) {
    console.log('Duygu çubukları güncelleniyor:', emotions);
    
    // Eksik veri kontrolü
    if (!emotions || Object.keys(emotions).length === 0) {
        console.error('Duygu verisi eksik veya boş');
        emotions = {
            happy: 25,
            anxious: 40,
            sad: 10,
            calm: 20,
            angry: 5
        };
        console.log('Demo duygu verileri kullanılıyor');
    }
    
    const chart = document.querySelector('.placeholder-chart');
    if (!chart) {
        console.error('Duygu çubukları container\'ı bulunamadı (.placeholder-chart)');
        
        // Sayfada olan chart/grafik türünü bulmaya çalış
        const alternativeCharts = document.querySelectorAll('.chart-container, .emotions-chart');
        if (alternativeCharts.length > 0) {
            console.log('Alternatif chart container bulundu:', alternativeCharts[0]);
            
            // Alternatif containerde placeholder-chart elementi oluştur
            const newChart = document.createElement('div');
            newChart.className = 'placeholder-chart';
            alternativeCharts[0].appendChild(newChart);
            
            // Yeni elementi kullan
            return updateEmotionBars(emotions);
        }
        
        return;
    }
    
    try {
        // Duygu isimleri dönüşüm tablosu
        const emotionNames = {
            happy: 'Mutlu',
            sad: 'Üzgün', 
            anxious: 'Endişeli',
            calm: 'Sakin',
            angry: 'Öfkeli',
            hopeful: 'Umutlu'
        };
        
        // En yüksek değerlere sahip 4 duyguyu seç (en fazla)
        const sortedEmotions = Object.entries(emotions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
        
        console.log('Sıralanmış duygular:', sortedEmotions);
        
        // Chart'ı temizle
        chart.innerHTML = '';
        
        // Gösterilecek duygu yoksa
        if (sortedEmotions.length === 0) {
            chart.innerHTML = '<p class="no-data">Gösterilecek duygu analizi henüz yok</p>';
            return;
        }
        
        // Yeni duygu çubuklarını ekle
        sortedEmotions.forEach(([emotion, value]) => {
            // Geçerli bir değer kontrolü
            if (isNaN(value) || value < 0) {
                console.warn(`Geçersiz duygu değeri (${emotion}): ${value}`);
                value = 5; // Minimum değer
            }
            
            // Maksimum değer kontrolü
            if (value > 100) {
                console.warn(`Çok yüksek duygu değeri (${emotion}): ${value}`);
                value = 100;
            }
            
            // Duygu ismini çevir
            const emotionName = emotionNames[emotion] || emotion;
            
            // Çubuk elementi oluştur
            const barElement = document.createElement('div');
            barElement.className = `emotion-bar ${emotion}`;
            barElement.style.width = `${value}%`;
            
            // Etiket elementi oluştur
            const labelElement = document.createElement('span');
            labelElement.className = 'emotion-label';
            labelElement.textContent = emotionName;
            
            // Yüzde elementi oluştur
            const percentElement = document.createElement('span');
            percentElement.className = 'emotion-percent';
            percentElement.textContent = `${value}%`;
            
            // Elementleri ekle
            barElement.appendChild(labelElement);
            barElement.appendChild(percentElement);
            chart.appendChild(barElement);
        });
        
        console.log('Duygu çubukları güncellendi');
    } catch (error) {
        console.error('Duygu çubuklarını güncellerken hata:', error);
        
        // Hata durumunda basit bir mesaj göster
        chart.innerHTML = '<p class="error">Duygu grafiği yüklenirken bir hata oluştu</p>';
    }
}

// Egzersiz önerisini güncelle
function updateExerciseRecommendation(recommendations) {
    const exerciseTitle = document.getElementById('exercise-title');
    const exerciseDescription = document.getElementById('exercise-description');
    
    if (!exerciseTitle || !exerciseDescription || !recommendations) return;
    
    // Önerilen egzersiz başlığı ve açıklaması
    if (recommendations.exercise) {
        exerciseTitle.textContent = recommendations.exercise;
    }
    
    if (recommendations.mindfulness) {
        exerciseDescription.textContent = recommendations.mindfulness;
    }
}

// Temaları güncelle
function updateThemes(data) {
    const themesContainer = document.getElementById('themes-container');
    
    if (!themesContainer || !data.tags) return;
    
    // Tema etiketlerini oluştur
    themesContainer.innerHTML = '';
    
    // Her temayı ekle
    data.tags.forEach(tag => {
        const themeTag = document.createElement('span');
        themeTag.className = 'theme-tag';
        themeTag.textContent = tag;
        themesContainer.appendChild(themeTag);
    });
    
    // Hiç tema yoksa
    if (data.tags.length === 0) {
        const defaultTags = ['günlük', 'düşünceler'];
        defaultTags.forEach(tag => {
            const themeTag = document.createElement('span');
            themeTag.className = 'theme-tag';
            themeTag.textContent = tag;
            themesContainer.appendChild(themeTag);
        });
    }
}

// Analiz sonuçları ile ilgili etkileşimleri ayarla
function setupAnalysisResults() {
    // Analiz kapatma butonu
    const closeAnalysisBtn = document.querySelector('.close-analysis');
    
    if (closeAnalysisBtn) {
        closeAnalysisBtn.addEventListener('click', function() {
            const analysisResults = document.querySelector('.analysis-results');
            if (analysisResults) {
                analysisResults.style.display = 'none';
            }
        });
    }
}

// Egzersiz başlatma butonunu ayarla
function setupExerciseButton() {
    const startExerciseBtn = document.getElementById('start-exercise');
    
    if (!startExerciseBtn) return;
    
    startExerciseBtn.addEventListener('click', function() {
        const exerciseTitle = document.getElementById('exercise-title')?.textContent || 'Egzersiz';
        
        // Egzersiz başlatma modalı (bu bir örnek olduğundan burada simüle ediyoruz)
        alert(`"${exerciseTitle}" egzersizi başlatılıyor. Gerçek uygulamada, bu bir egzersiz sayfası veya modal açacaktır.`);
    });
}

// Geçmiş günlük girişleri ayarla
function setupHistoryEntries() {
    const historyItems = document.querySelectorAll('.history-list li');
    
    historyItems.forEach(item => {
        item.addEventListener('click', function() {
            // Gerçek uygulamada burada API'den geçmiş günlük getirilir
            alert('Bu özellik henüz geliştirme aşamasındadır. İleride geçmiş günlüklerinizi görüntüleyebileceksiniz.');
        });
    });
}

// Yükleme animasyonunu göster
function showLoading() {
    // Zaten var olan loading elementi kontrol et
    let loadingEl = document.querySelector('.loading-overlay');
    
    // Yoksa oluştur
    if (!loadingEl) {
        loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        const message = document.createElement('div');
        message.className = 'loading-message';
        message.textContent = 'Analiz ediliyor...';
        
        loadingEl.appendChild(spinner);
        loadingEl.appendChild(message);
        
        document.body.appendChild(loadingEl);
    } else {
        // Varsa göster
        loadingEl.style.display = 'flex';
    }
    
    console.log('Yükleme animasyonu gösteriliyor');
}

// Yükleme animasyonunu gizle
function hideLoading() {
    const loadingEl = document.querySelector('.loading-overlay');
    
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }
    
    console.log('Yükleme animasyonu gizlendi');
}

// Chart.js grafikleri başlat
function initializeCharts() {
    // Burada bir şey yapılmasına gerek yok, sadece Chart.js kütüphanesi yüklendiğinden emin olunuyor
}

// Koç avatarını güncelle
function updateCoachAvatar(coachType) {
    const coachAvatar = document.getElementById('coach-avatar');
    const coachName = document.getElementById('coach-name');
    
    if (!coachAvatar || !coachName) return;
    
    // Koç türüne göre avatar ve isim güncelle
    switch(coachType) {
        case 'compassionate':
            coachAvatar.src = 'images/coach1.png';
            coachName.textContent = 'Şefkatli Koç';
            break;
        case 'disciplined':
            coachAvatar.src = 'images/coach2.png';
            coachName.textContent = 'Disiplinli Koç';
            break;
        case 'humorous':
            coachAvatar.src = 'images/coach3.png';
            coachName.textContent = 'Mizahi Koç';
            break;
        case 'spiritual':
            coachAvatar.src = 'images/coach4.png';
            coachName.textContent = 'Spiritüel Koç';
            break;
        default:
            coachAvatar.src = 'images/coach1.png';
            coachName.textContent = 'Şefkatli Koç';
    }
}

// Koç geri bildirimini güncelle
function updateCoachFeedback(analysisData, coachType) {
    const coachFeedback = document.getElementById('coach-feedback');
    const motivationQuote = document.getElementById('motivation-quote');
    
    if (!coachFeedback || !analysisData || !coachType) return;
    
    // Koç türüne göre geri bildirim metni oluştur
    let feedback = '';
    let quote = '';
    
    // Burada gerçek API'den gelen verileri kullanabiliriz
    // Ya da koç türüne göre farklı mesajlar oluşturabiliriz
    
    switch(coachType) {
        case 'compassionate':
            feedback = "Duygularını bu kadar açık ifade etmen çok değerli. Kendine karşı nazik olmayı unutma. Bu zorlu süreçte kendine iyi bakmak önceliğin olsun.";
            quote = "\"Kendine şefkatle yaklaşmak, gerçek gücün başlangıcıdır.\"";
            break;
        case 'disciplined':
            feedback = "Duygularını analiz ettin, şimdi bunları nasıl yöneteceğine odaklanma zamanı. Hedeflerine ulaşmak için bir adım planı yap ve kararlılıkla ilerle.";
            quote = "\"Disiplin, istediğin ile ihtiyacın olan arasındaki köprüdür.\"";
            break;
        case 'humorous':
            feedback = "Hey, görünüşe göre bugün duygu dağıtım merkezinden tam paket almışsın! Unutma, en karanlık bulutların bile gümüş bir astarı vardır... ya da en azından yağmur yağdığında şemsiye satışları artar!";
            quote = "\"Gülmek, dünyanın bize karşı değil, bizimle beraber olduğunu hatırlatır.\"";
            break;
        case 'spiritual':
            feedback = "Bu duyguların varlığını kabul et ve onları dirençle karşılama. Her deneyim ruhsal yolculuğunun bir parçası. İçindeki bilgeliğe güven.";
            quote = "\"Her zorluk, ruhumuzun aydınlanması için bir fırsattır.\"";
            break;
        default:
            feedback = analysisData.coachResponse || "Bugün paylaştığın duygular için teşekkürler. Kendine nazik davranmayı unutma.";
            quote = "\"Kendi hikayeni yaşamaya cesaret et.\"";
    }
    
    coachFeedback.textContent = feedback;
    if (motivationQuote) {
        motivationQuote.textContent = quote;
    }
}

// Export fonksiyonları (başka dosyalarda kullanmak için)
export {
    showAnalysisResults,
    updateAnalysisUI,
    updateEmotionBars
}; 