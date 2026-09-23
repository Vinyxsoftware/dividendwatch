"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[app/error.tsx]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl text-foreground">Data temporarily unavailable</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          We couldn&apos;t load stock data right now. This is usually temporary — please try again in a moment.
        </p>
      </div>
      <button
        onClick={() => retry()}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}
