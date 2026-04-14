import { Suspense } from "react";
import { InboxPage } from "@/components/InboxPage";

export default function ReservationsRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxPage
        title="Reservations"
        description="Reservation requests from your AI phone agent"
        defaultType="reservation"
      />
    </Suspense>
  );
}
