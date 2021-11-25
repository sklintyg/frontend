import React from 'react'

const DATA_NOT_FOUND_TITLE = 'Intyget kunde inte hittas.'
const DATA_NOT_FOUND_MESSAGE = 'Intyget är borttaget eller så saknas behörighet.'

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
