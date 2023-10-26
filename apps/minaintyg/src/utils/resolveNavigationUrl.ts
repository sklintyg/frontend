function getSystemFromMode() {
  switch (import.meta.env.MODE) {
    case 'development':
      return 'sys'
    case 'staging':
      return 'acc'
    default:
      return 'prod'
  }
}

export function resolveNavigationUrl(url: { prod: string; acc: string; sys: string }) {
  return url[getSystemFromMode()]
}
