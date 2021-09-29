import React from 'react'
import styled from 'styled-components'

const Tooltip = styled.div`
  position: relative;

  .tooltiptext {
    color: #5f5f5f !important;
    position: absolute;
    visibility: hidden;
    bottom: 100%;
    left: 50%;
    margin-left: -60px;
    text-align: center;
    padding: 10px;
    margin-bottom: 7px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.35s;
    box-shadow: 0 0 1.25rem 0 rgb(0 0 0 / 30%);
    background-color: white;
  }

  &:hover .tooltiptext {
    visibility: visible;
    opacity: unset;
  }

  .tooltiptext::after {
    content: ' ';
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`
interface Props {
  description: string
  children: React.ReactNode
  className?: string
}

const ButtonTooltip: React.FC<Props> = ({ children, description, className }) => {
  const getDescription = () => {
    if (description && description !== '') {
      return <span className="tooltiptext">{description}</span>
    }
  }

  return (
    <Tooltip className={'button-tooltip ' + className}>
      {getDescription()}
      {children}
    </Tooltip>
  )
}

export default ButtonTooltip
