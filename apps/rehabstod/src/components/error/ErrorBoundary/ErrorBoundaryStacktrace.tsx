export function ErrorBoundryStacktrace({ stackTrace }: { stackTrace: string }) {
  return <pre className="bg-secondary-90 overflow-auto rounded p-5 text-left [&:not(:last-child)]:mb-5">{stackTrace}</pre>
}
