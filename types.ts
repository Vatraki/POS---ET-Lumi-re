export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Waiter {
  id: string;
  name: string;
  pin: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PREPARED = 'PREPARED',
  DELIVERED = 'DELIVERED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  GENERIC = 'GENERIC',
}

export interface Order {
  id: string;
  orderNumber: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: Date;
  paymentMethod: PaymentMethod;
  waiterId: string;
  waiterName: string;
}

export type TabView = 'HOME' | 'PRODUCTS' | 'KITCHEN' | 'DASHBOARD';