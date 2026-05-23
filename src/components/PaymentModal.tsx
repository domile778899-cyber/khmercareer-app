import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Loader2,
  CreditCard,
  Smartphone,
  QrCode,
  ChevronRight,
  ShieldCheck,
  Clock,
  Banknote,
} from "lucide-react";

type PaymentMethod = "aba" | "wing" | "khqr";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  itemName: string;
  onSuccess: () => void;
}

/* ─────────────────────── hash → 25×25 QR pattern ─────────────────────── */

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h = (h << 5) - h + ch;
    h |= 0;
  }
  return Math.abs(h);
}

function getQRPixels(data: string): boolean[][] {
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };
  const rand = rng(hashString(data));
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rand() > 0.5)
  );

  // Finder patterns (top-left, top-right, bottom-left)
  const finderSize = 7;
  const addFinder = (r0: number, c0: number) => {
    for (let r = -1; r <= finderSize; r++) {
      for (let c = -1; c <= finderSize; c++) {
        const inBounds = r >= 0 && r < finderSize && c >= 0 && c < finderSize;
        const isBorder = r === 0 || r === finderSize - 1 || c === 0 || c === finderSize - 1;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (inBounds) {
          grid[r0 + r][c0 + c] = isBorder || isCenter;
        }
      }
    }
  };
  addFinder(0, 0);
  addFinder(0, size - finderSize);
  addFinder(size - finderSize, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Dark module
  grid[size - 8][8] = true;

  return grid;
}

/* ─────────────────────── QR sub-component ─────────────────────── */

function QRPattern({ data, label }: { data: string; label: string }) {
  const pixels = getQRPixels(data);
  const cellSize = 8;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white rounded-xl border-2 border-[#D4AF37]/30 shadow-lg p-4">
        <svg
          width={cellSize * 25}
          height={cellSize * 25}
          viewBox={`0 0 ${cellSize * 25} ${cellSize * 25}`}
          className="block"
        >
          <rect width={cellSize * 25} height={cellSize * 25} fill="#ffffff" />
          {pixels.map((row, ri) =>
            row.map(
              (filled, ci) =>
                filled && (
                  <rect
                    key={`${ri}-${ci}`}
                    x={ci * cellSize + 1}
                    y={ri * cellSize + 1}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    rx={1}
                    fill="#2D2926"
                  />
                )
            )
          )}
        </svg>
      </div>
      <p className="text-xs text-[#2D2926]/60 text-center">{label}</p>
    </div>
  );
}

/* ─────────────────────── amount card ─────────────────────── */

function AmountCard({ amount }: { amount: number }) {
  return (
    <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20 p-4 text-center mb-4">
      <p className="text-sm text-[#2D2926]/60 mb-1">ចំនួនទឹកប្រាក់ / 金额 / Amount</p>
      <p className="text-3xl font-bold text-[#D4AF37] tracking-tight">
        ${amount.toFixed(2)}
      </p>
      <p className="text-xs text-[#2D2926]/50 mt-1">
        ប្រាក់រៀល ≈៛{(amount * 4100).toLocaleString()}
      </p>
    </div>
  );
}

/* ─────────────────────── processing overlay ─────────────────────── */

function ProcessingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4 rounded-2xl"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={48} className="text-[#059669]" />
      </motion.div>
      <div className="text-center">
        <p className="text-lg font-semibold text-[#2D2926]">កំពុងដំណើរការ / 处理中</p>
        <p className="text-sm text-[#2D2926]/60">Processing your payment...</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#2D2926]/40">
        <ShieldCheck size={14} />
        <span>Secured by SSL encryption</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── success overlay ─────────────────────── */

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4 rounded-2xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 size={64} className="text-[#059669]" />
      </motion.div>
      <div className="text-center">
        <p className="text-lg font-semibold text-[#2D2926]">បង់ប្រាក់ជោគជ័យ / 支付成功</p>
        <p className="text-sm text-[#2D2926]/60">Payment successful!</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── tab content: ABA Pay ─────────────────────── */

function AbaPayTab({ amount, itemName }: { amount: number; itemName: string }) {
  return (
    <div className="space-y-4">
      <AmountCard amount={amount} />

      <div className="bg-[#059669]/5 rounded-xl border border-[#059669]/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={18} className="text-[#059669]" />
          <span className="text-sm font-medium text-[#2D2926]">ABA Bank Mobile App</span>
        </div>
        <p className="text-xs text-[#2D2926]/60 mb-3">
          បើកកម្មវិធី ABA Bank របស់អ្នក ហើយស្គេន QR កូដខាងក្រោម / Open your ABA Bank app and scan the QR code below
        </p>
        <QRPattern
          data={`ABA|${itemName}|${amount}|${Date.now()}`}
          label="Scan with ABA Bank Mobile App"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#2D2926]/50">
          <Clock size={14} />
          <span>QR code expires in 5:00 minutes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#2D2926]/50">
          <ShieldCheck size={14} />
          <span>Protected by ABA Bank encryption</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── tab content: Wing ─────────────────────── */

function WingPayTab({
  amount,
  onSubmit,
}: {
  amount: number;
  onSubmit: () => void;
}) {
  const [account, setAccount] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (account.length >= 9 && pin.length >= 4) {
      onSubmit();
    }
  };

  const isValid = account.length >= 9 && pin.length >= 4;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AmountCard amount={amount} />

      <div className="bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone size={18} className="text-[#D4AF37]" />
          <span className="text-sm font-medium text-[#2D2926]">Wing Account Payment</span>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#2D2926]/70">
            Wing Account Number / លេខគណនី Wing
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#2D2926]/40 font-medium">
              +855
            </span>
            <input
              type="tel"
              value={account}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 9);
                setAccount(val);
              }}
              placeholder="08XXXXXXX"
              className="w-full pl-14 pr-4 py-3 rounded-lg border border-[#D4AF37]/30 bg-white text-[#2D2926] text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]
                         placeholder:text-[#2D2926]/30 transition-all"
            />
          </div>
          {account.length > 0 && account.length < 9 && (
            <p className="text-xs text-red-500">Please enter a valid 9-digit number</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#2D2926]/70">
            Wing PIN / លេខ PIN
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setPin(val);
            }}
            placeholder="Enter 4-6 digit PIN"
            maxLength={6}
            className="w-full px-4 py-3 rounded-lg border border-[#D4AF37]/30 bg-white text-[#2D2926] text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]
                       placeholder:text-[#2D2926]/30 transition-all tracking-widest"
          />
          {pin.length > 0 && pin.length < 4 && (
            <p className="text-xs text-red-500">PIN must be at least 4 digits</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#2D2926]/50">
          <ShieldCheck size={14} />
          <span>Your PIN is encrypted and never stored</span>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all
            ${
              isValid
                ? "bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/30 active:scale-[0.98]"
                : "bg-[#2D2926]/10 text-[#2D2926]/30 cursor-not-allowed"
            }`}
        >
          Pay with Wing — ${amount.toFixed(2)}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-[#2D2926]/40">
          By clicking Pay, you agree to Wing&apos;s Terms of Service
        </p>
      </div>
    </form>
  );
}

/* ─────────────────────── tab content: KHQR ─────────────────────── */

function KhqrTab({ amount, itemName }: { amount: number; itemName: string }) {
  const merchantId = "KHQR-MERCHANT-001";
  const merchantName = "高棉职通车 (Khmer Career Express)";
  const qrData = `KHQR|${merchantId}|${itemName}|${amount}|${Date.now()}`;

  return (
    <div className="space-y-4">
      <AmountCard amount={amount} />

      <div className="bg-[#FAF8F3] rounded-xl border border-[#2D2926]/10 p-5 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode size={20} className="text-[#059669]" />
          <span className="text-sm font-semibold text-[#2D2926]">
            KHQR — Cambodia National QR Standard
          </span>
        </div>

        <div className="flex justify-center">
          <QRPattern data={qrData} label="Scan with any banking app" />
        </div>

        <div className="space-y-2 pt-2 border-t border-[#2D2926]/10">
          <div className="flex justify-between text-xs">
            <span className="text-[#2D2926]/50">Merchant / ឈ្មោះអ្នកលក់</span>
            <span className="font-medium text-[#2D2926]">{merchantName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#2D2926]/50">Merchant ID</span>
            <span className="font-medium text-[#2D2926] font-mono">{merchantId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#2D2926]/50">Item / ទំនិញ</span>
            <span className="font-medium text-[#2D2926]">{itemName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#2D2926]/50">Amount / ចំនួន</span>
            <span className="font-bold text-[#D4AF37]">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#2D2926]/50">Currency / រូបិយបណ្ណ</span>
            <span className="font-medium text-[#2D2926]">USD / KHR</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-[#059669]/5 rounded-lg p-3">
        <Banknote size={16} className="text-[#059669] mt-0.5 shrink-0" />
        <p className="text-xs text-[#2D2926]/60 leading-relaxed">
          KHQR works with all Cambodian banks including ABA, Acleda, Canadia, Sathapana, and more.
          ស្គេន QR កូដនេះដោយប្រើកម្មវិធីធនាគារណាមួយក៏បាន
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── method tab button ─────────────────────── */

function MethodTab({
  method: _method,
  active,
  onClick,
  icon,
  label,
}: {
  method: PaymentMethod;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
        border-2 flex-1 justify-center
        ${
          active
            ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#2D2926] shadow-md shadow-[#D4AF37]/10"
            : "border-transparent bg-[#2D2926]/5 text-[#2D2926]/60 hover:bg-[#2D2926]/10 hover:text-[#2D2926]"
        }`}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#D4AF37] rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  itemName,
  onSuccess,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("aba");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const resetState = useCallback(() => {
    setSelectedMethod("aba");
    setProcessing(false);
    setCompleted(false);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(resetState, 300);
  }, [onClose, resetState]);

  const handlePaymentSubmit = useCallback(() => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 2000);
  }, []);

  const handleSuccessDone = useCallback(() => {
    onSuccess();
    handleClose();
  }, [onSuccess, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !processing) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, processing, handleClose]);

  const methodIcons: Record<PaymentMethod, ReactNode> = {
    aba: <CreditCard size={18} />,
    wing: <Smartphone size={18} />,
    khqr: <QrCode size={18} />,
  };

  const methodLabels: Record<PaymentMethod, string> = {
    aba: "ABA Pay",
    wing: "Wing",
    khqr: "KHQR",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={processing ? undefined : handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#FAF8F3] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* ─── Overlays ─── */}
            <AnimatePresence>
              {processing && <ProcessingOverlay />}
              {completed && <SuccessOverlay onDone={handleSuccessDone} />}
            </AnimatePresence>

            {/* ─── Header ─── */}
            <div className="relative bg-gradient-to-r from-[#D4AF37] to-[#C4A030] px-6 py-5">
              <button
                type="button"
                onClick={processing ? undefined : handleClose}
                disabled={processing}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-30"
              >
                <X size={18} className="text-white" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Banknote size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    បង់ប្រាក់ / 支付
                  </h2>
                  <p className="text-sm text-white/80">Payment</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-white/70 text-xs">
                <span className="bg-white/20 px-2 py-0.5 rounded-full">{itemName}</span>
                <ChevronRight size={12} />
                <span>${amount.toFixed(2)}</span>
              </div>
            </div>

            {/* ─── Method Tabs ─── */}
            <div className="px-5 pt-4">
              <div className="flex gap-2 relative">
                {(Object.keys(methodLabels) as PaymentMethod[]).map((method) => (
                  <MethodTab
                    key={method}
                    method={method}
                    active={selectedMethod === method}
                    onClick={() => setSelectedMethod(method)}
                    icon={methodIcons[method]}
                    label={methodLabels[method]}
                  />
                ))}
              </div>
            </div>

            {/* ─── Tab Content ─── */}
            <div className="px-5 py-4 max-h-[55vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMethod}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedMethod === "aba" && (
                    <AbaPayTab amount={amount} itemName={itemName} />
                  )}
                  {selectedMethod === "wing" && (
                    <WingPayTab amount={amount} onSubmit={handlePaymentSubmit} />
                  )}
                  {selectedMethod === "khqr" && (
                    <KhqrTab amount={amount} itemName={itemName} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── Footer ─── */}
            <div className="px-5 py-3 bg-[#2D2926]/5 border-t border-[#2D2926]/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#2D2926]/40">
                <ShieldCheck size={13} />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#2D2926]/30 uppercase tracking-wider">
                  高棉职通车
                </span>
                <div className="w-px h-3 bg-[#2D2926]/10" />
                <span className="text-[10px] text-[#2D2926]/30">Secure Checkout</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
