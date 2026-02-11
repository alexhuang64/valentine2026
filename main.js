/* --- CONFIGURATION --- */
const CONFIG = {
    YOUR_EMAIL: "phamlong101993@gmail.com",
    LOVE_LETTER: `Như Ý yêu ơi,

Trong nghệ thuật viết chữ Trung, đôi khi chính những nét xước, những vết loang lại tạo nên linh hồn cho một tác phẩm trưởng thành. Việc lỡ hẹn với tấm visa du học lần này là một 'vết sẹo' đau đớn trong bản kế hoạch của anh, nhưng nó cũng giúp anh hiểu một điều: rằng điều quý giá nhất anh đang có không phải là một kế hoạch hoàn hảo mà là sự đồng hành nhu hòa cùng em suốt 3 năm qua.

Anh nợ em một hành trình rực rỡ dưới nắng ấm, và anh hứa sẽ dùng cả sự quyết tâm của mình để trả lại em vào một ngày không xa. Đừng buồn vì một cánh cửa chưa hẳn hoàn toàn đóng lại, bởi trái tim anh vẫn luôn mở rộng để đón em vào, ấm áp và vẹn nguyên hơn bao giờ hết. Valentine này, hãy để anh được chăm sóc em, được là người đàn ông xứng đáng với tình yêu chân thành của em.

Như Ý à, be my valentine ?...`
};

/* --- AUDIO SYSTEM --- */
const AudioController = {
    ctx: null,
    bgMusic: document.getElementById('bgMusic'),
    isPlaying: false,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }


        // Auto-play music on FIRST interaction anywhere on the page
        const unlockAudio = (e) => {
            // Don't interfere with scrolling on the letter
            if (e.target.closest('.letter-content')) return;

            this.playMusic();
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio, { passive: true });
    },

    playTone(freq, type, duration, vol = 0.2) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playClick() {
        this.playTone(800, 'sine', 0.1, 0.2);
        if (navigator.vibrate) navigator.vibrate(10);
    },
    playPop() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },
    playSwoosh() {
        this.playTone(200, 'triangle', 0.3, 0.1);
    },
    playSuccess() {
        [440, 554, 659, 880].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.6, 0.1), i * 100);
        });
    },

    toggleMusic() {
        if (this.isPlaying) {
            this.bgMusic.pause();
            this.isPlaying = false;
            document.querySelector('.music-control').style.opacity = "0.5";
        } else {
            this.bgMusic.play().then(() => {
                this.isPlaying = true;
                document.querySelector('.music-control').style.opacity = "1";
                this.init();
            }).catch(e => {
                console.error("Music play failed:", e);
                alert("Hãy bấm vào nút nhạc 🎵 để bật nhạc nhé!");
            });
        }
    },

    playMusic() {
        if (!this.isPlaying) {
            this.bgMusic.play().then(() => {
                this.isPlaying = true;
                document.querySelector('.music-control').style.opacity = "1";
                this.init();
            }).catch(e => console.log("Auto-play blocked:", e));
        }
    }
};

/* --- UI CONTROLLER --- */
const UI = {
    noDodgeCount: 0, // Track NO button clicks

    nextScreen(targetId) {
        AudioController.playSwoosh();

        // Change Screen
        document.querySelectorAll('.container').forEach(c => c.classList.remove('active'));
        const target = document.getElementById(targetId);
        target.classList.add('active');

        // Logic per screen
        if (targetId === 'screen-gallery') {
            setTimeout(() => AudioController.playMusic(), 500);
        }
        if (targetId === 'screen-letter') {
            Typewriter.start();
        }
        if (targetId === 'screen-proposal') {
            // Reset counter and disable YES when entering proposal screen
            this.noDodgeCount = 0;
            const yesBtn = document.getElementById('yesBtn');
            yesBtn.disabled = true;
            yesBtn.style.opacity = '0.3';
            yesBtn.style.cursor = 'not-allowed';
            yesBtn.innerText = 'YES! 😍 (Try NO first)';
        }
    },


    dodgeButton(event) {
        // Prevent default touch/mouse behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        AudioController.playPop();
        const btn = document.getElementById('noBtn');
        const yesBtn = document.getElementById('yesBtn');
        const container = document.getElementById('screen-proposal');

        // Increment dodge counter
        this.noDodgeCount++;

        // Move button to container if not already there
        if (btn.parentNode !== container) {
            container.appendChild(btn);
        }

        const phrases = [
            "No 😢",
            "Are you sure?",
            "Really?",
            "Think again!",
            "Don't break my heart 💔",
            "Please? 🥺",
            "Last chance!",
            "You can't say no!",
            "I'll give you cookies 🍪",
            "But I love you! ❤️",
            "Still NO? 😭",
            "Okay, I'll cry...",
            "Just click YES!",
            "Năn nỉ mà...",
            "Thôi màaaaaa",
            "Đừng phũ phàng thế chứ!",
            "Em không thương anh à?",
            "Bấm YES đi mòa 💖"
        ];

        // Change text
        btn.innerText = phrases[Math.floor(Math.random() * phrases.length)];

        // Get limits relative to container
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const btnWidth = btn.offsetWidth;
        const btnHeight = btn.offsetHeight;
        const padding = 20;

        const maxLeft = containerWidth - btnWidth - padding;
        const maxTop = containerHeight - btnHeight - padding;

        let currentLeft = parseFloat(btn.style.left) || 0;
        let currentTop = parseFloat(btn.style.top) || 0;
        let newLeft, newTop;
        let distance = 0;

        // Try to find a position at least 50px away
        let attempts = 0;
        do {
            newLeft = Math.max(padding, Math.random() * maxLeft);
            newTop = Math.max(padding, Math.random() * maxTop);

            const dx = newLeft - currentLeft;
            const dy = newTop - currentTop;
            distance = Math.sqrt(dx * dx + dy * dy);
            attempts++;
        } while (distance < 50 && attempts < 10);

        // Apply style
        btn.style.position = 'absolute';
        btn.style.left = newLeft + 'px';
        btn.style.top = newTop + 'px';

        btn.style.transform = 'none';
        btn.style.margin = '0';

        // Make YES button grow bigger each time NO escapes
        const currentScale = parseFloat(yesBtn.getAttribute('data-scale')) || 0.5;
        const newScale = currentScale + 0.1; // Grow by 10%
        yesBtn.style.transform = `scale(${newScale})`;
        yesBtn.setAttribute('data-scale', newScale);

        // After 3 dodges, enable YES button
        if (this.noDodgeCount >= 3) {
            yesBtn.disabled = false;
            yesBtn.style.opacity = '1';
            yesBtn.style.cursor = 'pointer';
            yesBtn.innerText = 'YES! 😍';
            yesBtn.style.animation = 'glow 1s ease-in-out infinite';

            // Play success sound
            AudioController.playSuccess();
        }
    },

    acceptProposal() {
        const yesBtn = document.getElementById('yesBtn');
        // Check if YES button is enabled
        if (yesBtn.disabled) {
            AudioController.playPop();
            alert('Hãy thử bấm nút NO trước đã nhé! 😊');
            return;
        }

        AudioController.playSuccess();
        this.nextScreen('screen-celebration');
        createConfetti();
        sendEmail();
    }
};

/* --- TYPEWRITER --- */
const Typewriter = {
    charIndex: 0,
    elem: null,

    start() {
        this.elem = document.getElementById('typewriter-text');
        this.elem.innerHTML = "";
        this.charIndex = 0;
        this.type();
    },

    type() {
        if (this.charIndex < CONFIG.LOVE_LETTER.length) {
            const char = CONFIG.LOVE_LETTER.charAt(this.charIndex);
            this.elem.innerHTML += char === '\n' ? '<br>' : char;
            this.charIndex++;
            setTimeout(() => this.type(), 50);
        } else {
            const btn = document.getElementById('letter-next-btn');
            if (btn) {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        }
    }
};

/* --- PARTICLES & CONFETTI --- */
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + 'vw';
        p.style.width = Math.random() * 10 + 5 + 'px';
        p.style.height = p.style.width;
        p.style.animationDuration = Math.random() * 10 + 10 + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(p);
    }
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    for (let i = 0; i < 150; i++) {
        const c = document.createElement('div');
        c.style.position = 'fixed';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-10px';
        c.style.width = '10px';
        c.style.height = '10px';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.zIndex = '1000';
        document.body.appendChild(c);

        c.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 3000,
            easing: 'linear',
            fill: 'forwards'
        });
    }
}

/* --- EMAIL --- */
function sendEmail() {
    if (CONFIG.YOUR_EMAIL.includes("INSERT")) return;

    fetch(`https://formsubmit.co/ajax/${CONFIG.YOUR_EMAIL}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            subject: "SHE SAID YES! 💖",
            message: "Congratulations! Proposal accepted! 💍✨",
            timestamp: new Date().toLocaleString()
        })
    }).then(r => r.json()).then(d => console.log("Email sent", d)).catch(e => console.error("Email error", e));
}

// Init
createParticles();
AudioController.init(); // Initialize audio context and interaction listeners immediately

// Add event listeners for No button
document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');
    if (noBtn) {
        // Desktop: mouseover
        noBtn.addEventListener('mouseover', (e) => {
            UI.dodgeButton(e);
        });

        // Mobile: touchstart (with passive:false to allow preventDefault)
        noBtn.addEventListener('touchstart', (e) => {
            UI.dodgeButton(e);
        }, { passive: false });

        // Prevent click on No button from doing anything
        noBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }
});

// Global Accessors for HTML onclick events
window.playClickSound = () => AudioController.playClick();
window.nextScreen = (id) => UI.nextScreen(id);
window.toggleMusic = () => AudioController.toggleMusic();
window.dodgeButton = (e) => UI.dodgeButton(e);
window.acceptProposal = () => UI.acceptProposal();
