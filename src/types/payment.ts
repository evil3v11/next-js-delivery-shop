export type PaymentSimulationResult = "success" | "failure" | "error";

type MockPaymentDataStatus = Omit<PaymentSimulationResult, "error">;

export interface MockPaymentData {
  id: string;
  amount: number;
  cardLastFourDigits: string;
  timestamp: string;
  paymentProcessor: string;
  status: MockPaymentDataStatus;
}

export interface PaymentSuccessData {
  orderNumber: string;
  paymentId: string;
  amount: number;
  cardLastFourDigits: string;
}

export interface MockPaymentModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentData: MockPaymentData) => void;
  onError: (error: string) => void;
}

export type TestCard =  {
  number: string;
  description: string;
  result: PaymentSimulationResult;
}
