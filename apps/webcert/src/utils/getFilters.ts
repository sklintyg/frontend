export const getFilter = (type: string): string => {
  if (type === 'grey') {
    return 'brightness(0) saturate(100%) invert(65%) sepia(24%) saturate(183%) hue-rotate(347deg) brightness(89%) contrast(83%);'
  } else if (type === 'primary') {
    return 'brightness(0) saturate(100%) invert(25%) sepia(76%) saturate(1338%) hue-rotate(149deg) brightness(101%) contrast(101%)'
  } else if (type === 'grey-500') {
    return 'brightness(0) saturate(100%) invert(38%) sepia(4%) saturate(9%) hue-rotate(326deg) brightness(88%) contrast(80%)'
  } else {
    return 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(1%) hue-rotate(326deg) brightness(103%) contrast(101%)'
  }
}
