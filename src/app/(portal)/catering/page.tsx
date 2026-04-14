import { Suspense } from "react";
import { InboxPage } from "@/components/InboxPage";

export default function CateringRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxPage
        title="Catering"
        description="Catering requests from your AI phone agent"
        defaultType="catering"
      />
    </Suspense>
  );
}
