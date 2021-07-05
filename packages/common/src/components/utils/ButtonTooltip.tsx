import React from 'react'
import styled from 'styled-components'

const Tooltip = styled.div`
  position: relative;

  .tooltiptext {
    position: absolute;
    visibility: hidden;
    width: 120px;
    bottom: 100%;
    left: 50%;
    margin-left: -60px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    margin-bottom: 7px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.35s;
  }

  &:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  .tooltiptext::after {
    content: ' ';
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`
interface Props {
  description: string
  children: React.ReactNode
}

const ButtonTooltip: React.FC<Props> = ({ children, description }) => {
  const getDescription = () => {
    if (description && description !== '') {
      return <span className="tooltiptext">{description}</span>
    }
  }

  return (
    <Tooltip className="button-tooltip">
      {getDescription()}
      {children}
    </Tooltip>
  )
}

export default ButtonTooltip
