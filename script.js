
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

const colors = [
    "#FFC0CB",
    "#FF69B4",
    "#DB7093",
    "#E879F9",
    "#D8B4FE",
    "#A855F7",
    "#9333EA",
    "#F0ABFC"
];

let particles = [];
let width = 0;
let height = 0;
let heartY = 0;

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    heartY = width < 700 ? height * 0.12 : height * 0.17;

    particles = [];

    const count = width < 700 ? 65 : 140;

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 1.2 + 0.3;

        this.color = colors[
            Math.floor(Math.random() * colors.length)
        ];
    }

    update() {
        this.y -= this.speed;

        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

// Perfectly symmetrical mathematical heart
function drawHeart(x, y, scale) {
    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.beginPath();

    for (let i = 0; i <= 360; i++) {
        const t = (i * Math.PI) / 180;

        const heartX = 16 * Math.pow(Math.sin(t), 3);

        const heartY =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

        if (i === 0) {
            ctx.moveTo(heartX, -heartY);
        } else {
            ctx.lineTo(heartX, -heartY);
        }
    }

    ctx.closePath();

    ctx.fillStyle = "#FF69B4";
    ctx.shadowColor = "#FF1493";
    ctx.shadowBlur = 35;

    ctx.fill();

    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Heart animation
    const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.08;

    const heartScale = width < 900 ? 5 : 7;

    ctx.save();

    ctx.translate(width / 2, heartY);
    ctx.scale(pulse, pulse);
    ctx.translate(-width / 2, -heartY);

    drawHeart(width / 2, heartY, heartScale);

    ctx.restore();

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

resize();
animate();

const startDate = new Date(2025, 6, 28, 4, 11, 0);

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    document.getElementById("timer").innerHTML =
        `${days} днів ${hours} год ${minutes} хв ${seconds} сек`;
}

updateTimer();
setInterval(updateTimer, 1000);