// ==========================================
// 0. Intro Splash Screen Engine (UX Lock)
// ==========================================
document.body.classList.add('intro-active');

function initIntroSplash() {
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('intro-video');
    const introAudio = document.getElementById('intro-audio');
    const skipBtn = document.getElementById('skip-intro-btn');
    let isTransitioning = false;

    if (!introScreen || !introVideo || !introAudio || !skipBtn) return;

    // Memastikan video dan audio berputar bersamaan (Simultaneous Playback)
    const playMedia = () => {
        introVideo.play().catch(error => console.log("Video autoplay diblokir:", error));
        introAudio.play().catch(error => {
            console.log("Audio autoplay diblokir oleh kebijakan browser:", error);
            skipBtn.classList.add('show'); // Memunculkan tombol jika tertahan aturan browser
        });
    };
    
    playMedia();

    // Fitur Sinkronisasi: Memastikan audio selalu mengikuti timeline video secara real-time
    introVideo.addEventListener('timeupdate', () => {
        if (Math.abs(introVideo.currentTime - introAudio.currentTime) > 0.15) {
            introAudio.currentTime = introVideo.currentTime;
        }
    });

    // Tampilkan tombol Skip setelah tepat 4 detik (4000ms)
    const skipTimer = setTimeout(() => {
        if (!isTransitioning) {
            skipBtn.classList.add('show');
        }
    }, 4000);

    // Fungsi transisi sekuensial utama
    const executeTransition = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        clearTimeout(skipTimer);
        
        // Menghentikan media & reset currentTime ke 0 saat selesai/skip
        introVideo.pause();
        introAudio.pause();
        introVideo.currentTime = 0;
        introAudio.currentTime = 0;

        // Alur 1: Fade Out Intro Screen (700ms)
        introScreen.classList.add('fade-out');

        setTimeout(() => {
            introScreen.style.display = 'none';
            // Aktifkan kembali scroll & klik pada website
            document.body.classList.remove('intro-active');

            // Alur 2: Fade In Main Website (700ms)
            document.body.classList.add('site-ready');
        }, 700);
    };

    // Event Listener Selesai / Skip (Ketika video selesai, audio otomatis ikut berhenti di dalam executeTransition)
    introVideo.addEventListener('ended', executeTransition);
    skipBtn.addEventListener('click', executeTransition);
}

// ==========================================
// 1. Loading Screen & Init
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 1000);
    document.getElementById('year').textContent = new Date().getFullYear();

    // Jalankan Intro Sistem
    initIntroSplash();
});

// ==========================================
// 2. Scroll Progress Bar
// ==========================================
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progress-bar').style.width = scrolled + '%';
});

// ==========================================
// 3. Custom Typing Animation
// ==========================================
const phrases = ["Welcome", "Nice to meet you", "Enjoy your visit"];
const typingTextElement = document.getElementById('typing-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; 
    } else {
        typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120; 
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; 
    }
    setTimeout(typeEffect, typingSpeed);
}
setTimeout(typeEffect, 2000);

// ==========================================
// 4. Scroll Reveal
// ==========================================
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
    });
}, revealOptions);
revealElements.forEach(el => revealOnScroll.observe(el));

// ==========================================
// 5. Music Player Toggle
// ==========================================
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
let isPlaying = false;
bgMusic.volume = 0.4; 

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        musicBtn.classList.remove('playing');
    } else {
        let playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                iconPlay.style.display = 'none';
                iconPause.style.display = 'block';
                musicBtn.classList.add('playing');
            }).catch(error => {
                console.log("Audio play blocked:", error);
            });
        }
    }
    isPlaying = !isPlaying;
});

// ==========================================
// 6. Back To Top
// ==========================================
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================
// 7. Ripple Effect
// ==========================================
const rippleButtons = document.querySelectorAll('.ripple');
rippleButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;
        let ripples = document.createElement('span');
        ripples.classList.add('ripple-circle');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        this.appendChild(ripples);
        setTimeout(() => { ripples.remove(); }, 600);
    });
});

// ==========================================
// 8. Particle Engine
// ==========================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = window.innerWidth < 768 ? 50 : 120;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ==========================================
// 9. Live Digital Clock, Date & Location (OpenStreetMap)
// ==========================================
let userLocation = "📍 Indonesia"; 
let isLocationFetched = false;

function initLocation() {
    if (!navigator.geolocation) {
        isLocationFetched = true;
        return; 
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=id`);
                const data = await response.json();
                
                if (data && data.address) {
                    const city = data.address.city || data.address.regency || data.address.county || data.address.town || "Indonesia";
                    const state = data.address.state || "";
                    
                    if (city !== "Indonesia" && state) {
                        userLocation = `📍 ${city}, ${state}`;
                    }
                }
            } catch (error) {
                // Keep default fallback
            } finally {
                isLocationFetched = true;
            }
        },
        (error) => {
            isLocationFetched = true;
        }
    );
}

initLocation();

function updateLiveWidget() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('widget-time').textContent = `🕒 ${hours}:${minutes}:${seconds} WIB`;

    const daysIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthsIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const dayName = daysIndo[now.getDay()];
    const date = now.getDate();
    const monthName = monthsIndo[now.getMonth()];
    const year = now.getFullYear();
    document.getElementById('widget-date').textContent = `📅 ${dayName}, ${date} ${monthName} ${year}`;

    if (isLocationFetched) {
        document.getElementById('widget-location').textContent = userLocation;
    }
}

setInterval(updateLiveWidget, 1000);
updateLiveWidget();