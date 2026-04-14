import type {
  InboxItem,
  AnalyticsSummary,
  Restaurant,
  User,
} from "./types";

export const mockRestaurant: Restaurant = {
  id: "rest_001",
  name: "The Golden Fork",
  phone: "(555) 123-4567",
  address: "123 Main Street, San Francisco, CA 94102",
  timezone: "America/Los_Angeles",
  transferNumber: "(555) 987-6543",
  hoursJson: {
    mon: { open: "11:00", close: "22:00", closed: false },
    tue: { open: "11:00", close: "22:00", closed: false },
    wed: { open: "11:00", close: "22:00", closed: false },
    thu: { open: "11:00", close: "23:00", closed: false },
    fri: { open: "11:00", close: "23:30", closed: false },
    sat: { open: "10:00", close: "23:30", closed: false },
    sun: { open: "10:00", close: "21:00", closed: false },
  },
  readiness: {
    isReady: false,
    missingFields: ["Transfer Number", "Voicemail Greeting"],
  },
};

export const mockUser: User = {
  id: "user_001",
  email: "owner@goldenfork.com",
  restaurantId: "rest_001",
};

export const mockInboxItems: InboxItem[] = [
  {
    id: "req_001",
    requestType: "reservation",
    restaurantId: "rest_001",
    customerName: "Sarah Johnson",
    customerPhone: "(415) 555-0101",
    status: "received",
    source: "vapi",
    notes: "Requested a quiet table near the window. Celebrating an anniversary.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    summary: "Party of 4 · Tonight 7:30 PM",
  },
  {
    id: "req_002",
    requestType: "order",
    restaurantId: "rest_001",
    customerName: "Michael Chen",
    customerPhone: "(415) 555-0102",
    status: "confirmed",
    source: "vapi",
    notes: "Extra sauce on the side. No onions.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    summary: "Takeout · 2 Burgers, 1 Salad · $47.50",
  },
  {
    id: "req_003",
    requestType: "callback",
    restaurantId: "rest_001",
    customerName: "Emily Rodriguez",
    customerPhone: "(415) 555-0103",
    status: "received",
    source: "missed-call",
    notes: "Asked about gluten-free options for a large party.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    summary: "Inquiry about dietary accommodations",
  },
  {
    id: "req_004",
    requestType: "catering",
    restaurantId: "rest_001",
    customerName: "David Thompson",
    customerPhone: "(415) 555-0104",
    status: "confirmed",
    source: "vapi",
    notes: "Corporate lunch for 25 people. Need vegetarian and vegan options. Budget around $500.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    summary: "Corporate lunch · 25 guests · Friday Mar 15",
  },
  {
    id: "req_005",
    requestType: "reservation",
    restaurantId: "rest_001",
    customerName: "Jessica Williams",
    customerPhone: "(415) 555-0105",
    status: "completed",
    source: "vapi",
    notes: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    summary: "Party of 2 · Yesterday 6:00 PM",
  },
  {
    id: "req_006",
    requestType: "order",
    restaurantId: "rest_001",
    customerName: "Robert Kim",
    customerPhone: "(415) 555-0106",
    status: "cancelled",
    source: "vapi",
    notes: "Customer called back to cancel - plans changed.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
    summary: "Delivery · Cancelled by customer",
  },
  {
    id: "req_007",
    requestType: "callback",
    restaurantId: "rest_001",
    customerName: "Amanda Foster",
    customerPhone: "(415) 555-0107",
    status: "completed",
    source: "missed-call",
    notes: "Called back and answered questions about private dining room.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    summary: "Private dining inquiry · Resolved",
  },
  {
    id: "req_008",
    requestType: "catering",
    restaurantId: "rest_001",
    customerName: "Marcus Brown",
    customerPhone: "(415) 555-0108",
    status: "received",
    source: "vapi",
    notes: "Wedding rehearsal dinner. Needs tasting menu options. 40 guests expected.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    summary: "Wedding dinner · 40 guests · Apr 20",
  },
  {
    id: "req_009",
    requestType: "reservation",
    restaurantId: "rest_001",
    customerName: "Linda Martinez",
    customerPhone: "(415) 555-0109",
    status: "confirmed",
    source: "vapi",
    notes: "Birthday celebration. Would like a dessert with candle.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    summary: "Party of 6 · Tomorrow 8:00 PM",
  },
  {
    id: "req_010",
    requestType: "order",
    restaurantId: "rest_001",
    customerName: "James Wilson",
    customerPhone: "(415) 555-0110",
    status: "completed",
    source: "vapi",
    notes: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    summary: "Takeout · Picked up · $32.00",
  },
];

export const mockAnalytics: AnalyticsSummary = {
  restaurantId: "rest_001",
  restaurantName: mockRestaurant.name,
  totalRequests: mockInboxItems.length,
  byType: {
    reservations: mockInboxItems.filter((i) => i.requestType === "reservation").length,
    callbacks: mockInboxItems.filter((i) => i.requestType === "callback").length,
    catering: mockInboxItems.filter((i) => i.requestType === "catering").length,
    orders: mockInboxItems.filter((i) => i.requestType === "order").length,
  },
  byStatus: {
    received: mockInboxItems.filter((i) => i.status === "received").length,
    confirmed: mockInboxItems.filter((i) => i.status === "confirmed").length,
    cancelled: mockInboxItems.filter((i) => i.status === "cancelled").length,
    completed: mockInboxItems.filter((i) => i.status === "completed").length,
  },
};

// Placeholder for this week's count
export const mockThisWeekCount = 7;
