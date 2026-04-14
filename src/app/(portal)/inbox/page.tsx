import { Suspense } from "react";
import { InboxPage } from "@/components/InboxPage";

export default function InboxRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxPage
        title="Inbox"
        description="All requests from your AI phone agent"
      />
    </Suspense>
  );
}
