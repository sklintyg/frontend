export const uuidv4 = (): string => {
  const characters = '0123456789abcdef'
  let uuid = ''

  for (let i = 0; i < 36; i += 1) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-'
    } else if (i === 14) {
      uuid += '4'
    } else {
      const randomChar = characters[Math.floor(Math.random() * characters.length)]
      uuid += randomChar
    }
  }

  return uuid
}
