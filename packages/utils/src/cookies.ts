export function getCookies(): Record<string, string | undefined> {
  return Object.fromEntries(document.cookie.split('; ').map((v) => v.split(/=(.*)/s).map(decodeURIComponent)))
}

export const getCookie = (name: string) => getCookies()[name]
