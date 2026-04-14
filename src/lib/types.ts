export type IntakeType = "reservation" | "callback" | "catering" | "order";
export type RequestStatus = "received" | "confirmed" | "cancelled" | "completed";

export interface InboxItem {
  id: string;
  request_type: IntakeType;
  restaurant_id: string;
  customer_name: string;
  customer_phone: string;
  status: RequestStatus;
  source: string;
  notes: string | null;
  created_at: string;
  summary: string;
  // Alias for backward compatibility
  requestType?: IntakeType;
  restaurantId?: string;
  customerName?: string;
  customerPhone?: string;
  createdAt?: string;
}

export interface AnalyticsSummary {
  restaurant_id: string;
  restaurant_name: string;
  total_requests: number;
  by_type: {
    reservations: number;
    callbacks: number;
    catering: number;
    orders: number;
  };
  by_status: {
    received: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  // Alias for backward compatibility
  restaurantId?: string;
  restaurantName?: string;
  totalRequests?: number;
  byType?: {
    reservations: number;
    callbacks: number;
    catering: number;
    orders: number;
  };
  byStatus?: {
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
  is_ready: boolean;
  missing_fields: string[];
  // Alias for backward compatibility
  isReady?: boolean;
  missingFields?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  timezone: string | null;
  transfer_number: string | null;
  hours_json: HoursJson | null;
  readiness: ReadinessInfo;
  // Alias for backward compatibility
  transferNumber?: string | null;
  hoursJson?: HoursJson | null;
}

export interface User {
  id: string;
  email: string;
  restaurant_id: string;
  // Alias for backward compatibility
  restaurantId?: string;
}
