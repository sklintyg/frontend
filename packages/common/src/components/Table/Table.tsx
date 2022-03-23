import React from 'react'

interface Props {
  caption?: string
}

const Table: React.FC<Props> = ({ caption }, children) => {
  return (
    <>
      <table className="ic-table ic-table--full">
        {caption && <caption>{caption}</caption>}
        {children}
      </table>
    </>
  )
}

export default Table
