function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-[3px] bg-primary/40" />
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Pulse className="h-5 w-32" />
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-3">
          <Pulse className="h-8 w-64" />
          <Pulse className="h-4 w-80" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card px-5 py-4 space-y-2">
              <Pulse className="h-7 w-16" />
              <Pulse className="h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/60 px-4 py-3">
            <Pulse className="h-4 w-full max-w-xl" />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4 border-t border-border/50">
              <Pulse className="h-4 w-6 shrink-0" />
              <Pulse className="h-4 flex-1" />
              <Pulse className="h-4 w-16 shrink-0" />
              <Pulse className="h-4 w-16 shrink-0" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
