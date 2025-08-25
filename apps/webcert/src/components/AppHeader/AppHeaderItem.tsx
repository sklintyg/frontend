interface AppHeaderItemProps {
  children: React.ReactNode
}

const AppHeaderItem = (props: AppHeaderItemProps) => {
  return <div>{props.children}</div>
}

export default AppHeaderItem
