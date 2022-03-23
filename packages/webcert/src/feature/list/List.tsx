import * as React from 'react'
import { ListConfig } from '@frontend/common/src/types/list'
import ListFilter from './ListFilter'

interface Props {
  config: ListConfig | undefined
}

const List: React.FC<Props> = ({ config }) => {
  const getFilter = () => {
    if (!config) {
      return null
    }
    return config.filters.map((filterConfig) => <ListFilter config={filterConfig} />)
  }

  if (!config) {
    return null
  }

  //const getListContent = () => {}
  //      <Table>{getListContent()}</Table>

  return <>{getFilter()}</>
}

export default List
