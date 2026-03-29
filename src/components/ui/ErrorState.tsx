'use client';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({ message, onRetry, compact = false }: ErrorStateProps) {
  if (compact) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-red-400">{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="text-xs text-red-400 hover:text-red-300 underline ml-4">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 px-8 py-16 text-center">
      <span className="text-4xl mb-4">⚠️</span>
      <h3 className="text-lg font-semibold text-white mb-1">Something went wrong</h3>
      <p className="text-sm text-red-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function APIErrorBoundary({ error, onRetry, children }: { error: string | null; onRetry?: () => void; children: React.ReactNode }) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  return <>{children}</>;
}
