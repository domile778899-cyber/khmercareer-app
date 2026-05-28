import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { isHolidayToday } from '../../data/cambodiaHolidays';

interface Props {
  className?: string;
  forcedHolidayId?: string; // For testing specific holiday effects
}

// ---- Particle System Base ----
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  life: number;
  maxLife: number;
}

function createParticle(w: number, h: number, color: string, sizeRange: [number, number]): Particle {
  const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
  return {
    x: Math.random() * w,
    y: -size,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 0.5 + Math.random() * 1.5,
    size,
    opacity: 0.6 + Math.random() * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
    color,
    life: 0,
    maxLife: 200 + Math.random() * 200,
  };
}

function updateParticle(p: Particle, w: number, h: number): boolean {
  p.x += p.vx;
  p.y += p.vy;
  p.rotation += p.rotationSpeed;
  p.life++;
  p.vy += 0.005; // gravity
  p.vx += (Math.random() - 0.5) * 0.02; // wind

  // Fade near edges
  if (p.y > h - 50) {
    p.opacity -= 0.02;
  }

  return p.y < h + p.size && p.opacity > 0 && p.life < p.maxLife;
}

// ---- Khmer New Year: Petal Falling ----
function usePetalEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#F9A8D4', '#FBCFE8', '#FCE7F3', '#F472B6', '#FBBF24', '#FCD34D'];
    const w = canvas.width;
    const h = canvas.height;

    // Initialize particles
    for (let i = 0; i < 60; i++) {
      const p = createParticle(w, h, colors[Math.floor(Math.random() * colors.length)], [4, 12]);
      p.y = Math.random() * h;
      particlesRef.current.push(p);
    }

    function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Draw petal shape
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Petal vein
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.5, 0);
      ctx.lineTo(p.size * 0.5, 0);
      ctx.stroke();

      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles occasionally
      if (particlesRef.current.length < 80 && Math.random() < 0.1) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesRef.current.push(createParticle(canvas.width, canvas.height, color, [4, 12]));
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        const alive = updateParticle(p, canvas.width, canvas.height);
        if (alive) drawPetal(ctx, p);
        return alive;
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();
  }, [canvasRef]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    particlesRef.current = [];
  }, []);

  return { start, stop };
}

// ---- Water Festival: Floating Lanterns ----
function useWaterEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  interface Lantern {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    glow: number;
    color: string;
  }

  const lanternsRef = useRef<Lantern[]>([]);
  const rafRef = useRef<number>(0);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#F59E0B', '#FBBF24', '#FCD34D', '#EAB308', '#06B6D4'];
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < 25; i++) {
      lanternsRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.5,
        size: 6 + Math.random() * 8,
        opacity: 0.4 + Math.random() * 0.4,
        glow: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;

    function drawLantern(ctx: CanvasRenderingContext2D, l: Lantern) {
      ctx.save();
      ctx.globalAlpha = l.opacity;

      // Glow
      const gradient = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 3);
      gradient.addColorStop(0, l.color + '60');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Lantern body
      ctx.fillStyle = l.color;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Draw water waves
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      for (let y = canvas.height * 0.6; y < canvas.height; y += 20) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
          const waveY = y + Math.sin(x * 0.02 + time + y * 0.05) * 5;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      lanternsRef.current = lanternsRef.current.filter((l) => {
        l.x += l.vx + Math.sin(time + l.y * 0.01) * 0.2;
        l.y += l.vy;
        l.opacity -= 0.0003;

        if (l.y > -20 && l.opacity > 0) {
          drawLantern(ctx, l);
          return true;
        }
        // Recycle lantern
        if (Math.random() < 0.05) {
          l.y = canvas.height + 20;
          l.x = Math.random() * canvas.width;
          l.opacity = 0.4 + Math.random() * 0.4;
          return true;
        }
        return false;
      });

      // Add new lanterns
      if (lanternsRef.current.length < 35 && Math.random() < 0.03) {
        lanternsRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2 - Math.random() * 0.5,
          size: 6 + Math.random() * 8,
          opacity: 0.4 + Math.random() * 0.4,
          glow: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();
  }, [canvasRef]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    lanternsRef.current = [];
  }, []);

  return { start, stop };
}

// ---- Pchum Ben: Fireflies ----
function useFireflyEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  interface Firefly {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    pulseSpeed: number;
    pulseOffset: number;
    color: string;
  }

  const firefliesRef = useRef<Firefly[]>([]);
  const rafRef = useRef<number>(0);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < 40; i++) {
      firefliesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 1.5 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.7,
        pulseSpeed: 0.02 + Math.random() * 0.04,
        pulseOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.3 ? '#FBBF24' : '#F59E0B',
      });
    }

    let time = 0;

    function drawFirefly(ctx: CanvasRenderingContext2D, f: Firefly) {
      const pulse = Math.sin(time * f.pulseSpeed + f.pulseOffset) * 0.3 + 0.7;
      ctx.save();
      ctx.globalAlpha = f.opacity * pulse;

      // Glow
      const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4);
      gradient.addColorStop(0, f.color + '80');
      gradient.addColorStop(0.5, f.color + '30');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      firefliesRef.current.forEach((f) => {
        f.x += f.vx + Math.sin(time * 0.01 + f.pulseOffset) * 0.3;
        f.y += f.vy + Math.cos(time * 0.01 + f.pulseOffset) * 0.2;

        // Bounce off edges
        if (f.x < 0 || f.x > canvas.width) f.vx *= -1;
        if (f.y < 0 || f.y > canvas.height) f.vy *= -1;

        // Keep in bounds
        f.x = Math.max(5, Math.min(canvas.width - 5, f.x));
        f.y = Math.max(5, Math.min(canvas.height - 5, f.y));

        drawFirefly(ctx, f);
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();
  }, [canvasRef]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    firefliesRef.current = [];
  }, []);

  return { start, stop };
}

// ---- Independence Day: Fireworks ----
function useFireworkEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  interface Firework {
    x: number;
    y: number;
    targetY: number;
    vx: number;
    vy: number;
    color: string;
    exploded: boolean;
    particles: FireworkParticle[];
    dead: boolean;
  }

  interface FireworkParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    decay: number;
  }

  const fireworksRef = useRef<Firework[]>([]);
  const rafRef = useRef<number>(0);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#06B6D4'];

    function createFirework(): Firework {
      const x = 80 + Math.random() * (canvas.width - 160);
      return {
        x,
        y: canvas.height,
        targetY: 50 + Math.random() * (canvas.height * 0.4),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(6 + Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        exploded: false,
        particles: [],
        dead: false,
      };
    }

    function explode(f: Firework) {
      f.exploded = true;
      const particleCount = 40 + Math.random() * 30;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const speed = 1 + Math.random() * 3;
        f.particles.push({
          x: f.x,
          y: f.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2,
          opacity: 1,
          color: f.color,
          decay: 0.008 + Math.random() * 0.012,
        });
      }
    }

    function animate() {
      if (!canvas || !ctx) return;
      // Trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Launch new fireworks occasionally
      if (fireworksRef.current.length < 6 && Math.random() < 0.02) {
        fireworksRef.current.push(createFirework());
      }

      fireworksRef.current = fireworksRef.current.filter((f) => {
        if (!f.exploded) {
          // Rising phase
          f.x += f.vx;
          f.y += f.vy;
          f.vy += 0.08; // gravity

          // Draw trail
          ctx.save();
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (f.vy >= 0 || f.y <= f.targetY) {
            explode(f);
          }
          return true;
        }

        // Exploded particles
        let allDead = true;
        f.particles.forEach((p) => {
          if (p.opacity <= 0) return;
          allDead = false;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          p.opacity -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        return !allDead;
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    // Start with black bg
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Launch initial fireworks
    for (let i = 0; i < 3; i++) {
      const fw = createFirework();
      fw.y = canvas.height - Math.random() * 100;
      fireworksRef.current.push(fw);
    }

    animate();
  }, [canvasRef]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    fireworksRef.current = [];
  }, []);

  return { start, stop };
}

// ---- Confetti Effect (default) ----
function useConfettiEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < 50; i++) {
      const p = createParticle(w, h, colors[Math.floor(Math.random() * colors.length)], [4, 10]);
      p.vx = (Math.random() - 0.5) * 2;
      p.vy = 1 + Math.random() * 2;
      p.y = Math.random() * h;
      particlesRef.current.push(p);
    }

    function drawConfetti(ctx: CanvasRenderingContext2D, p: Particle) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particlesRef.current.length < 70 && Math.random() < 0.1) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesRef.current.push(createParticle(canvas.width, canvas.height, color, [4, 10]));
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        const alive = updateParticle(p, canvas.width, canvas.height);
        if (alive) drawConfetti(ctx, p);
        return alive;
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();
  }, [canvasRef]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    particlesRef.current = [];
  }, []);

  return { start, stop };
}

export function HolidayEffects({ className, forcedHolidayId }: Props) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHolidayId, setActiveHolidayId] = useState<string | null>(forcedHolidayId ?? null);

  // Determine active effect based on current holiday
  useEffect(() => {
    if (forcedHolidayId) {
      setActiveHolidayId(forcedHolidayId);
      return;
    }
    const today = isHolidayToday();
    if (today) {
      setActiveHolidayId(today.id);
    }
  }, [forcedHolidayId]);

  const effects = {
    petals: usePetalEffect(canvasRef),
    water: useWaterEffect(canvasRef),
    fireflies: useFireflyEffect(canvasRef),
    fireworks: useFireworkEffect(canvasRef),
    confetti: useConfettiEffect(canvasRef),
  };

  // Route to correct effect
  useEffect(() => {
    if (!activeHolidayId || !canvasRef.current) return;

    const id = activeHolidayId.toLowerCase();

    // Setup canvas size
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    // Stop all effects
    Object.values(effects).forEach((e) => e.stop());

    // Determine which effect to use
    if (id.includes('new-year') && id.includes('khmer')) {
      effects.petals.start();
    } else if (id.includes('bon-om-touk') || id.includes('water')) {
      effects.water.start();
    } else if (id.includes('pchum-ben') || id.includes('ancestors')) {
      effects.fireflies.start();
    } else if (id.includes('independence')) {
      effects.fireworks.start();
    } else {
      effects.confetti.start();
    }

    return () => {
      Object.values(effects).forEach((e) => e.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHolidayId]);

  // Handle resize
  useEffect(() => {
    function handleResize() {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!activeHolidayId) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className || ''}`}
      style={{ minHeight: '300px' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative z-10 p-6">
        <p className="text-sm font-medium text-gray-500">
          {t('holidayEffects.active', 'Holiday Effects Active')}
        </p>
      </div>
    </div>
  );
}
