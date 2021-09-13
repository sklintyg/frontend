import styled, { css } from 'styled-components/macro'

export const Root = styled.div`
  position: relative;
  height: 0;
  z-index: 1;
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
  position: sticky;
  bottom: 0;
`

export const StyledTitle = styled.p`
  position: sticky;
  top: 0;
  z-index: 3;
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
