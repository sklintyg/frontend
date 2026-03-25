// This file runs before setupTests.ts to ensure whatwg-fetch replaces Node's native fetch.
// Node's native fetch (undici) cannot resolve relative URLs, but whatwg-fetch can because
// it resolves them against window.location (http://localhost, set via vitest jsdom config).
// whatwg-fetch only installs if self.fetch is not already defined, so we delete it first.

// @ts-expect-error - intentionally deleting built-in globals for test environment
delete globalThis.fetch
// @ts-expect-error - intentionally deleting built-in globals for test environment
delete globalThis.Request
// @ts-expect-error - intentionally deleting built-in globals for test environment
delete globalThis.Response
// @ts-expect-error - intentionally deleting built-in globals for test environment
delete globalThis.Headers
