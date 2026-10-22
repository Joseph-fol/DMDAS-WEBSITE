
export type ManualStatus = 'Paid' | 'Ready for Pickup' | 'Collected' | 'Failed';

export type FilterTab = 'All' | 'Paid' | 'Ready for Pickup' | 'Collected' | 'Failed';

export interface Manual {
  id: string;
  code: string;
  title: string;
  department: string;
  level: string;
  price: string;
  paymentStatus: 'Paid';
  pickupStatus: 'Ready for Pickup' | 'Collected' | 'Failed';
  keycode: string;
  createdAt: string;
  collectedAt?: string;
  studentName: string;
  studentId: string;
  paystackRef: string;
}
