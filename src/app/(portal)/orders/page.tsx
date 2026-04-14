import { Suspense } from "react";
import { InboxPage } from "@/components/InboxPage";

export default function OrdersRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxPage
        title="Orders"
        description="Order requests from your AI phone agent"
        defaultType="order"
      />
    </Suspense>
  );
}
