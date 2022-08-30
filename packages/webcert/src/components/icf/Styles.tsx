import styled from 'styled-components'

export const Root = styled.div`
  position: relative;
  height: 0;
  z-index: 10;
`

export const CategoryWrapper = styled.div`
  padding: 0.75rem;
  padding-bottom: 0;
`

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.5em;
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ScrollDiv = styled.div`
  overflow: auto;
  max-height: 300px;
`

export const ValuesWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: start;
  flex-wrap: wrap;

  p {
    margin: 0;
  }
`

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

export const WhiteLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  filter: ${getFilter('white')};
`
