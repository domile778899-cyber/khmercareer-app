import { createContext, useState, useCallback, useEffect, useContext } from "react";
import type { ReactNode } from "react";

/* ═══════════════════════════ TYPES ═══════════════════════════ */

export type PaymentMethod = "aba" | "wing" | "khqr";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed";
export type PaymentType = "subscription" | "commission" | "course" | "advertising";

export interface PaymentOrder {
  id: string;
  type: PaymentType;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  completedAt?: string;
  failReason?: string;
}

export interface PaymentContextType {
  // Current active order
  currentOrder: PaymentOrder | null;

  // Payment history
  orders: PaymentOrder[];

  // Status
  status: PaymentStatus;

  // Actions
  createOrder: (params: CreateOrderParams) => PaymentOrder;
  startPayment: (orderId: string) => void;
  completePayment: (orderId: string) => void;
  failPayment: (orderId: string, reason?: string) => void;
  resetPayment: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;

  // Current method selection
  selectedMethod: PaymentMethod;

  // Loading
  isProcessing: boolean;

  // Utilities
  getOrderById: (orderId: string) => PaymentOrder | undefined;
  getOrdersByStatus: (status: PaymentStatus) => PaymentOrder[];
  getOrdersByType: (type: PaymentType) => PaymentOrder[];
}

export interface CreateOrderParams {
  type: PaymentType;
  amount: number;
  currency?: string;
  method?: PaymentMethod;
  description: string;
}

/* ═══════════════════════════ CONSTANTS ═══════════════════════════ */

const STORAGE_KEY_ORDERS = "khmercareer_payment_orders";
const STORAGE_KEY_CURRENT = "khmercareer_current_order";

/* ═══════════════════════════ HELPER FUNCTIONS ═══════════════════════════ */

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KHX-${timestamp}-${random}`;
}

function loadOrdersFromStorage(): PaymentOrder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as PaymentOrder[];
      }
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function loadCurrentOrderFromStorage(): PaymentOrder | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object" && parsed.id) {
        return parsed as PaymentOrder;
      }
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

/* ═══════════════════════════ CONTEXT ═══════════════════════════ */

export const PaymentContext = createContext<PaymentContextType>({
  currentOrder: null,
  orders: [],
  status: "pending",
  createOrder: () => ({
    id: "",
    type: "subscription",
    amount: 0,
    currency: "USD",
    method: "aba",
    status: "pending",
    description: "",
    createdAt: new Date().toISOString(),
  }),
  startPayment: () => {},
  completePayment: () => {},
  failPayment: () => {},
  resetPayment: () => {},
  setPaymentMethod: () => {},
  selectedMethod: "aba",
  isProcessing: false,
  getOrderById: () => undefined,
  getOrdersByStatus: () => [],
  getOrdersByType: () => [],
});

/* ═══════════════════════════ PROVIDER ═══════════════════════════ */

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PaymentOrder[]>(loadOrdersFromStorage);
  const [currentOrder, setCurrentOrder] = useState<PaymentOrder | null>(
    loadCurrentOrderFromStorage
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("aba");
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive status from current order
  const status: PaymentStatus = currentOrder?.status ?? "pending";

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // ignore storage errors
    }
  }, [orders]);

  // Persist current order to localStorage
  useEffect(() => {
    try {
      if (currentOrder) {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT);
      }
    } catch {
      // ignore storage errors
    }
  }, [currentOrder]);

  /**
   * Create a new payment order
   */
  const createOrder = useCallback(
    (params: CreateOrderParams): PaymentOrder => {
      const order: PaymentOrder = {
        id: generateOrderId(),
        type: params.type,
        amount: params.amount,
        currency: params.currency ?? "USD",
        method: params.method ?? selectedMethod,
        status: "pending",
        description: params.description,
        createdAt: new Date().toISOString(),
      };

      setCurrentOrder(order);
      setOrders((prev) => [order, ...prev]);
      setIsProcessing(false);
      return order;
    },
    [selectedMethod]
  );

  /**
   * Start processing a payment
   */
  const startPayment = useCallback((orderId: string) => {
    setIsProcessing(true);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "processing" as PaymentStatus } : o
      )
    );
    setCurrentOrder((prev) =>
      prev?.id === orderId
        ? { ...prev, status: "processing" as PaymentStatus }
        : prev
    );
  }, []);

  /**
   * Mark a payment as completed
   */
  const completePayment = useCallback((orderId: string) => {
    setIsProcessing(false);
    const completedAt = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "completed" as PaymentStatus, completedAt }
          : o
      )
    );
    setCurrentOrder((prev) =>
      prev?.id === orderId
        ? { ...prev, status: "completed" as PaymentStatus, completedAt }
        : prev
    );
  }, []);

  /**
   * Mark a payment as failed
   */
  const failPayment = useCallback(
    (orderId: string, reason?: string) => {
      setIsProcessing(false);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "failed" as PaymentStatus,
                failReason: reason ?? "Payment failed",
              }
            : o
        )
      );
      setCurrentOrder((prev) =>
        prev?.id === orderId
          ? {
              ...prev,
              status: "failed" as PaymentStatus,
              failReason: reason ?? "Payment failed",
            }
          : prev
      );
    },
    []
  );

  /**
   * Reset current payment state
   */
  const resetPayment = useCallback(() => {
    setCurrentOrder(null);
    setIsProcessing(false);
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    } catch {
      // ignore
    }
  }, []);

  /**
   * Set the selected payment method
   */
  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setSelectedMethod(method);
    // Also update current order if it exists and is still pending
    setCurrentOrder((prev) =>
      prev?.status === "pending" ? { ...prev, method } : prev
    );
  }, []);

  /**
   * Get order by ID
   */
  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  /**
   * Get orders by status
   */
  const getOrdersByStatus = useCallback(
    (filterStatus: PaymentStatus) =>
      orders.filter((o) => o.status === filterStatus),
    [orders]
  );

  /**
   * Get orders by type
   */
  const getOrdersByType = useCallback(
    (filterType: PaymentType) => orders.filter((o) => o.type === filterType),
    [orders]
  );

  const value: PaymentContextType = {
    currentOrder,
    orders,
    status,
    createOrder,
    startPayment,
    completePayment,
    failPayment,
    resetPayment,
    setPaymentMethod,
    selectedMethod,
    isProcessing,
    getOrderById,
    getOrdersByStatus,
    getOrdersByType,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

/* ═══════════════════════════ HOOK ═══════════════════════════ */

export function usePayment(): PaymentContextType {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}

/* ═══════════════════════════ NAMED EXPORTS ═══════════════════════════ */

export { generateOrderId };
