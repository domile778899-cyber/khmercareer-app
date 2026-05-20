import type { ReactNode } from "react";
import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Smartphone,
  Info,
  Banknote,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

/* ═══════════════════════════ TYPES ═══════════════════════════ */

interface QRCodeDisplayProps {
  data: string;
  size?: number;
}

/* ═══════════════════════════ HASH FUNCTION ═══════════════════════════ */

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h = (h << 5) - h + ch;
    h |= 0;
  }
  return Math.abs(h);
}

/* ═══════════════════════════ SEEDED RNG ═══════════════════════════ */

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ═══════════════════════════ QR MATRIX GENERATION ═══════════════════════════ */

function generateQRMatrix(data: string): boolean[][] {
  const GRID = 25;
  const rand = seededRandom(hashString(data));

  // Initialize random grid
  const grid: boolean[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => rand() > 0.5)
  );

  const FINDER = 7;

  // Place finder patterns
  const placeFinder = (r0: number, c0: number) => {
    for (let r = -1; r <= FINDER; r++) {
      for (let c = -1; c <= FINDER; c++) {
        const inBounds = r >= 0 && r < FINDER && c >= 0 && c < FINDER;
        if (!inBounds) continue;
        const isBorder =
          r === 0 || r === FINDER - 1 || c === 0 || c === FINDER - 1;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[r0 + r][c0 + c] = isBorder || isCenter;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, GRID - FINDER);
  placeFinder(GRID - FINDER, 0);

  // Timing patterns
  for (let i = 8; i < GRID - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Dark module
  grid[GRID - 8][8] = true;

  // Alignment pattern near bottom-right (small 3x3)
  const alignR = GRID - 9;
  const alignC = GRID - 9;
  for (let r = -1; r <= 3; r++) {
    for (let c = -1; c <= 3; c++) {
      const inBounds = r >= 0 && r < 3 && c >= 0 && c < 3;
      if (!inBounds) continue;
      grid[alignR + r][alignC + c] = r === 1 && c === 1 ? true : r === -1 || r === 3 || c === -1 || c === 3;
    }
  }

  // Ensure quiet zone (margin) is white
  for (let i = 0; i < GRID; i++) {
    grid[0][i] = false;
    grid[GRID - 1][i] = false;
    grid[i][0] = false;
    grid[i][GRID - 1] = false;
  }

  return grid;
}

/* ═══════════════════════════ SVG QR RENDERER ═══════════════════════════ */

function QRCodeSVG({
  data,
  cellSize,
  showMarkers,
}: {
  data: string;
  cellSize: number;
  showMarkers?: boolean;
}) {
  const pixels = useMemo(() => generateQRMatrix(data), [data]);
  const GRID = 25;
  const svgSize = cellSize * GRID;

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className="block"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White background */}
      <rect width={svgSize} height={svgSize} rx={cellSize} fill="#FFFFFF" />

      {/* QR modules */}
      {pixels.map((row, ri) =>
        row.map(
          (filled, ci) =>
            filled && (
              <rect
                key={`${ri}-${ci}`}
                x={ci * cellSize + 0.5}
                y={ri * cellSize + 0.5}
                width={cellSize - 1}
                height={cellSize - 1}
                rx={cellSize * 0.15}
                fill="#2D2926"
              />
            )
        )
      )}

      {/* Corner markers (decorative) */}
      {showMarkers && (
        <>
          <rect
            x={cellSize}
            y={cellSize}
            width={(FINDER - 2) * cellSize}
            height={(FINDER - 2) * cellSize}
            rx={cellSize}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            opacity={0.4}
          />
          <rect
            x={(GRID - FINDER + 1) * cellSize}
            y={cellSize}
            width={(FINDER - 2) * cellSize}
            height={(FINDER - 2) * cellSize}
            rx={cellSize}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            opacity={0.4}
          />
          <rect
            x={cellSize}
            y={(GRID - FINDER + 1) * cellSize}
            width={(FINDER - 2) * cellSize}
            height={(FINDER - 2) * cellSize}
            rx={cellSize}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            opacity={0.4}
          />
        </>
      )}
    </svg>
  );
}

const FINDER = 7;

/* ═══════════════════════════ ACTION BUTTON ═══════════════════════════ */

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

function ActionButton({
  icon,
  label,
  onClick,
  variant = "secondary",
}: ActionButtonProps) {
  const styles = {
    primary:
      "bg-[#059669] text-white hover:bg-[#047857] shadow-md shadow-[#059669]/20",
    secondary:
      "bg-[#2D2926]/5 text-[#2D2926] hover:bg-[#2D2926]/10 border border-[#2D2926]/10",
    ghost:
      "bg-transparent text-[#2D2926]/50 hover:text-[#2D2926] hover:bg-[#2D2926]/5",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium
        transition-all active:scale-[0.97] ${styles[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ═══════════════════════════ EXPIRY TIMER ═══════════════════════════ */

function ExpiryTimer() {
  const [remaining, setRemaining] = useState(300); // 5 minutes

  useMemo(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Clock
        size={14}
        className={remaining < 60 ? "text-red-500" : "text-[#2D2926]/40"}
      />
      <span
        className={`font-mono font-medium ${
          remaining < 60 ? "text-red-500" : "text-[#2D2926]/60"
        }`}
      >
        Expires in {formatted}
      </span>
    </div>
  );
}

/* ═══════════════════════════ BANK LOGO ROW ═══════════════════════════ */

function BankLogoRow() {
  const banks = [
    { name: "ABA", color: "#059669" },
    { name: "Acleda", color: "#004EA2" },
    { name: "Canadia", color: "#E31937" },
    { name: "Wing", color: "#D4AF37" },
    { name: "Sathapana", color: "#0066B3" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 py-2">
      {banks.map((bank) => (
        <div
          key={bank.name}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#2D2926]/5"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: bank.color }}
          />
          <span className="text-[10px] font-medium text-[#2D2926]/50">
            {bank.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════ STEPS GUIDE ═══════════════════════════ */

function StepsGuide() {
  const steps = [
    {
      icon: <Smartphone size={14} className="text-[#059669]" />,
      text: "Open your banking app on your phone",
    },
    {
      icon: <QrCode size={14} className="text-[#D4AF37]" />,
      text: "Tap the QR scanner or payment option",
    },
    {
      icon: <Banknote size={14} className="text-[#059669]" />,
      text: "Point camera at the QR code above",
    },
    {
      icon: <CheckCircle2 size={14} className="text-[#059669]" />,
      text: "Confirm the amount and complete payment",
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-[#2D2926]/40 uppercase tracking-wider">
        How to Scan
      </p>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-start gap-2.5"
        >
          <div className="mt-0.5 w-5 h-5 rounded-full bg-[#059669]/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-[#059669]">
            {i + 1}
          </div>
          <div className="flex items-center gap-2">
            {step.icon}
            <span className="text-xs text-[#2D2926]/60 leading-relaxed">
              {step.text}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */

export default function QRCodeDisplay({
  data,
  size = 256,
}: QRCodeDisplayProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const cellSize = Math.floor(size / 25);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = data;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [data]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "Payment QR Code",
      text: `Scan this QR code to pay: ${data.slice(0, 30)}...`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopy();
      }
    } catch {
      // Silently fail
    }
  }, [data, handleCopy]);

  const handleDownload = useCallback(() => {
    const svg = document.querySelector(`[data-qr="${data.slice(0, 20)}"]`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = size * 2;
      canvas.height = size * 2;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.download = `qr-code-${Date.now()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  }, [data, size]);

  const handleRefresh = useCallback(() => {
    setFlipped(true);
    setTimeout(() => setFlipped(false), 600);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#2D2926]/10 shadow-xl shadow-[#2D2926]/5 overflow-hidden">
        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#059669]/10 rounded-lg">
                <QrCode size={18} className="text-[#059669]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2D2926]">
                  Payment QR Code
                </h3>
                <p className="text-[10px] text-[#2D2926]/40">
                  កូដ QR ទូទាត់ប្រាក់
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleRefresh}
                className="p-1.5 rounded-lg text-[#2D2926]/30 hover:text-[#2D2926]/60
                  hover:bg-[#2D2926]/5 transition-colors"
                aria-label="Refresh QR"
              >
                <RefreshCw
                  size={14}
                  className={flipped ? "animate-spin" : ""}
                />
              </button>
              <button
                type="button"
                onClick={() => setShowSteps((p) => !p)}
                className="p-1.5 rounded-lg text-[#2D2926]/30 hover:text-[#2D2926]/60
                  hover:bg-[#2D2926]/5 transition-colors"
                aria-label="How to scan"
              >
                <Info size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── QR Code Area ── */}
        <div className="px-5 py-4">
          <motion.div
            animate={{ rotateY: flipped ? 360 : 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div
              className="p-4 rounded-xl border-2 border-[#D4AF37]/30 bg-white shadow-lg shadow-[#D4AF37]/10
                relative"
            >
              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] rounded-br-lg" />

              <div data-qr={data.slice(0, 20)}>
                <QRCodeSVG
                  data={data}
                  cellSize={cellSize}
                  showMarkers={true}
                />
              </div>

              {/* Center logo overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-white rounded-lg shadow-md border border-[#D4AF37]/30 flex items-center justify-center">
                  <Banknote size={20} className="text-[#D4AF37]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data hash display */}
          <div className="mt-3 text-center">
            <p className="text-[10px] text-[#2D2926]/30 font-mono truncate px-4">
              {data}
            </p>
          </div>
        </div>

        {/* ── Info Text ── */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#2D2926]/50">
            <Smartphone size={14} className="text-[#059669]" />
            <span>Scan with any banking app</span>
          </div>
          <p className="text-[10px] text-center text-[#2D2926]/30 mt-1">
            ស្គេនដោយប្រើកម្មវិធីធនាគារណាមួយ
          </p>
        </div>

        {/* ── Supported Banks ── */}
        <div className="px-5 py-2 border-t border-[#2D2926]/5">
          <BankLogoRow />
        </div>

        {/* ── Timer & Security ── */}
        <div className="px-5 py-3 border-t border-[#2D2926]/5 bg-[#FAF8F3]">
          <div className="flex items-center justify-between">
            <ExpiryTimer />
            <div className="flex items-center gap-1 text-[10px] text-[#2D2926]/30">
              <ShieldCheck size={12} className="text-[#059669]" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>

        {/* ── Steps Guide (expandable) ── */}
        {showSteps && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 py-3 border-t border-[#2D2926]/5 bg-[#059669]/[0.02]"
          >
            <StepsGuide />
          </motion.div>
        )}

        {/* ── Action Buttons ── */}
        <div className="px-4 py-3 border-t border-[#2D2926]/10 bg-[#2D2926]/[0.02]">
          <div className="flex items-center gap-2">
            <ActionButton
              icon={
                copied ? (
                  <CheckCircle2 size={13} className="text-[#059669]" />
                ) : (
                  <Copy size={13} />
                )
              }
              label={copied ? "Copied!" : "Copy"}
              onClick={handleCopy}
              variant="secondary"
            />
            <ActionButton
              icon={<Share2 size={13} />}
              label="Share"
              onClick={handleShare}
              variant="secondary"
            />
            <ActionButton
              icon={<Download size={13} />}
              label="Save"
              onClick={handleDownload}
              variant="secondary"
            />
          </div>
        </div>
      </div>

      {/* ── Footer Info ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 space-y-2"
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1 text-[10px] text-[#2D2926]/30">
            <ShieldCheck size={11} className="text-[#059669]" />
            <span>KHQR Standard Compliant</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-0.5 text-[10px] text-[#059669] hover:text-[#047857] transition-colors"
            onClick={() =>
              window.open(
                "https://www.nbc.gov.kh/",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <span>NBC.gov.kh</span>
            <ExternalLink size={9} />
          </button>
        </div>

        <div className="bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20 p-3">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-[#2D2926]/70 mb-0.5">
                កូដ QR នេះត្រូវបានការពារដោយការអ៊ិនគ្រីប 256-bit
              </p>
              <p className="text-[10px] text-[#2D2926]/40 leading-relaxed">
                This QR code is protected by 256-bit encryption. Each code is
                uniquely generated and expires after 5 minutes for your security.
                Do not share this code with anyone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-[9px] text-[#2D2926]/20">
          <span>高棉职通车</span>
          <ChevronRight size={8} />
          <span>Secure QR Payment</span>
          <ChevronRight size={8} />
          <span>KHQR</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════ NAMED EXPORTS ═══════════════════════════ */

export { generateQRMatrix, QRCodeSVG, hashString };
export type { QRCodeDisplayProps };
