export type IntakeType = "reservation" | "callback" | "catering" | "order";
export type RequestStatus = "received" | "confirmed" | "cancelled" | "completed";

export interface InboxItem {
  id: string;
  requestType: IntakeType;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  status: RequestStatus;
  source: string;
  notes: string | null;
  createdAt: string;
  summary: string;
}

export interface AnalyticsSummary {
  restaurantId: string;
  restaurantName: string;
  totalRequests: number;
  byType: {
    reservations: number;
    callbacks: number;
    catering: number;
    orders: number;
  };
  byStatus: {
    received: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
}

export interface HoursEntry {
  open: string;
  close: string;
  closed: boolean;
}

export type HoursJson = Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  HoursEntry
>;

export interface ReadinessInfo {
  status: string;
  issues: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  timezone: string | null;
  transferNumber: string | null;
  hoursJson: HoursJson | null;
  smsEnabled: boolean;
  smsFromNumber: string | null;
  reservationPolicy: string | null;
  orderPolicy: string | null;
  featureFlagsJson: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  readiness: ReadinessInfo;
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  restaurantIds: string[];
}
