export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';

export type ExamStatus = 0 | 1;

export type UserStatus = 0 | 1;

export interface CryptoOrder {
  id: string;
  status: CryptoOrderStatus;
  orderDetails: string;
  orderDate: number;
  orderID: string;
  sourceName: string;
  sourceDesc: string;
  amountCrypto: number;
  amount: number;
  cryptoCurrency: string;
  currency: string;
}
