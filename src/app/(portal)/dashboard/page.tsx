"use client";

import Link from "next/link";
import {
  Inbox,
  Clock,
  CheckCircle2,
  CalendarDays,
  AlertCircle,
  Phone,
  Star,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SummaryCard } from "@/components/SummaryCard";
import { InboxRow } from "@/components/InboxRow";
import {
  mockAnalytics,
  mockInboxItems,
  mockRestaurant,
  mockThisWeekCount,
} from "@/lib/mockData";

export default function DashboardPage() {
  // TODO: replace with real API call
  const analytics = mockAnalytics;
  const recentItems = mockInboxItems.slice(0, 5);
  const restaurant = mockRestaurant;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your restaurant&apos;s activity
        </p>
      </div>

      {/* Readiness Banner */}
      {!restaurant.readiness.isReady && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
          <div className="flex-1">
            <p className="font-medium text-amber-800">
              Complete your setup to activate your AI agent
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Missing: {restaurant.readiness.missingFields.join(", ")}
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            Complete setup
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Total Requests"
          value={analytics.totalRequests}
          icon={Inbox}
        />
        <SummaryCard
          title="Pending"
          value={analytics.byStatus.received}
          icon={Clock}
          accent={analytics.byStatus.received > 0}
        />
        <SummaryCard
          title="Confirmed"
          value={analytics.byStatus.confirmed}
          icon={CheckCircle2}
        />
        <SummaryCard
          title="This Week"
          value={mockThisWeekCount}
          icon={CalendarDays}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Link
              href="/inbox"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentItems.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentItems.map((item) => (
                  <InboxRow key={item.id} item={item} variant="card" />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>

        {/* Services Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Services</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    AI Phone Receptionist
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Handles calls 24/7
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-dashed p-4 opacity-60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Star className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Review Management
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AI-powered responses
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
