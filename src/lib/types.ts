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

export interface Restaurant {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  timezone: string | null;
  transferNumber: string | null;
  hoursJson: HoursJson | null;
  readiness: {
    isReady: boolean;
    missingFields: string[];
  };
}

export interface User {
  id: string;
  email: string;
  restaurantId: string;
}
