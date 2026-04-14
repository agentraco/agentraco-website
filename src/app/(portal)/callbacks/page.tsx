import { Suspense } from "react";
import { InboxPage } from "@/components/InboxPage";

export default function CallbacksRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxPage
        title="Callbacks"
        description="Callback requests from missed calls"
        defaultType="callback"
      />
    </Suspense>
  );
}
