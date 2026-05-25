import type { ReactNode } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
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
  AlertCircle,
  Copy,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { usePayment } from "@/stores/PaymentContext";
import type { PaymentMethod, PaymentOrder } from "@/stores/PaymentContext";
import QRCodeDisplay from "./QRCodeDisplay";

/* ═══════════════════════════ TYPES ═══════════════════════════ */

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  itemName: string;
  orderType?: "subscription" | "commission" | "course" | "advertising";
  description?: string;
  onSuccess?: (order: PaymentOrder) => void;
  onFailure?: (order: PaymentOrder, reason?: string) => void;
}

/* ═══════════════════════════ UTILITY: hash → 25×25 QR pattern ═══════════════════════════ */

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
        if (!inBounds) continue;
        const isBorder = r === 0 || r === finderSize - 1 || c === 0 || c === finderSize - 1;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[r0 + r][c0 + c] = isBorder || isCenter;
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

/* ═══════════════════════════ QR sub-component (inline) ═══════════════════════════ */

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

/* ═══════════════════════════ AMOUNT CARD ═══════════════════════════ */

function AmountCard({ amount, orderId }: { amount: number; orderId?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = useCallback(() => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [orderId]);

  return (
    <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20 p-4 text-center mb-4">
      <p className="text-sm text-[#2D2926]/60 mb-1">
        ចំនួនទឹកប្រាក់ / 金额 / Amount
      </p>
      <p className="text-3xl font-bold text-[#D4AF37] tracking-tight">
        ${amount.toFixed(2)}
      </p>
      <p className="text-xs text-[#2D2926]/50 mt-1">
        ប្រាក់រៀល ≈ ៛{(amount * 4100).toLocaleString()}
      </p>
      {orderId && (
        <button
          type="button"
          onClick={handleCopyOrderId}
          className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2D2926]/5 hover:bg-[#2D2926]/10 transition-colors text-[10px] text-[#2D2926]/50 font-mono"
        >
          <span>Order: {orderId}</span>
          {copied ? (
            <CheckCircle2 size={10} className="text-[#059669]" />
          ) : (
            <Copy size={10} />
          )}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════ PROCESSING OVERLAY ═══════════════════════════ */

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
        <p className="text-lg font-semibold text-[#2D2926]">
          កំពុងដំណើរការ / 处理中
        </p>
        <p className="text-sm text-[#2D2926]/60">Processing your payment...</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#2D2926]/40">
        <ShieldCheck size={14} />
        <span>Secured by SSL encryption</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════ SUCCESS OVERLAY ═══════════════════════════ */

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
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
        <p className="text-lg font-semibold text-[#2D2926]">
          បង់ប្រាក់ជោគជ័យ / 支付成功
        </p>
        <p className="text-sm text-[#2D2926]/60">Payment successful!</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-1.5 text-xs text-[#059669] bg-[#059669]/10 px-3 py-1.5 rounded-full"
      >
        <CheckCircle2 size={12} />
        <span>Redirecting...</span>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════ FAILED OVERLAY ═══════════════════════════ */

function FailedOverlay({
  reason,
  onRetry,
  onClose,
}: {
  reason?: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4 rounded-2xl px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <AlertCircle size={64} className="text-red-500" />
      </motion.div>
      <div className="text-center">
        <p className="text-lg font-semibold text-[#2D2926]">
          បង់ប្រាក់បរាជ័យ / 支付失败
        </p>
        <p className="text-sm text-[#2D2926]/60 mt-1">
          {reason ?? "Payment failed. Please try again."}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg border border-[#2D2926]/20 text-sm font-medium text-[#2D2926]/70 hover:bg-[#2D2926]/5 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white text-sm font-medium shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all"
        >
          <RefreshCw size={14} className="inline mr-1.5" />
          Try Again
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════ TAB: ABA BANK ═══════════════════════════ */

function AbaPayTab({
  amount,
  itemName,
  orderId,
  onSubmit,
}: {
  amount: number;
  itemName: string;
  orderId?: string;
  onSubmit: () => void;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }
    if (!cardHolder.trim()) {
      newErrors.cardHolder = "Cardholder name is required";
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Format: MM/YY";
    }
    if (cvv.length < 3) {
      newErrors.cvv = "CVV must be at least 3 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [cardNumber, cardHolder, expiry, cvv]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const isValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardHolder.trim() &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvv.length >= 3;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AmountCard amount={amount} orderId={orderId} />

      {/* QR Scan Option */}
      <div className="bg-[#059669]/5 rounded-xl border border-[#059669]/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={18} className="text-[#059669]" />
          <span className="text-sm font-medium text-[#2D2926]">
            ABA Bank Mobile App
          </span>
        </div>
        <p className="text-xs text-[#2D2926]/60 mb-3">
          បើកកម្មវិធី ABA Bank របស់អ្នក ហើយស្គេន QR កូដខាងក្រោម / Open your
          ABA Bank app and scan the QR code below
        </p>
        <QRPattern
          data={`ABA|${itemName}|${amount}|${orderId ?? Date.now()}`}
          label="Scan with ABA Bank Mobile App"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2D2926]/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#FAF8F3] px-3 text-[#2D2926]/40">
            or pay with card
          </span>
        </div>
      </div>

      {/* Card Payment Form */}
      <div className="bg-white rounded-xl border border-[#D4AF37]/20 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={16} className="text-[#D4AF37]" />
          <span className="text-sm font-medium text-[#2D2926]">
            Card Payment
          </span>
        </div>

        {/* Card Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#2D2926]/70">
            Card Number / លេខកាត
          </label>
          <div className="relative">
            <CreditCard
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2926]/30"
            />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-[#2D2926] text-sm
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all
                placeholder:text-[#2D2926]/30 font-mono tracking-wide
                ${errors.cardNumber ? "border-red-300 focus:border-red-400" : "border-[#D4AF37]/30 focus:border-[#D4AF37]"}`}
            />
          </div>
          {errors.cardNumber && (
            <p className="text-xs text-red-500">{errors.cardNumber}</p>
          )}
        </div>

        {/* Card Holder */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#2D2926]/70">
            Cardholder Name / ឈ្មោះម្ចាស់កាត
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            placeholder="JOHN DOE"
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[#2D2926] text-sm
              focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all
              placeholder:text-[#2D2926]/30 uppercase
              ${errors.cardHolder ? "border-red-300 focus:border-red-400" : "border-[#D4AF37]/30 focus:border-[#D4AF37]"}`}
          />
          {errors.cardHolder && (
            <p className="text-xs text-red-500">{errors.cardHolder}</p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#2D2926]/70">
              Expiry (MM/YY)
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full px-4 py-3 rounded-lg border bg-white text-[#2D2926] text-sm font-mono
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all
                placeholder:text-[#2D2926]/30 text-center
                ${errors.expiry ? "border-red-300 focus:border-red-400" : "border-[#D4AF37]/30 focus:border-[#D4AF37]"}`}
            />
            {errors.expiry && (
              <p className="text-xs text-red-500">{errors.expiry}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#2D2926]/70">
              CVV
            </label>
            <div className="relative">
              <input
                type={showCvv ? "text" : "password"}
                value={cvv}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setCvv(val);
                }}
                placeholder="123"
                maxLength={4}
                className={`w-full px-4 py-3 pr-10 rounded-lg border bg-white text-[#2D2926] text-sm font-mono
                  focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all
                  placeholder:text-[#2D2926]/30 text-center tracking-widest
                  ${errors.cvv ? "border-red-300 focus:border-red-400" : "border-[#D4AF37]/30 focus:border-[#D4AF37]"}`}
              />
              <button
                type="button"
                onClick={() => setShowCvv((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2926]/30 hover:text-[#2D2926]/60"
              >
                {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.cvv && (
              <p className="text-xs text-red-500">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#2D2926]/50">
          <Lock size={12} />
          <span>Your card details are encrypted with 256-bit SSL</span>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all
            ${
              isValid
                ? "bg-gradient-to-r from-[#059669] to-[#047857] text-white shadow-lg shadow-[#059669]/20 hover:shadow-xl hover:shadow-[#059669]/30 active:scale-[0.98]"
                : "bg-[#2D2926]/10 text-[#2D2926]/30 cursor-not-allowed"
            }`}
        >
          Pay ${amount.toFixed(2)} with ABA
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#2D2926]/50">
          <Clock size={14} />
          <span>Payment session expires in 10:00 minutes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#2D2926]/50">
          <ShieldCheck size={14} />
          <span>Protected by ABA Bank encryption</span>
        </div>
      </div>
    </form>
  );
}

/* ═══════════════════════════ TAB: WING PAY ═══════════════════════════ */

function WingPayTab({
  amount,
  orderId,
  onSubmit,
}: {
  amount: number;
  orderId?: string;
  onSubmit: () => void;
}) {
  const [account, setAccount] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (account.length < 9) {
      newErrors.account = "Please enter a valid 9-digit Wing account number";
    }
    if (pin.length < 4) {
      newErrors.pin = "PIN must be at least 4 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [account, pin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const isValid = account.length >= 9 && pin.length >= 4;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AmountCard amount={amount} orderId={orderId} />

      <div className="bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone size={18} className="text-[#D4AF37]" />
          <span className="text-sm font-medium text-[#2D2926]">
            Wing Account Payment
          </span>
        </div>

        {/* Account Number */}
        <div className="space-y-1.5">
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
              className={`w-full pl-14 pr-4 py-3 rounded-lg border bg-white text-[#2D2926] text-sm
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all
                placeholder:text-[#2D2926]/30
                ${errors.account ? "border-red-300 focus:border-red-400" : "border-[#D4AF37]/30 focus:border-[#D4AF37]"}`}
            />
          </div>
          {errors.account && (
            <p className="text-xs text-red-500">{errors.account}</p>
          )}
        </div>

        {/* PIN */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#2D2926]/70">
            Wing PIN / លេខ PIN
          </label>
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPin(val);
              }}
              placeholder="Enter 4-6 digit PIN"
              maxLength={6}
              className={`w-full px-4 py-3 pr-10 rounded-lg border bg-white text-[#2D2926] text-sm
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all tracking-widest
                placeholder:text-[#2D2926]/30 placeholder:tracking-normal
                ${errors.pin ? "border-red-300 focus:border-red-400" : "border-[#D4AF37]/30 focus:border-[#D4AF37]"}`}
            />
            <button
              type="button"
              onClick={() => setShowPin((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2926]/30 hover:text-[#2D2926]/60"
            >
              {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.pin && <p className="text-xs text-red-500">{errors.pin}</p>}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#2D2926]/50">
          <Lock size={12} />
          <span>Your PIN is encrypted and never stored on our servers</span>
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

/* ═══════════════════════════ TAB: KHQR ═══════════════════════════ */

function KhqrTab({
  amount,
  itemName,
  orderId,
}: {
  amount: number;
  itemName: string;
  orderId?: string;
}) {
  const merchantId = "KHQR-MERCHANT-001";
  const merchantName = "高棉职通车 (Khmer Career Express)";
  const qrData = `KHQR|${merchantId}|${itemName}|${amount}|${orderId ?? Date.now()}`;

  return (
    <div className="space-y-4">
      <AmountCard amount={amount} orderId={orderId} />

      <div className="bg-[#FAF8F3] rounded-xl border border-[#2D2926]/10 p-5 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode size={20} className="text-[#059669]" />
          <span className="text-sm font-semibold text-[#2D2926]">
            KHQR — Cambodia National QR Standard
          </span>
        </div>

        {/* Use the full QRCodeDisplay component */}
        <QRCodeDisplay data={qrData} size={240} />

        {/* Transaction Details */}
        <div className="space-y-2 pt-3 border-t border-[#2D2926]/10">
          <p className="text-[10px] font-semibold text-[#2D2926]/40 uppercase tracking-wider mb-2">
            Transaction Details / ព័ត៌មានប្រតិបត្តិការ
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-[#2D2926]/50">Merchant / ឈ្មោះអ្នកលក់</span>
            <span className="font-medium text-[#2D2926]">{merchantName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#2D2926]/50">Merchant ID</span>
            <span className="font-medium text-[#2D2926] font-mono">
              {merchantId}
            </span>
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
          KHQR works with all Cambodian banks including ABA, Acleda, Canadia,
          Sathapana, and more. ស្គេន QR កូដនេះដោយប្រើកម្មវិធីធនាគារណាមួយក៏បាន
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════ METHOD TAB BUTTON ═══════════════════════════ */

function MethodTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all
        border-2 flex-1 justify-center
        ${
          active
            ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#2D2926] shadow-md shadow-[#D4AF37]/10"
            : "border-transparent bg-[#2D2926]/5 text-[#2D2926]/60 hover:bg-[#2D2926]/10 hover:text-[#2D2926]"
        }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(" ")[0]}</span>
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

/* ═══════════════════════════ SESSION TIMER ═══════════════════════════ */

function SessionTimer() {
  const [remaining, setRemaining] = useState(600); // 10 minutes

  useEffect(() => {
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
        size={12}
        className={remaining < 60 ? "text-red-500" : "text-white/70"}
      />
      <span
        className={`font-mono font-medium ${
          remaining < 60 ? "text-red-300" : "text-white/70"
        }`}
      >
        {formatted}
      </span>
    </div>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  itemName,
  orderType = "subscription",
  description,
  onSuccess,
  onFailure,
}: PaymentModalProps) {
  const {
    currentOrder,
    createOrder,
    startPayment,
    completePayment,
    failPayment,
    resetPayment,
    selectedMethod,
    setPaymentMethod,
    isProcessing,
  } = usePayment();

  const [localProcessing, setLocalProcessing] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);
  const [failReason, setFailReason] = useState<string | undefined>();
  const initialized = useRef(false);

  // Create order when modal opens
  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true;
      const order = createOrder({
        type: orderType,
        amount,
        description: description ?? itemName,
      });
      // Sync the selected method
      if (selectedMethod) {
        setPaymentMethod(selectedMethod);
      }
    }
    if (!isOpen) {
      initialized.current = false;
    }
  }, [isOpen, amount, itemName, orderType, description, createOrder, setPaymentMethod, selectedMethod]);

  const resetLocalState = useCallback(() => {
    setLocalProcessing(false);
    setLocalCompleted(false);
    setLocalFailed(false);
    setFailReason(undefined);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      resetLocalState();
      resetPayment();
    }, 300);
  }, [onClose, resetLocalState, resetPayment]);

  const handlePaymentSubmit = useCallback(() => {
    if (!currentOrder) return;
    setLocalProcessing(true);
    startPayment(currentOrder.id);

    // Simulate payment processing (2-3 seconds)
    const delay = 2000 + Math.random() * 1000;
    setTimeout(() => {
      // 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      if (isSuccess) {
        setLocalProcessing(false);
        setLocalCompleted(true);
        completePayment(currentOrder.id);
      } else {
        setLocalProcessing(false);
        setLocalFailed(true);
        const reason =
          "Payment was declined. Please check your account balance or try a different payment method.";
        setFailReason(reason);
        failPayment(currentOrder.id, reason);
      }
    }, delay);
  }, [currentOrder, startPayment, completePayment, failPayment]);

  const handleSuccessDone = useCallback(() => {
    if (currentOrder && onSuccess) {
      onSuccess(currentOrder);
    }
    handleClose();
  }, [currentOrder, onSuccess, handleClose]);

  const handleRetry = useCallback(() => {
    setLocalFailed(false);
    setFailReason(undefined);
    if (currentOrder) {
      startPayment(currentOrder.id);
      setLocalProcessing(true);
      setTimeout(() => {
        setLocalProcessing(false);
        setLocalCompleted(true);
        completePayment(currentOrder.id);
      }, 2000);
    }
  }, [currentOrder, startPayment, completePayment]);

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
      if (e.key === "Escape" && isOpen && !localProcessing) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, localProcessing, handleClose]);

  const methodIcons: Record<PaymentMethod, ReactNode> = {
    aba: <CreditCard size={18} />,
    wing: <Smartphone size={18} />,
    khqr: <QrCode size={18} />,
  };

  const methodLabels: Record<PaymentMethod, string> = {
    aba: "ABA Bank",
    wing: "Wing",
    khqr: "KHQR",
  };

  // Timer ref for countdown
  const [timerActive, setTimerActive] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={localProcessing ? undefined : handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#FAF8F3] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* ─── Overlays ─── */}
            <AnimatePresence>
              {localProcessing && <ProcessingOverlay />}
              {localCompleted && <SuccessOverlay onDone={handleSuccessDone} />}
              {localFailed && (
                <FailedOverlay
                  reason={failReason}
                  onRetry={handleRetry}
                  onClose={handleClose}
                />
              )}
            </AnimatePresence>

            {/* ─── Header ─── */}
            <div className="relative bg-gradient-to-r from-[#D4AF37] to-[#C4A030] px-6 py-5 shrink-0">
              <button
                type="button"
                onClick={localProcessing ? undefined : handleClose}
                disabled={localProcessing}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-30 z-10"
              >
                <X size={18} className="text-white" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Banknote size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white leading-tight">
                    បង់ប្រាក់ / 支付
                  </h2>
                  <p className="text-sm text-white/80">Payment</p>
                </div>
                {timerActive && (
                  <div className="hidden sm:block">
                    <SessionTimer />
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-white/70 text-xs flex-wrap">
                <span className="bg-white/20 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                  {itemName}
                </span>
                <ChevronRight size={12} />
                <span className="font-medium">${amount.toFixed(2)}</span>
                {currentOrder && (
                  <>
                    <ChevronRight size={12} />
                    <span className="font-mono text-[10px] opacity-70">
                      {currentOrder.id}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* ─── Method Tabs ─── */}
            <div className="px-5 pt-4 shrink-0">
              <div className="flex gap-2 relative">
                {(
                  Object.keys(methodLabels) as PaymentMethod[]
                ).map((method) => (
                  <MethodTab
                    key={method}
                    active={selectedMethod === method}
                    onClick={() => setPaymentMethod(method)}
                    icon={methodIcons[method]}
                    label={methodLabels[method]}
                  />
                ))}
              </div>
            </div>

            {/* ─── Tab Content (scrollable) ─── */}
            <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMethod}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedMethod === "aba" && (
                    <AbaPayTab
                      amount={amount}
                      itemName={itemName}
                      orderId={currentOrder?.id}
                      onSubmit={handlePaymentSubmit}
                    />
                  )}
                  {selectedMethod === "wing" && (
                    <WingPayTab
                      amount={amount}
                      orderId={currentOrder?.id}
                      onSubmit={handlePaymentSubmit}
                    />
                  )}
                  {selectedMethod === "khqr" && (
                    <KhqrTab
                      amount={amount}
                      itemName={itemName}
                      orderId={currentOrder?.id}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── Footer ─── */}
            <div className="px-5 py-3 bg-[#2D2926]/5 border-t border-[#2D2926]/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-[#2D2926]/40">
                <ShieldCheck size={13} />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#2D2926]/30 uppercase tracking-wider">
                  高棉职通车
                </span>
                <div className="w-px h-3 bg-[#2D2926]/10" />
                <span className="text-[10px] text-[#2D2926]/30">
                  Secure Checkout
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════ NAMED EXPORTS ═══════════════════════════ */

export type { PaymentModalProps };
