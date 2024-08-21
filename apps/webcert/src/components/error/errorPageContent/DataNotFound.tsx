import React from 'react'

export const DATA_NOT_FOUND_TITLE = 'Intyget kunde inte hittas'
export const DATA_NOT_FOUND_MESSAGE = 'Intyget är borttaget eller så saknas behörighet.'

const DataNotFound: React.FC = () => {
  return (
    <>
      <p>
        <strong>{DATA_NOT_FOUND_TITLE}</strong>
      </p>
      <p>{DATA_NOT_FOUND_MESSAGE}</p>
    </>
  )
}

export default DataNotFound
