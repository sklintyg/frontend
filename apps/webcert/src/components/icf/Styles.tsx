import styled from 'styled-components'
import { getFilter } from '../../utils'

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

export const WhiteLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  filter: ${getFilter('white')};
`
