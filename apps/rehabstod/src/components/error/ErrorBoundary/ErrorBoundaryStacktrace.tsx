export function ErrorBoundryStacktrace({ stackTrace }: { stackTrace: string }) {
  return <pre className="overflow-auto rounded bg-secondary-90 p-5 text-left [&:not(:last-child)]:mb-5">{stackTrace}</pre>
}
